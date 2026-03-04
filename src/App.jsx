import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.module.scss';
import { routes } from './routes/routes';
import MainLayout from './layouts/MainLayout/MainLayout';
import { AuthProvider } from './contexts/AuthContext';

import LoginModal from './components/AuthModal/LoginModal';
import { useAuth } from './hooks/useAuth';
import RegisterModal from './components/AuthModal/RegisterModal';
function App() {
    const { showLoginModal, showRegisterModal, onSwitchToRegister } = useAuth();

    return (
        <Router>
            <div className="App">
                {showRegisterModal && <RegisterModal />}
                {showLoginModal && <LoginModal />}

                <Routes>
                    {routes.map((route, index) => {
                        const Page = route.component;
                        const Layout = MainLayout;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
