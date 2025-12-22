import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import PublicRoute from "./Components/PublicRoute";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthContextProvider } from "./Context/AuthContext";
import OAuthLogin from "./Pages/OAuthLogin";
import Logout from "./Pages/Logout";
import { ToastContainer } from "react-toastify";
import Profile from "./Pages/Profile";
import Notes from "./Pages/Notes";

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
        { path: "/oauth/success", element: <OAuthLogin /> },
      ],
    },

    //protected routes
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { 
              path: "/dashboard",
              element: <Dashboard />,
              children:[
                {path:'profile', element:<Profile />},
                {path:'note' , element:<Notes />}
              ]
            },
          ],
        },
        {
          element: <Logout />,
          path: "/logout",
        },
      ],
    },
  ]);

  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthContextProvider>
      {/* <RouterProvider router={router} /> */}
    </>
  );
}

export default App;
