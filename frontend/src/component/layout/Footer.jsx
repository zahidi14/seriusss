import React from "react";
import {useSpring, animated} from "react-spring";

const Footer = ()=>{
    const footer=  useSpring({
        opacity:1,
        tranform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(100%)"}
    });

    return (
        <animated.div style={footer} className="footp">
            <div className="footp--content">
                <p className="footp--copy">
                &copy; 2023 Zahidi.
                </p>
            </div>
        </animated.div>
    )
} ;
export default Footer;