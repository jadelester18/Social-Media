import React from "react";
import { useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  //For Screen Loader
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ textAlign: "center" }}>
      <InfinitySpin color={"black"} loading={loading} size={20} />
    </div>
  );
};

export default Loader;
