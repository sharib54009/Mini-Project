import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./assets/Components/Login/LoginPage";
import SignUpPage from "./assets/Components/SignUp/SignUpPage";
import HomePage from "./assets/Components/HomePage/Home/HomePage";
import Routines from "./assets/Components/HomePage/Routines/Routines";
import Products from "./assets/Components/HomePage/Products/Products";
import Layout from "./assets/Components/Layout";
import Skin_Log from "./assets/Components/HomePage/Skin-Log/Skin_Log";
import Profile from "./assets/Components/HomePage/Profile/Profile";
import EventGlowPlanner from "./pages/EventGlowPlanner";
import RequireAuth from "./components/RequireAuth";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },

  {
    path: "/home",
    element: (
      <RequireAuth>
        <Layout>
          <HomePage />
        </Layout>
      </RequireAuth>
    ),
  },

  {
  path: "/routines",
  element: (
    <RequireAuth>
      <Layout>
        <Routines />
      </Layout>
    </RequireAuth>
  ),
},

  {
  path: "/routines/:type",
  element: (
    <RequireAuth>
      <Layout>
        <Routines />
      </Layout>
    </RequireAuth>
  )
},
   {
    path: "/products",
    element: (
        <RequireAuth>
          <Layout>
            <Products />
          </Layout>
        </RequireAuth>
    ),
  },
   {
    path: "/skin-log",
    element: (
        <RequireAuth>
          <Layout>
            <Skin_Log />
          </Layout>
        </RequireAuth>
    ),
  },
   {
    path: "/event-glow",
    element: (
        <RequireAuth>
          <Layout>
            <EventGlowPlanner />
          </Layout>
        </RequireAuth>
    ),
  },
   {
    path: "/profile",
    element: (
        <RequireAuth>
          <Layout>
            <Profile />
          </Layout>
        </RequireAuth>
    ),
  },
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;