import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader />

      <main>
        <div className="xl:absolute xl:left-60 px-12 pt-28 w-fit mx-auto">
          {children}
        </div>
      </main>
    </>
  );
}
