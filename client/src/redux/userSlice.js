import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentUser: null,
    loading: false,
    error: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.error = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.loading = false;
            state.error = true;
        },
        logout: (state) => {
            return initialState;
        },
        subscription: (state, action) => {
            if (state.currentUser.subscribedUsers.includes(action.payload)) {
                const index= state.currentUser.subscribedUsers.findIndex(
                    (channelId) => channelId === action.payload
                )
                console.log(index)
                state.currentUser.subscribedUsers.splice(index, 1);
            }else{
                state.currentUser.subscribedUsers.push(action.payload);
            }
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout ,subscription} = userSlice.actions;
export default userSlice.reducer;