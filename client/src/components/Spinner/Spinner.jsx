import React from "react";
import { useState } from "react";
import { css } from "@emotion/react";
import { PropagateLoader } from "react-spinners";

const Spinner = () => {
  //For Screen Loader
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ textAlign: "center" }}>
      <PropagateLoader color={"black"} loading={loading} size={20} />
    </div>
  );
};

export default Spinner;
