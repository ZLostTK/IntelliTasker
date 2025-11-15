"""
Modelos Pydantic para solicitudes de IA.
"""
from typing import Optional
from pydantic import BaseModel, Field


class AITaskRequest(BaseModel):
    """Modelo para solicitar generación de tarea con IA."""
    title: str = Field(..., min_length=1, max_length=200, description="Título de la tarea (obligatorio)")
    description: Optional[str] = Field(None, max_length=1000, description="Descripción de la tarea (opcional)")


class AITaskResponse(BaseModel):
    """Modelo de respuesta de la IA con tarea estructurada."""
    title: str
    description: str
    startDateTime: str  # ISO 8601
    endDateTime: str  # ISO 8601
    estimatedHours: float
    subtasks: list[dict] = Field(default_factory=list)  # Lista de subtareas con title y estimatedHours

