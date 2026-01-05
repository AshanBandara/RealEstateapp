import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./components/components.css"; // Import component styles
import Search from "./pages/Search";
import Property from "./pages/Property";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/property/:id" element={<Property />} />
      </Routes>
    </BrowserRouter>
  );
}

// Add a default export or named export if needed, but Vite expects default export for App
export default App;
