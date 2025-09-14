import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from "./context/AuthContext";

//Layouts
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

//Pages
import WelcomePage from './pages/WelcomePage'; // Import the page
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';

function App() {
    const { token } = useAuth();
    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                {/* These routes are for users who are NOT logged in */}
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* --- Protected Routes --- */}
                {/* All routes inside here require a user to be logged in */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        {/* All pages with the sidebar/header go here */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        {/* We will add routes for /files, /budget etc. later */}
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;