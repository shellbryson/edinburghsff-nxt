"use client";
import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY || process.env.VITE_GOOGLEMAPS_API_KEY || "";

import GoogleMap from "google-maps-react-markers";

import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Icons
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

const IconBox = styled(({ isFocused, ...otherProps }) => <Box {...otherProps} />)(({ theme, color, isFocused }) => ({
  display: "flex",
  position: "absolute",
  width: "calc(2rem - 4px)",
  height: "calc(2rem - 4px)",
  fontSize: "1rem",
  color: isFocused ? theme.palette[color]?.main || "currentColor" : "currentColor",
  backgroundColor: isFocused ? "#000" : "currentColor",
  borderTop: `2px solid ${theme.palette[color]?.main || "#888"}`,
  borderLeft: `2px solid ${theme.palette[color]?.main || "#888"}`,
  borderRight: `2px solid ${theme.palette[color]?.main || "#888"}`,
  borderBottom: `2px solid ${theme.palette[color]?.main || "#888"}`,
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
    backgroundColor: theme.palette[color]?.main || "#888",
    zIndex: "-1"
  },
  '> svg': {
    display: "block",
    width: "22px",
    height: "22px",
  }
}));

const LabelBox = styled(Box)(({ theme, color }) => ({
  display: "flex",
  position: "absolute",
  fontFamily: '"Chakra Petch", sans-serif',
  fontWeight: "400",
  fontSize: "0.5rem",
  textTransform: "uppercase",
  color: theme.palette.brand?.contrastText || "#fff",
  backgroundColor: theme.palette[color]?.main || "#888",
  top: "0",
  left: "2rem",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  padding: "4px 1rem"
}));

function MapMarker({ lat, lng, ...data }) {
  const theme = useTheme();
  const [iconData, setIconData] = React.useState({ icon: null, color: "pinDefault" });

  React.useEffect(() => {
    if (!data.tags) return;
    const tagIconMap = {
      Venue: { color: 'pinVenue', Icon: FestivalIcon },
      Bookshop: { color: 'pinBookshop', Icon: BookIcon },
      Cafe: { color: 'pinCafe', Icon: CreateIcon },
      Library: { color: 'pinLibrary', Icon: LocalLibraryIcon },
      Interesting: { color: 'pinInteresting', Icon: PushPinIcon },
    };
    const tagArray = data.tags.split(",");
    const tag = tagArray.find(tag => tagIconMap.hasOwnProperty(tag));
    const { color: iconColor, Icon } = tag ? tagIconMap[tag] : { color: 'pinDefault', Icon: PushPinIcon };
    const icon = <Icon color={iconColor === 'pinDefault' ? 'brand' : iconColor} />;
    setIconData({ icon, color: iconColor });
  }, [data.id]);

  const handleClick = () => {
    // You can add a callback here for pin click
  };

  return (
    <PinBox className="sff-map-pin" onClick={handleClick}>
      <IconBox color={iconData.color} isFocused={!!data.focus} className="sff-map-icon">{iconData.icon}</IconBox>
      {data.showLabel && (
        <LabelBox color={iconData.color} className="sff-map-label">
          <Typography component="p">{data.name_short}</Typography>
        </LabelBox>
      )}
    </PinBox>
  );
}

export default function Home() {
  const [markers, setMarkers] = useState<Array<{ id: string; lat: number; lng: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Firebase only once
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    async function fetchMarkers() {
      const snapshot = await getDocs(collection(db, "locations"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMarkers(data as Array<{ id: string; lat: number; lng: number }>);
      setLoading(false);

      console.log("Fetched markers:", data);
    }
    fetchMarkers();
  }, []);
  if (loading) return <div>Loading map and markers...</div>;

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <GoogleMap
        apiKey={GOOGLE_MAPS_API_KEY}
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat: 55.9533, lng: -3.1883 }}
        defaultZoom={12}
      >
        {markers.map(marker => (
          <MapMarker key={marker.id} {...marker} />
        ))}
      </GoogleMap>
    </Box>
  );
};

