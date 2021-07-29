import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="content">
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
