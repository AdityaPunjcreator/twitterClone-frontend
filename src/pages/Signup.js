import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../constant";

const Signup = () => {
  // setting up state variables
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loaderIcon, setLoaderIcon] = useState(false); // declaring the state variable for loadericon to render it conditionally

  const Navigate = useNavigate();

  // the below function will be called when the registration form is submitted
  const handleregistration = async (event) => {
    try {
      event.preventDefault();
      setLoaderIcon(true);
      const requestbody = {
        fullname,
        email,
        password,
        confirmPassword,
      };
      const signUpresponse = await axios.post(
        `${API_BASE_URL}/user/signup`,
        requestbody
      );
      if (signUpresponse.status === 201) {
        setLoaderIcon(false);
        Swal.fire({
          icon: "success",
          title: signUpresponse.data.message,
        });
        setFullname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        Navigate("/login");
      }
    } catch (error) {
      setLoaderIcon(false);
      console.log(error);
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
      setFullname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };
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
                  src="https://images.unsplash.com/photo-1611605698335-8b1569810432"
                  className="img-fluid rounded-start"
                  alt="profilePic"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h4 className="card-title fw-bold mb-3">Sign Up</h4>
                  <form onSubmit={handleregistration}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="fullname"
                        value={fullname}
                        onChange={(event) => setFullname(event.target.value)}
                      />
                    </div>
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
                      <small>(password should be 8 characters atleast)</small>
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="confirm password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      SignUp
                    </button>
                  </form>
                  <div className="row mt-5">
                    <div className="col-sm-12 text-center">
                      Already have an account?
                      <Link to="/login">Login</Link>
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

export default Signup;
