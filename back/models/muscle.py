from typing import List

from pydantic import BaseModel
from sqlalchemy import Connection, text


class MuscleModel(BaseModel):
    muscle_group_id: int
    muscle_id: int
    muscle_name: str

    @staticmethod
    def fetchAll(
        conn: Connection,
        muscle_group_id: int | None = None,
        muscle_id: int | None = None,
    ) -> List["MuscleModel"]:
        query = "select * from muscles "
        param = {}
        if muscle_group_id:
            query += " where muscle_group_id = :muscle_group_id "
            param["muscle_group_id"] = muscle_group_id
            if muscle_id:
                query += " and muscle_id = :muscle_id "
                param["muscle_id"] = muscle_id

        res: List[MuscleModel] = (
            conn.execute(text(query), param).mappings().all()
        )  # type:ignore
        return res
