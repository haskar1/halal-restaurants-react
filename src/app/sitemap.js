// 37 restaurants and 13 locations, updated 10/12/24
// Only manually update this page when there are new locations. Numbers above should match dashboard.
// You can add other locations not listed on dashboard if wanted (state/country names for example).
// Restaurants are automatically updated.

import { headers } from "next/headers";

export default async function sitemap() {
  const host = headers().get("host");
  const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/get-sitemap`);
  const data = await res.json();

  const allRestaurantsSitemap = data.allRestaurantsSitemap;

  return [
    {
      url: "https://www.whoishalal.com/",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/brooklyn-new-york-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/cary-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/charlotte-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/durham-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/fayetteville-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/greenville-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/high-point-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/holly-springs-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/manhattan-new-york-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/morrisville-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/new-york-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/new-york-city-new-york-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/raleigh-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/san-francisco-california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...allRestaurantsSitemap,
  ];
}
