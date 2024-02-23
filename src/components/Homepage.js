import React, { useState, useEffect } from "react";
import Card from "./Card"; // importing the Card component
import Tweet from "./Tweet"; // importing the Tweet component
import "./Homepage.css"; // importing the css file
import axios from "axios"; // importing the axios library
import API_BASE_URL from "../constant"; // importing the base url file

const Homepage = () => {
  // setting up the state variable
  const [alltweets, setAllTweets] = useState([]); // setting the initial state of alltweets as empty array

  // creatign a function to get all tweets  from all the users

  const getallTweets = async () => {
    try {
      const tweetsdata = await axios.get(`${API_BASE_URL}/getalltweet`);

      if (tweetsdata.status === 200) {
        setAllTweets(tweetsdata.data.allTweets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallTweets();
  }, []); // using the useEffect hook to call the function when the component mount

  return (
    <div className="container ">
      <div className="row">
        <Tweet getallTweets={getallTweets} />
        {/* here i am using the map function to loop over all the item of the alltweets array which is containing the data  */}
        {alltweets.map((tweet) => {
          return (
            <div key={tweet._id}>
              <Card tweets={tweet} getallTweets={getallTweets} />
              {/* passing the item of the array and function  as props  */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Homepage;
