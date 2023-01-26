import React from "react";
import { useTrail, animater as a } from "react-spring";
import { Link } from "react-router-dom";

const NotFound = () =>{
    const config = {mass: 5, tension: 2000, friction: 200 };
    const items = [
        <h1 className="notFound--title">¡Error 404!</h1>,
		<p className="notFound--text">
			The page you are looking for could not be found.:{" "}
			<span className="notFound--text--special">Za</span>
		</p>,
		<Link to="/school" className="notFound--link">
			{/* <Btn text="Volver a inicio" classNames="btn--primary" /> */}
		</Link>
    ]

    const trail = useTrail(items.length, {
        config,
        opacity: 1,
        x: 0,
        height: 100,
        from: {opacity: 0, x: 20, heigh:0 }
    });
    
    return(
        <div className="notFound">
            <div className="notFound--content">
                {trail.map(({x, height, ...rest }, index)=>{
                    <a.div key={index} style={{
                        ...rest,
                        transfom: x.interpolate(
                            (x) => `translate3d(0,${x}px,0)`
                        )
                    }}>
                        <a.div style={{height}}>{items[index]}</a.div>
                    </a.div>
                })}
            </div>
        </div>   
    )
};

export default NotFound;
