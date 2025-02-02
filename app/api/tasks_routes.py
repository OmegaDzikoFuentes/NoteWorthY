from flask import Blueprint, jsonify, request
from app.models import Task, Notebook
from flask_login import current_user, login_required
from app.models.db import db
from datetime import datetime

tasks_routes = Blueprint('tasks', __name__)


# get all tasks belonging to the current user
@tasks_routes.route('/current', methods=['GET'])
@login_required
def current_tasks():
    notebook_ids = [id[0] for id in Notebook.query.with_entities(Notebook.id).filter(Notebook.user_id == current_user.id).all()]

    tasks = Task.query.filter(Task.notebook_id.in_(notebook_ids)).all()

    return jsonify([task.to_dict() for task in tasks])

# create a new task
@tasks_routes.route('/new', methods=['POST'])
@login_required
def new_task():
    data = request.json

    if not data or 'title' not in data or data['title'] is None or data['title'] == '':
        return jsonify({"message": "Title is required"}), 400

    task = Task(
        title=data['title'],
        description=data['description'],
        due_date=datetime.strptime(data['due_date'], "%m/%d/%Y").date(),
        completed=data['completed'],
        notebook_id=data['notebook_id']
    )

    if task is None:
        return jsonify({"message": "Invalid task"}), 404

    db.session.add(task)
    db.session.commit()

    return task.to_dict()

# Delete a task
@tasks_routes.route('/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    task = Task.query.get(task_id)

    if task is None:
        return jsonify({"message": "Task not found"}), 404

    notebook = Notebook.query.get(task.notebook_id)

    if notebook.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 401

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task has been deleted successfully"})
