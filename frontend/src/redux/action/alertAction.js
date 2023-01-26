import { CLEAR_ALERTS, SET_ALERT, REMOVE_ALERT } from "../types";
import {v4 as uuidv4} from "uuid";

export const setAlert = (msg, type = "danger", timeout=8)=>(dispatch) =>{
    if (typeof type !== "string"){
        console.error("Alert type provided is not of type string. (Alert actions)")
    }

    dispatch({
        type: SET_ALERT,
        payload: {
            id: uuidv4(),
            msg,
            type,
            timeout
        }
    });
};

export const removeAlert = (id) =>(dispatch) =>{
    dispatch({ type: REMOVE_ALERT, payload: id});
};

export const clearAlert = () =>(dispatch) => {
    dispatch({ type: CLEAR_ALERTS });
};