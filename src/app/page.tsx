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

function MapMarker({ lat, lng, id }: { lat: number; lng: number; id: string }) {
  return (
    <div
      style={{
        color: "red",
        fontWeight: "bold",
        background: "white",
        borderRadius: "50%",
        padding: "2px 6px",
        boxShadow: "0 0 2px #0002"
      }}
    >
      ●
    </div>
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
          <MapMarker key={marker.id} id={marker.id} lat={marker.lat} lng={marker.lng} />
        ))}
      </GoogleMap>
    </Box>
  );
};

