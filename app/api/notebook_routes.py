from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import Notebook, db
from datetime import datetime

notebook_routes = Blueprint('notebooks', __name__)

# Helper function to validate notebook ownership
def is_notebook_owner(notebook):
    return notebook.user_id == current_user.id

# Get All Notebooks
@notebook_routes.route('/', methods=['GET'])
@login_required
def get_notebooks():
    """
    Get all notebooks owned by the current user.
    """
    notebooks = Notebook.query.filter_by(user_id=current_user.id).all()
    return jsonify({
        "Notebooks": [notebook.to_dict() for notebook in notebooks]
    }), 200

# Create a Notebook
@notebook_routes.route('/', methods=['POST'])
@login_required
def create_notebook():
    """
    Create a new notebook.
    """
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({"message": "Name is required"}), 400

    notebook = Notebook(
        name=name,
        user_id=current_user.id
    )
    db.session.add(notebook)
    db.session.commit()
    return jsonify(notebook.to_dict()), 201

# Edit a Notebook
@notebook_routes.route('/<int:notebookId>', methods=['PUT'])
@login_required
def edit_notebook(notebookId):
    """
    Edit an existing notebook.
    """
    notebook = Notebook.query.get(notebookId)

    if not notebook:
        return jsonify({"message": "Notebook couldn't be found"}), 404

    if not is_notebook_owner(notebook):
        return jsonify({"message": "Forbidden"}), 403

    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({"message": "Name is required"}), 400

    notebook.name = name
    notebook.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(notebook.to_dict()), 200

# Delete a Notebook
@notebook_routes.route('/<int:notebookId>', methods=['DELETE'])
@login_required
def delete_notebook(notebookId):
    """
    Delete an existing notebook.
    """
    notebook = Notebook.query.get(notebookId)

    if not notebook:
        return jsonify({"message": "Notebook couldn't be found"}), 404

    if not is_notebook_owner(notebook):
        return jsonify({"message": "Forbidden"}), 403

    db.session.delete(notebook)
    db.session.commit()
    return jsonify({"message": "Successfully deleted"}), 200
