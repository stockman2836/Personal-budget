from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Budget API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/operations", response_model=List[schemas.Operation])
def read_operations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_operations(db, skip=skip, limit=limit)


@app.post("/operations", response_model=schemas.Operation, status_code=201)
def create_operation(op: schemas.OperationCreate, db: Session = Depends(get_db)):
    return crud.create_operation(db, op)


@app.delete("/operations/{op_id}", response_model=schemas.Operation)
def delete_operation(op_id: int, db: Session = Depends(get_db)):
    op = crud.delete_operation(db, op_id)
    if op is None:
        raise HTTPException(status_code=404, detail="Operation not found")
    return op


@app.get("/balance")
def get_balance(db: Session = Depends(get_db)):
    balance = crud.get_balance(db)
    return {"balance": balance} 