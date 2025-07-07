import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None
        self.connect()
    
    def connect(self):
        """Connect to MongoDB using environment variable"""
        try:
            # Get MongoDB connection string from environment variable
            mongodb_uri = os.getenv("MONGODB_URI")
            if not mongodb_uri:
                raise ValueError("MONGODB_URI environment variable is required")
            
            # Connect to MongoDB
            self.client = MongoClient(mongodb_uri)
            
            # Test the connection
            self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
            # Select database and collection
            self.db = self.client["thesis_study"]
            self.collection = self.db["study_responses"]
            
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            raise
    
    def save_study_data(self, study_data):
        """Save study data to MongoDB"""
        try:
            # Add timestamp for when record was created
            study_data["createdAt"] = datetime.utcnow()
            
            # Insert the document
            result = self.collection.insert_one(study_data)
            logger.info(f"Study data saved with ID: {result.inserted_id}")
            
            return {
                "success": True,
                "message": "Study data saved successfully",
                "document_id": str(result.inserted_id)
            }
            
        except Exception as e:
            logger.error(f"Failed to save study data: {e}")
            return {
                "error": f"Failed to save study data: {str(e)}"
            }
    
    def get_all_study_data(self):
        """Retrieve all study data from MongoDB"""
        try:
            # Get all documents, excluding the MongoDB _id field
            cursor = self.collection.find({}, {"_id": 0, "createdAt": 0})
            data = list(cursor)
            logger.info(f"Retrieved {len(data)} study records")
            return data
            
        except Exception as e:
            logger.error(f"Failed to retrieve study data: {e}")
            raise
    
    def get_study_count(self):
        """Get the total number of study responses"""
        try:
            count = self.collection.count_documents({})
            return count
        except Exception as e:
            logger.error(f"Failed to get study count: {e}")
            return 0
    
    def close_connection(self):
        """Close the MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

# Global database manager instance
db_manager = DatabaseManager()
