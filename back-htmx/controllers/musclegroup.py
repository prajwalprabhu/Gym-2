from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import Connection, Engine

from back.db import get_db
from back.models.musclegroup import MuscleGroupModel

muscleGroupRouter = APIRouter(
    prefix="/muscle_groups",
    tags=["muscle_groups"],
    responses={404: {"description": "Not found"}},
)


class MuscleGroupController(BaseModel):
    @staticmethod
    @muscleGroupRouter.get("/")
    def fetchAll(
        muscle_group_id: int | None = None, conn: Connection = Depends(get_db)
    ) -> List[MuscleGroupModel]:
        return MuscleGroupModel.fetchAll(conn, muscle_group_id)
