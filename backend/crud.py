from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas


def get_operations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Operation).offset(skip).limit(limit).all()


def create_operation(db: Session, op: schemas.OperationCreate):
    db_op = models.Operation(**op.dict())
    db.add(db_op)
    db.commit()
    db.refresh(db_op)
    return db_op


def delete_operation(db: Session, op_id: int):
    db_op = db.query(models.Operation).filter(models.Operation.id == op_id).first()
    if db_op:
        db.delete(db_op)
        db.commit()
    return db_op


def get_balance(db: Session):
    income_sum = (
        db.query(func.sum(models.Operation.amount))
        .filter(models.Operation.type == "income")
        .scalar()
        or 0
    )
    expense_sum = (
        db.query(func.sum(models.Operation.amount))
        .filter(models.Operation.type == "expense")
        .scalar()
        or 0
    )
    return income_sum - expense_sum 