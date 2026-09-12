from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..ai import get_study_guide_reply
from ..database import get_db
from ..models import Message
from ..schemas import ChatReply, MessageCreate, MessageRead

router = APIRouter(prefix="/api/chat", tags=["chat"])

HISTORY_LIMIT = 12


@router.get("/messages", response_model=list[MessageRead])
async def list_messages(db: AsyncSession = Depends(get_db)) -> list[Message]:
    result = await db.execute(select(Message).order_by(Message.created_at, Message.id))
    return list(result.scalars().all())


@router.post("/messages", response_model=ChatReply)
async def send_message(
    payload: MessageCreate, db: AsyncSession = Depends(get_db)
) -> ChatReply:
    user_message = Message(role="user", content=payload.content)
    db.add(user_message)
    await db.commit()
    await db.refresh(user_message)

    history_result = await db.execute(
        select(Message)
        .order_by(Message.created_at.desc(), Message.id.desc())
        .limit(HISTORY_LIMIT)
    )
    history = list(reversed(history_result.scalars().all()))

    reply_text = await get_study_guide_reply(
        [{"role": message.role, "content": message.content} for message in history]
    )

    ai_message = Message(role="ai", content=reply_text)
    db.add(ai_message)
    await db.commit()
    await db.refresh(ai_message)

    return ChatReply(
        user_message=MessageRead.model_validate(user_message),
        ai_message=MessageRead.model_validate(ai_message),
    )