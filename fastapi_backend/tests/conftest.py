from httpx import AsyncClient
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from fastapi_users.db import SQLAlchemyUserDatabase

from app.config import settings
from app.models import User, Base

from app.database import get_user_db, get_async_session
from app.main import app


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

    # Override for user database
    async def override_get_db():
        session = SQLAlchemyUserDatabase(db_session, User)
        try:
            yield session
        finally:
            await db_session.close()

    # Override for general database session
    async def override_get_async_session():
        try:
            yield db_session
        finally:
            await db_session.close()

    # Override both dependencies
    app.dependency_overrides[get_user_db] = override_get_db
    app.dependency_overrides[get_async_session] = override_get_async_session

    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        yield client


@pytest_asyncio.fixture(scope="session")
async def authenticated_user(test_client):
    """Fixture to create and authenticate a test user."""
    # Register user
    register_json = {
        "email": "test@example.com",
        "password": "TestPassword123#",
    }
    response = await test_client.post("/auth/register", json=register_json)
    assert response.status_code == 201

    # Login to get access token
    login_response = await test_client.post(
        "/auth/jwt/login",
        data={
            "username": "test@example.com",
            "password": "TestPassword123#",
        },
    )
    assert login_response.status_code == 200
    access_token = login_response.json()["access_token"]

    # Return both the headers and the user data
    return {
        "headers": {"Authorization": f"Bearer {access_token}"},
        "user_data": register_json,
    }
