from fastapi import APIRouter, Depends, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database.database import get_db
from bless import Bless_ai
import aiofiles
from audio_purifier import Purify_Audio
from database.db_audio import create

router = APIRouter(
    prefix="/audio",
    tags=["Audio"]
)

@router.get("/Bless_audio_output")
async def upload_audio(db: Session = Depends(get_db)):
    return FileResponse("audios/output.wav", media_type="audio/mpeg")

@router.post("/Bless_audio_input")
async def upload_audio(file: UploadFile, db: Session = Depends(get_db)):
    async with aiofiles.open("./audios/temp.wav", 'wb') as f:
        await f.write(await file.read())
        Purify_Audio()
    log=Bless_ai()
    create(db,log['user_text'],log["blessi_text"],log["user_language"],log["mail_status"],str(log["mail_data"]))
    return log

@router.get("/Bless_user_auth")
async def upload_audio(data: dict):
    with open('data/ai_train_mail.json',"w") as file:
        file.write(data)
    # Do something with the id_token, for example, return it
    return None