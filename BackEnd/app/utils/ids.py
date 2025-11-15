"""
Utilidades para manejo seguro de ObjectId de MongoDB.
"""
from bson import ObjectId
from typing import Optional


def validate_object_id(id_str: str) -> ObjectId:
    """
    Valida y convierte un string a ObjectId.
    
    Parámetros:
    - `id_str`: String que representa un ObjectId.
    
    Retorna:
    - ObjectId válido.
    
    Lanza:
    - ValueError: Si el formato del ObjectId es inválido.
    """
    if not ObjectId.is_valid(id_str):
        raise ValueError(f"Formato de ObjectId inválido: {id_str}")
    return ObjectId(id_str)


def object_id_to_str(doc: dict) -> dict:
    """
    Convierte el campo _id de ObjectId a string en un documento.
    
    Parámetros:
    - `doc`: Diccionario con un campo _id de tipo ObjectId.
    
    Retorna:
    - Diccionario con el campo _id convertido a string como 'id'.
    """
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

