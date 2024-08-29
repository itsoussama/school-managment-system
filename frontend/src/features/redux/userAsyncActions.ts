import { axiosInstance } from "@services/axiosConfig";
import { axiosAuthInstance as axiosApi } from "@services/axiosConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface Data {
    email: string,
    password: string
}

const login = createAsyncThunk<void, Data>('user/login', async (data, {rejectWithValue}) => {
    try {

        const localStorage = window.localStorage
        let payload = null

        const response = await axiosInstance.post("/api/login", data)

        // jsenger@example.com
        //  password

        if (response.status === 200) {
            
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("refreshToken", response.data.refresh_token);
            localStorage.setItem('user', JSON.stringify(response.data.user))

            payload = response.data

            return payload
        }
    } catch (error) {
        
        return rejectWithValue(error?.response.payload)
    }
})

const logout = createAsyncThunk( 'user/logout', async (_,{rejectWithValue}) => {
    try {
        const localStorage = window.localStorage

        const response = await axiosApi.post('/api/logout')
        
        if (response.status !== 200) {
            throw Error("Bad Request")
        }

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

    } catch (error) {
        return rejectWithValue(error)
    }
})

// function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
// }

export {login, logout}