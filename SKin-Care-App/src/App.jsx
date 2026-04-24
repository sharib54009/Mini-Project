import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./assets/Components/Login/LoginPage";
import SignUpPage from "./assets/Components/SignUp/SignUpPage";
import HomePage from "./assets/Components/HomePage/Home/HomePage";
import Routines from "./assets/Components/HomePage/Routines/Routines";
import Products from "./assets/Components/HomePage/Products/Products";
import Layout from "./assets/Components/Layout";
import Skin_Log from "./assets/Components/HomePage/Skin-Log/Skin_Log";
import Profile from "./assets/Components/HomePage/Profile/Profile";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },

  {
    path: "/home",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },

  {
  path: "/routines",
  element: (
    <Layout>
      <Routines />
    </Layout>
  ),
},

  {
  path: "/routines/:type",
  element: (
    <Layout>
      <Routines />
    </Layout>
  )
},
   {
    path: "/products",
    element: (
      <Layout>
        <Products />
      </Layout>
    ),
  },
   {
    path: "/skin-log",
    element: (
      <Layout>
        <Skin_Log />
      </Layout>
    ),
  },
   {
    path: "/profile",
    element: (
      <Layout>
        <Profile />
      </Layout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;