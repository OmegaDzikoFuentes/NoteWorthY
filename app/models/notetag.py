from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func
from .notes import Notes
from .tags import Tag

class NoteTag(db.Model):
    __tablename__ = "notetags"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('notes.id')), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('tags.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())