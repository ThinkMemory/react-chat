import { useState } from "react";
import addAvatar from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

function Register() {
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const displayName = e.target[0].value;
		const email = e.target[1].value;
		const password = e.target[2].value;
		const file = e.target[3].files[0];
		if (
			displayName === undefined ||
			displayName === undefined ||
			displayName === "" ||
			email === undefined ||
			email === "" ||
			email === null ||
			password === undefined ||
			password === "" ||
			password === null ||
			file === undefined
		) {
			setErrMsg("Please complete the information");
			setErr(true);
			return;
		}

		setLoading(true);

		try {
			const res = await createUserWithEmailAndPassword(auth, email, password);

			const date = new Date().getTime();
			const storageRef = ref(storage, `${displayName + date}`);

			await uploadBytesResumable(storageRef, file).then(() => {
				getDownloadURL(storageRef).then(async (downloadURL) => {
					try {
						//Update profile
						await updateProfile(res.user, {
							displayName,
							photoURL: downloadURL,
						});
						//create user on firestore
						await setDoc(doc(db, "users", res.user.uid), {
							uid: res.user.uid,
							displayName,
							email,
							photoURL: downloadURL,
						});
						//create empty user chats on firestore
						await setDoc(doc(db, "userChats", res.user.uid), {});
						navigate("/");
					} catch (error) {
						setErrMsg("Something went wrong");
						setErr(true);
						setLoading(false);
					}
				});
			});
		} catch (error) {
			switch (error.code) {
				case "auth/invalid-email": {
					setErrMsg("Please input correct email");
					break;
				}
				case "auth/weak-password": {
					setErrMsg("Password should be at least 6 characters");
					break;
				}
				case "auth/email-already-in-use": {
					setErrMsg("This email already exists");
					break;
				}
				default: {
					setErrMsg("Something went wrong");
					break;
				}
			}
			setErr(true);
			setLoading(false);
		}

		// createUserWithEmailAndPassword(auth, email, password)
		// 	.then((userCredential) => {
		// 		// Signed in
		// 		const user = userCredential.user;

		// 		console.log(user);
		// 		// ...
		// 	})
		// 	.catch((error) => {
		// 		const errorCode = error.code;
		// 		const errorMessage = error.message;
		// 		console.log(errorCode);
		// 		console.log("errorMessage :>> ", errorMessage);
		// 		setErr(true);
		// 		// ..
		// 	});
	};

	return (
		<div className="formContainer">
			<div className="formWrapper">
				<span className="logo">React Chat</span>
				<span className="title">Register</span>
				<form onSubmit={handleSubmit}>
					<input type="text" placeholder="display name" />
					<input type="email" placeholder="email" />
					<input type="password" placeholder="password" />
					<input style={{ display: "none" }} type="file" id="file" />
					<label htmlFor="file">
						<img src={addAvatar} alt="" />
						<span>Add an avatar</span>
					</label>
					<button disabled={loading}>Sign up</button>
					{/* {loading && "Uploading and compressing the image please wait..."} */}
					{err && <span className="tips">{errMsg}</span>}
				</form>
				<p>
					You do have an account? <Link to={"/login"}>Login</Link>
				</p>
			</div>
		</div>
	);
}

export default Register;
