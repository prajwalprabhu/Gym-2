from typing import Union

from pydantic import BaseModel, Field
from sqlalchemy import Connection, text

from back.utils.db import *


class UserModel(BaseModel):
    user_id: int
    name: str
    password: str
    gender: str = Field(max_length=1)
    age: int
    height: int
    weight: int

    class LoginModel(BaseModel):
        name: str
        password: str

    @staticmethod
    def getUserId(conn: Connection):
        user_id = getId(
            conn,
            IdInput(
                table_name="users",
                column_name="user_id",
            ),
        )
        return user_id

    @staticmethod
    def insert(self, conn: Connection):
        insert_query = insertData(
            conn, insertInput(table_name="users", data=self.__dict__)
        )

    @staticmethod
    def login(conn: Connection, data: LoginModel) -> List["UserModel"]:
        return (
            conn.execute(
                text("select * from users where name = :name and password = :password"),
                data.__dict__,
            )
            .mappings()
            .all()
        )  # type:ignore
