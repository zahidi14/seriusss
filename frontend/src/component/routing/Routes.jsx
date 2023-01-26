import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Guru from "../guru/Guru";
import Student from "../student/Student";
import Ujian from "../ujian/Ujian";
import Kelas from "../kelas/Kelas";
import Mapels from "../mapels/Mapels";


const Routes = () => {
        <Switch>
            <Route exact path="/login" component={ Login } />
            <Route exact path="/register" component={Register}/>
           
            <PrivateRoute exact path="/mapel" component={Mapels} />
            <PrivateRoute exact path="/guru" component ={Guru} />
            <PrivateRoute exact path="/student" component ={Student} />
            <PrivateRoute exact path="/ujian" component ={Ujian} />
            <PrivateRoute exact path="/kelas" component ={Kelas} />
        </Switch>
};

export default Routes;