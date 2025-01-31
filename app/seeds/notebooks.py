from app.models import db, Notebook, environment, SCHEMA
from sqlalchemy.sql import text

# Adds demo notebooks
def seed_notebooks():
    # Assuming the demo user has an id of 1
    notebook1 = Notebook(
        name="Big Ideas", user_id=1
    )
    notebook2 = Notebook(
        name="Secret Money Makers", user_id=1
    )
    notebook3 = Notebook(
        name="Top 50 Stand-up Jokes", user_id=2
    )
    notebook4 = Notebook(
        name="Thoughts and Feelings", user_id=3
    )

    db.session.add(notebook1)
    db.session.add(notebook2)
    db.session.add(notebook3)
    db.session.add(notebook4)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the notebooks table.
def undo_notebooks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notebooks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notebooks"))

    db.session.commit()
