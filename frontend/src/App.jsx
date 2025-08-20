import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NavigationLayout from "./components/NavigationLayout";
function App() {
  return (
    <NavigationLayout>
      <main className="h-screen w-screen overflow-y-auto bg-[#F4F6F8]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </NavigationLayout>
  );
}

export default App;
