import React, { useState } from "react";
import "./Card.css"; // importing the css file
import { FaRegThumbsUp } from "react-icons/fa"; // importing react-icons
import { FaCommentDots } from "react-icons/fa"; // importing react-icons
import { FaRegThumbsDown } from "react-icons/fa"; // importing react-icons
import { FaRetweet } from "react-icons/fa6"; // importing react-icons
import { RiDeleteBin6Line } from "react-icons/ri"; // importing react-icons
import { FaReply } from "react-icons/fa"; // importing react-icons
import Modal from "react-bootstrap/Modal"; // importing the modal from react bootstrap
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; // importing useSelector  hook  from react redux library
import axios from "axios"; // importing the axios library
import Swal from "sweetalert2"; // importing Swal from sweetalert to send alerts
import API_BASE_URL from "../constant"; // importing the base url file

const Card = (props) => {
  const user = useSelector((state) => state.userReducer.user._id); // storing the id of the user in user variable
  // declaring the state variable
  const [modalShow, setModalShow] = useState(false);
  const [comment, setComment] = useState("");

  // the below function is for liking the tweet, basically it sends a put request to the server
  const likeTheTweet = async () => {
    try {
      const requestbody = { tweetId: props.tweets._id };
      const response = await axios.put(
        `${API_BASE_URL}/liketweet`,
        requestbody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        } // sending the authorization header with the request
      );
      if (response.status === 201) {
        props.getallTweets(); // using the "props" to call the getAllTweets function
        Swal.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };

  // the below function is for disliking the tweet, basically it sends a put request to the server
  const dislikeTheTweet = async () => {
    try {
      const requestbody = { tweetId: props.tweets._id };
      const response = await axios.put(
        `${API_BASE_URL}/unliketweet`,
        requestbody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        } // sending the authorization header with the request
      );
      if (response.status === 201) {
        props.getallTweets(); // using the "props" to call the getAllTweets function
        Swal.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "disliked already",
      });
    }
  };

  // the below function is for deleting the tweet, basically it sends a delete request to the server
  const deleteTweet = async (tweetId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        }, // sending the authorization header with the request
      });
      if (response.status === 200) {
        props.getallTweets(); // using the "props" to call the getAllTweets function to refresh the result
        Swal.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {}
  };

  // this function changes the state of the modal and set the "Comment" state to empty string
  const handleModal = () => {
    setModalShow(false);
    setComment("");
  };

  // this function will be called when the user wants to send reply to a tweet
  const handleReply = async () => {
    // checking if the comment field is empty or not
    if (!comment) {
      return Swal.fire({
        icon: "error",
        title: "please enter a comment",
      });
    }
    const requestbody = {
      commentText: comment,
      tweetId: props.tweets._id,
    };
    try {
      // sending the put request to the server to add reply
      const response = await axios.put(
        `${API_BASE_URL}/addcomment`,
        requestbody,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          }, // sending the authorization header
        }
      );
      if (response.status === 201) {
        setComment("");
        handleModal();
        Swal.fire({
          icon: "success",
          title: response.data.message,
        });
        props.getallTweets();
      }
    } catch (error) {
      setComment("");
      handleModal();
    }
  };

  // this function is called when the user clicks on the retweet icon, basically sending the put request on the server
  const handleRetweet = async (tweetId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/retweet/${tweetId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        props.getallTweets();
        Swal.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      return Swal.fire({
        icon: "error",
        title: error.response.data.error,
      });
    }
  };

  return (
    // creating card with the help of bootstrap "card" class
    <div className="row">
      <div className="col d-flex justify-content-center">
        <div className="card mb-3 shadow" style={{ maxWidth: "540px" }}>
          <div className="row">
            <div className="col-md-2">
              <Link to={`/userprofile/${props.tweets.author._id}`}>
                <img
                  src={props.tweets.author.image}
                  alt="profile-image"
                  className="tweet-profile-pic ms-2 mt-2"
                />
              </Link>
            </div>
            <div className="col-md-10">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    {props.tweets.author._id === user && (
                      <div>
                        <RiDeleteBin6Line
                          className="fs-3 float-end cursor"
                          onClick={() => deleteTweet(props.tweets._id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  to={`/userprofile/${props.tweets.author._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <p className="card-title mt-2 fw-bold">
                    @ {props.tweets.author.fullname}
                    <span className="ms-3">{props.tweets.createdOn}</span>
                  </p>
                </Link>
                <p className="card-text">{props.tweets.description}</p>
                <div>
                  <img
                    src={props.tweets.image}
                    alt="postedImage"
                    height="200px"
                    width="200px"
                  />
                </div>
                <div className="my-2">
                  {user && (
                    <>
                      <span>
                        <FaRegThumbsUp
                          className="fs-5 mx-1 cursor"
                          onClick={likeTheTweet}
                        />
                      </span>
                      <span className="mx-2 fs-5">
                        {props.tweets.likes.length}
                      </span>
                      <span className="me-2">
                        <FaRegThumbsDown
                          className="fs-5 mx-1 cursor"
                          onClick={dislikeTheTweet}
                        />
                      </span>
                      <span className="me-1">
                        <FaReply
                          className="fs-5 me-1 cursor"
                          onClick={() => setModalShow(true)}
                        />
                      </span>
                      <span className="me-2 fs-5">
                        {props.tweets.comment.length}
                      </span>
                      <span>
                        <FaRetweet
                          className="fs-5 mx-1 cursor"
                          onClick={() => handleRetweet(props.tweets._id)}
                        />
                      </span>
                      <span className="mx-1 fs-5">
                        {props.tweets.retweet.length}
                      </span>
                    </>
                  )}
                  <Link to={`/replies/${props.tweets._id}`}>
                    <span className="ms-4">
                      <small>replies</small>
                      <FaCommentDots className="fs-5 mx-1 cursor" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={modalShow} onHide={handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tweet your reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            placeholder="tweet your reply..."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleReply}>
            Reply
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Card;
