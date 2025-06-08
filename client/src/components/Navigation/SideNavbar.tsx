import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LogOut, Settings, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/Common";
import { useAuth } from "@/context/AuthContext";
import LogoutConfirmDialog from "../Auth/LogoutConfirmDialog";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

const menuItems = [
  {
    title: "Chats",
    slug: "/chats",
    icon: MessageCircle,
  },
];

export default function SideNavbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <div className="flex justify-center flex-col  group-data-[collapsible=icon]:justify-center gap-2">
            <Logo
              size="md"
              showText={true}
              className="group-data-[collapsible=icon]:block"
            />
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-xs text-muted-foreground">
                AI-powered voice translation chat app
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.slug;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem
                      key={item.slug}
                      onClick={() => {
                        navigate(item.slug);
                      }}
                    >
                      <SidebarMenuButton
                        className={`w-full justify-start ${
                          isActive
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground transition-all duration-100"
                            : ""
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Settings
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex items-center gap-2 w-full bg-white rounded-md p-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>
                  {user?.name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setOpenLogoutDialog(true)}
              >
                <LogOut className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Logout
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <LogoutConfirmDialog
        open={openLogoutDialog}
        setOpen={setOpenLogoutDialog}
      />
    </>
  );
}
