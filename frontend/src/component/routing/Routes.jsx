import React from "react";
import Guru from "../guru/Guru";
import Student from "../student/Student";
import Ujian from "../ujian/Ujian";
import Kelas from "../kelas/Kelas";
import Mapels from "../mapels/Mapels";
import {BrowserRouter as Route, Switch} from "react-router-dom";
const Routes = ()=>{
        <Switch>
            <Route exact path="/mapel" component={Mapels} />
            <Route exact path="/guru" component ={Guru} />
            <Route exact path="/student" component ={Student} />
            <Route exact path="/ujian" component ={Ujian} />
            <Route exact path="/kelas" component ={Kelas} />
        </Switch>
};

export default Routes;