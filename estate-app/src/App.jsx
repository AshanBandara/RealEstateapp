import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
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

export default App;
