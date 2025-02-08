import { csrfFetch } from "./csrf";

const LOAD = 'notebooks/LOAD';
const LOAD_BY_ID = 'notebooks/LOAD_BY_ID';
const CREATE_NOTEBOOK = 'notebooks/CREATE_NOTEBOOK';
const UPDATE_NOTEBOOK = 'notebooks/UPDATE_NOTEBOOK';
const REMOVE_NOTEBOOK = 'notebooks/REMOVE_NOTEBOOK';

// Action creators

const load = notebooks => ({
    type: LOAD,
    notebooks
});

const loadById = notebook => ({
    type: LOAD_BY_ID,
    notebook
});

const addNewNotebook = (notebook) => ({
    type: CREATE_NOTEBOOK,
    payload: notebook
});

const update = (notebook) => ({
    type: UPDATE_NOTEBOOK,
    payload: notebook
});

const removeNotebook = (notebookId) => ({
    type: REMOVE_NOTEBOOK,
    notebookId
});

// Thunk action creators

// Get all notebooks
export const getNotebooks = () => async dispatch => {
    const response = await csrfFetch(`/api/notebooks`);

    if (response.ok) {
        const notebooks = await response.json();
        dispatch(load(notebooks));
        return notebooks;
    }
};

// Get a notebook by ID
export const getNotebookById = (id) => async dispatch => {
    const notebookId = parseInt(id, 10);

    if (isNaN(notebookId)) return;

    const response = await csrfFetch(`/api/notebooks/${notebookId}`);

    if (response.ok) {
        const notebook = await response.json();
        dispatch(loadById(notebook));
        return notebook;
    }
};

// Create a new notebook
export const createNotebook = (notebookData) => async dispatch => {
    const formattedData = {
        name: notebookData.name,
        user_id: notebookData.user_id, // assuming you pass user_id with the notebook data
    };

    const response = await csrfFetch('/api/notebooks', {
        method: 'POST',
        body: JSON.stringify(formattedData),
    });

    if (response.ok) {
        const notebook = await response.json();
        dispatch(addNewNotebook(notebook));
        return notebook;
    }
};

// Update a notebook
export const updateNotebook = (notebookId, notebook) => async dispatch => {
    const response = await csrfFetch(`/api/notebooks/${notebookId}`, {
        method: 'PUT',
        body: JSON.stringify({
            name: notebook.name,
        }),
    });

    const data = await response.json();
    dispatch(update(data));
    return response;
};

// Delete a notebook
export const deleteNotebook = (notebookId) => async dispatch => {
    const response = await csrfFetch(`/api/notebooks/${notebookId}`, {
        method: 'DELETE',
    });
    dispatch(removeNotebook(notebookId));
    return response;
};

// Reducer

const initialState = {
    allNotebooks: {},
};

const notebooksReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD: {
            const newState = { ...state };
            newState.allNotebooks = {};
            // If action.notebooks is an object with key "notebooks"
            const notebooksArray = Array.isArray(action.notebooks)
                ? action.notebooks
                : action.notebooks.notebooks;
            notebooksArray.forEach(notebook => {
                newState.allNotebooks[notebook.id] = notebook;
            });
            return newState;
        }


        case CREATE_NOTEBOOK: {
            const newState = { ...state };
            newState.allNotebooks[action.payload.id] = action.payload;
            return newState;
        }

        case LOAD_BY_ID: {
            const newState = { ...state };
            newState.allNotebooks[action.notebook.id] = action.notebook;
            return newState;
        }

        case UPDATE_NOTEBOOK: {
            const newState = { ...state };
            newState.allNotebooks[action.payload.id] = action.payload;
            return newState;
        }

        case REMOVE_NOTEBOOK: {
            const newState = { ...state };
            delete newState.allNotebooks[action.notebookId]; // Remove notebook by ID
            return newState;
        }

        default:
            return state;
    }
};

export default notebooksReducer;
