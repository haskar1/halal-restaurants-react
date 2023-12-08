import prisma from "@/lib/prisma";

const cuisines = await prisma.cuisine.findMany();

export default function CuisineList() {
  return (
    <>
      <h1 className="text-3xl pb-8">Cuisine List</h1>
      <ul>
        {cuisines.length > 0 ? (
          cuisines.map((cuisine) => (
            <li key={cuisine.id}>
              <a
                href={`/dashboard/cuisines/${encodeURIComponent(
                  cuisine.id.toString()
                )}`}
              >
                <p>
                  <span>{cuisine.name}</span>
                </p>
              </a>
            </li>
          ))
        ) : (
          <li>There are no cuisines.</li>
        )}
      </ul>
    </>
  );
}
