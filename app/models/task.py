from .db import db, environment, SCHEMA, add_prefix_for_prod
from .notebook import Notebook


class Task(db.Model):
    __tablename__ = 'tasks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text(255))
    due_date = db.Column(db.Date)
    completed = db.Column(db.Boolean)
    notebook_id = db.Column(db.Integer, db.ForeignKey(Notebook.id), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'notebook_id': self.notebook_id,
            'due_date': self.due_date,
            'completed': self.completed
        }
