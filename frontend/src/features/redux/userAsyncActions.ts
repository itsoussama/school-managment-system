import { axiosInstance } from "@services/axiosConfig";
import { axiosAuthInstance as axiosApi } from "@services/axiosConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface Data {
    email: string,
    password: string
}

interface KnownError {
    error: string
}

const login = createAsyncThunk<Data, void, {rejectValue: KnownError}>('user/login', async (data,thunkApi) => {
    try {

        const localStorage = window.localStorage
        let payload = null

      const response = await axiosInstance
        .post("/api/login", data)
        
        
        if (response.status === 200) {
            // let cookies = document.cookie.split(';').every(el => el.search('remember_token'));
            
            // console.log(cookies);

            // if(response.data.remember_token !== null){
            //     const d = new Date();
            //     d.setTime(d.getTime() + (10*356*24*60*60*1000));
            //     let expires = "expires="+ d.toUTCString();
            //     document.cookie = `remember_token=${response.data.remember_token}; path=/; expires=${expires} httponly=true; secure=true,`
            // }
            
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("refreshToken", response.data.refresh_token);
            localStorage.setItem('user', JSON.stringify(response.data.user))

            payload = response.data
            // console.log(payload);
            

            return payload
        }

    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data)
    }
})

const logout = createAsyncThunk( 'user/logout', async (_,{rejectWithValue}) => {
    try {
        const localStorage = window.localStorage

        const response = await axiosApi.post('/api/logout')
        
        if (response.status !== 200) {
            throw Error("Bad Request")
        }

        localStorage.clear()

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