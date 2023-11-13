import { useState } from "react";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Search() {
	const { currentUser } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);

	const [userName, setUserName] = useState("");
	const [user, setUser] = useState(null);
	const [err, setErr] = useState(false);

	const handleSearch = async () => {
		setErr(false);
		const q = query(
			collection(db, "users"),
			where("displayName", "==", userName)
		);

		try {
			const querySnapshot = await getDocs(q);
			const tmp = [];
			querySnapshot.forEach((doc) => {
				if (doc.data().uid !== currentUser.uid) {
					tmp.push(doc.data());
				}
			});
			if (!tmp.length) {
				setErr(true);
			}
			setUser(tmp);
		} catch (error) {
			setErr(true);
		}
	};

	const handleKey = (e) => {
		e.code === "Enter" && handleSearch();
	};

	const handleSelect = async (u) => {
		//check whether the group(chats in firestore) exists, if not create
		const combinedId =
			currentUser.uid > u.uid
				? currentUser.uid + u.uid
				: u.uid + currentUser.uid;
		try {
			const res = await getDoc(doc(db, "chats", combinedId));

			if (!res.exists()) {
				//create a chat in chats collection
				await setDoc(doc(db, "chats", combinedId), { messages: [] });

				//create user chats
				await updateDoc(doc(db, "userChats", currentUser.uid), {
					[combinedId + ".userInfo"]: {
						uid: u.uid,
						displayName: u.displayName,
						photoURL: u.photoURL,
					},
					[combinedId + ".date"]: serverTimestamp(),
				});

				await updateDoc(doc(db, "userChats", u.uid), {
					[combinedId + ".userInfo"]: {
						uid: currentUser.uid,
						displayName: currentUser.displayName,
						photoURL: currentUser.photoURL,
					},
					[combinedId + ".date"]: serverTimestamp(),
				});
			}
		} catch (error) {}
		setUser(null);
		setErr(false);
		setUserName("");

		dispatch({ type: "CHANGE_USER", payload: u });
	};

	// const handleBlur = () => {
	// 	setErr(false);
	// 	setUserName("");
	// };

	return (
		<div className="search">
			<div className="searchForm">
				<input
					type="text"
					placeholder="Find a user"
					onKeyDown={handleKey}
					onChange={(e) => setUserName(e.target.value)}
					value={userName}
					onBlur={(e) => setErr(false)}
				/>
			</div>
			{err && <span className="tips">User not found!</span>}
			{user &&
				user.map((u) => (
					<div className="userChat" key={u.uid} onClick={() => handleSelect(u)}>
						<img src={u.photoURL} alt="" />
						<div className="userChatInfo">
							<span>{u.displayName}</span>
						</div>
					</div>
				))}
		</div>
	);
}

export default Search;
