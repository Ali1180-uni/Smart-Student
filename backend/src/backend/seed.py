import asyncio

from sqlalchemy import select

from .database import SessionLocal
from .models import Task

SEED_TASKS = [
    {"title": "Calculus II lecture", "type": "class", "time": "10:00 AM"},
    {"title": "Read chapter 4 of The Great Gatsby", "type": "assignment", "time": "Due 11:59 PM"},
    {"title": "Physics lab: motion and force", "type": "class", "time": "2:00 PM"},
    {"title": "Submit history essay outline", "type": "assignment", "time": "Due Friday"},
]


async def seed() -> None:
    async with SessionLocal() as session:
        for index, data in enumerate(SEED_TASKS, start=1):
            existing = await session.execute(
                select(Task).where(Task.title == data["title"])
            )
            if existing.scalar_one_or_none() is not None:
                continue
            session.add(
                Task(
                    **data,
                    completed=data["title"] == "Submit history essay outline",
                    position=index,
                )
            )
        await session.commit()


def main() -> None:
    asyncio.run(seed())


if __name__ == "__main__":
    main()