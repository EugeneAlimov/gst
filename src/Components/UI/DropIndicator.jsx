import React from "react";

import Box from "@mui/material/Box";

const DropIndicator = ({ height }) => {
    return (
      <Box
        sx={{
          display: "block",
          position: "relative",
          width: "256px",
          height: `${height}px`, //"30px",
          backgroundColor: "green",
          marginY: "10px",
        }}
      />
    );
  };

export default DropIndicator