from httpx import AsyncClient
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from fastapi_users.db import SQLAlchemyUserDatabase

from app.src.config import settings
from app.src.models import User, Base

from app.src.database import get_user_db
from app.src.main import app


@pytest_asyncio.fixture(scope="session")
async def db_session():
    """Fixture to create and return a new async database session."""

    engine = create_async_engine(settings.TEST_DATABASE_URL, echo=True)

    async_session_maker = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        yield session
        await session.rollback()

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await session.close()


@pytest_asyncio.fixture(scope="session")
async def test_client(db_session):
    """Fixture to create a test client that uses the test database session."""

    async def override_get_db():
        session = SQLAlchemyUserDatabase(db_session, User)
        try:
            yield session
        finally:
            await db_session.close()

    app.dependency_overrides[get_user_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        yield client
