from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    type: Literal["class", "assignment"]
    time: str = Field(min_length=1, max_length=50)
    completed: bool = False


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    type: Literal["class", "assignment"] | None = None
    time: str | None = Field(default=None, min_length=1, max_length=50)
    completed: bool | None = None


class TaskRead(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    position: int
    created_at: datetime


class MessageCreate(BaseModel):
    content: str = Field(min_length=1)


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: Literal["ai", "user"]
    content: str
    created_at: datetime


class ChatReply(BaseModel):
    user_message: MessageRead
    ai_message: MessageRead


class SleepRequest(BaseModel):
    hours_to_wake_time: float = Field(ge=0, le=24)
    estimated_workload_hours: float = Field(ge=0, le=24)


class SleepResponse(BaseModel):
    estimated_sleep: float
    status: Literal["healthy", "watch", "alert"]