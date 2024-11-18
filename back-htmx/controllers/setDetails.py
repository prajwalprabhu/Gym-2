
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import Connection, text

from ..db import get_db
from ..models.setDetails import SetdetailsModel

setDetailsRouter = APIRouter(
    prefix="/setDetailss",
    tags=["setDetailss"],
    responses={404: {"description": "Not found"}},
)

class SetdetailsController(BaseModel):
    pass