"""
Configuración de la conexión a MongoDB usando Motor (async).
"""
import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

logger = logging.getLogger(__name__)


class DatabaseSettings(BaseSettings):
    """Configuración de la base de datos."""
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # Ignorar campos extra del .env
    )
    
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "intellitasker"


db_settings = DatabaseSettings()

# Cliente global de MongoDB
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo():
    """
    Establece la conexión a MongoDB.
    """
    global client, db
    try:
        client = AsyncIOMotorClient(
            db_settings.mongodb_url,
            uuidRepresentation="standard",
            serverSelectionTimeoutMS=5000
        )
        db = client[db_settings.database_name]
        # Verificar conexión
        await client.admin.command('ping')
        logger.info(f"Conectado a MongoDB: {db_settings.database_name}")
    except Exception as e:
        logger.error(f"Error al conectar a MongoDB: {e}")
        raise


async def close_mongo_connection():
    """
    Cierra la conexión a MongoDB.
    """
    global client
    if client:
        client.close()
        logger.info("Conexión a MongoDB cerrada")

