import { configureStore } from "@reduxjs/toolkit";
import AllReducer from "./reducers/index";
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import createIdbStorage from "@piotr-cz/redux-persist-idb-storage"; // IndexedDB storage

// 1000 milliseconds to 1 second
// 60 seconds to 1 minute
// 60 minutes to 1 hour
// 1 hour * 4 = 4 hours
// const EXPIRY_INTERVAL = 1000 * 60 * 4;
const EXPIRY_INTERVAL = 1000 * 60 * 60 * 4;

// eslint-disable-next-line
const expireTransform = createTransform(
  (inboundState) => {
    // Save only once when state is persisted
    if (typeof inboundState !== "object" || inboundState === null || Array.isArray(inboundState)) {
      return inboundState; // Don't transform primitives or arrays
    }
    return {
      ...inboundState,
      timestamp: Date.now() + 19800000
    };
  },
  (outboundState) => {
    if (!outboundState || !outboundState?.timestamp) return undefined; // Prevent errors

    const currentTime = Date.now() + 19800000
    const globalTime = currentTime - outboundState.timestamp;

    // Logging expiration in hours, minutes, seconds, and milliseconds for tracking

    console.log("Current Time: " + Math.floor((currentTime % (24 * 3600000)) / 3600000) + " hours : " + Math.floor((currentTime % 3600000) / 60000) + " minutes : " + Math.floor((currentTime % 60000) / 1000) + " seconds : " + currentTime % 1000 + " milliseconds");

    console.log("Old Time: " + Math.floor((outboundState.timestamp % (24 * 3600000)) / 3600000) + " hours : " + Math.floor((outboundState.timestamp % 3600000) / 60000) + " minutes : " + Math.floor((outboundState.timestamp % 60000) / 1000) + " seconds : " + outboundState.timestamp % 1000 + " milliseconds");

    console.log("Time Difference: " + Math.floor((globalTime % (24 * 3600000)) / 3600000) + " hours : " + Math.floor((globalTime % 3600000) / 60000) + " minutes : " + Math.floor((globalTime % 60000) / 1000) + " seconds : " + globalTime % 1000 + " milliseconds");

    console.log("Expiry: " + Math.floor((EXPIRY_INTERVAL % (24 * 3600000)) / 3600000) + " hours : " + Math.floor((EXPIRY_INTERVAL % 3600000) / 60000) + " minutes : " + Math.floor((EXPIRY_INTERVAL % 60000) / 1000) + " seconds : " + EXPIRY_INTERVAL % 1000 + " milliseconds");

    console.log("\n\n");

    // Check if global state expiration has been reached
    if (globalTime > EXPIRY_INTERVAL) {
      console.log("Global state expired, clearing...");
      return undefined; // Clear the entire persisted state if expired
    }

    // Remove the timestamp when loading
    const { timestamp, ...rest } = outboundState;
    return rest;
  }
);

const persistConfig = {
  key: 'root',
  storage: createIdbStorage({ name: "myDB", storeName: "reduxStore" }), // Use IndexedDB
  transforms: [expireTransform],
  version: 1,
  // whitelist: ["auth", "cart"],
};

const reducer = persistReducer(persistConfig, AllReducer);

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor }