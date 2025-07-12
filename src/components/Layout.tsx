import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useGetMeQuery } from "@/features/useAuth";

export default function Layout() {
  const { data: user } = useGetMeQuery();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar user={user!} logout={logout} />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
