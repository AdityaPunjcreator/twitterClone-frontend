import React, { useState } from "react";
import Modal from "react-bootstrap/Modal"; // importing the modal component from react bootstrap
import { IoImagesOutline } from "react-icons/io5"; // this is the icon that i am importing form react-icons
import axios from "axios";
import Swal from "sweetalert2";
import API_BASE_URL from "../constant";
import { useSelector } from "react-redux";

// passing the data from Homepage.js component to Tweet componet using props
const Tweet = (props) => {
  const user = useSelector((state) => state.userReducer.user._id); // storing the id of the user in user variable

  const [modalShow, setModalShow] = useState(false);
  const [loaderIcon, setLoaderIcon] = useState(false); // declaring the state variable for loadericon to render it conditionally
  const [imagepreview, setImagePreview] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  //  the below function will be called when the user click on "cross" icon
  const hideModal = () => {
    setModalShow(false);
    setDescription("");
    setImage("");
  };

  // the below function will be called on "onChange" event
  const handleImagePreview = (event) => {
    const selectedImage = event.target.files[0];
    // checking if the image exists or not and then accordingly setting it to the imagepreview state variabale
    setImage(selectedImage);
    if (selectedImage) {
      const previewURL = URL.createObjectURL(selectedImage);
      setImagePreview(previewURL);
    } else {
      setImagePreview("");
    }
  };

  // below function will be called when the user clicks on "remove" button in modal and it will close the modal too
  const imageRemover = () => {
    setImagePreview("");
    hideModal();
  };

  // the below function is used to post image

  const handleImageSubmission = async () => {
    // creating the form data which will be sent to the server
    const imageData = new FormData(); // creating a form data
    imageData.append("image", image);
    try {
      const imageUploadData = await axios.post(
        `${API_BASE_URL}/upload`,
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }, // sending the image data
        }
      );
      return imageUploadData;
    } catch (error) {
      console.log(error);
    }
  };

  // here i am writing a functon which will be called on the click of the "submit button", which is used to update the profile
  const handleEditPost = async () => {
    // adding frontend validation to check if the description and image is there or not
    if (!description) {
      return Swal.fire({
        icon: "error",
        title: "name is required",
      });
    } else if (!image) {
      return Swal.fire({
        icon: "error",
        title: " image is required",
      });
    }
    setLoaderIcon(true); // setting the loadericon to true
    // sending the request body to the server
    const imageResponse = await handleImageSubmission();
    const requestBody = {
      description,
      image: `${API_BASE_URL}/download/${imageResponse.data.filename}`, // here i am providing the url to get the image from the server
    };
    try {
      const tweetData = await axios.post(
        `${API_BASE_URL}/addtweet`,
        requestBody,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          }, // sending the authorization header with the request
        }
      );
      if (tweetData.status === 201) {
        setLoaderIcon(false);
        setDescription("");
        setImage("");
        setImagePreview("");
        hideModal();
        props.getallTweets();
        Swal.fire({
          icon: "success",
          title: tweetData.data.message,
        });
      }
    } catch (error) {
      setLoaderIcon(false);
      console.log(error);
      setDescription("");
      setImage("");
      setImagePreview("");
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };
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
    <div className="row my-3">
      {user && (
        <div className="col-sm-8">
          <button
            className="btn btn-primary float-end"
            onClick={() => setModalShow(true)}
          >
            Tweet
          </button>
        </div>
      )}
      <Modal
        show={modalShow}
        onHide={hideModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/*  creating a modal here */}
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4>New Tweet</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loaderIcon && <LoaderIcon />}
          <form>
            <textarea
              className="form-control my-3"
              placeholder="write your tweet here..."
              value={description}
              onChange={(event) => setDescription(event.target.value)} // using the onChange event handler to set the value to what is input by the user
            ></textarea>
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
          <button className="btn btn-primary" onClick={handleEditPost}>
            Post
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tweet;
