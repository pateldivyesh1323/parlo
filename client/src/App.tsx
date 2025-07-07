import { createBrowserRouter, RouterProvider } from "react-router";
import Introduction from "./pages/Introduction";
import SignIn from "./pages/SignIn";
import Chats from "./pages/Chats";
import BasicPageWrapper from "./components/PageWrappers/BasicPageWrapper";
import { Toaster } from "./components/ui/sonner";
import PrivateRouteWrapper from "./components/PageWrappers/PrivateRouteWrapper";
import SidebarWrapper from "./components/Navigation/SidebarWrapper";
import PublicRouteWrapper from "./components/PageWrappers/PublicRouteWrapper";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <BasicPageWrapper>
        <Introduction />
      </BasicPageWrapper>
    ),
  },
  {
    path: "/signin",
    element: (
      <PublicRouteWrapper>
        <SignIn />
      </PublicRouteWrapper>
    ),
  },
  {
    path: "/chats",
    element: (
      <PrivateRouteWrapper>
        <SidebarWrapper>
          <Chats />
        </SidebarWrapper>
      </PrivateRouteWrapper>
    ),
  },
  {
    path: "/settings",
    element: (
      <PrivateRouteWrapper>
        <SidebarWrapper>
          <Settings />
        </SidebarWrapper>
      </PrivateRouteWrapper>
    ),
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default App;
