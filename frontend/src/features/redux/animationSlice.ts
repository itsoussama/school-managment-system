import { createSlice } from "@reduxjs/toolkit"

console.log(JSON.parse(localStorage.getItem("animation") as string));


const initialState = {
    animation: JSON.parse(localStorage.getItem("animation") as string) ?? false
}

const animationSlice = createSlice({
    name: 'animation',
    initialState: initialState,
    reducers: {
        toggleAnimation: (state, {payload}) => {
            state.animation = payload
        }
    }

})

export const {toggleAnimation} = animationSlice.actions

export default animationSlice.reducer