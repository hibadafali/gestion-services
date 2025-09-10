import React, { useState, useEffect } from "react";
import TableauIndicateurs from "./TableauIndicateurs";
import Commentaires from "./Commentaires";
import Accueil from "./Accueil";
import Layout from "./Layout";
import AdminUsers from "./AdminUsers";

// ----------- Formulaire Division/Service -----------
function FormDivisionService() {
  const divisions = [
    {
      nom: "Division des collectivités locales",
      services: [
        "Service des conseils élus",
        "Service des finances locales et personnel",
        "Service du patrimoine, planification et programmation",
        "Service de contrôle de la gestion des services publics communaux",
        "Service de l’état civil"
      ]
    },
    {
      nom: "Division des ressources humaines et des affaires générales",
      services: [
        "Service des ressources humaines",
        "Service de la formation continue",
        "Service des moyens généraux et de la logistique"
      ]
    },
    {
      nom: "Division du budget et des marchés",
      services: [
        "Service du budget",
        "Service de la comptabilité",
        "Service des marchés"
      ]
    },
    {
      nom: "Division des systèmes d’information et de communication et gestion",
      services: [
        "Service des systèmes d’information et communication",
        "Service de contrôle de gestion"
      ]
    },
    {
      nom: "Division du développement rural",
      services: [
        "Service des terres collectives",
        "Service du développement rural"
      ]
    },
    {
      nom: "Division des affaires économiques et de la coordination",
      services: [
        "Service de planification économique et programmation",
        "Service de l’action économique et du contrôle",
        "Service des affaires touristiques et du transport",
        "Service de l’animation culturelle et sportive"
      ]
    },
    {
      nom: "Division de l’urbanisme et de l’environnement",
      services: [
        "Service de l’urbanisme et du contrôle des constructions",
        "Service de l’environnement",
        "Service de gestion des risques naturels"
      ]
    },
    {
      nom: "Division des équipements",
      services: [
        "Service des études techniques",
        "Service des équipements et infrastructures",
        "Service de la propreté de la ville"
      ]
    },
    {
      nom: "Division de l’action sociale",
      services: [
        "Service de la coordination sociale intersectorielle",
        "Service du suivi et évaluation",
        "Service de la communication",
        "Service de la formation et renforcement des capacités"
      ]
    }
  ];

  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const servicesFiltered = divisions.find(d => d.nom === selectedDivision)?.services || [];

  return (
    <form style={{marginBottom: 32}}>
      <label>Division :</label>
      <select
        value={selectedDivision}
        onChange={e => {
          setSelectedDivision(e.target.value);
          setSelectedService("");
        }}
        required
      >
        <option value="">Sélectionner une division</option>
        {divisions.map((div) => (
          <option key={div.nom} value={div.nom}>{div.nom}</option>
        ))}
      </select>

      <label style={{marginLeft: 16}}>Service :</label>
      <select
        value={selectedService}
        onChange={e => setSelectedService(e.target.value)}
        required
        disabled={!selectedDivision}
      >
        <option value="">Sélectionner un service</option>
        {servicesFiltered.map((srv) => (
          <option key={srv} value={srv}>{srv}</option>
        ))}
      </select>
    </form>
  );
}
// ----------- Fin Formulaire Division/Service -----------

const DivisionsAccordion = ({ services, colors }) => {
  const [expandedDivisions, setExpandedDivisions] = useState({});

  // Grouper les services par division
  const servicesByDivision = services.reduce((acc, service) => {
    const divisionName = service.division?.nom || `Division ${service.division_id}`;
    if (!acc[divisionName]) {
      acc[divisionName] = [];
    }
    acc[divisionName].push(service);
    return acc;
  }, {});

  // Liste des divisions officielles avec leurs abréviations
  const officialDivisions = [
    { name: 'Division des collectivités territoriales (DCT)', abbr: 'DCT' },
    { name: 'Division des Ressources Humaines et des généraux (DRHG)', abbr: 'DRHG' },
    { name: 'Division du Budget et des marchés (DBM)', abbr: 'DBM' },
    { name: 'Division des systèmes d\'information de communication et de gestion (DSICG)', abbr: 'DSICG' },
    { name: 'Division du Développement Rural (DDR)', abbr: 'DDR' },
    { name: 'Division d\'urbanisme et de l\'environnement (DUE)', abbr: 'DUE' },
    { name: 'Division des équipements (DE)', abbr: 'DE' },
    { name: 'Division de l\'Action Sociale (DAS)', abbr: 'DAS' }
  ];

  const toggleDivision = (divisionName) => {
    setExpandedDivisions(prev => ({
      ...prev,
      [divisionName]: !prev[divisionName]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {officialDivisions.map((division) => {
        const divisionServices = servicesByDivision[division.name] || [];
        const isExpanded = expandedDivisions[division.name];
        
        return (
          <div key={division.name} style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: `0 2px 8px ${colors.shadow}`,
            transition: 'all 0.3s ease'
          }}>
            {/* Bouton de la division */}
            <button
              onClick={() => toggleDivision(division.name)}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                fontWeight: '600',
                color: colors.text
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = colors.surface;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: colors.primary,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {division.abbr}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    {division.name}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textLight }}>
                    {divisionServices.length} service{divisionServices.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              {/* Triangle qui pivote */}
              <div style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                color: colors.textLight
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Services de la division (accordéon) */}
            {isExpanded && (
              <div style={{
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                padding: '16px 24px',
                animation: 'fadeIn 0.3s ease'
              }}>
                {divisionServices.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '12px'
                  }}>
                    {divisionServices.map((service, idx) => (
                      <div
                        key={service.id || idx}
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          padding: '16px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = `0 4px 12px ${colors.shadow}`;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: colors.text,
                          margin: '0 0 8px 0'
                        }}>{service.nom || service}</h4>
                        <p style={{
                          fontSize: '12px',
                          color: colors.textLight,
                          margin: 0,
                          lineHeight: '1.4'
                        }}>{service.description || ""}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{
                    color: colors.textLight,
                    fontStyle: 'italic',
                    margin: 0,
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    Aucun service disponible pour cette division
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [userType, setUserType] = useState(""); // interne ou externe
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [page, setPage] = useState("dashboard");
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Ajout pour stocker l'utilisateur connecté

  // Connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setCurrentUser(data.user); // Stocke l'utilisateur connecté
        if (data.user && data.user.is_admin) {
          setPage("admin-users");
        }
        setLoading(false);
      } else {
        setError(data.message || "Erreur d'authentification");
        setLoading(false);
      }
    } catch (err) {
      setError("Erreur réseau");
      setLoading(false);
    }
  };

  // Inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setRegisterSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setRegisterSuccess("Inscription réussie ! Vous pouvez vous connecter.");
        setShowRegister(false);
        setEmail(registerData.email);
        setPassword("");
        setRegisterData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
        });
      } else {
        setError(data.message || "Erreur lors de l’inscription");
      }
      setLoading(false);
    } catch (err) {
      setError("Erreur réseau");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    setUserType("");
    setCurrentUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (!token) {
      setServices([]);
      setLoadingServices(false);
      setCurrentUser(null);
      return;
    }

    setLoadingServices(true);

    fetch("http://127.0.0.1:8000/api/services", { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      } 
    })
      .then(async (r) => {
        const text = await r.text();
        let json;
        try {
          json = text ? JSON.parse(text) : null;
        } catch (e) {
          json = text;
        }

        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }

        // Normaliser le payload : accepter { data: [...] } ou [...] directement
        const payload = (json && typeof json === 'object' && 'data' in json) ? json.data : json;
        setServices(Array.isArray(payload) ? payload : []);
        setLoadingServices(false);
      })
      .catch((error) => {
        setLoadingServices(false);
        alert(`Erreur API Services: ${error.message}`);
        if (error.message.includes('401') || error.message.includes('403')) {
          setToken("");
          setCurrentUser(null);
          localStorage.removeItem("token");
        }
      });
  }, [token]);

  // Page d'accueil pour tout le monde
  if (!token && !showLogin) {
    return <Accueil onLogin={() => setShowLogin(true)} />;
  }

  // Formulaire de connexion
  if (!token && showLogin) {
    const colors = {
      primary: '#d4a4a4',      // Rose poudré
      secondary: '#f7f3f3',    // Rose très clair
      accent: '#c8a2c8',       // Mauve clair
      background: '#fdf2f8',   // Rose bébé
      surface: '#f5f1f1',      // Nude clair
      text: '#6b5b73',         // Gris perle foncé
      textLight: '#9ca3af',    // Gris perle moyen
      border: '#e8d5d5',       // Bordure nude
      shadow: 'rgba(212, 164, 164, 0.15)',
      error: '#e57373'         // Rose d'erreur doux
    };

    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: colors.background,
          borderRadius: '24px',
          padding: '48px',
          boxShadow: `0 20px 60px ${colors.shadow}`,
          maxWidth: '450px',
          width: '100%',
          border: `1px solid rgba(255, 255, 255, 0.2)`
        }}>
          {/* Header avec logo */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '16px',
              backgroundColor: colors.surface,
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: `0 4px 16px ${colors.shadow}`
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke={colors.textLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: colors.text,
              margin: '0 0 8px 0',
              letterSpacing: '-0.025em'
            }}>Connexion</h2>
            <p style={{
              color: colors.textLight,
              fontSize: '16px',
              margin: 0,
              fontWeight: '500'
            }}>Accédez à votre espace administratif</p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: `1px solid #fecaca`,
              color: colors.error,
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: colors.text,
                marginBottom: '8px'
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `2px solid ${colors.border}`,
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: colors.surface,
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: colors.text,
                marginBottom: '8px'
              }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `2px solid ${colors.border}`,
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: colors.surface,
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: loading ? colors.textLight : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                color: '#ffffff',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 16px ${colors.shadow}`,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 8px 24px ${colors.shadow}`;
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 4px 16px ${colors.shadow}`;
                }
              }}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
          
          {/* Bouton retour */}
          <button
            onClick={() => setShowLogin(false)}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'transparent',
              border: `2px solid ${colors.border}`,
              borderRadius: '8px',
              color: colors.textLight,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.color = colors.primary;
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.color = colors.textLight;
            }}
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Tableau de bord principal
  const colors = {
    primary: '#2563eb',
    accent: '#10b981',
    background: '#ffffff',
    surface: '#f1f5f9',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  };

  const getPageTitle = () => {
    switch(page) {
      case 'tableau-indicateurs': return 'Tableau de bord - Indicateurs';
      case 'commentaires': return 'Gestion des demandes';
      case 'admin-users': return 'Administration - Utilisateurs';
      default: return `Tableau de bord - ${userType === "interne" ? "Interne" : "Externe"}`;
    }
  };

  return (
    <Layout 
      title={getPageTitle()}
      showLogout={true} 
      onLogout={handleLogout}
      userType={userType}
    >
      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setPage("dashboard")}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: page === 'dashboard' ? 'none' : `2px solid ${colors.border}`,
            backgroundColor: page === 'dashboard' ? colors.primary : colors.background,
            color: page === 'dashboard' ? 'white' : colors.text,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: page === 'dashboard' ? `0 2px 8px ${colors.shadow}` : 'none'
          }}
        >
          🏠 Accueil
        </button>
        
        <button 
          onClick={() => setPage("tableau-indicateurs")}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: page === 'tableau-indicateurs' ? 'none' : `2px solid ${colors.border}`,
            backgroundColor: page === 'tableau-indicateurs' ? colors.primary : colors.background,
            color: page === 'tableau-indicateurs' ? 'white' : colors.text,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: page === 'tableau-indicateurs' ? `0 2px 8px ${colors.shadow}` : 'none'
          }}
        >
          📈 Indicateurs
        </button>
        
        <button 
          onClick={() => setPage("commentaires")}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: page === 'commentaires' ? 'none' : `2px solid ${colors.border}`,
            backgroundColor: page === 'commentaires' ? colors.primary : colors.background,
            color: page === 'commentaires' ? 'white' : colors.text,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: page === 'commentaires' ? `0 2px 8px ${colors.shadow}` : 'none'
          }}
        >
          📝 Demandes
        </button>
        
        {/* Bouton Admin Users (visible seulement pour les admins) */}
        {currentUser?.is_admin && (
          <button 
            onClick={() => setPage("admin-users")}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: page === 'admin-users' ? 'none' : `2px solid ${colors.border}`,
              backgroundColor: page === 'admin-users' ? colors.accent : colors.background,
              color: page === 'admin-users' ? 'white' : colors.text,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: page === 'admin-users' ? `0 2px 8px ${colors.shadow}` : 'none'
            }}
          >
            👥 Utilisateurs
          </button>
        )}
      </div>

      {/* Exemple d'utilisation du formulaire division/service */}
      <FormDivisionService />

      {/* Contenu des pages */}
      {page === "tableau-indicateurs" && token && (
        <TableauIndicateurs token={token} />
      )}
      
      {page === "commentaires" && token && (
        <Commentaires token={token} user={userType} services={services} />
      )}
      
      {page === "admin-users" && token && currentUser?.is_admin && (
        <AdminUsers token={token} />
      )}
      {page === "admin-users" && token && !currentUser?.is_admin && (
        <div style={{ color: "red", fontWeight: "bold", padding: 32 }}>Accès refusé. Vous n'êtes pas administrateur.</div>
      )}
      
     

      {/* Page d'accueil par défaut */}
      {page === "dashboard" && (
        <Accueil
          currentUser={currentUser}
          isAdmin={currentUser?.is_admin}
          stats={{
            users: 42, // Remplace par la vraie valeur
            divisions: 9, // Remplace par la vraie valeur
            services: services.length,
            pachaliks: 4, // Remplace par la vraie valeur
            annexes: 18, // Remplace par la vraie valeur
            demandesEnAttente: 5, // Remplace par la vraie valeur
            demandesTraitees: 12, // Pour user
            mesDemandes: 3, // Pour user
            rapports: 2 // Pour user
          }}
        />
      )}
    </Layout>
  );
}

export default App;