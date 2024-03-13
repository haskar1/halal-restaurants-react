import getCuisines from "@/utils/get-cuisines";

export const fetchCache = "force-no-store";

export default async function CuisineList() {
  const cuisines = await getCuisines();

  return (
    <>
      <h1 className="text-3xl pb-8">Cuisine List</h1>
      <ul>
        {cuisines && cuisines.length > 0 ? (
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
          <li>No cuisines found.</li>
        )}
      </ul>
    </>
  );
}
