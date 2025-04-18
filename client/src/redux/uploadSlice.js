import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentVideo: {},
    currentImage: {},
    loading: false,
    error: false,
}

export const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        fetchFileUploadStart: (state) => {
            state.loading = true
        },
        fetchFileUploadSuccess: (state, action) => {
            console.log(action.payload)
            state.loading = false;
            state.error = false;
            if (action.payload.type === 'video') state.currentVideo = action.payload.path;
            if (action.payload.type === 'image') state.currentImage = action.payload.path;
        },
        fetchFileUploadFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        clearUpload: (state) => {
            state.currentVideo = {};
            state.currentImage = {};
            state.loading = false;
            state.error = false;
        }
    }
});

export const { fetchFileUploadStart, fetchFileUploadSuccess, fetchFileUploadFailure, clearUpload } = uploadSlice.actions;
export default uploadSlice.reducer;