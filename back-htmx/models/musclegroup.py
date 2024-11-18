from pydantic import BaseModel
from sqlalchemy import Connection, text

from back.utils.db import *


class MuscleGroupModel(BaseModel):
    muscle_group_id: int
    muscle_group_name: str

    @staticmethod
    def fetchAll(
        conn: Connection, muscle_group_id: int | None = None
    ) -> List["MuscleGroupModel"]:
        query = "select * from muscle_groups "
        param = {}
        if muscle_group_id:
            query = "where muscle_group_id = :muscle_group_id "
            param["muscle_group_id"] = muscle_group_id

        return conn.execute(text(query), param).mappings().all()  # type:ignore
