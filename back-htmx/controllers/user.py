from fastapi import APIRouter, Depends
from sqlalchemy import Connection, Engine

from back.db import get_db
from back.models.user import UserModel
from back.utils.db import *

userRouter = APIRouter(
    prefix="/users",
    tags=["users"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


class LoginResponse(BaseModel):
    success: bool


class UserController:
    @staticmethod
    @userRouter.post("/")
    def createUser(user: UserModel, conn: Connection = Depends(get_db)) -> int:

        user_id = 0

        user_id: int = UserModel.getUserId(conn)
        user.user_id = user_id
        UserModel.insert(user, conn)
        conn.commit()
        return user_id

    @staticmethod
    @userRouter.post("/login")
    def login(
        data: UserModel.LoginModel, conn: Connection = Depends(get_db)
    ) -> LoginResponse:
        data: List[UserModel] = UserModel.login(conn, data)
        print(data)
        return LoginResponse(success=len(data) > 0)
