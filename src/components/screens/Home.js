import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import { baseurl } from "../../reducers/userReducer";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch(`${baseurl}/allposts`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.posts) {
          setData(result.posts);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const likePost = (id) => {
    fetch(`${baseurl}/like`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch(`${baseurl}/unlike`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch(`${baseurl}/comment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`${baseurl}/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="home">
      {data.length === 0 ? (
        <h4>No posts available</h4>
      ) : (
        data.map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              <h5 style={{ padding: "24px" }}>
                {item.postedBy && item.postedBy._id ? (
                  <Link
                    to={
                      item.postedBy._id !== state?._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                  >
                    {item.postedBy.name}
                  </Link>
                ) : (
                  <span>Unknown User</span>
                )}
                {item.postedBy && item.postedBy._id === state?._id && (
                  <i
                    className="material-icons"
                    style={{ float: "right", color: "red" }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </h5>
              <div className="card-image">
                <img src={item.pic} alt={item.title || "Post image"} />
              </div>
              <div className="card-content">
                {item.likes && item.likes.includes(state?._id) ? (
                  <i
                    className="material-icons"
                    style={{ color: "red" }}
                    onClick={() => unlikePost(item._id)}
                  >
                    favorite
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    style={{ color: "red" }}
                    onClick={() => likePost(item._id)}
                  >
                    favorite_border
                  </i>
                )}
                <h6>{item.likes ? item.likes.length : 0} Likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments &&
                  item.comments.map((record) => {
                    return (
                      <h6 key={record._id}>
                        <span style={{ fontWeight: "500" }}>
                          {record.postedBy ? record.postedBy.name : "Unknown"}
                        </span>{" "}
                        {record.text}
                      </h6>
                    );
                  })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                  }}
                >
                  <input type="text" placeholder="Add Comment" />
                </form>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home;
