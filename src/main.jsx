import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import GlobalStyles from './components/GlobalStyles/GlobalStyles.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

const suppressedWarnings = ['Accessing element.ref was removed in React 19'];
const origWarn = console.error;
console.error = (...args) => {
    if (typeof args[0] === 'string' && suppressedWarnings.some((w) => args[0].includes(w))) {
        return;
    }
    origWarn(...args);
};
//
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </AuthProvider>
    </StrictMode>,
);
