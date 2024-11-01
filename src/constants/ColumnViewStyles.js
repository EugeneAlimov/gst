export const cardStyle = {
  display: "block",
  position: "relative",
  borderRadius: "20px",
  margin: "0px",
  padding: "0px",
  width: "256px",
  cursor: "pointer",
  height: "fit-content",
  "&:hover": {
    boxShadow: "3",
  },
};

export const CardContentStyle = {
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  minHeight: "24px",
  paddingTop: "8px",
  paddingX: "12px",
  paddingBottom: "4px",
};

export const boxEditOutlinedIconStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "40px",
  height: "40px",
  borderRadius: "20px",
  zIndex: 3,

  backgroundColor: "#eaeaea",
  "&:hover": {
    backgroundColor: "#dbdbdb",
  },
};

export const dialogTitle = {
  background: "linear-gradient(rgb(93, 93, 96), rgba(21, 21, 23, 0.04))",
  paddingTop: "6px",
  paddingBottom: "8px",
  cursor: "move",
  display: "inline-flex",
  flexFlow: "row",
  flexDirection: "row-reverse",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
};

export const dialogContent = {
  // maxWidth: "768px",
  // maxWidth: "fit-content",
  overflowY: "auto",
  overflowX: "hidden",
  msOverflowStyle: "none" /* IE и Edge */,
  scrollbarWidth: "none" /* Firefox */,
  "&::-webkit-scrollbar": {
    display: "none",
  },
  backgroundColor: "#f5f5f5",
  paddingX: "0px",
};

export const draggablePaper = {
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    backgroundColor: "rgba(66, 66, 70, 0.82)",
  }

  export const list = {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    alignItems: "center",
    alignContent: "center",
    width: "280px",
    overflow: "auto",
    msOverflowStyle: "none" /* IE и Edge */,
    scrollbarWidth: "none" /* Firefox */,
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }