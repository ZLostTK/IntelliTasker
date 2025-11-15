"""
Rutas API para generación de tareas con IA.
"""
from fastapi import APIRouter, HTTPException

from app.models.ai import AITaskRequest, AITaskResponse
from app.services.ai_service import generate_task_with_ai

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/generate-task", response_model=AITaskResponse, status_code=200)
async def generate_task(payload: AITaskRequest):
    """
    Genera una tarea estructurada usando IA basándose en el título y descripción.
    
    La IA analizará el título (obligatorio) y la descripción (opcional) y retornará
    un JSON estructurado con:
    - title: Título de la tarea
    - description: Descripción detallada
    - startDateTime: Fecha y hora de inicio (ISO 8601)
    - endDateTime: Fecha y hora de fin (ISO 8601)
    - estimatedHours: Horas estimadas
    - subtasks: Array de subtareas con título y horas estimadas
    """
    result = await generate_task_with_ai(payload)
    if result is None:
        raise HTTPException(
            status_code=500,
            detail="No se pudo generar la tarea con IA. Verifica que GEMINI_API_KEY esté configurada."
        )
    return result

