FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

COPY pyproject.toml uv.lock alembic.ini README.md ./
COPY alembic ./alembic
COPY src ./src

RUN uv sync --frozen --no-dev

EXPOSE 8000

CMD ["sh", "-c", "uv run alembic upgrade head && uv run python -m backend.seed && uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000"]