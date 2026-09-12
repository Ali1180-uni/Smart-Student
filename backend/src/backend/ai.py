from groq import AsyncGroq

from .config import settings

client = AsyncGroq(api_key=settings.groq_api_key)

SYSTEM_PROMPT = (
    "You are a friendly, encouraging study guide for Alex, a university student. "
    "Help with planning study time, breaking down assignments, reviewing concepts, "
    "and staying focused. Keep answers concise, warm, and practical. "
    "Use plain text only."
)


def _normalize_role(role: str) -> str:
    return "assistant" if role == "ai" else role


async def get_study_guide_reply(history: list[dict[str, str]]) -> str:
    if not settings.groq_api_key or settings.groq_api_key == "your-groq-api-key":
        return (
            "I can't reach my model right now because the GROQ_API_KEY isn't set. "
            "Add it to backend/.env and restart the server."
        )

    completion = await client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            *[
                {"role": _normalize_role(message["role"]), "content": message["content"]}
                for message in history
            ],
        ],
        temperature=0.7,
    )
    return completion.choices[0].message.content or ""