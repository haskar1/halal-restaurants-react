"use client";

import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

export default function ImageGallery({
  coverPhotoUrl,
  otherPhotosUrls,
  restaurantName,
  restaurantSlug,
}) {
  const isMobile = useMediaQuery("(max-width:767px)");
  const photosArr = [];

  if (coverPhotoUrl) {
    photosArr.push(coverPhotoUrl);
  }

  if (otherPhotosUrls?.length > 0) {
    otherPhotosUrls.map((photoUrl) => photosArr.push(photoUrl));
  }

  // Image carousel only on mobile
  if (isMobile) {
    return (
      <>
        {photosArr.length > 0 && (
          <Carousel
            infiniteLoop={true}
            swipeScrollTolerance={5}
            showThumbs={false}
            showIndicators={false}
          >
            {photosArr.map((photoUrl, index) => (
              <div className="grid touch-pan-x touch-pinch-zoom">
                <Link
                  key={index}
                  href={`/restaurants/${restaurantSlug}/photos#restaurant-photo-${
                    index + 1
                  }`}
                >
                  <Image
                    src={photoUrl}
                    alt={`${restaurantName} Photo ${index + 1}`}
                    className="object-cover w-full m-auto"
                    width="300"
                    height="300"
                  />
                </Link>
              </div>
            ))}
          </Carousel>
        )}
      </>
    );
  }

  // No image carousel on tablet or desktop
  if (photosArr.length === 3) {
    return (
      <div className="container pt-8">
        <div className="grid grid-cols-3 grid-rows-[repeat(2,_minmax(0,_12.5rem))] gap-2 rounded-2xl overflow-hidden">
          {photosArr.map((photo_url, index) => (
            <Link
              key={index}
              href={`/restaurants/${restaurantSlug}/photos#restaurant-photo-${
                index + 1
              }`}
              className={index === 0 ? "row-span-2 col-span-2" : ""}
            >
              <Image
                src={photo_url}
                alt={restaurantName}
                className="aspect-square object-cover h-full w-full"
                width={index === 0 ? "400" : "200"}
                height={index === 0 ? "400" : "200"}
              />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (photosArr.length === 2) {
    return (
      <div className="container pt-8">
        <div className="grid grid-cols-2 grid-rows-[repeat(1,_minmax(0,_25rem))] gap-2 rounded-2xl overflow-hidden">
          {photosArr.map((photo_url, index) => (
            <Link
              key={index}
              href={`/restaurants/${restaurantSlug}/photos#restaurant-photo-${
                index + 1
              }`}
            >
              <Image
                src={photo_url}
                alt={restaurantName}
                className="aspect-square object-cover h-full w-full"
                width={"400"}
                height={"400"}
              />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (photosArr.length === 1) {
    return (
      <div className="container pt-8">
        <div className="w-full h-[25rem] rounded-2xl overflow-hidden">
          <Link
            href={`/restaurants/${restaurantSlug}/photos#restaurant-photo-1`}
          >
            <Image
              src={photosArr[0]}
              alt={restaurantName}
              className="object-cover h-full w-full"
              width={"400"}
              height={"400"}
            />
          </Link>
        </div>
      </div>
    );
  }
}
