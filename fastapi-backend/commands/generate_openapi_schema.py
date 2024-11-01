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

    for path_data in schema["paths"].values():
        for operation in path_data.values():
            tag = operation["tags"][0]
            operation_id = operation["operationId"]
            to_remove = f"{tag}-"
            new_operation_id = operation_id[len(to_remove) :]
            operation["operationId"] = new_operation_id

    output_path.write_text(json.dumps(schema, indent=2))
    print(f"OpenAPI schema saved to {output_file}")


if __name__ == "__main__":
    generate_openapi_schema(OUTPUT_FILE)
