import json
from pathlib import Path
from src.main import app
import os

from dotenv import load_dotenv

load_dotenv()

OUTPUT_FILE = os.getenv("OPENAPI_OUTPUT_FILE")


def generate_openapi_schema(output_file):
    schema = app.openapi()
    output_path = Path(output_file)
    output_path.write_text(json.dumps(schema, indent=2))
    print(f"OpenAPI schema saved to {output_file}")


if __name__ == "__main__":
    generate_openapi_schema(OUTPUT_FILE)
