import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    language: Intl.DateTimeFormat().resolvedOptions().locale.slice(0, 2),
    themeMode: "auto",
    brand: "blue"
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
        },
        changeBrandColor: (state, {payload}) => {
            state.brand = payload
        }
    }

})

export const {toggleThemeMode, toggleLanguage, changeBrandColor} = preferenceSlice.actions

export default preferenceSlice.reducer