"""
Servicio para generar tareas usando IA (Gemini).
"""
import json
import logging
from typing import Optional
from datetime import datetime, timedelta
import google.generativeai as genai
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

from app.models.ai import AITaskRequest, AITaskResponse

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Configuración de la aplicación."""
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # Ignorar campos extra del .env
    )
    
    gemini_api_key: str = ""


settings = Settings()

# Configurar la API key de Gemini
if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)


async def generate_task_with_ai(request: AITaskRequest) -> Optional[AITaskResponse]:
    """
    Genera una tarea estructurada usando Gemini AI basándose en el título y descripción.
    
    Parámetros:
    - request: AITaskRequest con título (obligatorio) y descripción (opcional)
    
    Retorna:
    - AITaskResponse con la tarea estructurada o None si falla
    """
    if not settings.gemini_api_key:
        logger.error("GEMINI_API_KEY no está configurada en el archivo .env")
        return None
    
    try:
        # Obtener fecha actual para referencia
        now = datetime.now()
        current_date_str = now.strftime("%Y-%m-%d")
        
        # Construir el prompt para la IA
        prompt = f"""Eres un asistente experto en gestión de proyectos y tareas. 
Analiza el siguiente título de tarea y su descripción (si existe) y genera un JSON estructurado con los siguientes campos:

- title: El título de la tarea (usa exactamente el proporcionado)
- description: Una descripción detallada y útil basada en el título y descripción proporcionados. Debe ser específica y profesional.
- startDateTime: Fecha y hora de inicio en formato ISO 8601 (YYYY-MM-DDTHH:MM:SS). Debe ser una fecha futura razonable (mínimo 1 día después de hoy: {current_date_str})
- endDateTime: Fecha y hora de fin en formato ISO 8601 (YYYY-MM-DDTHH:MM:SS). Debe ser posterior a startDateTime (mínimo 1 día después de startDateTime)
- estimatedHours: Número de horas estimadas para completar la tarea (debe ser un número positivo, típicamente entre 1 y 200 horas)
- subtasks: Array de objetos con las siguientes propiedades:
  - title: Título descriptivo de la subtarea
  - estimatedHours: Horas estimadas para la subtarea (número positivo)

REGLAS IMPORTANTES:
- El JSON debe ser válido y estar en formato correcto
- Las fechas deben estar en formato ISO 8601 estricto: YYYY-MM-DDTHH:MM:SS (ejemplo: 2025-01-20T09:00:00)
- startDateTime debe ser al menos 1 día después de hoy ({current_date_str})
- endDateTime debe ser al menos 1 día después de startDateTime
- estimatedHours debe ser un número positivo (puede ser decimal como 2.5)
- La suma de estimatedHours de las subtareas debe ser aproximadamente igual a estimatedHours de la tarea principal
- Las subtareas deben tener sentido y estar relacionadas con la tarea principal
- Si la tarea es compleja (más de 8 horas), divide en 2-5 subtareas lógicas
- Si la tarea es simple (menos de 8 horas), puedes dejar el array de subtareas vacío o con 1-2 subtareas
- Cada subtarea debe tener un título claro y horas estimadas realistas

Título de la tarea: {request.title}
"""
        
        if request.description:
            prompt += f"\nDescripción proporcionada: {request.description}"
        
        prompt += "\n\nResponde ÚNICAMENTE con el JSON válido, sin texto adicional antes o después, sin markdown (sin ```json o ```), sin explicaciones. Solo el objeto JSON."

        # Configurar el modelo
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Generar respuesta
        response = model.generate_content(prompt)
        
        # Extraer el JSON de la respuesta
        response_text = response.text.strip()
        
        # Limpiar la respuesta si tiene markdown o texto adicional
        # Buscar el inicio del JSON (primer {)
        start_idx = response_text.find('{')
        if start_idx != -1:
            response_text = response_text[start_idx:]
        
        # Buscar el final del JSON (último })
        end_idx = response_text.rfind('}')
        if end_idx != -1:
            response_text = response_text[:end_idx + 1]
        
        # Limpiar markdown si aún existe
        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:].strip()
        if response_text.endswith("```"):
            response_text = response_text[:-3].strip()
        response_text = response_text.strip()
        
        # Parsear el JSON
        task_data = json.loads(response_text)
        
        # Validar fechas
        try:
            start_dt = datetime.fromisoformat(task_data.get("startDateTime", "").replace('Z', '+00:00'))
            end_dt = datetime.fromisoformat(task_data.get("endDateTime", "").replace('Z', '+00:00'))
            
            if end_dt <= start_dt:
                logger.warning(f"endDateTime no es posterior a startDateTime. Ajustando endDateTime.")
                # Ajustar endDateTime para que sea al menos 1 día después
                from datetime import timedelta
                end_dt = start_dt + timedelta(days=1)
                task_data["endDateTime"] = end_dt.strftime("%Y-%m-%dT%H:%M:%S")
            
            # Validar que las fechas sean futuras
            if start_dt < now:
                logger.warning(f"startDateTime es en el pasado. Ajustando a mañana.")
                start_dt = now + timedelta(days=1)
                task_data["startDateTime"] = start_dt.strftime("%Y-%m-%dT%H:%M:%S")
                # Ajustar también endDateTime
                if end_dt <= start_dt:
                    end_dt = start_dt + timedelta(days=1)
                    task_data["endDateTime"] = end_dt.strftime("%Y-%m-%dT%H:%M:%S")
        except (ValueError, AttributeError) as e:
            logger.error(f"Error al validar fechas: {e}")
            # Usar fechas por defecto si hay error
            start_dt = now + timedelta(days=1)
            end_dt = start_dt + timedelta(days=7)
            task_data["startDateTime"] = start_dt.strftime("%Y-%m-%dT%H:%M:%S")
            task_data["endDateTime"] = end_dt.strftime("%Y-%m-%dT%H:%M:%S")
        
        # Validar estimatedHours
        estimated_hours = float(task_data.get("estimatedHours", 1.0))
        if estimated_hours <= 0:
            logger.warning(f"estimatedHours no es positivo. Ajustando a 1.0.")
            estimated_hours = 1.0
            task_data["estimatedHours"] = estimated_hours
        
        # Validar subtareas
        subtasks = task_data.get("subtasks", [])
        if not isinstance(subtasks, list):
            subtasks = []
        
        # Validar que cada subtarea tenga los campos requeridos
        valid_subtasks = []
        for subtask in subtasks:
            if isinstance(subtask, dict) and "title" in subtask and "estimatedHours" in subtask:
                try:
                    subtask_hours = float(subtask["estimatedHours"])
                    if subtask_hours > 0:
                        valid_subtasks.append({
                            "title": str(subtask["title"]),
                            "estimatedHours": subtask_hours
                        })
                except (ValueError, TypeError):
                    logger.warning(f"Subtarea con horas inválidas ignorada: {subtask}")
        
        task_data["subtasks"] = valid_subtasks
        
        # Crear la respuesta validada
        ai_response = AITaskResponse(
            title=task_data.get("title", request.title),
            description=task_data.get("description", ""),
            startDateTime=task_data.get("startDateTime", ""),
            endDateTime=task_data.get("endDateTime", ""),
            estimatedHours=estimated_hours,
            subtasks=valid_subtasks
        )
        
        logger.info(f"Tarea generada exitosamente con IA para: {request.title}")
        return ai_response
        
    except json.JSONDecodeError as e:
        logger.error(f"Error al parsear JSON de la IA: {e}")
        logger.error(f"Respuesta recibida: {response_text if 'response_text' in locals() else 'N/A'}")
        return None
    except Exception as e:
        logger.error(f"Error al generar tarea con IA: {e}", exc_info=True)
        return None

