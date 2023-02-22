import React, { useEffect } from "react";
import "./ProfileMainPost.css";
import Coverimage from "../Images/Profile.png";

export default function ProfileMainPost() {
  return (
    <div className="ProfilemainPostContainer">
      <div>
        <img src={`${Coverimage}`} className="profileCoverimage" alt="" />
        <h2
          style={{
            marginTop: -43,
            color: "white",
            textAlign: "start",
            marginLeft: "34px",
          }}
        >
          Your Profile
        </h2>
      </div>
      <ContentPost />
    </div>
  );
}
