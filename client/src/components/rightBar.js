import React from 'react';
import FriendList from './FriendList'; 

const Rightbar = ({ friends, onSelectFriend }) => (
  <aside className="rightbar">
    <div className="suggestions">
      <h4>Suggestions</h4>
      <p>Join your class groups, follow your college clubs, and more.</p>
    </div>
    <FriendList friends={friends} onSelectFriend={onSelectFriend} />
  </aside>
);

export default Rightbar;
