from .db import db, environment, SCHEMA, add_prefix_for_prod
from .notebook import Notebook

class Notes(db.Model):
    __tablename__ = 'notes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(40), nullable=False)
    content = db.Column(db.String(255), nullable=False)
    notebook_id = db.Column(db.Integer, db.ForeignKey(Notebook.id), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'notebook_id': self.notebook_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }