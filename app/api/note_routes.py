from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import Notes, Notebook, db
from datetime import datetime

note_routes = Blueprint('notes', __name__)

# Get all notes for user
@note_routes.route('/current')
@login_required
def get_notes():
    notes = [id[0] for id in Notebook.query.with_entities(Notebook.id).filter(Notebook.user_id == current_user.id).all()]

    return jsonify({
        "Notes": [note.to_dict() for note in notes]
    }), 200

# Get all notes for a notebook id
@note_routes.route('/:notebookId')
@login_required
def edit_note(notebookId):
    notes = Notes.query.filter_by(notebook_id=notebookId).all()

    if not notes:
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
@note_routes.route('/:noteId', methods=['PUT'])
@login_required
def edit_note(noteId):
    note = Notes.query.get(noteId)

    if not note:
        return jsonify({"message": "Note couldn't be found"}), 404
    
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title:
        return jsonify({"message": "Title is required"}), 400
    
    if not content:
        return jsonify({"message": "Content is required"}), 400
    
    note.title = title
    note.content = content
    db.session.commit()
    return jsonify(note.to_dict()), 200

# Delete a note
@note_routes.route('/:noteId', methods=['DELETE'])
@login_required
def delete_notebook(noteId):
    note = Notes.query.get(noteId)

    if not note:
        return jsonify({"message": "Note couldn't be found"}), 404
    
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Successfully deleted"}), 200