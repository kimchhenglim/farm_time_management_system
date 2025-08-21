import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Roster from "./pages/Roster";
import NavigationLayout from "./components/NavigationLayout";
import StaffManagement from "./pages/StaffManagement";
import Report from "./pages/Report";
function App() {
  return (
    <NavigationLayout>
      <main className="h-screen w-screen overflow-y-auto bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </NavigationLayout>
  );
}

export default App;
