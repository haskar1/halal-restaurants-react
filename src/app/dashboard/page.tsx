import DashboardNav from "./nav";

export default function Dashboard() {
  return (
    <>
      <header>
        <h1>Admin Dashboard</h1>
        <DashboardNav />
      </header>

      <main className="mt-58">
        <div className="container">
          <h1>Halal Restaurants</h1>
          <p>Welcome to Halal Restaurants, a website that finds the best halal restaurants near you!</p>
          <p>Total number of halal restaurants listed so far:</p>
          <ul>
            <li><strong>Restaurants:</strong></li>
            <li><strong>Cities:</strong></li>
            <li><strong>Cuisines:</strong></li>
          </ul>
        </div>
      </main>

      <footer></footer>
    </>
  );
}
