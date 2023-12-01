import prisma from "../lib/prisma";
import DashboardHeader from "../components/DashboardHeader";

const restaurantCount = await prisma.restaurant.count();
const restaurantInstanceCount = await prisma.restaurantInstance.count();
const locationCount = await prisma.location.count();
const cuisineCount = await prisma.cuisine.count();

export default function Dashboard() {
  return (
    <>
      <DashboardHeader />

      <main>
        <div>
          <h1 className="text-3xl pb-8">Admin Dashboard</h1>
          <p className="text-xl pb-4">Halal Restaurant Statistics:</p>
          <ul className="text-lg">
            <li>
              <strong>Restaurants: {restaurantCount}</strong>
            </li>
            <li>
              <strong>Restaurant Instances: {restaurantInstanceCount}</strong>
            </li>
            <li>
              <strong>Cities: {locationCount}</strong>
            </li>
            <li>
              <strong>Cuisines: {cuisineCount}</strong>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
