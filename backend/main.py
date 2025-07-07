from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from typing import List
import os
import csv
import io
import json
from datetime import datetime
from api_interface import generate_group_a_response, generate_group_b_response
from thesis_data import get_thesis_data
from database import db_manager

app = FastAPI()

# Serve frontend static files
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
app.mount("/static", StaticFiles(directory=frontend_dist), name="static")

@app.get("/")
def read_root():
    return FileResponse(os.path.join(frontend_dist, "index.html"))

# Request models
class StudyStartRequest(BaseModel):
    thesis_id: int
    initial_position: int
    initial_statement: str

class StudyContinueRequest(BaseModel):
    thesis_id: int
    initial_position: int
    initial_statement: str
    history: List[dict]

class ChatRequest(BaseModel):
    thesis_text: str
    api_key: str
    model: str
    position: int
    user_statement: str
    history: List[dict]

class StudySubmissionRequest(BaseModel):
    prolificPid: str
    group: str
    thesisId: int
    thesisTitle: str
    thesisText: str
    run: int
    initialPosition: int
    initialInformation: int
    initialStatement: str
    chatHistory: List[dict]
    finalPosition: int
    finalInformation: int
    timestamps: dict
    totalTimeSeconds: float = None
    chatTimeSeconds: float = None


# Group A start
@app.post("/study/group-a/start")
async def study_group_a_start(request: StudyStartRequest):
    # Get thesis data for Thesis ID
    thesis_data = get_thesis_data(request.thesis_id)
    if not thesis_data:
        return {"role": "error", "content": f"Main.py Error: Thesis {request.thesis_id} not found in THESIS_DATA"}
    
    result = generate_group_a_response(
        thesis_text=thesis_data["thesis_text"],
        position=request.initial_position,
        user_statement=request.initial_statement,
        pro_text=thesis_data["pro"],
        contra_text=thesis_data["contra"]
    )
    return result

# Group B start
@app.post("/study/group-b/start")
async def study_group_b_start(request: StudyStartRequest):
    # Get thesis data for Thesis ID
    thesis_data = get_thesis_data(request.thesis_id)
    if not thesis_data:
        return {"role": "error", "content": f"Main.py Error: Thesis {request.thesis_id} not found in THESIS_DATA"}
    
    result = generate_group_b_response(
        thesis_text=thesis_data["thesis_text"],
        position=request.initial_position,
        user_statement=request.initial_statement,
        pro_text=thesis_data["pro"],
        contra_text=thesis_data["contra"],
        history=None
    )
    return result

# Group B continue
@app.post("/study/group-b/continue")
async def study_group_b_continue(request: StudyContinueRequest):
    if not request.history or not isinstance(request.history, list):
        return {"role": "error", "content": "No history provided"}
    thesis_data = get_thesis_data(request.thesis_id)
    if not thesis_data:
        return {"role": "error", "content": f"Main.py Error: Thesis {request.thesis_id} not found in THESIS_DATA"}
    result = generate_group_b_response(
        thesis_text=thesis_data["thesis_text"],
        position=0,
        user_statement="",
        pro_text=thesis_data["pro"],
        contra_text=thesis_data["contra"],
        history=request.history
    )
    return result

# Study data submission
@app.post("/study/submit")
async def submit_study_data(request: StudySubmissionRequest):
    try:
        # Convert request to dict
        study_data = request.dict()
        
        # Save to MongoDB
        result = db_manager.save_study_data(study_data)
        
        return result
        
    except Exception as e:
        return {"error": f"Failed to save study data: {str(e)}"}

# CSV Download endpoint
@app.get("/download")
async def download_study_data():
    try:
        # Get all study data from MongoDB
        study_data = db_manager.get_all_study_data()
        
        if not study_data:
            raise HTTPException(status_code=404, detail="No study data found")
        
        # Create CSV content
        output = io.StringIO()
        
        # Define CSV headers
        headers = [
            'prolificPid', 'group', 'thesisId', 'thesisTitle', 'thesisText', 'run',
            'initialPosition', 'initialInformation', 'initialStatement',
            'finalPosition', 'finalInformation', 
            'totalTimeSeconds', 'chatTimeSeconds',
            'iframeOpen', 'chatStart', 'chatEnd', 'completion', 'createdAt',
            'chatHistoryLength', 'chatHistoryJSON'
        ]
        
        writer = csv.DictWriter(output, fieldnames=headers)
        writer.writeheader()
        
        # Process each study record
        for record in study_data:
            # Flatten timestamps
            timestamps = record.get('timestamps', {})
            
            # Process chat history
            chat_history = record.get('chatHistory', [])
            chat_history_json = json.dumps(chat_history) if chat_history else ""
            
            # Helper function to convert timestamp to readable format
            def format_timestamp(ts):
                if ts:
                    try:
                        return datetime.fromtimestamp(ts / 1000).strftime('%Y-%m-%d %H:%M:%S')
                    except:
                        return str(ts)
                return ''
            
            # Create row for CSV
            row = {
                'prolificPid': record.get('prolificPid', ''),
                'group': record.get('group', ''),
                'thesisId': record.get('thesisId', ''),
                'thesisTitle': record.get('thesisTitle', ''),
                'thesisText': record.get('thesisText', ''),
                'run': record.get('run', ''),
                'initialPosition': record.get('initialPosition', ''),
                'initialInformation': record.get('initialInformation', ''),
                'initialStatement': record.get('initialStatement', ''),
                'finalPosition': record.get('finalPosition', ''),
                'finalInformation': record.get('finalInformation', ''),
                'totalTimeSeconds': record.get('totalTimeSeconds', ''),
                'chatTimeSeconds': record.get('chatTimeSeconds', ''),
                'iframeOpen': format_timestamp(timestamps.get('iframeOpen')),
                'chatStart': format_timestamp(timestamps.get('chatStart')),
                'chatEnd': format_timestamp(timestamps.get('chatEnd')),
                'completion': format_timestamp(timestamps.get('completion')),
                'createdAt': record.get('createdAt', ''),
                'chatHistoryLength': len(chat_history),
                'chatHistoryJSON': chat_history_json
            }
            
            writer.writerow(row)
        
        # Prepare the response
        output.seek(0)
        csv_content = output.getvalue()
        output.close()
        
        # Create a streaming response
        def generate_csv():
            yield csv_content
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"thesis_study_data_{timestamp}.csv"
        
        return StreamingResponse(
            io.StringIO(csv_content),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate CSV: {str(e)}")

# Get study statistics
@app.get("/stats")
async def get_study_stats():
    try:
        total_responses = db_manager.get_study_count()
        return {
            "total_responses": total_responses,
            "message": f"Total study responses: {total_responses}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")

# API testing chat
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # Placeholder logic for API testing - implement later
    return {"role": "assistant", "content": "API testing not implemented yet"}

# Catch-all route for frontend (for React Router) - MUST be last!
@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    file_path = os.path.join(frontend_dist, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(os.path.join(frontend_dist, "index.html"))
