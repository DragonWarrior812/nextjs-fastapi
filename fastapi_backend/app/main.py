from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import traceback
from .schemas import UserCreate, UserRead, UserUpdate
from .users import auth_backend, fastapi_users, AUTH_URL_PATH
from fastapi.middleware.cors import CORSMiddleware
from .utils import simple_generate_unique_route_id
from app.routes.items import router as items_router
from app.config import settings

app = FastAPI(generate_unique_id_function=simple_generate_unique_route_id)

# Middleware for CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication and user management routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix=f"/{AUTH_URL_PATH}/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix=f"/{AUTH_URL_PATH}",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix=f"/{AUTH_URL_PATH}",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix=f"/{AUTH_URL_PATH}",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

# Include items routes
app.include_router(items_router, prefix="/items")


# Custom Exception Handlers

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # Log the exception with context (type and message)
    error_message = f"Exception occurred: {exc}"
    # Capture the full traceback for more context
    stack_trace = traceback.format_exc()

    # You can log both the message and the stack trace for debugging
    print(error_message)
    print("Stack trace:\n", stack_trace)

    # FastAPI will automatically log the exception traceback, so this is optional for more control
    return JSONResponse(status_code=500, content={})