import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    animation: false
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