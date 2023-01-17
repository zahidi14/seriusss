import { connect } from "react-redux";
import React, {useEffect} from "react";
import {Route, Redirect} from "react-router-dom";

const PrivateRoute = ({
    auth:{loading, isAuthenticated},
    loadUser,
    component: Component,
    ...rest
})=>{
    useEffect(()=>{
        loadUser();
    }, []);
    
    
    return (
    <Route
        {...rest}
        render={(props)=>
            !isAuthenticated && !loading ?(
                <Redirect to="/login" />
            ):(
                <Component {...props} />
            )
        }
    />  
    )  
};

PrivateRoute.propTypes ={
    auth: propTypes.objet.isRequired,
    loadUser: propTypes.func.isRequired
};

const mapStateToProps = (state) =>({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {loadUser}
)(PrivateRoute)