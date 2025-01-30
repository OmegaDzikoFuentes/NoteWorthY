from app.models import db, environment, SCHEMA
from app.models.notes import Notes
from sqlalchemy.sql import text


# Adds a demo note to notebook 1
def seed_notes():
    demo_note_1 = Notes(title='Example Note', content='This is an example', notebook_id=1)
    demo_note_2 = Notes(
        title='Anatomy of the arm', content='The arm from the shoulder to the wrist consists of 3 bones: the humerus, the ulna, and the radius.', notebook_id='marnie')
    demo_note_3 = Notes(
        title='Signs and symptoms of Parkinson\'s', content='Some signs and symptoms include: essential tremors, memory loss, halucinations, difficulty moving, and shuffling feet.', notebook_id='bobbie')

    db.session.add(demo_note_1)
    db.session.add(demo_note_2)
    db.session.add(demo_note_3)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_notes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notes"))
        
    db.session.commit()