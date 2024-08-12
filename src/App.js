import React, { useEffect, createContext, useReducer ,useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes, Switch, useNavigate } from 'react-router-dom';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import { initialState, reducer } from './reducers/userReducer';
import SubscribesUserPosts from './components/screens/SubscribesUserPosts';

export const UserContext = createContext()

const Routing = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })
    } else {
      navigate("/signin")
    }
  }, [])
  return (
    <>
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' exact element={<Profile />} />
        <Route path='/createpost' element={<CreatePost />} />
        <Route path='/profile/:userid' element={<UserProfile />} />
        <Route path='/myfollowerspost' element={<SubscribesUserPosts />} />
      </Routes>
    </>
  )
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })
    }
  }, [])

  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Navbar />
        <Routing />
      </UserContext.Provider>
    </>
  );
}

export default App;
