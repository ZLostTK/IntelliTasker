"""
Configuración de la conexión a MongoDB usando Motor (async).
"""
import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional

logger = logging.getLogger(__name__)

# Cliente global de MongoDB
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None

# Configuración por defecto
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "intellitasker"


async def connect_to_mongo():
    """
    Establece la conexión a MongoDB.
    """
    global client, db
    try:
        client = AsyncIOMotorClient(
            MONGODB_URL,
            uuidRepresentation="standard",
            serverSelectionTimeoutMS=5000
        )
        db = client[DATABASE_NAME]
        # Verificar conexión
        await client.admin.command('ping')
        logger.info(f"Conectado a MongoDB: {DATABASE_NAME}")
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

