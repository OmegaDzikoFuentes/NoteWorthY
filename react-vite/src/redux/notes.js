import { csrfFetch } from "./csrf";

const LOAD_CURRENT = 'notes/LOAD_CURRENT';
const LOAD_BY_ID = 'notes/LOAD_BY_ID'
const CREATE_NOTE = 'notes/CREATE_NOTENOTE';
const UPDATE_NOTE = 'notes/UPDATE_NOTE';
const DELETE_NOTE = 'notes/DELETE_NOTE';
const SET_NOTE_TAGS = 'notes/SET_NOTE_TAGS';


const loadCurrent = notes => ({
    type: LOAD_CURRENT,
    notes
})

const loadById = note => ({
    type: LOAD_BY_ID,
    note
})

const createNote = (note) => ({
    type: CREATE_NOTE,
    payload: note
})

const updateNote = (note) => ({
    type: UPDATE_NOTE,
    payload: note
})

const deleteNote = (noteId) => ({
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

export const createNewNote = (noteData) => async dispatch => {
    const formattedData = {
        title: noteData.title,
        content: noteData.content,
        notebook_id: noteData.notebook_id
    };

    const response = await csrfFetch(`/api/notes`, {
        method: 'POST',
        body: JSON.stringify(formattedData)
    });

    if (response.ok) {
        const note = await response.json();
        dispatch(createNote(note));
        return note;
    };

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
        case CREATE_NOTE: {
            const newState = { ...state };
            newState.Notes = { ...state.Notes };
            newState.Notes[action.payload.id] = action.payload;
            return newState
        }
        default:
            return state;
    }
}

export default notesReducer;