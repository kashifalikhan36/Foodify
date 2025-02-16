from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from AI import Ai_assistent
from fastapi.middleware.cors import CORSMiddleware

# Initialize the FastAPI app
app = FastAPI()

# Define allowed origins for CORS
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:3000",  # If the React frontend is running on port 3000
    # Add other allowed origins here
]

# Add the CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, or you can specify a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Define request body schema using Pydantic
class TextRequest(BaseModel):
    text: str

# Define response schema
class TextResponse(BaseModel):
    response_text: str

@app.post("/foodify", response_model=TextResponse)
async def process_text(request: TextRequest):
    # Process the incoming request
    ai = Ai_assistent()
    response_text = ai.Assistent_listen(request.text)
    return TextResponse(response_text=response_text)

# Run the server (if running directly, e.g., `python app.py`)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)
