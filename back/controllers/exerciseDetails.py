from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import Connection, text

from ..db import get_db
from ..models.exerciseDetails import ExercisedetailsModel, FetchAll

exerciseDetailsRouter = APIRouter(
    prefix="/exerciseDetails",
    tags=["exerciseDetails"],
    responses={404: {"description": "Not found"}},
)


class ExercisedetailsController(BaseModel):
    @staticmethod
    @exerciseDetailsRouter.get("/set")
    def fetchSetDetails(
        exercise_details_id: int,
        user_id: int,
        exercise_id: int,
        conn: Connection = Depends(get_db),
    ) -> List[ExercisedetailsModel.setDetail]:
        return ExercisedetailsModel.fetchSetDetails(
            conn, exercise_details_id, user_id, exercise_id
        )

    @staticmethod
    @exerciseDetailsRouter.get("/")
    def fetchAll(
        user_id: int,
        exercise_id: int | None = None,
        exercise_details_id: int | None = None,
        conn: Connection = Depends(get_db),
    ) -> List[FetchAll]:
        return ExercisedetailsModel.fetchAll(
            conn, user_id, exercise_id, exercise_details_id
        )

    @staticmethod
    @exerciseDetailsRouter.post("/")
    def insert(data: "ExercisedetailsModel", conn: Connection = Depends(get_db)) -> int:
        return ExercisedetailsModel.insert(data, conn)
    @staticmethod
    @exerciseDetailsRouter.get("/max")
    def getMax(user_id: int, exercise_id: int, conn: Connection = Depends(get_db)) -> List[ExercisedetailsModel.MaxDetails]:
        return ExercisedetailsModel.getMax(conn, user_id, exercise_id)
