from loguru import logger
from sqlalchemy import create_engine, text
connection_url = "postgresql://postgres:amin123@localhost:5432/gym"
db = create_engine(
    connection_url
)


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
        db = create_engine(
            connection_url
        )
        conn = db.connect()
        logger.info("Reconnected")
        yield conn
    finally:
        logger.info("Closing connection")
        conn.close()
