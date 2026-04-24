import BottomNavbar from "./HomePage/Home/BottomNavbar";

const Layout = ({ children }) => {
  return (
    <div>
      {children}
      <BottomNavbar />
    </div>
  );
};

export default Layout;