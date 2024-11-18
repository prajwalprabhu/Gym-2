from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from loguru import logger
import time
from .controllers.exercise import exerciseRouter
from .controllers.exerciseDetails import exerciseDetailsRouter
from .controllers.muscle import muscleRouter
from .controllers.musclegroup import muscleGroupRouter
from .controllers.setDetails import setDetailsRouter
from .controllers.user import userRouter
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates


def custom_generate_unique_id(route: APIRoute):
    print(route)
    tag = route.tags[0] if len(route.tags) > 0 else "api"
    return f"{tag}-{route.name}"


app = FastAPI(generate_unique_id_function=custom_generate_unique_id)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


templates = Jinja2Templates(directory="templates")


@app.get("/Login", response_class=HTMLResponse)
def get_items(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    url = str(request.url).replace(str(request.base_url), "")
    logger.info("Request: {} path {} ", request.method, url)
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"Processed {url} in {process_time} seconds")
    return response


app.include_router(exerciseDetailsRouter)
app.include_router(muscleGroupRouter)
app.include_router(userRouter)
app.include_router(muscleRouter)
app.include_router(exerciseRouter)
app.include_router(setDetailsRouter)
