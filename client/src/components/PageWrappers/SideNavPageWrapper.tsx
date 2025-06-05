import SideNavbar from "../Navigation/SideNavbar";

export default function SideNavPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SideNavbar />
      {children}
    </div>
  );
}
