from loguru import logger
from pydantic import BaseModel
from sqlalchemy import Connection, text
from typing import List
from ..utils.db import *


class FetchAll(BaseModel):
    muscle_name: str
    muscle_group_name: str
    exercise_name: str
    performed_date: str
    user_id: int
    exercise_id: int
    exercise_details_id: int


class ExercisedetailsModel(BaseModel):
    class setDetail(BaseModel):
        set_number: int
        weight: float
        reps: int

    user_id: int
    exercise_id: int
    exercise_details_id: int
    performed_date: str = "Now()"
    sets: List[setDetail]

    @staticmethod
    def fetchAll(
        conn: Connection,
        user_id: int,
        exercise_id: int | None = None,
        exercise_details_id: int | None = None,
    ) -> List[FetchAll]:
        query = "select exercise_id,performed_date,user_id,exercise_details_id from exercise_details "
        full_query, params = queryGen(
            query,
            {
                "user_id": user_id,
                "exercise_id": exercise_id,
                "exercise_details_id": exercise_details_id,
            },
        )
        full_query = f"""select
        muscle_name,muscle_group_name,exercise_name,to_char(performed_date,'dd-mm-yyy') as performed_date,user_id,exercise_id,exercise_details_id
        from ( {full_query} ) as ed
        join exercises  using(exercise_id)
        join muscle_groups  using(muscle_group_id)
        join muscles using (muscle_group_id,muscle_id)
        order by ed.performed_date desc"""
        data: List[FetchAll] = (
            conn.execute(text(full_query), params).mappings().all()
        )  # type:ignore
        return data

    @staticmethod
    def fetchSetDetails(
        conn: Connection, exercise_details_id: int, user_id: int, exercise_id: int
    ) -> List[setDetail]:
        query = text(
            "select * from set_details where user_id = :user_id and exercise_id = :exercise_id and exercise_details_id = :exercise_details_id"
        )
        return (
            conn.execute(
                query,
                {
                    "user_id": user_id,
                    "exercise_details_id": exercise_details_id,
                    "exercise_id": exercise_id,
                },
            )
            .mappings()
            .all()
        )  # type:ignore

    @staticmethod
    def insert(data: "ExercisedetailsModel", conn: Connection):
        if data.exercise_details_id and data.exercise_details_id > 0:
            conn.execute(
                text(
                    "delete from exercise_details where user_id = :user_id and exercise_id = :exercise_id and exercise_details_id = :exercise_details_id"
                ),
                {
                    "user_id": data.user_id,
                    "exercise_id": data.exercise_id,
                    "exercise_details_id": data.exercise_details_id,
                },
            )
        else:
            data.exercise_details_id = getId(
                conn,
                IdInput(
                    table_name="exercise_details",
                    column_name="exercise_details_id",
                    where={"user_id": data.user_id, "exercise_id": data.exercise_id},
                ),
            )
        logger.info(f"Got exercise details id {data.exercise_details_id}")
        logger.info(f"{data.__dict__}")
        insertData(
            conn,
            insertInput(
                table_name="exercise_details", data=data.__dict__, skip=["sets"]
            ),
        )

        logger.info(f"Inserted exercise details {data.exercise_details_id}")
        for set in data.sets:
            insertData(
                conn,
                insertInput(
                    table_name="set_details",
                    data={
                        "user_id": data.user_id,
                        "exercise_details_id": data.exercise_details_id,
                        "exercise_id": data.exercise_id,
                        "set_number": set.set_number,
                        "weight": set.weight,
                        "reps": set.reps,
                    },
                ),
            )

        logger.info(f"Inserted sets {data.exercise_details_id}")
        conn.commit()
        return data.exercise_details_id
    class MaxDetails(BaseModel):
        user_id: int
        exercise_id: int
        exercise_name:str
        exercise_date: str
        max_weight: float
    @staticmethod
    def getMax(conn: Connection, user_id: int, exercise_id: int) ->List[MaxDetails]:
        query = text("""
            SELECT
                ed.user_id,
                ed.exercise_id,
                e.exercise_name,
                TO_CHAR(ed.performed_date, 'DD-MM') AS exercise_date,
                MAX(sd.weight) AS max_weight
            FROM
                exercise_details ed
            JOIN
                set_details sd ON ed.user_id = sd.user_id
                               AND ed.exercise_id = sd.exercise_id
                               AND ed.exercise_details_id = sd.exercise_details_id
            JOIN
                exercises e ON ed.exercise_id = e.exercise_id
            WHERE
                e.exercise_id = :exercise_id
                AND ed.user_id = :user_id
            GROUP BY
                ed.user_id, ed.exercise_id, e.exercise_name, ed.performed_date
            ORDER BY
                exercise_date ;
""")
        return conn.execute(query, {"user_id": user_id, "exercise_id": exercise_id}).mappings().all() # type:ignore
