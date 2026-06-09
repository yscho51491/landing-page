import StudioHeader from "@/components/layout/StudioHeader";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudioHeader />
      {children}
    </>
  );
}
