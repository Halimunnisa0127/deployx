import Navbar from "../components/layout/Navbar";

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
