import React from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PushPinIcon from '@mui/icons-material/PushPin';
import FestivalIcon from '@mui/icons-material/Festival';
import BookIcon from '@mui/icons-material/Book';
import CreateIcon from '@mui/icons-material/Create';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

const PinBox = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "relative",
  width: "2rem",
  height: "3rem",
  marginTop: "-3rem",
  left: "-1rem",
  filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))"
}));

interface IconBoxProps {
  color?: string;
  isFocused?: boolean;
}
const IconBox = styled(Box)<IconBoxProps>(({ theme, color = "pinDefault", isFocused = false }) => ({
  display: "flex",
  position: "absolute",
  width: "calc(2rem - 4px)",
  height: "calc(2rem - 4px)",
  fontSize: "1rem",
  color: isFocused ? theme.palette.primary.main : "currentColor",
  backgroundColor: isFocused ? "#000" : "currentColor",
  borderTop: `2px solid ${theme.palette.primary.main}`,
  borderLeft: `2px solid ${theme.palette.primary.main}`,
  borderRight: `2px solid ${theme.palette.primary.main}`,
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  top: "0",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  '&::after': {
    content: "''",
    position: "absolute",
    top: "20px",
    width: "calc(1rem)",
    height: "calc(1rem)",
    clear: "both",
    transform: "rotate(45deg)",
    backgroundColor: theme.palette.primary.main,
    zIndex: "-1"
  },
  '> svg': {
    display: "block",
    width: "22px",
    height: "22px",
  }
}));

interface LabelBoxProps {
  color?: string;
}

const LabelBox = styled(Box)<LabelBoxProps>(({ theme, color = "pinDefault" }) => ({
  display: "flex",
  position: "absolute",
  fontFamily: '"Chakra Petch", sans-serif',
  fontWeight: "400",
  fontSize: "0.5rem",
  textTransform: "uppercase",
  color: "#fff",
  backgroundColor: theme.palette.primary.main,
  top: "0",
  left: "2rem",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  padding: "4px 1rem"
}));

interface MapMarkerProps {
  lat: number;
  lng: number;
  id: string;
  tags?: string;
  focus?: boolean;
  showLabel?: boolean;
  name_short?: string;
}

export default function MapMarker({ lat, lng, id, tags = "", focus = false, showLabel = false, name_short = "" }: MapMarkerProps) {
  const theme = useTheme();
  const [iconData, setIconData] = React.useState<{ icon: React.ReactNode; color: string }>({ icon: null, color: "pinDefault" });

  React.useEffect(() => {
    const tagIconMap: Record<string, { color: "primary" | "secondary" | "error" | "info" | "success"; Icon: typeof PushPinIcon }> = {
      Venue: { color: 'secondary', Icon: FestivalIcon },
      Bookshop: { color: 'info', Icon: BookIcon },
      Cafe: { color: 'success', Icon: CreateIcon },
      Library: { color: 'error', Icon: LocalLibraryIcon },
      Interesting: { color: 'primary', Icon: PushPinIcon },
    };
    const tagArray = tags.split(",");
    const tag = tagArray.find((tag: string) => tagIconMap.hasOwnProperty(tag));
    const { color: iconColor, Icon } = tag ? tagIconMap[tag] : { color: 'primary', Icon: PushPinIcon };
  const icon = <Icon color={iconColor as "primary" | "secondary" | "error" | "info" | "success" | "action" | "disabled" | "warning" | "inherit"} />;
    setIconData({ icon, color: iconColor });
  }, [id, tags]);

  const handleClick = () => {
    // You can add a callback here for pin click
  };

  return (
    <PinBox className="sff-map-pin" onClick={handleClick}>
      <IconBox color={iconData.color} className="sff-map-icon">{iconData.icon}</IconBox>
      {showLabel && (
        <LabelBox color={iconData.color} className="sff-map-label">
          <Typography component="p">{name_short}</Typography>
        </LabelBox>
      )}
    </PinBox>
  );
}
