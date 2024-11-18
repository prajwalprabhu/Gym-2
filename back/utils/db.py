from typing import Any, Dict, List

from pydantic import BaseModel
from sqlalchemy import Connection, text


class IdInput(BaseModel):
    table_name: str
    column_name: str
    where: Dict[str, Any] = {}


def getId(conn: Connection, input: IdInput):
    query = f"select coalesce(max({input.column_name}),0)+1 as {input.column_name} from {input.table_name} "

    if len(input.where) > 0:
        query += " where "
        query += " and ".join(f"{key} = :{key}" for key in input.where)

    query += " ; "
    value = conn.execute(text(query), input.where).fetchone()
    if not value:
        return 1
    value = value._asdict()[input.column_name]
    return value


class insertInput(BaseModel):
    table_name: str
    data: Dict[str, Any]
    skip: List[str] = []


def insertData(conn: Connection, input: insertInput):
    columns = [x for x in input.data if x not in input.skip]
    query = "INSERT INTO {table_name}({columns}) VALUES (".format(
        table_name=input.table_name, columns=" , ".join(columns)
    )
    query += " , ".join(f":{column}" for column in columns)
    query += " ) "

    query += " ; "
    response = conn.execute(
        text(query), {k: v for k, v in input.data.items() if k not in input.skip}
    )
    return response


class updateInput(BaseModel):
    table_name: str
    set: Dict[str, Any]
    where: Dict[str, Any]


def updateTable(input: updateInput):
    query = "UPDATE {} SET ".format(input.table_name)
    _a = []
    args = []
    for k, v in input.set.items():
        _a.append(" {} = :{} ".format(k, k))
        args.append(v)
    query += " , ".join(_a)
    _a = []
    query += " where "
    for k, v in input.where.items():
        _a.append(" {} = :{} ".format(k, k))
        args.append(v)
    query += " and ".join(_a)
    query += " ; "
    return text(query), {**input.where, **input.set}


def queryGen(select_query: str, where: Dict[str, Any]):
    query = select_query
    params = {}
    keys = []
    for k, v in where.items():
        if v != None:
            keys.append(k)
            params[k] = v
    if keys:
        query += " where "
        query += " and ".join(["{} = :{}".format(k, k) for k in keys])

    return query, params
