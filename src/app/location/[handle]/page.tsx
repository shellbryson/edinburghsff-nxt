"use client";

// Utility to slugify a string
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .replace(/--+/g, '-');
}

import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import MapMarker from "../../MapMarker";
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

export default function LocationPage() {
  const [markers, setMarkers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    async function fetchMarkers() {
      const snapshot = await getDocs(collection(db, "locations"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMarkers(data);
      setLoading(false);
      console.log("Fetched markers:", data);
    }
    fetchMarkers();
  }, []);

  // Get handle from URL path
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const locationSlug = url.searchParams.get("location");
      if (locationSlug && markers.length) {
        const marker = markers.find(m => slugify(m.name || m.title || "") === locationSlug);
        if (marker) setSelectedMarker(marker);
      }
    }
  }, [markers]);

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
    const slug = slugify(marker.name || marker.title || "");
    if (slug) {
      const url = new URL(window.location.href);
      url.searchParams.set("location", slug);
      router.replace(url.pathname + url.search, { scroll: false });
    }
  };

  const handleDialogClose = () => {
    setSelectedMarker(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("location");
    router.replace(url.pathname + url.search, { scroll: false });
  };

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
          <MapMarker key={marker.id} {...marker} onClick={() => handleMarkerClick(marker)} />
        ))}
      </GoogleMap>
      <Dialog open={!!selectedMarker} onClose={handleDialogClose}>
        <DialogTitle>{selectedMarker?.name || "Location Info"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selectedMarker?.description || "No description available."}</Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>Handle:</strong> {selectedMarker?.handle}
          </Typography>
          <Typography variant="body2">
            <strong>Lat:</strong> {selectedMarker?.lat}, <strong>Lng:</strong> {selectedMarker?.lng}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
