import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/navBar';
import './Profile.css';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const Profile = () => {
  const { token } = useContext(AuthContext);

  // user profile state loaded from the server
  const [profile, setProfile] = useState({
    profileImage: '',
    biography: '',
    favoriteBooks: []
  });

  // For editing the biography
  const [tempBiography, setTempBiography] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Modal state for adding a favorite book
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookImage, setBookImage] = useState('');
  const [bookReview, setBookReview] = useState('');

  // get profile data from server
  useEffect(() => {
    if (token) {
      axios.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setProfile({
          profileImage: res.data.profileImage || '',
          biography: res.data.biography || '',
          favoriteBooks: res.data.favoriteBooks || []
        });
        setTempBiography(res.data.biography || '');
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
      });
    }
  }, [token]);

  // user image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const newImage = loadEvent.target.result;
        setProfile((prev) => ({
          ...prev,
          profileImage: newImage
        }));
        // Update user photo in server
        updateProfile({ ...profile, profileImage: newImage });
      };
      reader.readAsDataURL(file);
    }
  };

  // save bio and profile in server
  const saveProfile = () => {
    const updatedProfile = { ...profile, biography: tempBiography };
    setProfile(updatedProfile);
    setIsEditing(false);
    updateProfile(updatedProfile);
  };

  // update profile on server
  const updateProfile = (updatedData) => {
    axios.put('/users/profile', {
      profileImage: updatedData.profileImage,
      biography: updatedData.biography,
      favoriteBooks: updatedData.favoriteBooks
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setProfile({
        profileImage: res.data.profileImage,
        biography: res.data.biography,
        favoriteBooks: res.data.favoriteBooks
      });
    })
    .catch((err) => {
      console.error('Failed to update profile:', err);
    });
  };

  // handle favorite books feature
  const openBookModal = () => {
    setShowBookModal(true);
  };

  const closeBookModal = () => {
    setShowBookModal(false);
    setBookImage('');
    setBookReview('');
  };

  const handleBookImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setBookImage(loadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFavoriteBook = () => {
    if (bookImage && bookReview) {
      const updatedBooks = [...profile.favoriteBooks, { image: bookImage, review: bookReview }];
      const updatedProfile = { ...profile, favoriteBooks: updatedBooks };
      setProfile(updatedProfile);
      closeBookModal();
      updateProfile(updatedProfile);
    }
  };
  
  return (
    <div className="profile-page">
      <Header />

      <div className="profile-content">
        <div className="profile-edit-container">
          {/* Profile Image */}
          <div className="profile-image-section">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Profile" className="profile-img" />
            ) : (
              <div className="no-image">No Image</div>
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="file-input"
              />
            )}
          </div>

          {/* Biography */}
          <div className="biography-section">
            {isEditing ? (
              <textarea
                rows="4"
                value={tempBiography}
                onChange={(e) => setTempBiography(e.target.value)}
                className="bio-textarea"
                placeholder="Enter your biography..."
              />
            ) : (
              <div className="published-biography">
                {profile.biography || 'No biography available.'}
              </div>
            )}
          </div>

          {/* Edit / Save Buttons */}
          <div className="edit-button-section">
            {isEditing ? (
              <button onClick={saveProfile} className="add-post-button">
                Save
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="add-post-button">
                Edit
              </button>
            )}
          </div>

          {/* Favorite Books */}
          <div className="favorite-books-section">
            <h3>Favorite Books</h3>
            <div className="books-list">
              {profile.favoriteBooks.length > 0 ? (
                profile.favoriteBooks.map((book, index) => (
                  <div key={index} className="book-item">
                    {book.image && (
                      <img
                        src={book.image}
                        alt={`Book ${index}`}
                        className="book-image"
                      />
                    )}
                    <p>{book.review}</p>
                  </div>
                ))
              ) : (
                <p>No favorite books added.</p>
              )}
            </div>
            <button onClick={openBookModal} className="add-post-button">
              Add Favorite Book
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Adding Favorite Book */}
      {showBookModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Favorite Book</h3>
            <div className="add-post">
              <div className="photo-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBookImageChange}
                  className="file-input"
                />
              </div>
              <div className="post-content-container">
                <textarea
                  rows="3"
                  value={bookReview}
                  onChange={(e) => setBookReview(e.target.value)}
                  placeholder="Write your review..."
                />
                <button onClick={addFavoriteBook} className="add-post-button">
                  Submit
                </button>
              </div>
            </div>
            <button onClick={closeBookModal} className="add-post-button close-modal">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
