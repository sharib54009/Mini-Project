import BottomNavbar from "./HomePage/Home/BottomNavbar";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="app-shell flex flex-col">
        <div className="px-4 pb-24 flex-1">
          {children}
        </div>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Layout;