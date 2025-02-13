from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import Notes, Notebook, db
from datetime import datetime

note_routes = Blueprint('notes', __name__)

# Get all notes for user
@note_routes.route('/current')
@login_required
def get_notes():
    notebook_ids = [id[0] for id in Notebook.query.with_entities(Notebook.id).filter(Notebook.user_id == current_user.id).all()]
    notes = Notes.query.filter(Notes.notebook_id.in_(notebook_ids)).all()

    return jsonify({
        "Notes": [note.to_dict() for note in notes]
    }), 200

# Get note by ID
@note_routes.route('/<int:note_Id>')
@login_required
def get_note_by_id(note_Id):
    note = Notes.query.filter(Notes.id == note_Id).first()

    return jsonify({
        "Note": note.to_dict()
    }), 200

# Get all notes for a notebook id
@note_routes.route('/notebook/<int:notebook_Id>')
@login_required
def get_notebook_notes(notebook_Id):
    notes = Notes.query.filter(Notes.notebook_id == notebook_Id).all()

    if notes is None:
        return jsonify({"message": "Notebook couldn't be found"}), 404
    
    return jsonify({
        "Notes": [note.to_dict() for note in notes]
    }), 200
    

# Create a note
@note_routes.route('/', methods=['POST'])
@login_required
def creat_note():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    notebook_id = data.get('notebook_id')

    if not title:
        return jsonify({"message": "Title is required"}), 400
    
    if not content:
        return jsonify({"message": "Content is required"}), 400
    
    if not notebook_id:
        return jsonify({"message": "Nokebook id is required"}), 400
    
    note = Notes(
        title=title,
        content=content,
        notebook_id=notebook_id
    )

    db.session.add(note)
    db.session.commit()
    return jsonify(note.to_dict()), 201

# Edit a note
@note_routes.route('/<int:note_Id>', methods=['PUT'])
@login_required
def edit_note(note_Id):
    note = Notes.query.get(note_Id)

    if not note:
        return jsonify({"message": "Note couldn't be found"}), 404
    
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    notebook_id = data.get('notebook_id')

    if not title:
        return jsonify({"message": "Title is required"}), 400
    
    if not content:
        return jsonify({"message": "Content is required"}), 400
    
    note.title = title
    note.content = content
    note.notebook_id = notebook_id
    
    db.session.commit()
    return jsonify(note.to_dict()), 200

# Delete a note
@note_routes.route('/<int:note_Id>', methods=['DELETE'])
@login_required
def delete_notebook(note_Id):
    note = Notes.query.get(note_Id)

    if note is None:
        return jsonify({"message": "Note couldn't be found"}), 404
    
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Successfully deleted"}), 200