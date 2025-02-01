from app.models import db, Task, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_tasks():
    demo_task = Task(
        title = 'Demo Task 2', description = 'Finish rough draft for essay',  due_date=datetime.strptime("12/01/2025", "%m/%d/%Y").date(), completed = False, notebook_id = 1
    )
    demo_task2 = Task(
        title = 'Demo Task 3', description = 'Finish cover art for essay',  due_date=datetime.strptime("12/01/2025", "%m/%d/%Y").date(), completed = False, notebook_id = 1
    )
    demo_task3 = Task(
        title = 'Demo Task 4', description = 'Finish letter of thanks for essay',  due_date=datetime.strptime("12/01/2025", "%m/%d/%Y").date(), completed = False, notebook_id = 1
    )

    db.session.add(demo_task)
    db.session.add(demo_task2)
    db.session.add(demo_task3)
    db.session.commit()

def undo_tasks():
        if environment == 'production':
            db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
        else:
            db.session.execute(text("DELETE FROM tasks"))

        db.session.commit()
