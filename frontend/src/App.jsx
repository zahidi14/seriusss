import React from "react";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
import Routes from "./component/routing/Routes";



// const homePage = "/class";
// if(localStorage.token) {
//   setAuthToken(localStorage.token);
// }

const App = ()=>{
  // const [access, setAccess] = useState("");
  // const [fakeLoading, setFakeLoading]= useState(true);
  // const [lastPage, setLastPage] = useState(homePage);

  // useEffect(() => {
  //   loadUser();
  // }, []);

  // useEffect(() => {
  //   if (isAuthenticated) setAccess("private");
  //   else setAccess("public")
  // }, [isAuthenticated]);

  // useEffect(() => {
  //   if(!loading && access !=="") setFakeLoading(false)
    
  // }, [loading, access]);
  // const routerChangeHandler = ()=>{
  //   if(localStorage.lastPage) setLastPage(localStorage.lastPage);
  //   else setLastPage(homePage)
  // }

  return(
    // <Fragment>
    //   <Preloader loading = {fakeLoading} main={true} bgColor="green" />
    //   <Router>
    //     <RouterListener handleChange={routerChangeHandler}/>
    //     <div className={`main main--${access}`}>
    //         <Navigation access = {access}></Navigation>
    //         <div className="main--cont">
    //           {/* <Alert></Alert> */}
    //           <Switch>
    //             <Route exact
    //             path="/"
    //             render={()=>
    //             !isAuthenticated?(<Redirect to="/login"/>)
    //           :(<Redirect to={lastPage} />)}></Route>
    //             <Route component={Routes}></Route>
    //           </Switch>
    //         </div>
    //         {/* {access === "public" && <Footer />} */}
    //     </div>
    //   </Router>
    // </Fragment>
    <Router>
      <Switch>
        <Route exac path="/" component={Routes}></Route>
      </Switch>
    </Router>
  )

};
export default  App;