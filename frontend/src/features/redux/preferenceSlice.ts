import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    language: localStorage.getItem("language") ?? Intl.DateTimeFormat().resolvedOptions().locale.slice(0, 2),
    themeMode: localStorage.getItem("color-preferd") ?? "auto",
}

const preferenceSlice = createSlice({
    name: 'preference',
    initialState: initialState,
    reducers: {
        toggleThemeMode: (state, {payload}) => {
            state.themeMode = payload
        },
        toggleLanguage: (state, {payload}) => {
            state.language = payload
        }
    }

})

export const {toggleThemeMode, toggleLanguage} = preferenceSlice.actions

export default preferenceSlice.reducer