import {combineReducers, configureStore} from '@reduxjs/toolkit'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { TypedUseSelectorHook } from 'react-redux/es/types'

import authReducer from './authSlice'
import teamReducer from './teamSlice'
import storage from './storage'
import { persistReducer } from 'redux-persist'


const persistConfig = {
  key: 'root',
  storage
}
const reducer = combineReducers({
    authReducer , teamReducer
})
const persistendReducer = persistReducer(persistConfig , reducer)
export const store = configureStore({
    reducer: persistendReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector