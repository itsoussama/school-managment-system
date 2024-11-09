import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    themeMode: localStorage.getItem("color-preferd") ?? "light"
}

const themeModeSlice = createSlice({
    name: 'themeMode',
    initialState: initialState,
    reducers: {
        toggleThemeMode: (state, {payload}) => {
            state.themeMode = payload
        }
    }

})

export const {toggleThemeMode} = themeModeSlice.actions

export default themeModeSlice.reducer