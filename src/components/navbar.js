import React from "react";
import { NavLink } from "react-router-dom"; // importing NavLink from react-router-dom library to implement navigation
import "./navbar.css";
import { IoHomeOutline } from "react-icons/io5"; // importing react-icons
import { IoIosLogIn } from "react-icons/io"; // importing react-icons
import { FiLogOut } from "react-icons/fi"; // importing react-icons
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux"; // importing useSelector and useDispatch hook  from react redux library
import { useNavigate } from "react-router-dom";
import { loginFailure } from "../Redux/Action/userAction"; // importing loginFailure which i have defined in userAction.js file in Redux folder

const Navbar = () => {
  const userId = useSelector((state) => state.userReducer.user._id); // using the useSelector hook to get the userId from redux store
  const user = useSelector((state) => state.userReducer.user); // using the useSelector hook to get the user from
  const Dispatch = useDispatch(); // to trigger the action
  const Navigate = useNavigate(); // to navigate to the desired page

  const handleLogout = () => {
    try {
      // removing the token and the user form the local storage of the browser
      localStorage.removeItem("token");
      localStorage.removeItem("existingUser");
      Dispatch(loginFailure()); // triggering the action of loginFailure and updating to the initial state
      Navigate("/login"); // navigating to the login page once the user is logged out
      // using the sweetalert library to alert the user that he has logged out
      Swal.fire({
        icon: "success",
        title: "user successfully logged out",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* creating a navbar with the help of "navbar" className */}
      {/* using the "navbar-expand-md className" so that until the screen size is 768px, the "nav-item" will align itself horizontally  */}
      <nav
        className="navbar navbar-expand-lg bg-dark shadow"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <h3 className="navbar-brand brand-font">Twitter</h3>
          {/* creating  a toggle button   */}
          <button
            type="button"
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navbar"
          >
            {/* used the "navbar-toggler-icon" to give icon   */}
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* creating a collapse element */}
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link  fs-5" to="/home">
                  <span>
                    <IoHomeOutline className="fs-3" />
                  </span>
                  Home
                </NavLink>
              </li>
              {userId && (
                <li className="nav-item">
                  <NavLink className="nav-link  fs-5" to="/myprofile">
                    <span>
                      <img
                        src={user.image}
                        alt="profile-image"
                        className="navbar-profile-pic"
                      />
                    </span>
                    Profile
                  </NavLink>
                </li>
              )}
              {userId ? (
                ""
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link  fs-5" to="/login">
                    <span>
                      <IoIosLogIn className="fs-3" />
                    </span>
                    login
                  </NavLink>
                </li>
              )}

              {userId && (
                <li className="nav-item" onClick={handleLogout}>
                  <NavLink className="nav-link fs-5">
                    <span>
                      <FiLogOut className="fs-3" />
                    </span>
                    Logout
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
