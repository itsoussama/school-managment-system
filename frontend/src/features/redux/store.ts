import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "@redux/userSlice";
import animationSlice from "@redux/animationSlice";
import preferenceSlice from "@redux/preferenceSlice";

const rootReducer = combineReducers({
  userSlice,
  animationSlice,
  preferenceSlice
})
export const store = configureStore({
    reducer: rootReducer,
  });

  // console.log(store.getState())

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch