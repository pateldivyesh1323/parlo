import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideNavbar from "./SideNavbar";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SideNavbar />
      <main className="flex-1">
        <div className="flex h-full ">
          <SidebarTrigger className="h-full border-r" />
          <section className="flex-1">{children}</section>
        </div>
      </main>
    </SidebarProvider>
  );
}
