from sqlalchemy.orm.session import Session

from .models import User
from .oauth2 import pwd_context
from .schemas import UserCreate


def create_new_user(request: UserCreate, db: Session):
    new_user = User(
        username=request.username,
        email=request.email,
        password=pwd_context.hash(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
