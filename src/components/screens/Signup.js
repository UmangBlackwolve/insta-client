import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from 'materialize-css'
import { baseurl } from '../../reducers/userReducer'

const Signup = () => {
  const navigate = useNavigate()
  const [name, setname] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)

  useEffect(() => {
    if (url) {
      uploadFields()
    }
  }, [url])
  
  const uploadPic = (e) => {
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
  const uploadFields = () => {
    // if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    // {
    //     M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
    //     return
    // }
    fetch(`${baseurl}/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic:url
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" })
        } else {
          M.toast({ html: data.message, classes: "#43a047 green darken-1" })
          setname("")
          setEmail("")
          setPassword("")
          navigate('/signin')
        }
      })
  }
  const PostData = () => {
    if (image) {
      uploadPic()
    } else {
      uploadFields()
    }

  }

  return (
    <div>
      <div className="mycard">
        <div className="card card-auth">
          <h2>Instagram</h2>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setname(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
              <span>Upload pic</span>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
              <input type="text" className="file-path validate" />
            </div>
          </div>
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={PostData}> SignUp</button>
          <h5>
            <Link to="/signin">Already have an account ?</Link>
          </h5>
        </div>
      </div>
    </div >
  )
}

export default Signup
