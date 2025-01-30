from app.models import db, Note, environment, SCHEMA
from sqlalchemy.sql import text

# Adds demo notes
def seed_notes():
    # Assuming demo notebooks have ids 1, 2, 3, and 4 (from the seed_notebooks function)
    note1 = Note(
        title="First Big Idea",
        content="This is a very important idea that I need to write down.",
        notebook_id=1  # Associating with the first notebook
    )
    note2 = Note(
        title="Money-Making Scheme #1",
        content="An idea to generate a secret income stream. Shh...",
        notebook_id=2  # Associating with the second notebook
    )
    note3 = Note(
        title="Funny Joke #1",
        content="Why don't skeletons fight each other? They don't have the guts.",
        notebook_id=3  # Associating with the third notebook
    )
    note4 = Note(
        title="Emotional Growth",
        content="Reflecting on my journey of emotional growth and self-awareness.",
        notebook_id=4  # Associating with the fourth notebook
    )

    db.session.add(note1)
    db.session.add(note2)
    db.session.add(note3)
    db.session.add(note4)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the notes table.
def undo_notes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notes"))

    db.session.commit()
