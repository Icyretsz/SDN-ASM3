import './App.css'
import {Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import PerfumeDetail from "./pages/PerfumeDetail.tsx";
import Header from "./components/Header.tsx";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route index element={<Home />} />
                <Route path="/perfumes/:id" element={<PerfumeDetail />} />
            </Routes>
        </>
    )
}

export default App
