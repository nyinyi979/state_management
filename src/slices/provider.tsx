'use client' 
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { store } from './store'
const persistor = persistStore(store);
export default function ReduxProvider(){
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}></PersistGate>
        </Provider>
        )
}