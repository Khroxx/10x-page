import os
from dotenv import load_dotenv


load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://test:testpassword@localhost:3306/texsib_projekt'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "ASDF345345GSDG"
# zu test zwecken ohne .env
