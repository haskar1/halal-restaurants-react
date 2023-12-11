import prisma from "@/lib/prisma";

const locations = await prisma.location.findMany();

export default function LocationList() {
  return (
    <>
      <h1 className="text-3xl pb-8">Location List</h1>
      <ul>
        {locations.length > 0 ? (
          locations.map((location) => (
            <li key={location.id}>
              <a
                href={`/dashboard/locations/${encodeURIComponent(
                  location.id.toString()
                )}`}
              >
                <p>
                  <span>
                    {location.city + ", "}
                    {location.state && location.state + ", "}
                    {location.country}
                  </span>
                </p>
              </a>
            </li>
          ))
        ) : (
          <li>There are no locations.</li>
        )}
      </ul>
    </>
  );
}
