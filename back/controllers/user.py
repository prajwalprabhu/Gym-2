from fastapi import APIRouter, Depends
from sqlalchemy import Connection, Engine
from typing import Dict, List
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
    user_id: int
    user_name: str


class UserController:
    @staticmethod
    @userRouter.get("/")
    def getUser(user_id:int,conn:Connection = Depends(get_db)) ->UserModel:
        return UserModel.getUser(conn,user_id)
    @staticmethod
    @userRouter.post("/")
    def createUser(user: UserModel, conn: Connection = Depends(get_db)) -> Dict[str, int]:

        user_id = 0

        user_id: int = UserModel.getUserId(conn)
        user.user_id = user_id
        UserModel.insert(user, conn)
        conn.commit()
        return {"user_id":user_id}

    @staticmethod
    @userRouter.post("/login")
    def login(
        data: UserModel.LoginModel, conn: Connection = Depends(get_db)
    ) -> LoginResponse:
        data: List[UserModel] = UserModel.login(conn, data)
        print(data)
        return LoginResponse(success=len(data) > 0, user_id=data[0].user_id, user_name=data[0].name)
