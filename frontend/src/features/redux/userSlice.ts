import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "@redux/userAsyncActions";


const initialState = {
    user: {
        id: 0,
        name: "",
        email: "",
        school_id:"",
        phone:"",
        imagePath: ""
    },
    token: "",
    loading: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        updateUser: (state, {payload}) => {
            state.user = payload.user
        },
       refreshToken: (state, {payload}) => {
            state.token = payload?.token
       }
    },
    extraReducers: (builder) => {
        // login reducers
        builder
        .addCase(login.pending, (state) => {
            state.loading = true
        })
        .addCase(login.fulfilled, (state, {payload}) => {
            state.user = payload?.user,
            state.token = payload?.token,
            state.loading = false
        })
        .addCase(login.rejected, (state) => {
            state.loading = false
        })

        // logout reducers
        .addCase(logout.pending, (state) => {
            state.loading = true
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = {}
            state.loading = false
        })
        .addCase(logout.rejected, (state) => {
            state.loading = false
        })
    }
})

export const {refreshToken, updateUser} = userSlice.actions

export default userSlice.reducer