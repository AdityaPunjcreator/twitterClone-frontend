import React, { useState } from "react";
import "./Login.css";
import axios from "axios"; // importing axios to make http requests
import Swal from "sweetalert2"; // importing sweetalert library to show alert
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../constant"; // importing the base URL from constant js file
import { Link } from "react-router-dom"; // importing link to enable navigation
import { useDispatch } from "react-redux";
import { loginSuccess } from "../Redux/Action/userAction"; // importing the action from redux folder

const Login = () => {
  // setting up state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loaderIcon, setLoaderIcon] = useState(false); // declaring the state variable for loadericon to render it conditionally

  const Navigate = useNavigate();
  const Dispatch = useDispatch(); // used  the dispatch to dispatch the data to the redux store to trigger the action

  // this function will be called on the submission of the form
  const handleLogin = async (event) => {
    try {
      event.preventDefault(); // preventing the default behavior of the browser
      setLoaderIcon(true); // setting the loadericon  value to true  so that is starts to show
      const requestbody = {
        email,
        password,
      }; // sending this in the payload
      // posting the data to the server
      const loginData = await axios.post(
        `${API_BASE_URL}/user/login`,
        requestbody
      );
      // performing the below action if the status is successful
      if (loginData.status === 200) {
        setLoaderIcon(false);
        // firing the alert once the user is successfully logged in
        Swal.fire({
          icon: "success",
          title: loginData.data.message,
        });
        localStorage.setItem("token", loginData.data.token); // storing the token in  localStorage
        // storing the existing user in localStorage
        localStorage.setItem(
          "existingUser",
          JSON.stringify(loginData.data.existingUser)
        );
        Dispatch(loginSuccess(loginData.data.existingUser)); // dispatching loginsuccess action
        setEmail(""); // setting the email  state variable to empty string
        setPassword(""); // setting the password state variable to empty string
        Navigate("/home"); // navigating to the home page when login is successful
      }
    } catch (error) {
      setLoaderIcon(false);
      console.log(error);

      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
      setEmail("");
      setPassword("");
    }
  };
  // creating a loader icon component
  const LoaderIcon = () => {
    return (
      <>
        <div className="row">
          <div className="col text-center">
            <div
              className="spinner-border text-primary loader-icon"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <div className="row ">
        <div className="col-sm-12 d-flex justify-content-center">
          <div className="card shadow custom-margin">
            {/* rendering the LoaderIcon component conditionally using shortcircuiting */}
            {loaderIcon && <LoaderIcon />}
            <div className="row">
              <div className="col-md-4">
                <img
                  src="https://images.unsplash.com/photo-1611162618479-ee3d24aaef0b"
                  className="img-fluid rounded-start"
                  alt="profilePic"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h4 className="card-title fw-bold mt-5 mb-3">Log in</h4>
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </form>
                  <div className="row mt-5">
                    <div className="col-sm-12 text-center">
                      Don't have an account register here?
                      <Link to="/signup">Register here</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
