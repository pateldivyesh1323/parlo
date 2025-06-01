import { createBrowserRouter, RouterProvider } from "react-router";
import Introduction from "./pages/Introduction";
import SignIn from "./pages/SignIn";
import Chats from "./pages/Chats";
import BasicPageWrapper from "./components/PageWrappers/BasicPageWrapper";
import { Toaster } from "./components/ui/sonner";
import PrivateRouteWrapper from "./components/PageWrappers/PrivateRouteWrapper";

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
        <BasicPageWrapper>
          <Chats />
        </BasicPageWrapper>
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
