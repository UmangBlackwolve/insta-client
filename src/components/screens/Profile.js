import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { baseurl } from "../../reducers/userReducer";

const Profile = () => {
  const [mypics, setMypics] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  const [image, setImage] = useState("")

  useEffect(() => {
    fetch(`${baseurl}/mypost`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        setMypics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "insta-clone")
      data.append("cloud_name", "dmr3dz4qe")
      fetch("https://api.cloudinary.com/v1_1/insta-clone/image/upload", {
        method: "post",
        body: data
      })
        .then(res => res.json())
        .then(data => {
          fetch(`${baseurl}/updatepic`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              pic: data.url
            })
          }).then(res => res.json())
            .then(result => {
              console.log(result)
              localStorage.setItem("user", JSON.stringify({...state,pic:result.pic}))
              dispatch({ type: "UPDATEPIC", payload: result.pic })
              
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [image])

  const updatephoto = (file) => {
    setImage(file)
  }

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div className="profile-main">
        <div className="profile">
          <div className="profile-image">
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px", objectFit: "cover" }}
              src={state ? state.pic : "loading"} alt="profile"
            />
          </div>
          <div>
            <h4 className="profile-name">{state?.name || "loading"}</h4>
            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
              <h5 className="profile-post"><span>{mypics.length}</span> Post</h5>
              <h5 className="profile-follower"><span>{state?.followers?.length || 0}</span> Follower{state?.followers?.length !== 1 && 's'}</h5>
              <h5 className="profile-following"><span>{state?.following?.length || 0}</span> Following</h5>
            </div>
          </div>
        </div>


        <div className="file-field input-field" style={{ margin: "10px" }}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update pic</span>
            <input type="file" onChange={(e) => updatephoto(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input type="text" className="file-path validate" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map(item => (
          <img key={item._id} className="item" src={item.pic} alt={item.title} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
