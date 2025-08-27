import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Roster from "./pages/Roster";
import NavigationLayout from "./components/NavigationLayout";
import StaffManagement from "./pages/StaffManagement";
import StaffDetail from "./pages/StaffDetail";
import Report from "./pages/Report";
function App() {
  return (
    <NavigationLayout>
      <main className="w-full h-full overflow-y-auto bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Roster />} />
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route
            path="/staff-management/staff-detail/:staffID"
            element={<StaffDetail />}
          />
          <Route path="/report" element={<Report />} />
          {/* <Route path="/staff/:id" element={<StaffDetail />} /> */}
        </Routes>
      </main>
    </NavigationLayout>
  );
}

export default App;
