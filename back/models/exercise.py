from loguru import logger
from pydantic import BaseModel
from sqlalchemy import Connection, text

from ..utils.db import *
from ..utils.regression import predictNextValue


class ExerciseModel(BaseModel):
    class setDetail(BaseModel):
        set_number: int
        weight: float
        reps: int

        def __getitem__(self, key):
            return getattr(self, key)

    muscle_group_id: int
    muscle_id: int
    exercise_id: int
    exercise_name: str
    sets: List[setDetail] = []

    @staticmethod
    def fetchAll(
        conn: Connection,
        muscle_group_id: int | None = None,
        muscle_id: int | None = None,
        exercise_id: int | None = None,
    ) -> List["ExerciseModel"]:
        # sort by number of exercises performed count the number from exercise details
        query = "SELECT exercises.* FROM muscle_groups "
        query += "JOIN muscles USING (muscle_group_id) "
        query += "JOIN exercises USING (muscle_group_id,muscle_id) "
        param = {}
        if muscle_group_id:
            query += " where muscle_group_id = :muscle_group_id "
            param["muscle_group_id"] = muscle_group_id
            if muscle_id:
                query += " and muscle_id = :muscle_id "
                param["muscle_id"] = muscle_id
            if exercise_id:
                query += " and exercise_id = :exercise_id "
                param["exercise_id"] = exercise_id
        query += " order by (select count(*) from exercise_details where exercise_id = exercises.exercise_id) desc"
        return conn.execute(text(query), param).mappings().all()  # type: ignore

    @staticmethod
    def fetchNextSets(
        conn: Connection, exercise_id: int, user_id: int
    ) -> List["ExerciseModel.setDetail"]:
        query = text(
            #     """SELECT
            # string_agg(sd.weight::text, ',') AS weights,
            # string_agg(sd.reps::text, ',') AS reps,
            # sd.set_number
            # FROM (select user_id,exercise_details_id from exercise_details where user_id = :user_id and exercise_id = :exercise_id order by performed_date desc limit 5) as ed
            # JOIN (select user_id,exercise_details_id,weight,reps,set_number from set_details where user_id=:user_id and exercise_id = :exercise_id) as sd USING(user_id, exercise_details_id)
            # GROUP BY sd.set_number
            # LIMIT 15"""
            """SELECT
            string_agg(sd.weight::text, ',') AS weights,
            string_agg(sd.reps::text, ',') AS reps,
            sd.set_number
        FROM (
            SELECT user_id, exercise_details_id
            FROM exercise_details
            WHERE user_id = :user_id AND exercise_id = :exercise_id
            ORDER BY performed_date DESC
            LIMIT 5
        ) AS ed
        JOIN set_details sd ON ed.exercise_details_id = sd.exercise_details_id
        GROUP BY sd.set_number
        LIMIT 15"""
        )
        sets: List[ExerciseModel.setDetail] = (
            conn.execute(query, {"exercise_id": exercise_id, "user_id": user_id})
            .mappings()
            .all()
        )  # type: ignore
        logger.info("Got the previous set")
        newSet: List[ExerciseModel.setDetail] = []
        for i, set in enumerate(sets):
            newSet.append(
                ExerciseModel.setDetail(
                    set_number=set["set_number"],
                    reps=int(set["reps"].split(",")[-1]),
                    weight=ExerciseModel._predictNextValue(
                        [float(x) for x in set["weights"].split(",")]
                    ),
                )
            )
            logger.info(f"Predicted the {i} set")
        return newSet

    @staticmethod
    def _predictNextValue(data: List[float]) -> float:
        predictedValue = predictNextValue(data)
        lower = predictedValue // 2.5
        upper = lower + 1
        lower *= 2.5
        upper *= 2.5
        if predictedValue > lower and predictedValue <= lower + (2.5 / 2):
            predictedValue = lower
        else:
            predictedValue = upper
        print(predictedValue)
        return predictedValue

    @staticmethod
    def fetchSetDetails(
        conn: Connection, exercise_details_id: int, user_id: int, exercise_id: int
    ) -> List["ExerciseModel.setDetail"]:
        query = text(
            "select * from set_details where user_id = :user_id and exercise_details_id = :exercise_details_id"
        )
        return (
            conn.execute(
                query, {"user_id": user_id, "exercise_details_id": exercise_details_id}
            )
            .mappings()
            .all()
        )  # type: ignore
