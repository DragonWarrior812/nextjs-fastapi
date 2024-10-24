# nextjs-fastapi-template

## Run the project (Development)

- `docker compose build`
- `docker compose up`

## Run migrations
- `docker compose run --rm backend alembic upgrade head`


## Frontend

Create a .env.local file

NEXT_PUBLIC_API_BASE_URL=http://backend:8000