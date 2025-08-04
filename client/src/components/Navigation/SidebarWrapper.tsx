import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideNavbar from "./SideNavbar";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(searchParams.get("sidebar") === "true");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("sidebar", open ? "true" : "false");
    setSearchParams(params);
  }, [open, searchParams, setSearchParams]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <SideNavbar />
      <main className="flex-1">
        <div className="flex h-full ">
          <SidebarTrigger className="h-full border-r rounded-none" />
          <section className="flex-1">{children}</section>
        </div>
      </main>
    </SidebarProvider>
  );
}
