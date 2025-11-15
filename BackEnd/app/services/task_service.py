"""
Servicio de lógica de negocio para tareas.
"""
import logging
from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId

from app.db.database import db
from app.models.task import TaskCreate, TaskUpdate, TaskResponse, SubtaskResponse
from app.utils.ids import validate_object_id, object_id_to_str

logger = logging.getLogger(__name__)


async def init_indexes():
    """
    Inicializa los índices de la colección de tareas.
    """
    try:
        await db.tasks.create_index("created_at")
        await db.tasks.create_index("completed")
        await db.tasks.create_index("startDateTime")
        logger.info("Índices de tareas inicializados")
    except Exception as e:
        logger.error(f"Error al crear índices: {e}")


def _prepare_task_document(task_data: dict) -> dict:
    """
    Prepara un documento de tarea para insertar en MongoDB.
    Convierte fechas a datetime UTC y añade timestamps.
    """
    now = datetime.now(timezone.utc)
    
    # Convertir fechas ISO a datetime UTC
    start_dt = datetime.fromisoformat(
        task_data["startDateTime"].replace('Z', '+00:00')
    )
    end_dt = datetime.fromisoformat(
        task_data["endDateTime"].replace('Z', '+00:00')
    )
    
    # Validar que endDateTime > startDateTime
    if end_dt <= start_dt:
        raise ValueError("endDateTime debe ser posterior a startDateTime")
    
    # Preparar subtareas con IDs
    subtasks = []
    for subtask in task_data.get("subtasks", []):
        subtask_doc = {
            "_id": ObjectId(),
            "title": subtask["title"],
            "estimatedHours": subtask["estimatedHours"],
            "completed": subtask.get("completed", False)
        }
        subtasks.append(subtask_doc)
    
    document = {
        "title": task_data["title"],
        "description": task_data.get("description", ""),
        "startDateTime": start_dt,
        "endDateTime": end_dt,
        "estimatedHours": task_data["estimatedHours"],
        "completed": task_data.get("completed", False),
        "subtasks": subtasks,
        "created_at": now,
        "updated_at": now
    }
    
    return document


def _task_doc_to_response(doc: dict) -> TaskResponse:
    """
    Convierte un documento de MongoDB a TaskResponse.
    """
    # Convertir _id a id
    doc = object_id_to_str(doc)
    
    # Convertir subtareas
    subtasks = []
    for subtask in doc.get("subtasks", []):
        subtasks.append(SubtaskResponse(
            id=str(subtask["_id"]),
            title=subtask["title"],
            estimatedHours=subtask["estimatedHours"],
            completed=subtask.get("completed", False)
        ))
    
    # Convertir fechas a ISO 8601
    start_dt = doc["startDateTime"]
    end_dt = doc["endDateTime"]
    created_at = doc["created_at"]
    updated_at = doc["updated_at"]
    
    if isinstance(start_dt, datetime):
        start_dt = start_dt.isoformat()
    if isinstance(end_dt, datetime):
        end_dt = end_dt.isoformat()
    if isinstance(created_at, datetime):
        created_at = created_at.isoformat()
    if isinstance(updated_at, datetime):
        updated_at = updated_at.isoformat()
    
    return TaskResponse(
        id=doc["id"],
        title=doc["title"],
        description=doc.get("description", ""),
        startDateTime=start_dt,
        endDateTime=end_dt,
        estimatedHours=doc["estimatedHours"],
        completed=doc.get("completed", False),
        subtasks=subtasks,
        created_at=created_at,
        updated_at=updated_at
    )


async def create_task_service(task_data: TaskCreate) -> Optional[TaskResponse]:
    """
    Crea una nueva tarea.
    
    Parámetros:
    - `task_data`: Datos de la tarea a crear.
    
    Retorna:
    - TaskResponse con la tarea creada o None si falla.
    """
    try:
        task_dict = task_data.model_dump()
        document = _prepare_task_document(task_dict)
        
        result = await db.tasks.insert_one(document)
        logger.info(f"Tarea creada: {result.inserted_id}, colección: tasks")
        
        # Recuperar el documento creado
        created_doc = await db.tasks.find_one({"_id": result.inserted_id})
        if not created_doc:
            return None
        
        return _task_doc_to_response(created_doc)
    except Exception as e:
        logger.error(f"Error al crear tarea: {e}")
        return None


async def get_task_by_id_service(task_id: str) -> Optional[TaskResponse]:
    """
    Obtiene una tarea por su ID.
    
    Parámetros:
    - `task_id`: ID de la tarea.
    
    Retorna:
    - TaskResponse o None si no se encuentra.
    """
    try:
        oid = validate_object_id(task_id)
        doc = await db.tasks.find_one({"_id": oid})
        
        if not doc:
            logger.info(f"Tarea no encontrada: {task_id}, colección: tasks")
            return None
        
        logger.info(f"Tarea encontrada: {task_id}, colección: tasks")
        return _task_doc_to_response(doc)
    except ValueError as e:
        logger.warning(f"ObjectId inválido: {task_id}")
        return None
    except Exception as e:
        logger.error(f"Error al obtener tarea: {e}")
        return None


async def get_all_tasks_service(
    completed: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100
) -> List[TaskResponse]:
    """
    Obtiene todas las tareas con filtros opcionales.
    
    Parámetros:
    - `completed`: Filtrar por estado de completado (opcional).
    - `skip`: Número de documentos a saltar.
    - `limit`: Número máximo de documentos a retornar.
    
    Retorna:
    - Lista de TaskResponse.
    """
    try:
        filter_query = {}
        if completed is not None:
            filter_query["completed"] = completed
        
        cursor = db.tasks.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
        docs = await cursor.to_list(length=limit)
        
        logger.info(
            f"Tareas obtenidas: {len(docs)}, filtro: {filter_query}, "
            f"colección: tasks"
        )
        
        return [_task_doc_to_response(doc) for doc in docs]
    except Exception as e:
        logger.error(f"Error al obtener tareas: {e}")
        return []


async def update_task_service(
    task_id: str,
    task_update: TaskUpdate
) -> Optional[TaskResponse]:
    """
    Actualiza una tarea existente.
    
    Parámetros:
    - `task_id`: ID de la tarea a actualizar.
    - `task_update`: Datos a actualizar.
    
    Retorna:
    - TaskResponse con la tarea actualizada o None si no se encuentra.
    """
    try:
        oid = validate_object_id(task_id)
        
        # Verificar que la tarea existe
        existing = await db.tasks.find_one({"_id": oid})
        if not existing:
            logger.info(f"Tarea no encontrada para actualizar: {task_id}")
            return None
        
        # Preparar datos de actualización
        update_data = task_update.model_dump(exclude_unset=True)
        
        # Si hay fechas, validar y convertir
        if "startDateTime" in update_data or "endDateTime" in update_data:
            start_dt = existing.get("startDateTime")
            end_dt = existing.get("endDateTime")
            
            if "startDateTime" in update_data:
                start_dt = datetime.fromisoformat(
                    update_data["startDateTime"].replace('Z', '+00:00')
                )
            if "endDateTime" in update_data:
                end_dt = datetime.fromisoformat(
                    update_data["endDateTime"].replace('Z', '+00:00')
                )
            
            if end_dt <= start_dt:
                raise ValueError("endDateTime debe ser posterior a startDateTime")
            
            if "startDateTime" in update_data:
                update_data["startDateTime"] = start_dt
            if "endDateTime" in update_data:
                update_data["endDateTime"] = end_dt
        
        # Si hay subtareas, prepararlas con IDs
        if "subtasks" in update_data:
            subtasks = []
            for subtask in update_data["subtasks"]:
                subtask_doc = {
                    "_id": ObjectId(),
                    "title": subtask["title"],
                    "estimatedHours": subtask["estimatedHours"],
                    "completed": subtask.get("completed", False)
                }
                subtasks.append(subtask_doc)
            update_data["subtasks"] = subtasks
        
        # Añadir timestamp de actualización
        update_data["updated_at"] = datetime.now(timezone.utc)
        
        result = await db.tasks.update_one(
            {"_id": oid},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            logger.warning(f"No se modificó la tarea: {task_id}")
            return None
        
        logger.info(f"Tarea actualizada: {task_id}, colección: tasks")
        
        # Recuperar el documento actualizado
        updated_doc = await db.tasks.find_one({"_id": oid})
        return _task_doc_to_response(updated_doc)
    except ValueError as e:
        logger.warning(f"Error de validación al actualizar tarea: {e}")
        return None
    except Exception as e:
        logger.error(f"Error al actualizar tarea: {e}")
        return None


async def delete_task_service(task_id: str) -> bool:
    """
    Elimina una tarea.
    
    Parámetros:
    - `task_id`: ID de la tarea a eliminar.
    
    Retorna:
    - True si se eliminó correctamente, False en caso contrario.
    """
    try:
        oid = validate_object_id(task_id)
        result = await db.tasks.delete_one({"_id": oid})
        
        if result.deleted_count == 0:
            logger.info(f"Tarea no encontrada para eliminar: {task_id}")
            return False
        
        logger.info(f"Tarea eliminada: {task_id}, colección: tasks")
        return True
    except ValueError as e:
        logger.warning(f"ObjectId inválido: {task_id}")
        return False
    except Exception as e:
        logger.error(f"Error al eliminar tarea: {e}")
        return False

