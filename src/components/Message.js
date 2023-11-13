import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Message({ message }) {
	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const ref = useRef();

	useEffect(() => {
		ref.current?.scrollIntoView({ behavior: "smooth" });
	}, [message]);

	const formatDate = (time) => {
		if (new Date().getTime() - time.getTime() < 120000) {
			return "just now";
		} else {
			const m = time.getMonth() + 1;
			const d = time.getDate();
			const h = time.getHours();
			const mi = time.getMinutes();
			return m + "-" + d + " " + h + ":" + mi;
		}
	};

	return (
		<div
			ref={ref}
			className={`message ${message.senderId === currentUser.uid && "owner"}`}
		>
			<div className="messageInfo">
				<img
					src={
						message.senderId === currentUser.uid
							? currentUser.photoURL
							: data.user.photoURL
					}
					alt=""
				/>
				<span>{formatDate(message.date.toDate())}</span>
			</div>
			<div className="messageContent">
				{(message.text !== "" ||
					message.text !== undefined ||
					message.text !== null) && <p>{message.text}</p>}
				{message.img && <img src={message.img} alt="" />}
			</div>
		</div>
	);
}

export default Message;
