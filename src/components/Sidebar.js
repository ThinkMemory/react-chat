import Chats from "./Chats";
import NavBar from "./NavBar";
import Search from "./Search";

function Sidebar() {
	return (
		<div className="sidebar">
			<NavBar />
			<Search />
			<Chats />
		</div>
	);
}

export default Sidebar;
