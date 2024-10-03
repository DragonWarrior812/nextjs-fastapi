FROM python:3.12-bookworm

WORKDIR /app

RUN curl -sSL https://install.python-poetry.org | python3 -

ENV PATH="/root/.local/bin:$PATH"

RUN poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root

COPY . .

EXPOSE 8000

CMD ["fastapi", "dev", "src/main.py", "--host", "0.0.0.0", "--port", "8000", "--reload"]