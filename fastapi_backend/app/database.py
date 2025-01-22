from typing import AsyncGenerator
from urllib.parse import urlparse

from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from .config import settings
from .models import Base, User

tmpPostgres = urlparse(settings.DATABASE_URL)

formated_database_url = (
    f"postgresql+asyncpg://{tmpPostgres.username}:{tmpPostgres.password}@"
    f"{tmpPostgres.hostname}{':' + str(tmpPostgres.port) if tmpPostgres.port else ''}"
    f"{tmpPostgres.path}"
)

# Disable connection pooling for serverless environments like Vercel
engine = create_async_engine(formated_database_url, poolclass=NullPool)

async_session_maker = async_sessionmaker(
    engine, expire_on_commit=settings.EXPIRE_ON_COMMIT
)


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)
