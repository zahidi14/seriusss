import {combineReducers} from "redux";
import authReducer from "./authReducer";
import alertReducer from "./alertReducer";
import messageReducer from "./messageReducer";

// import alertReducer from "./alertReducer";

export default combineReducers({
    auth : authReducer,
    alerts: alertReducer,
    messages: messageReducer
});