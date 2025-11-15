"""
Modelos Pydantic para Task y Subtask.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class SubtaskCreate(BaseModel):
    """Modelo para crear una subtarea."""
    title: str = Field(..., min_length=1, max_length=200)
    estimatedHours: float = Field(..., gt=0)
    completed: bool = False


class SubtaskResponse(BaseModel):
    """Modelo de respuesta para una subtarea."""
    id: str
    title: str
    estimatedHours: float
    completed: bool


class TaskCreate(BaseModel):
    """Modelo para crear una tarea."""
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=1000)
    startDateTime: str  # ISO 8601
    endDateTime: str  # ISO 8601
    estimatedHours: float = Field(..., gt=0)
    completed: bool = False
    subtasks: List[SubtaskCreate] = Field(default_factory=list)

    @field_validator('endDateTime')
    @classmethod
    def validate_end_after_start(cls, v, info):
        """Valida que endDateTime sea posterior a startDateTime."""
        if 'startDateTime' in info.data:
            start = datetime.fromisoformat(info.data['startDateTime'].replace('Z', '+00:00'))
            end = datetime.fromisoformat(v.replace('Z', '+00:00'))
            if end <= start:
                raise ValueError("endDateTime debe ser posterior a startDateTime")
        return v


class TaskUpdate(BaseModel):
    """Modelo para actualizar una tarea."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    startDateTime: Optional[str] = None  # ISO 8601
    endDateTime: Optional[str] = None  # ISO 8601
    estimatedHours: Optional[float] = Field(None, gt=0)
    completed: Optional[bool] = None
    subtasks: Optional[List[SubtaskCreate]] = None


class TaskResponse(BaseModel):
    """Modelo de respuesta para una tarea."""
    id: str
    title: str
    description: str
    startDateTime: str
    endDateTime: str
    estimatedHours: float
    completed: bool
    subtasks: List[SubtaskResponse]
    created_at: str
    updated_at: str

