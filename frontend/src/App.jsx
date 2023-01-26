import React, { Fragment, useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from "react-router-dom";
import setAuthToken from "./utilFuncs/setAuthToken";
import "./scss/main.scss";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Nav from "./component/layout/Nav";
import Footer from "./component/layout/Footer";
import Routes from "./component/routing/Routes";
import RouterListener from "./component/routing/RouterListener";

import { loadUser } from "./redux/action/authAction";
import Preloader from "./component/utils/Preloader";
import Alert from "./component/utils/Alert";


const homePage = "/class";
if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = ({ auth: {loading, isAuthenticated}, loadUser })=>{
  const [access, setAccess] = useState("");
	const [fakeLoading, setFakeLoading] = useState(true);
	const [lastPage, setLastPage] = useState(homePage);

	useEffect(() => {
		loadUser();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (isAuthenticated) setAccess("private");
		else setAccess("public");
		// eslint-disable-next-line
	}, [isAuthenticated]);

	useEffect(() => {
		if (!loading && access !== "") setFakeLoading(false);
	}, [loading, access]);

	const routerChangeHandler = () => {
		if (localStorage.lastPage) setLastPage(localStorage.lastPage);
		else setLastPage(homePage);
	};

  return(
    <Fragment>
      <Preloader loading = {fakeLoading} main={true} bgColor="green" />
      <Router>
        <RouterListener handleChange={routerChangeHandler}/>
        <div className={`main main--${access}`}>
            <Nav access = {access} />
            <div className="main--content">
				
               <Alert />
              <Switch>
							<Route
								exact path="/" render={() =>
									!isAuthenticated ? (
										<Redirect to="/login" />
									) : (
										<Redirect to={lastPage} />
									)
								}
							/>
							<Route component={Routes} />
						</Switch> 
            </div>
            {access === "public" && <Footer />}
        </div>
      </Router>
    </Fragment>
 
  )

};

App.propTypes = {
	auth: PropTypes.object.isRequired,
	loadUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ loadUser }
)(App);
