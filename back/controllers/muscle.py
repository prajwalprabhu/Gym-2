from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import Connection, text

from back.db import get_db
from back.models.muscle import MuscleModel

muscleRouter = APIRouter(
    prefix="/muscles",
    tags=["muscles"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


class MuscleController:

    @staticmethod
    @muscleRouter.get("/")
    def fetchAll(
        muscle_group_id: int | None = None,
        muscle_id: int | None = None,
        conn: Connection = Depends(get_db),
    ) -> List[MuscleModel]:

        return MuscleModel.fetchAll(conn, muscle_group_id, muscle_id)
