// 142 restaurants and 51 locations, updated 10/31/24
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
      url: "https://www.whoishalal.com/best-halal-restaurants/anaheim-california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/arlington-texas-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/arlington-virginia-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/asheville-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/british-columbia-canada",
      changeFrequency: "weekly",
      priority: 1.0,
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
      url: "https://www.whoishalal.com/best-halal-restaurants/carrollton-texas-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/cary-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/chapel-hill-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/charlotte-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/chicago-illinois-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/coral-springs-florida-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/dearborn-michigan-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/detroit-michigan-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/district-of-columbia-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/downey-california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/durham-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/el-segundo-california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/evanston-illinois-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/farmers-branch-texas-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/fayetteville-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/florida-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/greensboro-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/greenville-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/harrisburg-north-carolina-united-states",
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
      url: "https://www.whoishalal.com/best-halal-restaurants/hollywood-florida-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/illinois-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/irvine-california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/irving-texas-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/lauderhill-florida-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/los-angeles-california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/manhattan-new-york-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/maywood-california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/miami-florida-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/miramar-florida-united-states",
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
      url: "https://www.whoishalal.com/best-halal-restaurants/niles-illinois-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/orange-california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/pembroke-pines-florida-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/plano-texas-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/plantation-florida-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/queens-new-york-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/raleigh-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/richardson-texas-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/san-francisco-california-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/sunrise-florida-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/bronx-new-york-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/texas-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/vancouver-british-columbia-canada",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/virginia-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/washington-district-of-columbia-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.whoishalal.com/best-halal-restaurants/wilmington-north-carolina-united-states",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...allRestaurantsSitemap,
  ];
}
