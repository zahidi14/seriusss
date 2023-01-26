import React, { useEffect, useState } from "react";
import {connect} from "react-redux";
import {loginUser} from "../../redux/action/authAction";
import { clearMsg } from "../../redux/action/messageActions";
import { setAlert } from "../../redux/action/alertAction";
import PropTypes from "prop-types";
import {useSpring, animated} from "react-spring";


const Login = ({
    auth: {isAuthenticated},
    msgs,
    errId,
    loginUser,
    setAlert,
    clearMsg,
    history
})=>{

    const [user, setUser] = useState({
        email:"",
        password:""
    });

    const {email, password} = user;
    const spring = useSpring({
        opacity: 1,
        transform: "translateX(0)",
        from:{
            opacity:0,
            transform: "translateX(-15rem)"
        }
    });
    useEffect(()=>{
        if (msgs.includes("AUTH_LOADUSER_ERROR")){
            clearMsg("AUTH_LOADUSER_ERROR");
            setAlert(
                "Nama Pengguna Tidak Ditemukan"
            );
        }else if(msgs.includes("AUTH_LOGIN_ERROR")){
            clearMsg("AUTH_LOGIN_ERROR");
            let msg = "Login Gagal.";
            if(errId === 3){
                msg = "Email belum terdaftar"
            }else if( errId === 5){
                msg ="Password salah"
            }else if(errId === 5.1){
                msg = "Field tidak valid"
            }

            setAlert(msg, "danger", 3);
        }
    }, [msgs]);

    useEffect(()=>{
        if(isAuthenticated) history.push("/");
    },[isAuthenticated, history]);

    const onChange = (e) => {
        let value = e.target.value;
        const key = e.target.dataset.key;

        setUser({ ...user, [key]: value});
    };

    const onSubmit = (e) =>{
        e.preventDefault();
        if(email === "") setAlert("Masukkan Email");
        else if (password === "") setAlert("Masukan kata sandi.");
        else {
            loginUser({
                email,
                password
            });
        }
    };

    return(
        <animated.div style={spring}>
        <div className="form">
            <div className="form--content">
                <h2>
                    Login <span className="text--primary">examilo</span>
                </h2>
                <form onSubmit={onSubmit}>
                    {/* <Input
                        boxStyle={true}
                        type="email"
                        value={email}
                        title="Email"
                        placeHolder="Email"
                        onChange={onChange}
                        objKey="email"
                        autoFocus={true}
                    />

                    <Input
                        boxStyle={true}
                        type="password"
                        value={password}
                        title="Contraseña"
                        placeHolder="Password"
                        onChange={onChange}
                        objKey="password"
                    />

                    <Btn
                        classNames="btn--primary form--btn"
                        type="submit"
                        text="Login"
                    /> */}
                </form>
            </div>
        </div>
    </animated.div>
    )

    
};
Login.propTypes = {
    auth: PropTypes.object.isRequired,
    msgs: PropTypes.array.isRequired,
    errId: PropTypes.number,
    loginUser: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    clearMsg: PropTypes.func.isRequired
};

const mapStateToProps = (state)=> ({
    auth: state.auth,
    msgs: state.messages,
    errId: state.auth.error
});

export default connect(mapStateToProps, { loginUser, setAlert, clearMsg })(
	Login
);