from datetime import date

from pydantic import BaseModel, validator


class OperationBase(BaseModel):
    type: str  # income or expense
    amount: float
    category: str
    date: date

    @validator("type")
    def validate_type(cls, v):
        if v not in ("income", "expense"):
            raise ValueError("type must be 'income' or 'expense'")
        return v


class OperationCreate(OperationBase):
    pass


class Operation(OperationBase):
    id: int

    class Config:
        orm_mode = True 