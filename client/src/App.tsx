import './App.css'
import {Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import PerfumeDetail from "./pages/PerfumeDetail.tsx";

function App() {
  return (
      <Routes>
          <Route index element={<Home />} />
          <Route path="/perfumes/:id" element={<PerfumeDetail />} />
      </Routes>
  )
}

export default App
