import './App.css'
import {Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import PerfumeDetail from "./pages/PerfumeDetail.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Profile from "./pages/Profile.tsx";
import Header from "./components/Header.tsx";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route index element={<Home />} />
                <Route path="/perfumes/:id" element={<PerfumeDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    )
}

export default App
