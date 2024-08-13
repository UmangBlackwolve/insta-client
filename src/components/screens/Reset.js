import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

import { baseurl } from "../../reducers/userReducer";

const Reset = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState()


  const PostData = () => {
    console.log("🚀 ~ PostData ~ baseurl:", baseurl)
    fetch(`${baseurl}/reset-password`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" })
        } else {
          M.toast({ html: data.message, classes: "#43a047 green darken-1" })
          setEmail("")
          navigate('/signin')
        }
      })
  }

  return (
    <div>
      <div className="mycard">
        <div className="card card-auth">
          <h2>Instagram</h2>
          <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn waves-effect waves-light #64b5f6 blue darken-2" onClick={PostData}>Reset Password</button>
          <h5>
            <Link to="/signup">Don't Have an account ?</Link>
          </h5>
        </div>
      </div>

    </div>
  );
};

export default Reset;
