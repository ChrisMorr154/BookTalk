import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { AuthContext } from '../context/authContext';

const Feed = () => {
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const currentUser = user && user.username ? user.username : "Unknown User";

  // Load posts from localStorage
  const [posts, setPosts] = useState(() => {
    const storedPosts = localStorage.getItem("posts");
    if (!storedPosts) {
      return [{
        title: "Welcome to BookTalk, ",
        content: "This is our first post on the social network for book related interests. Stay tuned for more updates!",
        image: "",
        author: "System",
        time: new Date().toLocaleString(),
        replies: [],
        likes: 0,
        likedByCurrentUser: false
      }];
    } else {
      const parsed = JSON.parse(storedPosts);
      // i'm making sure each post has the needed fields
      return parsed.map(post => ({
        ...post,
        replies: post.replies || [],
        likes: typeof post.likes === "number" ? post.likes : 0,
        likedByCurrentUser: typeof post.likedByCurrentUser === "boolean" ? post.likedByCurrentUser : false
      }));
    }
  });

  // Save posts to localStorage when the user makes changes
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  // make system post and user posts different
  const systemPosts = posts.filter(p => p.author === "System");
  const userPosts = posts.filter(p => p.author !== "System");

  // Modal state to create a new user post
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");

  const handlePostImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setPostImage(loadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewPost = () => {
    if (postContent.trim() !== "") {
      const newPost = {
        title: "",
        content: postContent,
        image: postImage,
        author: currentUser,
        time: new Date().toLocaleString(),
        replies: [],
        likes: 0,
        likedByCurrentUser: false
      };
      setPosts([...posts, newPost]);
      setShowPostModal(false);
      setPostContent("");
      setPostImage("");
    }
  };

  // Editing
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingImage, setEditingImage] = useState("");

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingContent(userPosts[index].content);
    setEditingImage(userPosts[index].image);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setEditingImage(loadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = (index) => {
    if (editingContent.trim() !== "") {
      const overallIndex = posts.indexOf(userPosts[index]);
      if (overallIndex !== -1) {
        const updatedPosts = [...posts];
        updatedPosts[overallIndex] = {
          ...updatedPosts[overallIndex],
          content: editingContent,
          image: editingImage
        };
        setPosts(updatedPosts);
      }
    }
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingContent("");
    setEditingImage("");
  };

  const deletePost = (index) => {
    const overallIndex = posts.indexOf(userPosts[index]);
    if (overallIndex !== -1) {
      const updatedPosts = posts.filter((_, i) => i !== overallIndex);
      setPosts(updatedPosts);
    }
  };

  // Replying
  const [replyingIndex, setReplyingIndex] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const startReply = (index) => {
    setReplyingIndex(index);
    setReplyContent("");
  };

  const submitReply = (index) => {
    if (replyContent.trim() !== "") {
      const overallIndex = posts.indexOf(userPosts[index]);
      if (overallIndex !== -1) {
        const updatedPosts = [...posts];
        if (!updatedPosts[overallIndex].replies) {
          updatedPosts[overallIndex].replies = [];
        }
        updatedPosts[overallIndex].replies.push({
          author: currentUser,
          content: replyContent,
          time: new Date().toLocaleString()
        });
        setPosts(updatedPosts);
      }
      setReplyingIndex(null);
      setReplyContent("");
    }
  };

  // Like Toggle
  const handleLike = (index) => {
    const overallIndex = posts.indexOf(userPosts[index]);
    if (overallIndex !== -1) {
      const updatedPosts = [...posts];
      const targetPost = updatedPosts[overallIndex];
      if (targetPost.likedByCurrentUser) {
        targetPost.likes = (targetPost.likes || 0) - 1;
        targetPost.likedByCurrentUser = false;
      } else {
        targetPost.likes = (targetPost.likes || 0) + 1;
        targetPost.likedByCurrentUser = true;
      }
      setPosts(updatedPosts);
    }
  };

  // I need to put this in CSS file (feed.css)
  const feedStyles = {
    postContainer: {
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#fff'
    },
    postHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
      fontWeight: 'bold'
    },
    postAuthor: {
      fontSize: '1.5rem'
    },
    postLikes: {
      fontSize: '0.9rem',
      color: '#666'
    },
    postContent: {
      marginBottom: '0.1rem'
    },
    postImage: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '3px',
      marginBottom: '0.5rem'
    },
    postTime: {
      fontSize: '0.8rem',
      color: '#999',
      marginBottom: '0.5rem'
    },
    postActions: {
      display: 'flex',
      gap: '0.5rem'
    },
    systemPostTitle: {
      marginTop: '0.5rem',
      marginBottom: '0.5rem'
    }
  };

  return (
    <section className="feed">
      <div className="post-creator" style={{ textAlign: "center" }}>
        <button onClick={() => setShowPostModal(true)} className="add-post-button">
          Post
        </button>
      </div>

      {/* put the System Posts first */}
      {systemPosts.map((post, index) => (
        <div key={index} className="post" style={feedStyles.postContainer}>
          <div style={feedStyles.postHeader}>
            <span style={feedStyles.postAuthor}>{post.author}</span>
            <span style={feedStyles.postLikes}>System Post</span>
          </div>
          <div style={feedStyles.postContent}>
            <h3 style={feedStyles.systemPostTitle}>{post.title}</h3>
            {post.image && (
              <img
                src={post.image}
                alt={`System Post ${index}`}
                style={feedStyles.postImage}
              />
            )}
            <p>{post.content}</p>
          </div>
          <div style={feedStyles.postTime}>{post.time}</div>
        </div>
      ))}

      {/* "adding feed heading above the user posts" */}
      {userPosts.length > 0 && (
        <h3 style={{ marginTop: "1rem" }}>Feed</h3>
      )}

      {/* for User Posts */}
      {userPosts.map((post, index) => {
        const isEditing = (editingIndex === index);
        const isReplying = (replyingIndex === index);

        return (
          <div key={index} className="post" style={feedStyles.postContainer}>
            <div style={feedStyles.postHeader}>
              <span style={feedStyles.postAuthor}>{post.author}</span>
              <span style={feedStyles.postLikes}>Likes: {post.likes}</span>
            </div>

            {/* If editing, show editing fields. if not just show post content. */}
            {isEditing ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  style={{ marginBottom: "0.5rem" }}
                />
                {editingImage && (
                  <img
                    src={editingImage}
                    alt="Editing"
                    style={feedStyles.postImage}
                  />
                )}
                <textarea
                  rows="3"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <button onClick={() => saveEdit(index)} className="add-post-button">
                  Save
                </button>
                <button onClick={cancelEdit} className="close-btn" style={{ marginLeft: "0.5rem" }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* Post Content */}
                <div style={feedStyles.postContent}>
                  <p>{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={`Post ${index}`}
                      style={feedStyles.postImage}
                    />
                  )}
                </div>
                {/* adding the current time to post */}
                <div style={feedStyles.postTime}>{post.time}</div>
              </>
            )}

            {/* handle (edit/delete/reply/like) */}
            <div style={feedStyles.postActions}>
              {post.author === currentUser && !isEditing && (
                <>
                  <button onClick={() => startEdit(index)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(index)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </>
              )}
              {!isEditing && (
                <>
                  <button onClick={() => startReply(index)}>
                    Reply
                  </button>
                  <button
                    onClick={() => handleLike(index)}
                    className="like-btn"
                  >
                    {post.likedByCurrentUser ? "Unlike" : "Like"}
                  </button>
                </>
              )}
            </div>

            {/* Replying section */}
            {isReplying && (
              <div style={{ marginTop: "0.5rem" }}>
                <textarea
                  rows="2"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <button onClick={() => submitReply(index)} className="add-post-button">
                  Submit Reply
                </button>
              </div>
            )}

            {/* Replies */}
            {post.replies && post.replies.length > 0 && (
              <div className="replies-section" style={{ marginTop: '1rem' }}>
                <h4>Replies</h4>
                {post.replies.map((r, rIndex) => (
                  <div key={rIndex} className="reply-item" style={{ marginBottom: '0.5rem' }}>
                    <div className="reply-header" style={{ fontWeight: 'bold' }}>
                      <span className="reply-author">{r.author}</span>
                      <span className="reply-time" style={{ marginLeft: '0.5rem', color: '#999', fontSize: '0.8rem' }}>
                        {r.time}
                      </span>
                    </div>
                    <p>{r.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {showPostModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Create Post</h3>
            <div className="add-post">
              <div className="photo-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePostImageChange}
                  className="file-input"
                />
              </div>
              <div className="post-content-container">
                <textarea
                  rows="3"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                />
                <button onClick={addNewPost} className="add-post-button">
                  Submit
                </button>
              </div>
            </div>
            <button onClick={() => setShowPostModal(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Feed;
