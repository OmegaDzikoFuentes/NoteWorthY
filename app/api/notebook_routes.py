from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime
from app.models import db, Notebook

notebook_routes = Blueprint('notebooks', __name__)

# Helper function to check ownership
def is_owner(notebook):
    return notebook and notebook.user_id == current_user.id


# GET ALL NOTEBOOKS
@notebook_routes.route('/', methods=['GET'])
@login_required
def get_notebooks():
    """ Get all notebooks owned by the current user """
    notebooks = Notebook.query.filter_by(user_id=current_user.id).all()
    return jsonify({"notebooks": [n.to_dict() for n in notebooks]}), 200


# GET A SINGLE NOTEBOOK
@notebook_routes.route('/<int:notebook_id>', methods=['GET'])
@login_required
def get_notebook(notebook_id):
    """ Get a specific notebook by ID """
    notebook = Notebook.query.get(notebook_id)
    if not notebook or not is_owner(notebook):
        return jsonify({"message": "Notebook not found or forbidden"}), 404
    return jsonify(notebook.to_dict()), 200


# CREATE A NOTEBOOK
@notebook_routes.route('/', methods=['POST'])
@login_required
def create_notebook():
    """ Create a new notebook """
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({"message": "Name is required"}), 400

    notebook = Notebook(
        name=name,
        user_id=current_user.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.session.add(notebook)
    db.session.commit()
    return jsonify(notebook.to_dict()), 201


# UPDATE A NOTEBOOK
@notebook_routes.route('/<int:notebook_id>', methods=['PUT'])
@login_required
def update_notebook(notebook_id):
    """ Update an existing notebook """
    notebook = Notebook.query.get(notebook_id)
    if not notebook or not is_owner(notebook):
        return jsonify({"message": "Notebook not found or forbidden"}), 404

    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({"message": "Name is required"}), 400

    notebook.name = name
    notebook.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(notebook.to_dict()), 200


# DELETE A NOTEBOOK
@notebook_routes.route('/<int:notebook_id>', methods=['DELETE'])
@login_required
def delete_notebook(notebook_id):
    """ Delete a notebook """
    notebook = Notebook.query.get(notebook_id)
    if not notebook or not is_owner(notebook):
        return jsonify({"message": "Notebook not found or forbidden"}), 404

    db.session.delete(notebook)
    db.session.commit()
    return jsonify({"message": "Notebook deleted"}), 200
