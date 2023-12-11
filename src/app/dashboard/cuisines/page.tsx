import callAPI_GET from "@/utils/callAPI_GET";
import { CuisineInterface } from "@/lib/modelsInterfaces";

export default async function CuisineList() {
  const cuisines = await callAPI_GET("cuisines");

  return (
    <>
      <h1 className="text-3xl pb-8">Cuisine List</h1>
      <ul>
        {cuisines.length > 0 ? (
          cuisines.map((cuisine: CuisineInterface) => (
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
