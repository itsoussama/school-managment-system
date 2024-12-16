import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "@redux/userSlice";
import animationSlice from "@redux/animationSlice";
import preferenceSlice from "@redux/preferenceSlice";
import { 
  persistReducer, 
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
 } from 'redux-persist'
import storage from "redux-persist/es/storage";

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['user']
}

const rootReducer = combineReducers({
  userSlice,
  animationSlice,
  preferenceSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

// Export the persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

