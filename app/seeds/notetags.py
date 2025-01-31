from app.models import db, NoteTag, environment, SCHEMA
from sqlalchemy.sql import text

def seed_notetags():
    notetag1 = NoteTag(note_id=1, tag_id=1)
    notetag2 = NoteTag(note_id=1, tag_id=2)
    notetag3 = NoteTag(note_id=2, tag_id=1)
    notetag4 = NoteTag(note_id=3, tag_id=3)

    db.session.add(notetag1)
    db.session.add(notetag2)
    db.session.add(notetag3)
    db.session.add(notetag4)
    db.session.commit()

def undo_notetags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notetags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notetags"))

    db.session.commit()
