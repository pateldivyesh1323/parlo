import { createBrowserRouter, RouterProvider } from "react-router";
import Introduction from "./pages/Introduction";
import SignIn from "./pages/SignIn";
import Chats from "./pages/Chats";
import BasicPageWrapper from "./components/PageWrappers/BasicPageWrapper";
import { Toaster } from "./components/ui/sonner";
import PrivateRouteWrapper from "./components/PageWrappers/PrivateRouteWrapper";
import SidebarWrapper from "./components/Navigation/SidebarWrapper";

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
    element: <SignIn />,
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
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
