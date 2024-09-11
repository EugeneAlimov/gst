import { styled } from "@mui/system";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

export const TextareaCardDescription = styled(BaseTextareaAutosize)(
  () => `
    box-sizing: border-box;
    width: 95%;
    height: fit-content;
    font-family: 'Roboto';
    font-size: 16px;
    font-weight: 400;
    padding: 0px 6px;
    border-radius: 4px;
    color: #172b4d;
    border: 0px;
    resize: none;
    letter-spacing: 0.7px;
    line-height: 1.4;
    &:hover {
      border-color: #3399FF;
    }
    
   &:focus {
      background: #fff;
      outline: 0;
      border-color: #3399FF;
      box-shadow: 0 0 0 3px #b6daff;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export const TextareaColumnName = styled(BaseTextareaAutosize)(
  () => `
    box-sizing: border-box;
    width: 95%;
    height: fit-content;
    font-family: 'Roboto';
    font-size: 16px;
    font-weight: 400;
    padding: 0px 6px;
    border-radius: 4px;
    color: #172b4d;
    border: 0px;
    resize: none;
    text-align: center;

    &:hover {
      border-color: #3399FF;
    }
    
   &:focus {
      background: #fff;
      outline: 0;
      border-color: #3399FF;
      box-shadow: 0 0 0 3px #b6daff;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export const TextareaCardName = styled(BaseTextareaAutosize)(
  () => `
    box-sizing: border-box;
    width: 95%;
    height: fit-content;
    font-family: 'Roboto';
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    padding: 0px 6px;
    border-radius: 4px;
    color: #172b4d;
    background-color: #f5f5f5;
  
    border: 0px;
    resize: none;
    &:hover {
      border-color: #3399FF;
    }
    
   &:focus {
      background: #fff;
      outline: 0;
      border-color: #3399FF;
      box-shadow: 0 0 0 3px #b6daff;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export const TextareaChkListText = styled(BaseTextareaAutosize)(
  () => `
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    font-family: 'Roboto';
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    padding: 0px 6px;
    border-radius: 4px;
    color: #172b4d;
    background-color: #f5f5f5;
  
    border: 0px;
    resize: none;
    &:hover {
      border-color: #3399FF;
    }
    
      background: #fff;
      outline: 0;
      border-color: #3399FF;
      box-shadow: 0 0 0 3px #b6daff;
    }
  
      outline: 0;
  `
);

export const boxStyle = {
  minWidth: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  aligneContent: "center",
  justifyContent: "space-between",
};

export const typographyStyle = {
  verticalAligne: "top",
  overflow: "visible",
  fontSize: "12px",
  fontWeight: "400",
  lineHeight: "1.4",
};

export const iconStyle = {
  overflow: "visible",
  fontSize: "18px",
};

export const mainContainer = {
  display: "block",
  position: "relative",
  width: "768px",
  // borderRadius: "20px",
  margin: "0px",
  backgroundColor: "#f5f5f5",
  // boxShadow: "1",
  // marginY: "20px",
  paddingRight:"8px",
};

export const cardMedia = {
  // maxHeight: "120px",
  marginBottom: "10px",
  // borderTopRightRadius: "10px",
  // borderTopLeftRadius: "10px",
};
export const typographyCardName = {
  cursor: "default",
  fontSize: "20px",
  fontWeight: "400",
  color: "#172b4d",
  width: "100%",
  padding: "3px",
};

export const typographyOnTheColumn = {
  marginTop: "12px",
  cursor: "default",
  fontSize: "20px",
  color: "#172b4d",
};

export const icon = {
  marginTop: "0px",
  position: "absolute",
  left: "20px",
};

export const linkOnTheColumn = {
  textDecoration: "underline",
  textDecorationColor: "#172b4d",
  fontSize: "16px",
  fontWeight: "400",
  color: "#172b4d",
  role: "button",
  cursor: "pointer",
};

export const basicOperationsWithCard = {
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  alignItems: "flex-start",
  width: "478px",
};

export const avatarBox = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
};

export const cheepsBox = {
  marginBottom: "15px",
  width: "478px", //"100%",
  backgroundColor: "#e1e1e14f",
  borderRadius: "4px",
  boxShadow: "1",
  padding: "5px",
};

export const text = {
  cursor: "default",
  fontSize: "20px",
  color: "#172b4d",
  width: "100%",
  padding: "3px",
};

export const addIconButton = {
  margin: "2px",
  width: "48px",
  height: "32px",
  borderRadius: "4px",
  transition: "all .05s ease-in-out",
  backgroundColor: "#c1c1c18a",
  "&:hover": {
    backgroundColor: "#9b99998a",
    transform: "scale(1.005)",
  },
};

export const cardActionsMainContainer = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  width: "350px",
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  padding: "5px",
};

export const cardActionsContainer = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  width: "100%",
  marginBottom: "15px",
  borderRadius: "3px",
  paddingX: "10px",
  paddingBottom: "10px",
  boxShadow: "1",
};

export const cardSubscrContainer = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  borderRadius: "3px",
};

export const cardComplContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    borderRadius: "3px",
    paddingX: "10px",
    paddingBottom: "10px",
    boxShadow: "1",
}