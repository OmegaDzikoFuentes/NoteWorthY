from flask import Blueprint, jsonify
from app.models import Task, Notebook
from flask_login import current_user, login_required

tasks_routes = Blueprint('tasks', __name__)


# get all tasks belonging to the current user
@tasks_routes.route('/current', methods=['GET'])
@login_required
def current_tasks():
    notebook_ids = [id[0] for id in Notebook.query.with_entities(Notebook.id).filter(Notebook.user_id == current_user.id).all()]

    tasks = Task.query.filter(Task.notebook_id.in_(notebook_ids)).all()

    return jsonify([task.to_dict() for task in tasks])

# create a new task
