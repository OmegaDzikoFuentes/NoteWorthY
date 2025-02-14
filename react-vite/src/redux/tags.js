import { csrfFetch } from "./csrf"; 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "/api/tags";


export const fetchTags = createAsyncThunk("tags/fetchTags", async (_, thunkAPI) => {
    try {
        const response = await csrfFetch(`${API_URL}/`);
        if (!response.ok) throw response; 
        const data = await response.json();
        return Array.isArray(data) ? data : data.Tags || []; 
    } catch (error) {
        return thunkAPI.rejectWithValue(await error.json()); 
    }
});

export const fetchTagsForNote = createAsyncThunk("tags/fetchTagsForNote", async (noteId, thunkAPI) => {
    try {
        const response = await csrfFetch(`${API_URL}/${noteId}/tags`);
        if (!response.ok) throw response;
        return { noteId, tags: await response.json() };
    } catch (error) {
        return thunkAPI.rejectWithValue(await error.json());
    }
});

export const fetchNotesByTag = createAsyncThunk("tags/fetchNotesByTag", async (tagName, thunkAPI) => {
    try {
        const response = await csrfFetch(`${API_URL}/${tagName}/notes`);
        if (!response.ok) throw response;
        return { tagName, notes: await response.json() };
    } catch (error) {
        return thunkAPI.rejectWithValue(await error.json());
    }
});

export const addTagToNote = createAsyncThunk("tags/addTagToNote", async ({ noteId, tagName }, thunkAPI) => {
    try {
        const response = await csrfFetch(`${API_URL}/${noteId}/tags`, {
            method: "POST",
            body: JSON.stringify({ name: tagName }),
        });

        if (!response.ok) throw response;
        return { noteId, tag: await response.json() };
    } catch (error) {
        return thunkAPI.rejectWithValue(await error.json());
    }
});

export const removeTagFromNote = createAsyncThunk("tags/removeTagFromNote", async ({ noteId, tagName }, thunkAPI) => {
    try {
        const response = await csrfFetch(`${API_URL}/${noteId}/tags`, {
            method: "DELETE",
            body: JSON.stringify({ name: tagName }),
        });

        if (!response.ok) throw response;
        return { noteId, tagName };
    } catch (error) {
        return thunkAPI.rejectWithValue(await error.json());
    }
});

const tagsSlice = createSlice({
    name: "tags",
    initialState: {
        tags: [],  
        noteTags: {},  
        notesByTag: {}, 
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags = action.payload;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(fetchTagsForNote.fulfilled, (state, action) => {
                state.noteTags[action.payload.noteId] = action.payload.tags;
            })
            .addCase(fetchTagsForNote.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(fetchNotesByTag.fulfilled, (state, action) => {
                state.notesByTag[action.payload.tagName] = action.payload.notes;
            })
            .addCase(fetchNotesByTag.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(addTagToNote.fulfilled, (state, action) => {
                if (!state.noteTags[action.payload.noteId]) {
                    state.noteTags[action.payload.noteId] = [];
                }
                state.noteTags[action.payload.noteId].push(action.payload.tag);
            })
            .addCase(addTagToNote.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(removeTagFromNote.fulfilled, (state, action) => {
                if (state.noteTags[action.payload.noteId]) {
                    state.noteTags[action.payload.noteId] = state.noteTags[action.payload.noteId].filter(
                        (tag) => tag.name !== action.payload.tagName
                    );
                }
            })
            .addCase(removeTagFromNote.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default tagsSlice.reducer;
