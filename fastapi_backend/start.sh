#!/bin/bash

if [ -f /.dockerenv ]; then
    echo "Running in Docker"
    fastapi dev src/main.py --host 0.0.0.0 --port 8000 --reload &
    python watcher.py
else
    echo "Running locally with Poetry"
    poetry run fastapi dev src/main.py --host 0.0.0.0 --port 8000 --reload &
    poetry run python watcher.py
fi

wait