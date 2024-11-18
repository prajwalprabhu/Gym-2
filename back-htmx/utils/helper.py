import sys

args = sys.argv[1:]
if len(args) == 0:
    print('Enter the module name')
    exit(0)

name = args[0]
className = name.capitalize()
_response = '{404: {"description": "Not found"}}'
controllerContent = f"""
from fastapi import APIRouter, Depends
from sqlalchemy import Connection , text
from pydantic import BaseModel


from ..db import get_db
from ..models.{name} import {className}Model

{name}Router = APIRouter(
    prefix="/{name}s",
    tags=["{name}s"],
    responses={_response},
)

class {className}Controller(BaseModel):
    pass"""
with open(f"./controllers/{name}.py",'w') as f:
    f.write(controllerContent)


modelContent = f"""
from pydantic import BaseModel
from sqlalchemy import Connection,text
from ..utils.db import *

class {className}Model(BaseModel):
    pass"""
with open(f"./models/{name}.py",'w') as f:
    f.write(modelContent)
apiData = ''
with open('api.py','r') as f:
    apiData = f.read().strip()
importStatement = f'from .controllers.{name} import {name}Router'
includeStatement = f'app.include_router({name}Router)'
    
apiData = '{}\n{}\n{}'.format(importStatement,apiData,includeStatement)
with open('api.py','w') as f:
    f.write(apiData)
print(f'{name} created successfully')