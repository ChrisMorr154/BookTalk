import React, { useState } from "react";
import Header from "../components/navBar";
import Sidebar from "../components/sideBar";
import Feed from "../components/Feed";
import Rightbar from "../components/rightBar";
import ChatBox from "../components/chatBox";
import "../home.css"; 

const Home = () => {
  const [friends] = useState([
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" },
  ]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="home-page">
      <Header />
      <div className="home-main-content">
        <div className="home-sidebar">
          <Sidebar />
        </div>
        <div className="home-feed">
          <Feed />
        </div>
        <div className="home-rightbar">
          <Rightbar friends={friends} onSelectFriend={setSelectedFriend} />
        </div>
      </div>

      {selectedFriend && (
        <ChatBox
          selectedFriend={selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      )}
    </div>
  );
};

export default Home;