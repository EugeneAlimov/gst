import React from "react";
import CardMedia from "@mui/material/CardMedia";
import img1 from "../../../static/images/img1.png";

export default function CardImage() {
  return (
    <CardMedia
      sx={{ paddingBottom: "4px", zIndex: "10",}}
      component="img"
      // image="https://slp-statics.astockcdn.net/static_assets/staging/24winter/home/curated-collections/card-2.jpg?width=580"
      image={img1}
      alt="Paella dish"
    />
  );
}
