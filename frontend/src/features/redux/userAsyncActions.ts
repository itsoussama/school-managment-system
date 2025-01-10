import { axiosInstance } from "@services/axiosConfig";
import { axiosAuthInstance as axiosApi } from "@services/axiosConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface Data {
    email: string,
    password: string
}

interface ErrorResponse extends Error {
    response: {
        payload : string
    }
}

const login = createAsyncThunk<void, Data>('user/login', async (data, {rejectWithValue}) => {
    try {

        // const localStorage = window.localStorage
        let payload = null

        const response = await axiosInstance.post("/api/login", data)

        if (response.status === 200) {
            
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("refreshToken", response.data.refresh_token);

           

            payload = response.data
            console.log(payload);
            

            return payload
        }
    } catch (error) {
        const response = (error as ErrorResponse).response;
        return rejectWithValue(response?.payload)
    }
})

const logout = createAsyncThunk( 'user/logout', async (_,{rejectWithValue}) => {
    try {
        const localStorage = window.localStorage

        const response = await axiosApi.post('/api/logout')
        
        if (response.status !== 200) {
            throw Error("Bad Request")
        }
        
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