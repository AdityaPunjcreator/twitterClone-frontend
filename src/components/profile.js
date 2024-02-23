import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal"; // importing the modal from react bootstrap
import { IoImagesOutline } from "react-icons/io5"; // importing the icons from reacticons library
import axios from "axios"; // importing the axios library
import Swal from "sweetalert2"; // importing Swal from sweetalert to send alerts
import API_BASE_URL from "../constant";
import { useSelector, useDispatch  } from "react-redux"; // importing useSelector and useDispatch hook  from react redux library
import { loginSuccess } from "../Redux/Action/userAction"; // importing the action from redux folder


const Profile = () => {
  const user = useSelector((state) => state.userReducer.user); // storing the id of the user in user variable
  const Dispatch = useDispatch(); // used  the dispatch to dispatch the data to the redux store to trigger the action
  console.log(user);
  const [modalShow, setModalShow] = useState(false);
  const [imagepreview, setImagePreview] = useState("");
  const [loaderIcon, setLoaderIcon] = useState(false); // declaring the state variable for loadericon to render it conditionally
  // declaring the state varables
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  const [profile, setProfile] = useState([]);

  //  the below function will be called when the user click on "cross" icon
  const hideModal = () => {
    setModalShow(false);
    setFullname("");
    setEmail("");
    setImage("");
  };

  // the below function is triggered with the onchange event and is used for image previewing
  const handleImagePreview = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
    if (selectedImage) {
      const previewURL = URL.createObjectURL(selectedImage);
      setImagePreview(previewURL);
    } else {
      setImagePreview("");
    }
  };

  // this function wil remove the preview image and close the modal as well
  const imageRemover = () => {
    setImagePreview("");
    hideModal();
  };

  // this function will send the file to the server
  const handleImageSubmission = async () => {
    // creating the form data which will be sent to the server
    const imageData = new FormData();
    imageData.append("image", image);

    try {
      const imageUploadData = await axios.post(
        `${API_BASE_URL}/upload`,
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return imageUploadData;
    } catch (error) {
      console.log(error);
    }
  };

  // here i am writing a functon which will be called on the click of the "submit button", which is used to update the profile
  const handleEditProfile = async () => {
    // adding frontend validation
    if (!fullname) {
      return Swal.fire({
        icon: "error",
        title: "name is required",
      });
    } else if (!email) {
      return Swal.fire({
        icon: "error",
        title: "email is required",
      });
    } else if (!image) {
      return Swal.fire({
        icon: "error",
        title: "image is required",
      });
    }
    setLoaderIcon(true); // setting the loadericon to true
    // sending the request body to the server
    const imageResponse = await handleImageSubmission();
    const requestBody = {
      fullname,
      email,
      image: `${API_BASE_URL}/download/${imageResponse.data.filename}`, // here i am providing the url to get the image from the server
    };
    try {
      const profileUpdateData = await axios.put(
        `${API_BASE_URL}/user/editprofile`,
        requestBody,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          }, // sending the authorization header with the request
        }
      );
      // when the status of the response is 201 the below action will be executed
      if (profileUpdateData.status === 201) {
        setLoaderIcon(false);
        setFullname("");
        setEmail("");
        setImage("");
        setImagePreview("");
        hideModal();
        // also setting up the updated profile in the local storage
        localStorage.setItem(
          "existingUser",
          JSON.stringify(profileUpdateData.data.updateProfile)
        );
        Dispatch(loginSuccess(profileUpdateData.data.updateProfile)); // dispatching the data to update the use state
        Swal.fire({
          icon: "success",
          title: profileUpdateData.data.message,
        });
      }
    } catch (error) {
      setLoaderIcon(false);
      console.log(error);
      setFullname("");
      setEmail("");
      setImage("");
      setImagePreview("");
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };

  // writing a function to get the userprofile

  const getMyProfile = async () => {
    try {
      const profiledata = await axios.get(`${API_BASE_URL}/getmytweet`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      if (profiledata.status === 200) {
        setProfile(profiledata.data.myTweets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []); // using the useEffect hook to call the function when the component mount

  // creating a component for the loader icon

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
      <div className="row mt-3">
        <div className="col d-flex justify-content-center">
          <div className="card mb-3" style={{ maxWidth: "540px" }}>
            <div className="custom-div"></div>
            <div className="card-body">
              <img
                src={user.image}
                alt="profile-pic"
                className="user-profile-pic"
              />
              <span
                className="btn btn-primary float-end"
                onClick={() => setModalShow(true)}
              >
                Edit profile
              </span>
              <div className="card-title">
                <h5>{user.fullname}</h5>
                <p>{user.email}</p>
                <p>
                  <span className="fw-bold">created On-</span> {user.createdOn}{" "}
                </p>
                <p>
                  <span className="fw-bold me-3">
                    {/* here i am checking the length of profile array, if it is greater than 0 then getting its length */}
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
                      className="card mx-2 mb-3 shadow"
                      style={{ maxWidth: "400px" }}
                    >
                      <div className="row">
                        <div className="col-md-2">
                          <img
                            src={user.image}
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
                              @ {items.author.fullname}- created On{" "}
                              {items.createdOn}
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
      {/*  creating a modal here */}
      <Modal
        show={modalShow}
        onHide={hideModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4>Edit Profile</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loaderIcon && <LoaderIcon />}
          <form>
            <input
              type="text"
              className="form-control my-2"
              placeholder="name"
              value={fullname}
              onChange={(event) => setFullname(event.target.value)}
            />
            <input
              type="text"
              className="form-control my-2"
              placeholder="email id"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <div>
              <IoImagesOutline className="fs-2 icon-position" />
            </div>
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              className="customize-input my-2"
              onChange={handleImagePreview}
            />
            <div>
              {imagepreview && (
                <>
                  <img
                    src={imagepreview}
                    alt="image"
                    height="250px"
                    width="250px"
                  />
                  <button
                    className="btn btn-warning"
                    onClick={() => imageRemover()}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleEditProfile}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
