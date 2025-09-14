import React from 'react';
import logo from '../assets/logo.png'; // Update filename if necessary

const AuthLayout = ({ children, containerStyle = {} }) => {
    const defaultStyles={
            backgroundColor: '#121212',
            color: 'white',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            boxSizing: 'border-box'
        };
    const combinedStyles = { ...defaultStyles, ...containerStyle };
         return (
             <div style = {combinedStyles}>
                 <div>
                     <header style={{ textAlign: 'center', marginBottom: '-1rem', marginTop: '-10rem' }}>
                         <img src={logo} alt="FinWell Logo" style={{ width: '350px', marginBottom: '0.5rem' }} />
                     </header>
                     <main>
                         {children}
                     </main>
                 </div>
            </div>
        );
};

export default AuthLayout;