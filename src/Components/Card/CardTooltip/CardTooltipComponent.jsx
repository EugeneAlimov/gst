import React from "react";

import Tooltip from "@mui/material/Tooltip";

export default function CardTooltipComponent() {
  return (
    <Tooltip title="Add" placement="bottom">
      <Button>bottom</Button>
    </Tooltip>
  );
}
