import React, { useState} from "react";
import { Link, useNavigate, useParams} from "react-router-dom";
import M from "materialize-css";
import { baseurl } from "../../reducers/userReducer";

const NewPassword = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState()
  const { token } = useParams()
  console.log("🚀 ~ NewPassword ~ token:", token)

  const PostData = () => {
    console.log("🚀 ~ PostData ~ baseurl:", baseurl)
    fetch(`${baseurl}/new-password`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        token
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" })
        } else {
          M.toast({ html: data.message, classes: "#43a047 green darken-1" })
          setPassword("")
          navigate('/signin')
        }
      })
  }

  return (
    <div>
      <div className="mycard">
        <div className="card card-auth">
          <h2>Instagram</h2>
          <input type="password" placeholder="Enter New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn waves-effect waves-light #64b5f6 blue darken-2" onClick={PostData}>Change Password</button>
          <h5>
            <Link to="/signup">Don't Have an account ?</Link>
          </h5>
        </div>
      </div>

    </div>
  );
};

export default NewPassword;
