import os

from loguru import logger
from sqlalchemy import create_engine, text

# env is render then use different db
mode = "local" if os.environ.get("RENDER") is None else "render"
connection_url = (
    "postgresql://gym_w4s6_user:RVjtnRCmHmmeeq1mcMIHsLbskC0SDTv4@dpg-cstl2n8gph6c739g7l4g-a/gym_w4s6"
    if mode != "local"
    else "postgresql://tprajwalprabhu:@localhost:5432/gym"
)
db = create_engine(connection_url)


def get_db():
    global db
    conn = db.connect()
    logger.info("connected to db")
    try:
        logger.info("checking connection")
        conn.execute(text("select 1 "))
        logger.info("connected")
        yield conn
    except Exception as e:
        logger.error(e)
        logger.info("Reconnecting")
        db = create_engine(connection_url)
        conn = db.connect()
        logger.info("Reconnected")
        yield conn
    finally:
        logger.info("Closing connection")
        conn.close()
