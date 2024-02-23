import React, { useState, useEffect } from "react"; // importing React , (useEffect and useState hook) from React library
import axios from "axios"; // importing the axios library
import API_BASE_URL from "../constant"; // importing the base url file
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom

const Allreplies = () => {
  // declaring the state variable
  const [comment, setComment] = useState([]); // setting the initial state of comment as empty array
  const { tweetId } = useParams(); // Extract tweetId from URL parameters

  // this function is called to get all the replies on a tweet from a user
  const getAllReplies = async (tweetId) => {
    try {
      const allReplies = await axios.get(
        `${API_BASE_URL}/allcomments/${tweetId}`
      );

      if (allReplies.status === 200) {
        setComment(allReplies.data.allComments.comment);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllReplies(tweetId); // passing the tweetId in the argument while calling the function
  }, []); //// using the useEffect hook to call the function when the component mount

  return (
    // taking the use of "media object" to create comment from bootstrap"
    <>
      {/* here i am using the map function to loop over all the item of the comment array which is containing the data  */}
      {comment.map((commentdata) => {
        return (
          <div className="row mt-2" key={commentdata._id}>
            <div className="col my-2">
              <div class="d-flex shadow">
                <div class="flex-shrink-0">
                  <img
                    src={commentdata.commentedBy.image}
                    alt="profile-pic"
                    className="tweet-profile-pic"
                  />
                </div>
                <div class="flex-grow-1 ms-3">
                  <h5>
                    @{commentdata.commentedBy.fullname}-
                    <small>commented on-</small>
                    {commentdata.createdOn}
                  </h5>
                  <p>{commentdata.commentText}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Allreplies; // exporting the component
