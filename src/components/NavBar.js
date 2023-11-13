import { useContext } from "react";
// import Saori from "../img/saori.jpeg";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function NavBar() {
	const { currentUser } = useContext(AuthContext);

	return (
		<div className="navbar">
			<span className="logo">React Chat</span>
			<div className="user">
				<img src={currentUser.photoURL} alt="" />
				<span>{currentUser.displayName}</span>
				<button onClick={() => signOut(auth)}>logout</button>
			</div>
		</div>
	);
}

export default NavBar;
