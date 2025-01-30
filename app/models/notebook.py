from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Notebook(db.Model):
    """
    Notebook Model
    matches schema names and relationships
    a notebook can have many notes and tasks
    backref allows for notebook object to access notes and for a note object to access the notebook (note.notebook)
    lazy=true allows for the access of notes through notebook.notes on demand
    cascade='all, deletw-orphan' allows a note to be removed from the database aswell as the notebook
    """
    __tablename__ = 'notebooks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(88), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    notes = db.relationship('Note', backref='notebook', lazy=True, cascade='all, delete-orphan')
    tasks = db.relationship('Task', backref='notebook', lazy=True, cascade='all, delete-orphan')


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
