from sqlalchemy import Column, Integer, String, Float, Date

from .database import Base


class Operation(Base):
    __tablename__ = "operations"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True)  # income or expense
    amount = Column(Float, nullable=False)
    category = Column(String, index=True, nullable=False)
    date = Column(Date, nullable=False) 