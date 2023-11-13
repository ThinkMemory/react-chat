import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function Login() {
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const email = e.target[0].value;
		const password = e.target[1].value;
		if (
			email === undefined ||
			email === "" ||
			email === null ||
			password === undefined ||
			password === "" ||
			password === null
		) {
			setErrMsg("Please input email and password");
			setErr(true);
			return;
		}

		setLoading(true);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate("/");
		} catch (error) {
			setErrMsg("Please input correct email or password");
			setErr(true);
			setLoading(false);
		}
	};

	return (
		<div className="formContainer">
			<div className="formWrapper">
				<span className="logo">React Chat</span>
				<span className="title">Login</span>
				<form onSubmit={handleSubmit}>
					<input type="email" placeholder="email" />
					<input type="password" placeholder="password" />
					<button disabled={loading}>Sign in</button>
					{err && <span className="tips">{errMsg}</span>}
				</form>
				<p>
					You don't have an account? <Link to={"/register"}>Register</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
