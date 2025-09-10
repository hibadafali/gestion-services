
import React from "react";
//import logo from './logo-prefecture-officiel.svg';
import logo from './logo_prefecture.png';

function Accueil({ onLogin }) {
  const colors = {
    primary: '#d9467a',    // rose vif
    secondary: '#fdecef',  // rose très clair
    accent: '#7c3aed',     // violet
    background: 'linear-gradient(135deg,#fff1f2 0%, #fff7ed 100%)',
    surface: '#ffffff',
    text: '#2b2b2b',
    muted: '#6b7280',
    cardShadow: 'rgba(124, 58, 237, 0.12)'
  };

  const goDashboard = () => {
    if (typeof onLogin === "function") return onLogin();
    window.location.href = "/dashboard";
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      padding: 24
    }}>
      <div style={{
        width: '100%',
        maxWidth: 980,
        padding: 28,
        borderRadius: 20,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.85))',
        boxShadow: `0 20px 60px ${colors.cardShadow}`,
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: 20,
        alignItems: 'center'
      }}>
        {/* left: hero */}
        <div style={{ padding: 18 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12
          }}>
            <img src={logo} alt="logo" style={{ width: 84, height: 56, objectFit: 'contain', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }} />
            <div>
              <div style={{ fontSize: 14, color: colors.muted, fontWeight: 600 }}>Préfecture de</div>
              <div style={{ fontSize: 20, color: colors.text, fontWeight: 800, lineHeight: 1 }}>{'\u{1F3E2}'} Marrakech</div>
            </div>
          </div>

          <h1 style={{ margin: '6px 0 12px', fontSize: 26, color: colors.text }}>
            Tableau de bord centralisé <span style={{ fontSize: 22 }}>✨</span>
          </h1>

          <p style={{ margin: 0, color: colors.muted, lineHeight: 1.5 }}>
            Accédez aux indicateurs clés, suivez les demandes et consultez les rapports en un clic.
            Interface claire, actions rapides et visuelles pour faciliter la prise de décision.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button
              onClick={goDashboard}
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                color: '#ffffff',
                border: 'none',
                padding: '12px 18px',
                borderRadius: 12,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(124,58,237,0.18)'
              }}
            >
              Accéder au tableau { ' ' } 🚀
            </button>

            <button
              onClick={() => alert("Aide: contactez support@prefecture.ma")}
              style={{
                background: 'transparent',
                border: '1px solid rgba(43,43,43,0.06)',
                padding: '12px 16px',
                borderRadius: 12,
                cursor: 'pointer',
                color: colors.muted
              }}
            >
              Aide ℹ️
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
            <small style={{ color: colors.muted }}>Mises à jour :</small>
            <div style={{ background: '#fff', padding: '6px 10px', borderRadius: 999, fontSize: 13, boxShadow: '0 6px 18px rgba(16,24,40,0.04)', color: '#0f172a' }}>
              Nouvelle vue KPI 📊
            </div>
            <div style={{ background: '#fff', padding: '6px 10px', borderRadius: 999, fontSize: 13, boxShadow: '0 6px 18px rgba(16,24,40,0.04)', color: '#0f172a' }}>
              Export PDF ✅
            </div>
          </div>

          <div style={{ marginTop: 22, display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: '#10b981' }} />
            <small style={{ color: colors.muted }}>Système en ligne • SLA 98%</small>
          </div>
        </div>

        {/* right: decorative cards */}
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 14,
            borderRadius: 12,
            background: colors.surface,
            boxShadow: '0 10px 30px rgba(15,23,42,0.04)'
          }}>
            <div>
              <div style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>Demandes en attente</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: colors.primary }}>32 ✉️</div>
            </div>
            <div style={{ fontSize: 12, color: colors.muted }}>M° courante</div>
          </div>

          <div style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: 14,
            borderRadius: 12,
            background: 'linear-gradient(90deg, #fff, #fffaf0)',
            boxShadow: '0 10px 30px rgba(124,58,237,0.06)'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(180deg,#fff0f6,#fff1f2)', fontSize: 22
            }}>📈</div>
            <div>
              <div style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>Rapports générés</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>7</div>
              <div style={{ fontSize: 12, color: colors.muted }}>Export automatique chaque matin</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: 14,
            borderRadius: 12,
            background: '#ffffff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontSize: 28 }}>⚙️</div>
            <div>
              <div style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>Actions rapides</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => window.open('/indicateurs', '_self')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', background: '#fff', cursor: 'pointer' }}>Indicateurs</button>
                <button onClick={() => window.open('/rapports', '_self')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', background: '#fff', cursor: 'pointer' }}>Rapports</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, padding: 14, borderRadius: 12, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>Satisfaction</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>98% 😊</div>
              <div style={{ fontSize: 12, color: colors.muted }}>Basé sur les retours</div>
            </div>
            <div style={{ width: 120, padding: 14, borderRadius: 12, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>Équipe</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>12</div>
              <div style={{ fontSize: 12, color: colors.muted }}>Actifs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accueil;