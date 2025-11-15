"""
Rutas API para gestión de tareas.
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

from app.models.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.task_service import (
    create_task_service,
    get_task_by_id_service,
    get_all_tasks_service,
    update_task_service,
    delete_task_service
)

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(payload: TaskCreate):
    """
    Crea una nueva tarea.
    """
    task = await create_task_service(payload)
    if task is None:
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear la tarea. Verifica los datos enviados."
        )
    return task


@router.get("/{task_id}", response_model=TaskResponse, status_code=200)
async def get_task(task_id: str):
    """
    Obtiene una tarea por su ID.
    """
    task = await get_task_by_id_service(task_id)
    if task is None:
        raise HTTPException(
            status_code=404,
            detail=f"Tarea con ID {task_id} no encontrada"
        )
    return task


@router.get("/", response_model=List[TaskResponse], status_code=200)
async def get_tasks(
    completed: Optional[bool] = Query(None, description="Filtrar por estado de completado"),
    skip: int = Query(0, ge=0, description="Número de documentos a saltar"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de documentos")
):
    """
    Obtiene todas las tareas con filtros opcionales.
    """
    tasks = await get_all_tasks_service(completed=completed, skip=skip, limit=limit)
    return tasks


@router.put("/{task_id}", response_model=TaskResponse, status_code=200)
async def update_task(task_id: str, payload: TaskUpdate):
    """
    Actualiza una tarea existente.
    """
    task = await update_task_service(task_id, payload)
    if task is None:
        raise HTTPException(
            status_code=404,
            detail=f"Tarea con ID {task_id} no encontrada o datos inválidos"
        )
    return task


@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: str):
    """
    Elimina una tarea.
    """
    deleted = await delete_task_service(task_id)
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail=f"Tarea con ID {task_id} no encontrada"
        )
    return None

