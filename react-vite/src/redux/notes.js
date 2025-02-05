const LOAD_CURRENT = 'notes/LOAD_CURRENT';
const LOAD_BY_ID = 'notes/LOAD_BY_ID'
const CREATE_NOTE = 'spots/CREATE_NOTENOTE';
const UPDATE_NOTE = 'spots/UPDATE_NOTE';
const DELETE_NOTE = 'spots/DELETE_NOTE';

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


export const getCurrentUserNotes = () => async dispatch => {
    const response = await fetch(`/api/notes/current`);

    if (response.ok) {
        const notes = await response.json();
        dispatch(loadCurrent(notes));
        return notes
    }
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
                }
            });
            return newState;
        }
        default:
            return state;
    }
}

export default notesReducer;