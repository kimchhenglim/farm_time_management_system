import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
function App() {
  return (
    <>
      <main className="h-screen w-screen overflow-y-auto bg-[#F4F6F8]">
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
