#!/bin/bash

if [ -f /.dockerenv ]; then
    echo "Running in Docker"
    fastapi dev app/src/main.py --host 0.0.0.0 --port 8000 --reload &
    python app/watcher.py
else
    echo "Running locally with Poetry"
    poetry run fastapi dev app/src/main.py --host 0.0.0.0 --port 8000 --reload &
    poetry run python app/watcher.py
fi

wait