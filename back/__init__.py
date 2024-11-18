# Example usage:
from datetime import datetime

import pydantic
from loguru import logger

logger.add("logs.log", rotation="50MB", compression="zip")
