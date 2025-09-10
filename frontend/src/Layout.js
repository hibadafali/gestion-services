import React from 'react';
import logo from './logo_prefecture.png';

const Layout = ({ children, title, showLogout = false, onLogout, userType }) => {
  const colors = {
    primary: '#d4a4a4',      // Rose poudré
    secondary: '#f7f3f3',    // Rose très clair
    accent: '#c8a2c8',       // Mauve clair
    background: '#fdf2f8',   // Rose bébé
    surface: '#f5f1f1',      // Nude clair
    text: '#6b5b73',         // Gris perle foncé
    textLight: '#9ca3af',    // Gris perle moyen
    border: '#e8d5d5',       // Bordure nude
    shadow: 'rgba(212, 164, 164, 0.15)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Header avec logo */}
      <header style={{
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: `0 1px 3px ${colors.shadow}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src={logo} 
            alt="Logo Préfecture Marrakech" 
            style={{ 
              width: '150px', 
              height: '48px',
              borderRadius: '8px',
              boxShadow: `0 2px 8px ${colors.shadow}`
            }} 
          />
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '700',
              color: colors.primary,
              letterSpacing: '-0.025em'
            }}>
              Préfecture de Marrakech
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: colors.textLight,
              fontWeight: '500'
            }}>
              Système de gestion administrative
            </p>
          </div>
        </div>

        {showLogout && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {userType && (
              <span style={{
                backgroundColor: colors.accent,
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {userType}
              </span>
            )}
            <button 
              onClick={onLogout}
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: `0 1px 3px ${colors.shadow}`
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </header>

      {/* Contenu principal */}
      <main style={{
        padding: '32px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {title && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: colors.text,
              margin: '0 0 8px 0',
              letterSpacing: '-0.025em'
            }}>
              {title}
            </h2>
            <div style={{
              width: '60px',
              height: '4px',
              backgroundColor: colors.accent,
              borderRadius: '2px'
            }}></div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
