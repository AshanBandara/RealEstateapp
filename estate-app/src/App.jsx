import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import Results from "./pages/Results";
import Property from "./pages/Property";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/results" element={<Results />} />
        <Route path="/property/:id" element={<Property />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
