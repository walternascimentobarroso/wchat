from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.chat import MessageRequest
from app.services.chat_service import stream_response

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/message")
async def send_message(body: MessageRequest):
    return StreamingResponse(
        stream_response(body.content),
        media_type="text/plain",
    )
