// @ts-nocheck

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import DashboardHeader from "@/components/DashboardHeader";

export const metadata = {
  title: "Dashboard | Who Is Halal",
};

export default withPageAuthRequired(
  function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        <DashboardHeader />

        <div className="xl:absolute xl:left-60 py-28 px-[1rem] md:px-12 [90%] max-w-[1350px]">
          {children}
        </div>
      </>
    );
  },
  { returnTo: "/dashboard" }
);
