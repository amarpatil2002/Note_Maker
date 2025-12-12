import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import PublicRoute from "./Components/PublicRoute";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthContextProvider } from "./Context/AuthContext";
import OAuthLogin from "./Pages/OAuthLogin"
import Logout from "./Pages/Logout";

function App() {
  const DashboardLayout = () => {
    return (
      <>
        <Outlet />
      </>
    );
  };

  const router = createBrowserRouter([
    //public routes
    {
      element: <PublicRoute />,
      children: [
        { path: "/", element: <Login /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        {path:'/oauth/success' , element:<OAuthLogin/>}
      ],
    },

    //protected routes
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <DashboardLayout />,
          children: [{ path: "dashboard", element: <Dashboard /> }],
        },
        {
          element:<Logout/>,
          path:'/logout'
        }
      ],
    },
  ]);

  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
      {/* <RouterProvider router={router} /> */}
    </>
  );
}

export default App;
