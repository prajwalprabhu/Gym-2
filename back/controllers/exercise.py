from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import Connection, Engine

from back.db import get_db
from back.models.exercise import ExerciseModel

exerciseRouter = APIRouter(
    prefix="/exercises",
    tags=["exercises"],
    responses={404: {"description": "Not found"}},
)


class ExerciseController(BaseModel):
    @staticmethod
    @exerciseRouter.get("/")
    def fetchAll(
        muscle_group_id: int | None = None,
        muscle_id: int | None = None,
        exercise_id: int | None = None,
        conn: Connection = Depends(get_db),
    ) -> List[ExerciseModel]:

        return ExerciseModel.fetchAll(conn, muscle_group_id, muscle_id, exercise_id)

    @staticmethod
    @exerciseRouter.get("/set/next")
    def fetchNextSet(
        exercise_id: int, user_id: int, conn: Connection = Depends(get_db)
    ) -> List[ExerciseModel.setDetail]:

        return ExerciseModel.fetchNextSets(conn, exercise_id, user_id)

    @staticmethod
    @exerciseRouter.get("/set/details")
    def fetchSetDetails(
        exercise_details_id: int,
        user_id: int,
        exercise_id: int,
        conn: Connection = Depends(get_db),
    ) -> List[ExerciseModel.setDetail]:
        return ExerciseModel.fetchSetDetails(
            conn, exercise_details_id, user_id, exercise_id
        )
