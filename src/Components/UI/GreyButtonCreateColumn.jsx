//import MUI components
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

const GreyButtonCreateColumn = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(grey[500]),
  backgroundColor: grey[500],
  borderColor: "#fff",
  border: "1px",
  "&:hover": {
    borderColor: "#fff",
    border: "1px",

    color: theme.palette.getContrastText(grey[700]),
    backgroundColor: grey[700],
  },
}));

export default GreyButtonCreateColumn;
