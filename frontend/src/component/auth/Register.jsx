import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { registerUser } from "../../redux/action/authAction";
import { setAlert } from "../../redux/action/alertAction";
import { clearMsg } from "../../redux/action/messageActions";
import validate from "../../utilFuncs/validate";
import { correctText } from "../../utilFuncs/other";
import PropTypes from "prop-types";
// import Btn from "../utils/Btn";
// import Input from "../utils/Input";
import { useSpring, animated  } from "react-spring";

const Register = ({
	auth: { error, isAuthenticated },
	msgs,
	registerUser,
	setAlert,
	clearMsg,
	history
}) => {
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		password2: "",
		productKey: ""
	});

	const { name, email, password, password2, productKey } = user;
	const spring = useSpring({
		opacity: 1,
		transform: "translateX(0)",
		from: {
			opacity: 0,
			transform: "translateX(15rem)"
		}
	});

	useEffect(() => {
		if (msgs.includes("AUTH_REGISTER_ERROR")) {
			clearMsg("AUTH_REGISTER_ERROR");
			error === 9
				? setAlert(`${email} allready exist`)
				: setAlert(
						"Unexpected error. Try again later."
				  );
		}
		// eslint-disable-next-line
	}, [msgs, error]);

	useEffect(() => {
		if (isAuthenticated) history.push("/");
	}, [isAuthenticated, history]);

	const onChange = (e) => {
		let value = e.target.value;
		const key = e.target.dataset.key;
		const inputType = e.target.dataset.type;

		if (inputType === undefined) {
			setUser({ ...user, [key]: e.target.value });
		} else {
			const limit = e.target.dataset.limit;
			const input = validate(inputType, value, limit);

			if (input.isValid) {
				let newVal = input.newValue;
				if (key === "name") newVal = correctText(newVal, true);
				setUser({ ...user, [key]: newVal });
			}
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		if (
			name === "" ||
			email === "" ||
			password === "" ||
			productKey === ""
		) {
			setAlert("Field Cannot empty.");
		} else if (password.toString().length < 6) {
			setAlert("The password must have more than 5 (five) characters!");
		} else if (password !== password2) {
			setAlert("Las contraseñas no son iguales!");
		} else {
			registerUser({
				name,
				email,
				password,
				productKey
			});
		}
	};

	return (
		<animated.div style={spring}>
			<div className="form">
				Ini halaman register
			</div>
		</animated.div>
	);
};

Register.propTypes = {
	auth: PropTypes.object.isRequired,
	msgs: PropTypes.array.isRequired,
	registerUser: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	clearMsg: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	msgs: state.messages
});

export default connect(
	mapStateToProps,
	{ registerUser, setAlert, clearMsg }
)(Register);
