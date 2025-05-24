import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

export default function ChangeChip({ setNewChipColorHandle, color, chipStyle, isSelected }) {
  const buttonStyle = {
    width: "48px",
    height: "32px",
    borderRadius: "4px",
    transition: "all .05s ease-in-out",
    backgroundColor: color.normal,
    border: isSelected ? "3px solid #000" : "1px solid #ddd",
    "&:hover": {
      backgroundColor: color.hover,
      transform: "scale(1.05)",
    },
  };

  return (
    <Tooltip
      title={
        <Typography
          sx={{
            ...chipStyle.typographyStyle,
            color: "#fff",
            width: "fit-content",
          }}
          paragraph={true}
        >
          Цвет: {color.colorName}
        </Typography>
      }
      followCursor
      placement="bottom"
    >
      <IconButton size="small" sx={buttonStyle} onClick={() => setNewChipColorHandle(color)} />
    </Tooltip>
  );
}
