import React, { useState} from "react";
import { connect } from "react-redux";
import RouterListener from "../routing/RouterListener";
import PropTypes from "prop-types";
import { removeAlert, clearAlert } from "../../redux/action/alertAction";
// import RouterListener from "../routing/RouterListener";
import { useTransition, animated as a } from "react-spring";

const Alert = ({
    alert, removeAlert, clearAlert
}) =>{
    const [refMap] = useState(() => new WeakMap());
    const transition = useTransition(alert, (item)=> item.id, {
        from : { opacity: 0, height: 0, marginTop:" 1.5rem"},
        enter: (item) => async(next) => 
            await next({
                opacity: 1,
                height: refMap.get(item).offsetHeight
            }),
        leave: (item) => async (next) =>{
            await next({ opacity: 0 });
            await next({height: 0 , marginTop: "0"});
        },
        onRest: (item) =>{
            setTimeout(()=>{
                removeAlert(item);
            }, item.timeout *1000);
        }
    });

    const routerChangeHandler = (location) => clearAlert();
    const remove = (item) =>{
        if (alert.includes(item)) removeAlert(item.id);
    };

    return(
        <div className="alerts">
            <RouterListener handleChange={routerChangeHandler}/>
            {transition.map(({item, props})=>(
                <a.div key={item.id}
                style={props}
                className={`alerts__item alerts__item--${item.type}`}
            >
                    <div
						className="alerts__item--content"
						ref={(ref) => ref && refMap.set(item, ref)}
					>
						<p className="alerts__item--txt">{item.msg}</p>
						<button
							className="alerts__item__btn"
							onClick={(e) => {
								e.stopPropagation();
								remove(item);
							}}
						>
							{/* <SVG icon="x" className="alerts__item__btn--icon" /> */}
						</button>
					</div>
                </a.div>
            ))}
        </div>
    )
};

Alert.propTypes = {
    alert: PropTypes.array.isRequired,
    removeAlert: PropTypes.func.isRequired,
    clearAlert: PropTypes.func.isRequired
};

const mapStateToProps = (state) =>({
    alert: state.alert
});

export default connect(
    mapStateToProps, { removeAlert, clearAlert}
)(Alert);