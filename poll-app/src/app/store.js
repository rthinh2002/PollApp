import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import questionsReducer from "../slice/questionsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        questions: questionsReducer,
    },
});

export default store;
