from . import db
from sqlalchemy.orm import validates
from sqlalchemy import String
from datetime import datetime, timezone


ABTEILUNGEN_CHOICES = [
    "Allgemein",
    "Geschäftsführung",
    "Einkauf",
    "Verkauf",
    "Personal",
    "Marketing",
    "ITP",
    "Produktion",
    "Alle"
]


PERSONAL_CHOICES = [
    "Andreas",
    "Sabine",
    "Torsten",
    "Bari"
]

BEWERTUNG_CHOICES = list(range(1, 11))

class Ziel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    abteilung = db.Column(String(50), default="Allgemein", nullable=False)
    aussage = db.Column(db.String(255), nullable=True)
    kriterium = db.Column(db.String(255), nullable=True)
    bewertung = db.Column(db.Integer, nullable=True)
    einschätzung = db.Column(db.String(255), nullable=True)
    geändert = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    kommentar = db.Column(db.String(255), nullable=True)
    author = db.Column(String(50), default="Andreas", nullable=False)

    @validates('bewertung')
    def validate_bewertung(self, key, value):
        if value < 0 or value > 11:
            raise ValueError("Rating must be between 1 and 10")
        return value


