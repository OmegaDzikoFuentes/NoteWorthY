from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Tag, NoteTag, Notes
from datetime import datetime
from sqlalchemy.exc import IntegrityError

tag_routes = Blueprint("tags", __name__)

@tag_routes.route('/<string:tag_name>/notes', methods=['GET'])
@login_required
def get_notes_by_tag(tag_name):
    """
    Get all notes associated with a specific tag name.
    """
    tag = Tag.query.filter_by(name=tag_name).first()

    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    # Fetch all notes associated with the tag via the NoteTag join table
    note_tags = NoteTag.query.filter_by(tag_id=tag.id).all()
    note_ids = [note_tag.note_id for note_tag in note_tags]

    notes = Notes.query.filter(Notes.id.in_(note_ids)).all()

    return jsonify({"notes": [note.to_dict() for note in notes]}), 200


@tag_routes.route('/', methods=['GET'])
@login_required
def get_all_tags():
    tags = Tag.query.all()
    return jsonify([tag.to_dict() for tag in tags]), 200

# Get all tags for a specific note
@tag_routes.route('/<int:note_id>/tags', methods=['GET'])
@login_required
def get_tags_for_note(note_id):
    note = Notes.query.get(note_id)

    if not note:
        return jsonify({"error": "Note not found"}), 404

    # Query NoteTag to get tag IDs linked to the note
    note_tags = NoteTag.query.filter_by(note_id=note_id).all()

    if not note_tags:
        return jsonify({"message": "No tags found for this note"}), 404

    # Extract tag IDs and fetch corresponding Tag objects
    tag_ids = [notetag.tag_id for notetag in note_tags]
    tags = Tag.query.filter(Tag.id.in_(tag_ids)).all()

    response = jsonify([tag.to_dict() for tag in tags])
    response.headers['Content-Type'] = 'application/json'
    return response, 200


# Add a tag to a note
@tag_routes.route('/<int:note_id>/tags', methods=['POST'])
@login_required
def add_tag_to_note(note_id):
    data = request.get_json()
    tag_name = data.get("name")

    if not tag_name:
        return jsonify({"error": "Tag name is required"}), 400

    note = Notes.query.get(note_id)

    if not note:
        return jsonify({"error": "Note not found"}), 404

    # Check if tag exists, if not create it
    tag = Tag.query.filter_by(name=tag_name).first()
    if not tag:
        tag = Tag(name=tag_name)
        db.session.add(tag)
        db.session.commit()

    # Check if the tag is already linked to the note
    existing_notetag = NoteTag.query.filter_by(note_id=note_id, tag_id=tag.id).first()
    if existing_notetag:
        return jsonify({"error": "Tag already added to this note"}), 400

    # Link the tag to the note
    new_notetag = NoteTag(note_id=note_id, tag_id=tag.id)
    db.session.add(new_notetag)
    db.session.commit()

    return jsonify({"message": "Tag added successfully", "tag": tag.to_dict()}), 201


# Remove a tag from a note
@tag_routes.route('/<int:note_id>/tags', methods=['DELETE'])
@login_required
def delete_tag_from_note(note_id):
    data = request.get_json()
    tag_name = data.get("name")

    if not tag_name:
        return jsonify({"error": "Tag name is required"}), 400

    note = Notes.query.get(note_id)

    if not note:
        return jsonify({"error": "Note not found"}), 404

    tag = Tag.query.filter_by(name=tag_name).first()

    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    notetag = NoteTag.query.filter_by(note_id=note_id, tag_id=tag.id).first()

    if not notetag:
        return jsonify({"error": "Tag is not attached to this note"}), 400

    db.session.delete(notetag)
    db.session.commit()

    return jsonify({"message": "Tag removed successfully"}), 200
