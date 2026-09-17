import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("SUPABASE_URL")

if not DATABASE_URL:
    # Local fallback to SQLite
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_PATH = os.path.join(os.path.dirname(BASE_DIR), "e_complaints.db")
    DATABASE_URL = f"sqlite:///{DB_PATH}"
elif DATABASE_URL.startswith("postgres://"):
    # Fix legacy Heroku/Supabase postgres:// scheme to postgresql:// for SQLAlchemy
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

is_sqlite = DATABASE_URL.startswith("sqlite")

connect_args = {"check_same_thread": False} if is_sqlite else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
