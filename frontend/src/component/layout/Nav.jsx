import React from "react";
import{connect} from "react-redux"
import { NavLink, Link } from "react-router-dom";
import PropTypes from "prop-types";
import {useSpring, animated} from "react-spring";
import {logout} from "../../redux/action/authAction";

const Nav =({logout, access})=>{
    const navItems = [
        {linkTo:"class",text:"kelas"}
    ];

    const navMain = useSpring ({
        opacity: access === "private"? 1:0,
        transform: access === "private" ? "translateX(0)" : "translateX(-100%)"
    });

    const navTop = useSpring({
        opacity: access === "public" ? 1: 0,
        transform: access === "public" ? "translateX(0)" : "translateX(-100%)"
    });

    const onLogout = () => logout();

    if(access === "public"){
        return(
            <animated.div style={navTop} className="navp">
                <div className="navp--content">
                    <div className="navp__logo">
                        ini logo gambar
                    </div>
                    <ul className="navp__menu">
                        <li className="navp__menu--item">
                            <Link to="/login" className="navp__menu--link">Login</Link>
                        </li>
                        <li className="navp__menu--item">
                            <Link to="/register" className="navp__menu--link">Register</Link>
                        </li>
                    </ul>
                </div>
            </animated.div>
        )
    };

    return(
        <animated.div className="navm" style={navMain}>
            <div className="navm--content">
                <div className="navm__logo">
                    ini logo
                </div>

                <div className="navm__menu">
                    {navItems.map((item)=>(
                        <NavLink 
                            key={item.linkTo}
                            to = {item.linkTo}
                            className= "navm__menu__item"
                            activeClassName="navm__menu__item--active"
                            >
                            {/* <SVG 
                                icon={item.icon}
                                className="navm__menu__item--icon"
                            /> */}
                            <p className="navm__menu__item--text">{item.text}</p>

                        </NavLink>
                    ))}
                </div>
                <div className="navm__foot">
                    <div className="navm__foot__item" onClick={onLogout}>
                        <p className="navm__foot__item--text">Sign Out</p>
                    </div>
                </div>
            </div>
        </animated.div>
    )
};

Nav.propTypes = {
    access: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired
};

export default connect(
    null,
    { logout }
)(Nav);