import React, { useState, useEffect } from "react";
import "./Userprofile.css";
import axios from "axios";
import Swal from "sweetalert2";
import API_BASE_URL from "../constant";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom
import { useSelector } from "react-redux"; // Import useSelector hook from react redux

const Userprofile = () => {
  const user = useSelector((state) => state.userReducer.user._id); // storing the id of the user in user variable

  const [profile, setProfile] = useState([]); // setting the initial state of the profile as empty array
  const [isFollowing, setIsFollowing] = useState(false); // setting the initial state of  isFollowing as false
  const { authorId } = useParams(); // Extract authorId from URL parameters

  // the below function will be called when the user click on follow  button
  const handleFollow = async (authorId) => {
    try {
      const followUser = await axios.put(
        `${API_BASE_URL}/user/follow/${authorId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }, //  sending the authorization header with the request , which startas with Bearer
        }
      );
      if (followUser.status === 201) {
        setIsFollowing(true); // Setting the state to true after successful follow
        getUserProfile(authorId); // here i am calling the getUserProfile function so that all updated value is visible to the user
        Swal.fire({
          icon: "success",
          title: followUser.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };

  // // the below function will be called when the user click on unfollow  button
  const handleUnfollow = async (authorId) => {
    try {
      const unfollowUser = await axios.put(
        `${API_BASE_URL}/user/unfollow/${authorId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (unfollowUser.status === 201) {
        setIsFollowing(false); // Setting the state to false after successful unfollow
        getUserProfile(authorId);
        Swal.fire({
          icon: "success",
          title: unfollowUser.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };

  // the below function will check that if the logged in user is a follower of the author who has posted that tweet
  const checkFollowingStatus = async (authorId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/checkfollowing/${authorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsFollowing(response.data.isFollowing); // setting the state of isFollowing with the response we are getting from the server
    } catch (error) {
      console.log(error);
    }
  };

  // the below function is used to get the user profile from the server
  const getUserProfile = async (authorId) => {
    try {
      const profileData = await axios.get(
        `${API_BASE_URL}/profile/${authorId}`
      );
      if (profileData.status === 200) {
        setProfile(profileData.data.userDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // using the useEffect hook to call the fucntion in it when the component mounts
  useEffect(() => {
    getUserProfile(authorId);
    checkFollowingStatus(authorId);
  }, []);

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col d-flex justify-content-center">
          <div className="card mb-3" style={{ maxWidth: "540px" }}>
            {/* this is a div having a class of "custom-div" to style it */}
            <div className="custom-div"></div>
            <div className="card-body">
              <img
                src={profile.length > 0 ? profile[0].author.image : ""} // here i am checking if the length of the profile array is greater than 0, if it is then the action will be carried out
                alt="profile-pic"
                className="user-profile-pic"
              />
              {/*here i am rendering the component conditionally based on the fact that the user has logged in or not  */}
              {user && (
                <>
                  {/* here i am checking if "isFollowing is true or false", and based on this condition, loading the two button  */}
                  {isFollowing ? (
                    // Render Unfollow button if user is already following
                    <span
                      className="btn btn-warning float-end"
                      onClick={() => handleUnfollow(authorId)} //the  function will be called on click event
                    >
                      Unfollow
                    </span>
                  ) : (
                    // Render Follow button if user is not following
                    <span
                      className="btn btn-primary float-end"
                      onClick={() => handleFollow(authorId)}
                    >
                      Follow
                    </span>
                  )}
                </>
              )}

              <div className="card-title">
                <h5>{profile.length > 0 ? profile[0].author.fullname : ""}</h5>
                <p>{profile.length > 0 ? profile[0].author.email : ""}</p>
                <p>{profile.length > 0 ? profile[0].author.createdOn : ""} </p>
                <p>
                  <span className="fw-bold me-3">
                    Followers:
                    {profile.length > 0
                      ? profile[0].author.followers.length
                      : 0}
                  </span>
                  <span className="fw-bold">
                    Following:
                    {profile.length > 0
                      ? profile[0].author.following.length
                      : 0}
                  </span>
                </p>
              </div>

              <h5 className="card-text text-center">Tweets</h5>
            </div>
            <hr />
            {/* here i am using the map function to loop over all the item of the profile array which is containing the data  */}
            {profile.map((items) => {
              return (
                <div className="row" key={items._id}>
                  <div className="col d-flex justify-content-center">
                    <div
                      className="card mx-2   mb-3 shadow"
                      style={{ maxWidth: "400px" }}
                    >
                      <div className="row">
                        <div className="col-md-2">
                          <img
                            src={items.author.image}
                            alt="profile-image"
                            className="tweet-profile-pic ms-2 mt-2"
                          />
                        </div>
                        <div className="col-md-10">
                          <div className="card-body">
                            <div className="row">
                              <div className="col"></div>
                            </div>

                            <p className="card-title fw-bold">
                              @ {items.author.fullname} ||
                              <span className="ms-2">
                                {items.author.createdOn}
                              </span>
                            </p>

                            <p className="card-text">{items.description}</p>
                            <div>
                              <img
                                src={items.image}
                                alt="postedImage"
                                height="200px"
                                width="200px"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
