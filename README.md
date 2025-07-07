# Thesis Study Application

A web application for conducting political opinion studies with AI-powered chat discussions.

## Features

- **Study Flow**: Initial assessment → AI chat discussion → Final assessment
- **Two Groups**: Group A (static response) and Group B (interactive chat)
- **Data Collection**: Complete study data saved to MongoDB
- **CSV Export**: Download all study data as CSV file
- **Responsive Design**: Works on desktop and mobile devices

## Setup

### Environment Variables

Create a `.env` file in the root directory with:

```env
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

### Installation

1. **Backend Setup:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Frontend Setup:**
```bash
cd frontend
npm install
npm run build
```

### Development

**Start Backend:**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Build Frontend:**
```bash
cd frontend
npm run build
```

## Deployment (Heroku)

### Files needed in project root:

1. **Procfile:**
```
web: uvicorn backend.main:app --host=0.0.0.0 --port=$PORT
```

2. **requirements.txt:** (copy from backend/requirements.txt)

3. **Set environment variables:**
```bash
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set MONGODB_URI=your_mongodb_uri_here
```

## API Endpoints

- `POST /study/group-a/start` - Start Group A study
- `POST /study/group-b/start` - Start Group B study
- `POST /study/group-b/continue` - Continue Group B chat
- `POST /study/submit` - Submit study data
- `GET /download` - Download CSV of all study data
- `GET /stats` - Get study statistics

## Database Schema

Study data is stored in MongoDB with the following structure:

```json
{
  "prolificPid": "string",
  "group": "A|B",
  "thesisId": "number",
  "thesisTitle": "string",
  "thesisText": "string",
  "run": "number",
  "initialPosition": "number (0-100)",
  "initialInformation": "number (0-100)",
  "initialStatement": "string",
  "finalPosition": "number (0-100)",
  "finalInformation": "number (0-100)",
  "chatHistory": "array",
  "timestamps": {
    "iframeOpen": "timestamp",
    "chatStart": "timestamp",
    "chatEnd": "timestamp",
    "completion": "timestamp"
  },
  "totalTimeSeconds": "number",
  "chatTimeSeconds": "number",
  "createdAt": "datetime"
}
```

## Usage

Access the study via: `https://yourapp.herokuapp.com/study?PROLIFIC_PID=test&group=A&thesis_id=1&run=1`

Required URL parameters:
- `PROLIFIC_PID`: Participant identifier
- `group`: A or B
- `thesis_id`: 1, 4, or 5
- `run`: Run number

## CSV Export

Visit `/download` to download all study data as CSV. The CSV includes:
- All participant responses
- Timing data
- Chat history (as JSON string)
- Calculated metrics
