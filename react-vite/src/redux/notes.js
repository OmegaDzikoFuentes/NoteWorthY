import { csrfFetch } from "./csrf";

const LOAD_CURRENT = 'notes/LOAD_CURRENT';
const LOAD_BY_ID = 'notes/LOAD_BY_ID'
const CREATE_NOTE = 'notes/CREATE_NOTENOTE';
const UPDATE_NOTE = 'notes/UPDATE_NOTE';
const DELETE_NOTE = 'notes/DELETE_NOTE';
const SET_NOTE_TAGS = 'notes/SET_NOTE_TAGS';
const LOAD_BY_NB_ID = 'notes/LOAD_BY_NB_ID';


const loadCurrent = notes => ({
    type: LOAD_CURRENT,
    notes
})

const loadById = note => ({
    type: LOAD_BY_ID,
    note
})

const loadByNotebookId = (notes) => ({
    type: LOAD_BY_NB_ID,
    notes
})

const createNote = (note) => ({
    type: CREATE_NOTE,
    payload: note
})

const update_Note = (note) => ({
    type: UPDATE_NOTE,
    payload: note
})

const delete_Note = (noteId) => ({
    type: DELETE_NOTE,
    noteId
})

const getTagsForNote = (noteId) => ({
    type: SET_NOTE_TAGS,
    noteId
})


export const getCurrentUserNotes = () => async dispatch => {
    const response = await csrfFetch(`/api/notes/current`);

    if (response.ok) {
        const notes = await response.json();
        dispatch(loadCurrent(notes));
        return notes
    }
}

export const getNoteTags = (noteId) => async dispatch => {
    const response = await csrfFetch(`/api/tags/${noteId}/tags`);

    if (response.ok) {
        const tags = await response.json();
        // Create a new action type to handle adding tags to a note
        dispatch(getTagsForNote(noteId), tags);
        return tags;
    }
}

export const getNoteById = (noteId) => async dispatch => {
    const response = await csrfFetch(`/api/notes/${noteId}`);

    if (response.ok) {
        const note = await response.json();
        dispatch(loadById(note));
        return note
    }
}

export const getNotesForNotebook = (notebookId) => async dispatch => {
    const response = await csrfFetch(`/api/notes/notebook/${notebookId}`);

    if (response.ok) {
        const data = await response.json();
        const normalizedNotes = {};
        data.Notes.forEach(note => {
            normalizedNotes[note.id] = note;
        });
        dispatch(loadByNotebookId(normalizedNotes));
        return normalizedNotes;
    }
}

export const createNewNote = (noteData) => async dispatch => {
    const formattedData = {
        title: noteData.title,
        content: noteData.content,
        notebook_id: noteData.notebook_id
    };

    const response = await csrfFetch(`/api/notes/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
    });

    if (response.ok) {
        const note = await response.json();
        dispatch(createNote(note));
        return note;
    }

}

export const updateNote = (noteId, note) => async dispatch => {
    // const currentNoteData = await csrfFetch(`/api/notes/${noteId}`);
    // const currentNote = await currentNoteData.json();

    const response = await csrfFetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: note.title,
            content: note.content,
            notebook_id: note.notebook_id
        })
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(update_Note(data));
        return data;
    }
}

export const deleteNote = (noteId) => async dispatch => {
    const response = await csrfFetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
    });
    dispatch(delete_Note(noteId));
    return response;
}

const initialState = {
    Notes: {}
}

const notesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CURRENT: {
            const newState = { ...state };
            newState.Notes = {};
            const notesArray = action.notes.Notes;
            notesArray.forEach(note => {
                newState.Notes[note.id] = {
                    ...note,
                    tags: []
                }
            });
            return newState;
        }
        case SET_NOTE_TAGS: {
            const newState = { ...state };
            newState.Notes[action.noteId] = {
                ...newState.Notes[action.noteId],
                tags: action.tags
            };
            return newState;
        }
        case LOAD_BY_ID: {
            const newState = { ...state };
            newState.Notes = { ...action.note };
            return newState;
        }
        case LOAD_BY_NB_ID: {
            const newState = { ...state };
            newState.Notes = { ...action.notes };
            return newState;
        }
        case CREATE_NOTE: {
            const newState = { ...state };
            newState.Notes[action.payload.id] = action.payload;
            return newState
        }
        case UPDATE_NOTE: {
            const newState = { ...state };
            newState.Notes[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_NOTE: {
            const newState = { ...state };
            delete newState.Notes[action.noteId]
            return newState;
        }
        default:
            return state;
    }
}

export default notesReducer;