import React, { useEffect, useState } from "react";
import "./ProfileRightBar.css";
import image5 from "../Images/image5.jpg";
import image6 from "../Images/image6.jpg";

import image1 from "../Images/image1.jpg";

import addFriends from "../Images/add-user.png";
export default function ProfileRightbar() {
  return (
    <div className="Profilerightbar">
      <div className="profilerightcontainer">
        <h3>Followers</h3>
        <div>
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: 10,
                cursor: "pointer",
              }}
            >
              <img src={`${image1}`} className="Friendsimage" alt="" />
              <p style={{ textAlign: "start", marginLeft: "10px" }}>
                Rogelio Umbay
              </p>
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: 10,
                cursor: "pointer",
              }}
            >
              <img src={`${image1}`} className="Friendsimage" alt="" />
              <p style={{ textAlign: "start", marginLeft: "10px" }}>
                Jade Ballester
              </p>
            </div>
          </div>

          <div className="rightcontainer2">
            <h3 style={{ textAlign: "start", marginLeft: "10px" }}>
              Suggested for you
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
