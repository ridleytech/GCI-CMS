import { createStore, combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
};

const inititalState = {
  name: null,
  email: "randall.ridley@gmail.com",
  clientName: "RandallRidley",
};

export const gcCMS = (state = inititalState, action) => {
  switch (action.type) {
    case "UPDATE_CLIENT_NAME":
      return {
        ...state,
        clientName: action.payload.clientName,
      };
    default:
      return state;
  }
};

const reducers = {
  gcCMS,
};

const rootReducer = combineReducers(reducers);
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStore = () => createStore(persistedReducer);
