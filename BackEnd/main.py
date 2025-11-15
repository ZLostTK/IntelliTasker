"""
Aplicación principal FastAPI para IntelliTasker.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import connect_to_mongo, close_mongo_connection
from app.services.task_service import init_indexes
from app.api.tasks import router as tasks_router
from app.api.ai import router as ai_router

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gestiona el ciclo de vida de la aplicación.
    - Al iniciar: conecta a MongoDB e inicializa índices.
    - Al cerrar: cierra la conexión a MongoDB.
    """
    # Startup
    logger.info("Iniciando aplicación...")
    await connect_to_mongo()
    await init_indexes()
    logger.info("Aplicación iniciada correctamente")
    
    yield
    
    # Shutdown
    logger.info("Cerrando aplicación...")
    await close_mongo_connection()
    logger.info("Aplicación cerrada")


# Crear aplicación FastAPI
# Nota: ReDoc está deshabilitado debido a un error conocido con Pydantic v2
# que causa "Identifier already declared". Swagger UI funciona correctamente.
app = FastAPI(
    title="IntelliTasker API",
    description="API backend para gestión de tareas con FastAPI y MongoDB",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",  # Swagger UI - funciona correctamente
    redoc_url=None  # ReDoc deshabilitado debido a error conocido
)

# Configurar CORS para permitir conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite y otros puertos comunes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(tasks_router)
app.include_router(ai_router)


@app.get("/", status_code=200)
async def root():
    """
    Endpoint raíz de la API.
    """
    return {
        "message": "IntelliTasker API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", status_code=200)
async def health_check():
    """
    Endpoint de verificación de salud de la API.
    """
    return {"status": "healthy"}

