import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true);

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('User not found');
        }
        return res.json();
      })
      .then(result => {
        console.log(result);
        setUserProfile(result);
      })
      .catch(err => {
        setError(err.message);
      });
  }, [userid]);

  const followUser = () => {
    fetch(`http://localhost:5000/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userid
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to follow user');
        }
        return res.json();
      })
      .then(data => {
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile(prev => ({
          ...prev,
          user: {
            ...prev.user,
            followers: [...prev.user.followers, data._id]
          }
        }));
        setShowFollow(false);
        console.log('Followed user:', data);
      })
      .catch(err => {
        console.error('Error following user:', err);
      });
  };

  const unfollowUser = () => {
    fetch(`http://localhost:5000/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to unfollow user');
        }
        return res.json();
      })
      .then(data => {
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile(prev => {
          const newFollowers = prev.user.followers.filter(item => item !== data._id);
          return {
            ...prev,
            user: {
              ...prev.user,
              followers: newFollowers
            }
          };
        });
        setShowFollow(true);
        console.log('Unfollowed user:', data);
      })
      .catch(err => {
        console.error('Error unfollowing user:', err);
      });
  };

  return (
    <>
      {error ? (
        <h2>{error}</h2>
      ) : (
        userProfile ? (
          <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey",
              }}
            >
              <div>
                <img
                  style={{ width: "160px", height: "160px", borderRadius: "80px", objectFit: "cover" }}
                  src={userProfile.user.pic}
                  alt="Profile"
                />
              </div>
              <div>
                <h4>{userProfile.user.name}</h4>
                <h5>{userProfile.user.email}</h5>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "108%",
                  }}
                >
                  <h5>{userProfile.posts ? userProfile.posts.length : 0} Posts</h5>
                  <h5>{userProfile.user.followers ? userProfile.user.followers.length : 0} Followers</h5>
                  <h5>{userProfile.user.following ? userProfile.user.following.length : 0} Following</h5>
                </div>
                {showFollow ?
                  <button className="btn waves-effect waves-light #64b5f6 blue darken-2" style={{ margin: "10px" }} onClick={followUser}>Follow</button>
                  :
                  <button className="btn waves-effect waves-light #64b5f6 blue darken-2" style={{ margin: "10px" }} onClick={unfollowUser}>UnFollow</button>
                }
              </div>
            </div>

            <div className="gallery">
              {userProfile.posts && userProfile.posts.map(item => (
                <img key={item._id} className="item" src={item.pic} alt={item.title} />
              ))}
            </div>
          </div>
        ) : (
          <h2>Loading...!</h2>
        )
      )}
    </>
  );
};

export default Profile;
