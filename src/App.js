import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // importing this library to enable routing to different components in the browser
import Login from "./pages/Login"; // importing Login component
import Signup from "./pages/Signup"; // importing Signup component
import Homepage from "./components/Homepage"; // importing Homepage component
import Profile from "./components/profile"; // importing Profile component
import Navbar from "./components/navbar"; // importing Navbar component
import Allreplies from "./components/Allreplies";
import Userprofile from "./components/Userprofile"; // importing Userprofile component"
import "./App.css";
import { useDispatch } from "react-redux"; // import useDispatch from  react-redux library
import { loginFailure, loginSuccess } from "./Redux/Action/userAction"; // import loginSuccess, loginFailure
import { useNavigate } from "react-router-dom"; // import useNavigate from react-router-dom library

// created a component  here using arrow function
const App = () => {
  // we want to maintain the same state of the user if the page is refreshed and also disable navigation from URL

  function Dynamicrouting() {
    const Dispatch = useDispatch(); // used  the dispatch to dispatch the data to the redux store to trigger the action
    const Navigate = useNavigate(); // used this to navigate to the desired page

    // the same state of the application should be maintained ,when the user refreshes the page,

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("existingUser")); // parsing the data to convert from string to object
      if (userData) {
        Dispatch(loginSuccess(userData)); // dispatching the login success action if user exists, that is asking the application not to change the state when the page refreshes
      } else {
        // the below code will run in case the user is not logged in
        localStorage.removeItem("token"); // removing the token from localStorage
        localStorage.removeItem("existingUser"); // removing the existing user from localStorage
        Dispatch(loginFailure()); // dispatching the login failure action
        Navigate("/login"); // navigating to login page in case user is not found
      }
    }, []); // Empty dependency array to run the effect only once

    return (
      // implementing the routers
      <>
        <Routes>
          {/* using the "exact" to match the exact route */}
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/signup" element={<Signup />}></Route>
          <Route exact path="/home" element={<Homepage />}></Route>
          <Route exact path="/myprofile" element={<Profile />}></Route>
          <Route
            exact
            path="/replies/:tweetId"
            element={<Allreplies />}
          ></Route>
          <Route
            exact
            path="/userprofile/:authorId"
            element={<Userprofile />}
          ></Route>
        </Routes>
        ;
      </>
    );
  }

  return (
    // implementing the routing thing, basically if the paths are exactly that the user will be redirected to that component
    <Router>
      <Navbar />
      <Dynamicrouting />
    </Router>
  );
};

export default App;
