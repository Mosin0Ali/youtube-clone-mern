import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from '../redux/userSlice.js';
import videoReducer from '../redux/videoSlice.js';
import uploadReducer from '../redux/uploadSlice.js';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import { PersistGate } from "redux-persist/integration/react";
import { version } from "react";


const persistConfig = {
    key: 'root',
    version: 1,
    storage
}
const rootReducer = combineReducers({ user: userReducer, video: videoReducer,upload:uploadReducer })
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }
    })
});

export const persistor = persistStore(store);

