import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./components/components.css"; // Import component styles
import Search from "./pages/Search";
import Property from "./pages/Property";

function App() {
  return (
    /* Use Vite's BASE_URL so client routing works when deployed under a subpath (e.g. GitHub Pages).
       Alternatively, replace BrowserRouter with HashRouter to avoid basename concerns. */
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/property/:id" element={<Property />} />
      </Routes>
    </BrowserRouter>
  );
}

// Add a default export or named export if needed, but Vite expects default export for App
export default App;
