import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setMypics] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  const [image, setImage] = useState("")

  useEffect(() => {
    fetch('http://localhost:5000/mypost', {
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
          fetch("http://localhost:5000/updatepic", {
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
      <div style={{
        margin: "18px 0px",
        borderBottom: "1px solid grey",
      }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px", objectFit: "cover" }}
              src={state ? state.pic : "loading"} alt="profile"
            />
          </div>
          <div>
            <h4>{state?.name || "loading"}</h4>
            <h5>{state?.email || "loading"}</h5>
            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
              <h5>{mypics.length} Post{mypics.length !== 1 && 's'}</h5>
              <h5>{state?.followers?.length || 0} Follower{state?.followers?.length !== 1 && 's'}</h5>
              <h5>{state?.following?.length || 0} Following</h5>
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
