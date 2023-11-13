import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";

function Chats() {
	const { currentUser } = useContext(AuthContext);
	const { data, dispatch } = useContext(ChatContext);

	const [chats, setChats] = useState([]);

	useEffect(() => {
		const getChats = () => {
			const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
				setChats(Object.entries(doc.data()));
			});

			return () => {
				unsub();
			};
		};
		currentUser.uid && getChats();
	}, [currentUser.uid]);

	const handleSelect = (u) => {
		dispatch({ type: "CHANGE_USER", payload: u });
	};

	return (
		<div className="Chats">
			{chats
				.sort((a, b) => b[1].date - a[1].date)
				.map((chat) => (
					<div
						className={`userChat ${chat[0] === data.chatId && "active"}`}
						key={chat[0]}
						onClick={() => handleSelect(chat[1].userInfo)}
						title={`${chat[1].userInfo.displayName}\n${chat[1].lastMessage?.text}`}
					>
						<img src={chat[1].userInfo.photoURL} alt="" />
						<div className="userChatInfo">
							<span>{chat[1].userInfo.displayName}</span>
							<p>{chat[1].lastMessage?.text}</p>
						</div>
					</div>
				))}
		</div>
	);
}

export default Chats;
