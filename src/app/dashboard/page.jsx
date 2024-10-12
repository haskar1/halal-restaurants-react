import { sql } from "@vercel/postgres";

export const fetchCache = "force-no-store";

export default async function Dashboard() {
  try {
    const [res1, res2] = await Promise.all([
      sql`
        SELECT Count(*) FROM restaurants;
      `,
      sql`
        SELECT city, COUNT(*) FROM restaurants GROUP BY city ORDER BY city;   
      `,
    ]);

    const restaurantCount = res1?.rows[0]?.count;
    const cityCount = res2?.rows;

    return (
      <>
        <h1 className="text-3xl pb-10">Admin Dashboard</h1>
        {restaurantCount && (
          <div className="flex items-center gap-2 pb-2">
            <h3>Total number of restaurants (including hidden ones): </h3>
            <p className="text-lg">{restaurantCount}</p>
          </div>
        )}
        {cityCount && (
          <div className="flex items-center gap-2 pb-6">
            <h3>Total number of locations (including hidden ones): </h3>
            <p className="text-lg">{cityCount.length}</p>
          </div>
        )}

        {cityCount.length > 0 && (
          <>
            <h3 className="pb-2">
              Restaurant count by location (including hidden ones):
            </h3>
            {cityCount.map((city) => (
              <div key={city.city} className="flex gap-2 text-lg">
                <p>{city.city}: </p>
                <p>{city.count}</p>
              </div>
            ))}
          </>
        )}
      </>
    );
  } catch (error) {
    console.error("Error fetching count: ", error);
    return null;
  }
}
