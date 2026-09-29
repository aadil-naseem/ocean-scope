from app.database import Base, engine
from models import Instrument, Observation, ModelRun


print("Creating OceanScope database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")