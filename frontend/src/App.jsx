import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Roster from "./pages/Roster";
import NavigationLayout from "./components/NavigationLayout";
import StaffManagement from "./pages/StaffManagement";
import StaffDetail from "./pages/StaffDetail";
import { Toaster } from "react-hot-toast";
import Report from "./pages/Report";
import { useEffect } from "react";
import useAuthStore from "./stores/useAuthStore";
function App() {
  //import checkAuth from the useAuthStore
  const { checkAuth, authUser } = useAuthStore();
  //using useEffect to check for authuser
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <NavigationLayout>
      <main className="w-full h-full overflow-y-auto bg-gray-50">
        <Routes>
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={authUser ? <Roster /> : <Navigate to="/login" />}
          />
          <Route
            path="/staff-management"
            element={authUser ? <StaffManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/staff-management/staff/:staffID"
            element={authUser ? <StaffDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/report"
            element={authUser ? <Report /> : <Navigate to="/login" />}
          />
          {/* <Route path="/staff/:id" element={<StaffDetail />} /> */}
        </Routes>
      </main>
      <Toaster />
    </NavigationLayout>
  );
}

export default App;
