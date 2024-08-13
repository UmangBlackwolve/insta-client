import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
import {baseurl} from "../../reducers/userReducer"
const CreatePost = () => {

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (url) {
      fetch(`${baseurl}/createpost`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          body,
          pic: url
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" })
          } else {
            M.toast({ html: "Create Post Success !!!", classes: "#43a047 green darken-1" })
            setTitle("")
            setBody("")
            setImage("")
            setUrl("")
            navigate('/')
          }
        })
    }
  }, [url])


  const PostDetails = () => {
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
        setUrl(data.url)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div
      className="card input-filed"
      style={{
        maxWidth: "500px",
        margin: "10px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="body" value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input type="text" className="file-path validate" />
        </div>
      </div>
      <button className="btn waves-effect waves-light #64b5f6 blue darken-2" onClick={PostDetails}>Submit Post</button>

    </div>
  );
};

export default CreatePost;
