import pytest
from fastapi import status
from fastapi.testclient import TestClient
from fastapi_users.router import ErrorCode
from src.main import app


class TestPasswordValidation:
    @pytest.mark.parametrize(
        "email, password, expected_status, expected_detail",
        [
            (
                "test@example.com",
                "short",
                status.HTTP_400_BAD_REQUEST,
                {
                    "detail": {
                        "code": ErrorCode.REGISTER_INVALID_PASSWORD.value,
                        "reason": "Password should be at least 8 characters",
                    }
                },
            ),
            (
                "test@example.com",
                "test@example.com",
                status.HTTP_400_BAD_REQUEST,
                {
                    "detail": {
                        "code": ErrorCode.REGISTER_INVALID_PASSWORD.value,
                        "reason": "Password should not contain e-mail",
                    }
                },
            ),
            (
                "test@example.com",
                "lowercasepassword",
                status.HTTP_400_BAD_REQUEST,
                {
                    "detail": {
                        "code": ErrorCode.REGISTER_INVALID_PASSWORD.value,
                        "reason": "Password should contain at least one uppercase letter",
                    }
                },
            ),
            (
                "test@example.com",
                "Nosppecialchar1",
                status.HTTP_400_BAD_REQUEST,
                {
                    "detail": {
                        "code": ErrorCode.REGISTER_INVALID_PASSWORD.value,
                        "reason": "Password should contain at least one special character",
                    }
                },
            ),
        ],
    )
    def test_password_validation(
        self, email, password, expected_status, expected_detail
    ):
        client = TestClient(app)
        json = {"email": email, "password": password}
        response = client.post("auth/register", json=json)
        assert response.status_code == expected_status
