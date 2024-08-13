import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);

  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/createpost">Create Post</Link>
        </li>,
        <li>
          <Link to="/myfollowerspost">My Following Posts</Link>
        </li>,
        <li>
          <Link to="/signin" style={{ paddingRight: "0px" }}>
            <button
              className="btn #c62828 red darken-3"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
              }}
            >
              <i className="material-icons">arrow_forward</i>
            </button>
          </Link>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">Signin</Link>
        </li>,
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrap white">
        <div className="logo">
          <Link to={state ? "/" : "/signin"}>Instagram</Link>
        </div>
        <div className="menu">
          <ul>{renderList()}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
