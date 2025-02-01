from app.models import db, Tag, environment, SCHEMA
from sqlalchemy.sql import text

# Seed tags
def seed_tags():
    tag1 = Tag(name="Work")
    tag2 = Tag(name="Personal")
    tag3 = Tag(name="Important")

    db.session.add(tag1)
    db.session.add(tag2)
    db.session.add(tag3)
    db.session.commit()

# Undo tags
def undo_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tags"))

    db.session.commit()
