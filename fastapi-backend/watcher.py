import time
import re
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
from threading import Timer
import os

WATCHER_REGEX_PATTERN = re.compile(r"(main|schemas)\.py$")
APP_PATH = "src"


class MyHandler(FileSystemEventHandler):
    def __init__(self):
        super().__init__()
        self.debounce_timer = None
        self.last_modified = 0

    def on_modified(self, event):
        if not event.is_directory:
            if WATCHER_REGEX_PATTERN.search(os.path.basename(event.src_path)):
                current_time = time.time()
                # Ensure a minimum interval between modifications (e.g., 1 second)
                if current_time - self.last_modified > 1:
                    self.last_modified = current_time
                    if self.debounce_timer:
                        self.debounce_timer.cancel()
                    self.debounce_timer = Timer(
                        1.0, self.execute_command, [event.src_path]
                    )
                    self.debounce_timer.start()

    def execute_command(self, file_path):
        print(f"File {file_path} has been modified and saved.")

        try:
            subprocess.run(
                ["poetry", "run", "python", "-m", "commands.generate_openapi_schema"],
                check=True,
            )
        except subprocess.CalledProcessError as e:
            print(f"An error occurred: {e}")


if __name__ == "__main__":
    path = APP_PATH
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)

    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
