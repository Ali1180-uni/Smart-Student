from fastapi import APIRouter

from ..schemas import SleepRequest, SleepResponse

router = APIRouter(prefix="/api/sleep", tags=["sleep"])


@router.post("/estimate", response_model=SleepResponse)
async def estimate_sleep(payload: SleepRequest) -> SleepResponse:
    estimated_sleep = max(payload.hours_to_wake_time - payload.estimated_workload_hours, 0)
    if estimated_sleep >= 8:
        status_text = "healthy"
    elif estimated_sleep >= 6:
        status_text = "watch"
    else:
        status_text = "alert"
    return SleepResponse(estimated_sleep=estimated_sleep, status=status_text)