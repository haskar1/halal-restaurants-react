"use client";

import LoadingButton from "@mui/lab/LoadingButton";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FindNearMeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const center = `${lon},${lat}`;
    router.push(`/best-halal-restaurants?center=${center}`);
  }

  function error(err) {
    const findNearMeButton = document.querySelector(".find-near-me-button");
    const errorMsg = document.createElement("div");

    errorMsg.id = "geolocate-error-message";
    errorMsg.textContent = "Unable to find your location. Please try again.";
    errorMsg.style.color = "#ff9a9a";
    errorMsg.style.paddingTop = "1rem";
    findNearMeButton.parentNode.parentNode.append(errorMsg);

    setIsLoading(false);
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  function handleClick() {
    const errorMsgDiv = document.querySelector("#geolocate-error-message");
    if (errorMsgDiv) {
      errorMsgDiv.remove();
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  return (
    <LoadingButton
      className="find-near-me-button !text-white disabled:bg-[#1976d2] disabled:opacity-60"
      loading={isLoading}
      loadingPosition="start"
      startIcon={<LocationSearchingIcon />}
      variant="contained"
      color="primary"
      onClick={handleClick}
    >
      <span>Find Near Me</span>
    </LoadingButton>
  );
}
