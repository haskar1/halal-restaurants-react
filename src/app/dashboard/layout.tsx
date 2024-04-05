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
        <div className="xl:absolute xl:left-60 py-28 px-[1rem] md:px-12 [90%] max-w-[1350px]">
          {children}
        </div>
      </main>
    </>
  );
}
