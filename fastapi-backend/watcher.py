import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
from threading import Timer

WATCHER_FILES = [
    "src/schemas.py",
    "src/main.py",
]


class MyHandler(FileSystemEventHandler):
    def __init__(self):
        super().__init__()
        self.debounce_timer = None  # Timer to debounce multiple events
        self.last_modified = 0

    def on_modified(self, event):
        # Check if the event is for a file and not a directory
        if not event.is_directory:
            if event.src_path in WATCHER_FILES:  # Specify the file(s) you want to track
                # If there's an existing debounce timer, cancel it
                if self.debounce_timer:
                    self.debounce_timer.cancel()

                # Start a new timer (e.g., 1 second delay) to wait before executing
                self.debounce_timer = Timer(1.0, self.execute_command, [event.src_path])
                self.debounce_timer.start()

    def execute_command(self, file_path):
        print(f"File {file_path} has been modified and saved.")

        try:
            # Execute your first command
            subprocess.run(
                ["poetry", "run", "python", "-m", "commands.generate_openapi_schema"],
                check=True,
            )

        except subprocess.CalledProcessError as e:
            print(f"An error occurred: {e}")


if __name__ == "__main__":
    path = "src"  # Directory to watch
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)

    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
