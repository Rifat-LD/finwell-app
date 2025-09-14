import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage'; // Import the page
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* When the user visits the base URL ('/'), show the WelcomePage */}
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* We will add /login and /signup routes next */}
            </Routes>
        </Router>
    );
}

export default App;