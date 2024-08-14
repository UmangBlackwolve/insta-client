import React, { useContext, useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
import { baseurl } from "../reducers/userReducer";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const searchModal = useRef(null);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);


  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <Link style={{ display: "flex", alignItems: "center" }}>
            <i
              className="material-icons modal-trigger"
              data-target="modal1"
              style={{ color: "black" }}
            >
              search
            </i>
            Search
          </Link>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/createpost">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowerspost">My Following Posts</Link>
        </li>,
        <li key="5">
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
        <li key="6">
          <Link to="/signin">Signin</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    if (!query) {
      setUserDetails([]); // Clear results if the query is empty
      return;
    }

    setSearch(query);
    fetch(`${baseurl}/search-users`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((results) => {
        console.log("Fetched users:", results.users);
        setUserDetails(results.users || []); // Ensure userDetails is always an array
      })
      .catch((err) => {
        console.error(err);
        setUserDetails([]); // Handle any errors by setting userDetails to an empty array
      });
  };

  return (
    <nav style={{ display: window.location.pathname.startsWith('/signup') || window.location.pathname.startsWith('/signin') ? 'none' : 'block' }}>
      <div className="nav-wrap white">
        <div className="logo">
          <Link to={state ? "/" : "/signin"}>Instagram</Link>
        </div>
        <div className="menu">
          <ul>{renderList()}</ul>
        </div>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="Search Users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
        </div>
        <ul className="collection">
          {Array.isArray(userDetails) && userDetails.length > 0 ? (
            userDetails.map((item) => (
              <Link
                key={item._id}
                to={item._id !== state._id ? "/profile/" + item._id : "/profile"}
                onClick={() => {
                  M.Modal.getInstance(searchModal.current).close();
                  setSearch("");
                }}
              >
                <li className="collection-item">{item.email}</li>
              </Link>
            ))
          ) : (
            <li className="collection-item">No users found</li>
          )}
        </ul>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            Agree
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
