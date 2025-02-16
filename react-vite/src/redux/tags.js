import { csrfFetch } from "./csrf";
import { createAsyncThunk } from "@reduxjs/toolkit";

/** 🔹 Action Types */
const LOAD_CURRENT = "tags/LOAD_CURRENT";  // Fetch Current User Tags
const LOAD_FOR_NOTE = "tags/LOAD_FOR_NOTE";
const LOAD_NOTES_BY_TAG = "tags/LOAD_NOTES_BY_TAG";  
const ADD_TAG = "tags/ADD_TAG";  // Add Tag to Note
const REMOVE_TAG = "tags/REMOVE_TAG";  // Remove Tag from Note
const RESET_TAGS = "tags/RESET_TAGS";  // Clear Tags on Logout

/** 🔹 Action Creators */
const loadCurrentTags = (tags) => ({
    type: LOAD_CURRENT,
    tags
});

const loadTagsForNote = (noteId, tags) => ({
    type: LOAD_FOR_NOTE,
    noteId,
    tags
});

const loadNotesByTag = (tagName, notes) => ({
    type: LOAD_NOTES_BY_TAG,
    tagName,
    notes
});

export const resetTags = () => ({
    type: RESET_TAGS
});

// Fetch all tags for the current user
export const fetchCurrentUserTags = () => async (dispatch) => {
    const response = await csrfFetch("/api/tags/");

    if (response.ok) {
        const tags = await response.json();
        dispatch(loadCurrentTags(tags));
        return tags;
    }
};


export const fetchTagsForNote = (noteId) => async (dispatch) => {
    const response = await csrfFetch(`/api/tags/${noteId}/tags`);

    if (response.ok) {
        const tags = await response.json();
        dispatch(loadTagsForNote(noteId, tags));
        return tags;
    }
};

export const fetchNotesByTag = (tagName) => async (dispatch) => {
    const response = await csrfFetch(`/api/tags/${tagName}/notes`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadNotesByTag(tagName, data.notes));
        return data.notes;
    }
};

export const addTagToNote = createAsyncThunk(
    "tags/addTagToNote",
    async ({ noteId, tagName }, thunkAPI) => {
        if (!noteId || typeof noteId !== "number") {
            return thunkAPI.rejectWithValue("Invalid noteId");
        }

        try {
            const response = await csrfFetch(`/api/tags/${noteId}/tags`, {
                method: "POST",
                body: JSON.stringify({ name: tagName }),
            });

            if (!response.ok) throw response;
            return { noteId, tag: await response.json() };
        } catch (error) {
            return thunkAPI.rejectWithValue(await error.json());
        }
    }
);
// Remove a tag from a note
export const removeTagFromNote = createAsyncThunk(
    "tags/removeTagFromNote",
    async ({ noteId, tagName }, thunkAPI) => {
        if (!noteId || typeof noteId !== "number") {
            return thunkAPI.rejectWithValue("Invalid noteId");
        }
        if (!tagName || typeof tagName !== "string") {
            return thunkAPI.rejectWithValue("Invalid tagName");
        }

        try {
            const response = await csrfFetch(`/api/tags/${noteId}/tags`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: tagName }),
            });

            if (!response.ok) throw response;
            return { noteId, tagName };
        } catch (error) {
            return thunkAPI.rejectWithValue(await error.json());
        }
    }
);

/** 🔹 Initial State */
const initialState = {
    tags: {},  // Stores all user’s tags
    noteTags: {},  // Stores tags for each note
    notesByTag: {} 
};

/** 🔹 Reducer */
const tagsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CURRENT: {
            const newState = { ...state, tags: {} };
            action.tags.forEach(tag => {
                newState.tags[tag.id] = tag;
            });
            return newState;
        }

        case LOAD_FOR_NOTE: {
            const newState = { ...state };
            newState.noteTags[action.noteId] = action.tags;
            return newState;
        }

        case LOAD_NOTES_BY_TAG: {
            return {
                ...state,
                notesByTag: { ...state.notesByTag, [action.tagName]: action.notes }
            };
        }

        case ADD_TAG: {
            const newState = { ...state };
        
            if (!newState.noteTags[action.noteId]) {
                newState.noteTags[action.noteId] = [];
            }
        
            const tagExists = newState.noteTags[action.noteId].some(tag => tag.name === action.tag.name);
            if (!tagExists) {
                newState.noteTags[action.noteId] = [...newState.noteTags[action.noteId], action.tag];
            }
        
            return newState;
        }
        case REMOVE_TAG: {
            const newState = { ...state };
            if (newState.noteTags[action.noteId]) {
                newState.noteTags[action.noteId] = newState.noteTags[action.noteId].filter(
                    (tag) => tag.name !== action.tagName
                );
            }
            return newState;
        }

        case RESET_TAGS:
            return { ...initialState };  // Reset all tags on logout

        default:
            return state;
    }
};

export default tagsReducer;
