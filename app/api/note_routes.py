from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import Notes, db
from datetime import datetime

note_routes = Blueprint('notes', __name__)

# Get all notes for user
@note_routes.route('/notes')
@login_required
def get_notes():
    notes = Notes.query.filter_by(user_id=current_user.id).all()

    return jsonify({
        "Notes": [note.to_dict() for note in notes]
    }), 200

# Create a note
@note_routes.route('/notes', methods=['POST'])
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
@note_routes.route('/notes/:noteId', methods=['PUT'])
@login_required
def edit_note(noteId):
    note = Notes.query.get(noteId)

    if not note:
        return jsonify({"message": "Note couldn't be found"}), 404
    
    if not is_notebook_owner(notebook):
        return jsonify({"message": "Forbidden"}), 403