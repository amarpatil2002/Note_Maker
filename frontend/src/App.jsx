import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import PublicRoute from "./Components/PublicRoute";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthContextProvider } from "./Context/AuthContext";
import OAuthLogin from "./Pages/OAuthLogin"

function App() {
  const DashboardLayout = () => {
    return (
      <>
        <Dashboard />
        <Outlet />
      </>
    );
  };

  const router = createBrowserRouter([
    //public routes
    {
      element: <PublicRoute />,
      children: [
        { path: "/", element: <Home /> },
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
