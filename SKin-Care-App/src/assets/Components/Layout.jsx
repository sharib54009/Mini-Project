import BottomNavbar from "./HomePage/Home/BottomNavbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">

      {/* APP CONTAINER */}
      <div className="w-full max-w-md min-h-screen bg-[#faede7] relative">

        {/* PAGE CONTENT */}
        <div >
          {children}
        </div>

        {/* BOTTOM NAVBAR */}
        <BottomNavbar />

      </div>
    </div>
  );
};

export default Layout;