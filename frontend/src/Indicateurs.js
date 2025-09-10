import React, { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000";

// Liste des divisions et services associés
const divisionsData = [
  {
    id: 1,
    nom: "Division des collectivités locales",
    services: [
      "Service des conseils élus",
      "Service des finances locales et personnel",
      "Service du patrimoine, planification et programmation",
      "Service de contrôle de la gestion des services publics communaux",
      "Service de l’état civil",
    ],
  },
  {
    id: 2,
    nom: "Division des ressources humaines et des affaires générales",
    services: [
      "Service des ressources humaines",
      "Service de la formation continue",
      "Service des moyens généraux et de la logistique",
    ],
  },
  {
    id: 3,
    nom: "Division du budget et des marchés",
    services: ["Service du budget", "Service de la comptabilité", "Service des marchés"],
  },
  {
    id: 4,
    nom: "Division des systèmes d’information et de communication et gestion",
    services: ["Service des systèmes d’information et communication", "Service de contrôle de gestion"],
  },
  {
    id: 5,
    nom: "Division du développement rural",
    services: ["Service des terres collectives", "Service du développement rural"],
  },
  {
    id: 6,
    nom: "Division des affaires économiques et de la coordination",
    services: [
      "Service de planification économique et programmation",
      "Service de l’action économique et du contrôle",
      "Service des affaires touristiques et du transport",
      "Service de l’animation culturelle et sportive",
    ],
  },
  {
    id: 7,
    nom: "Division de l’urbanisme et de l’environnement",
    services: [
      "Service de l’urbanisme et du contrôle des constructions",
      "Service de l’environnement",
      "Service de gestion des risques naturels",
    ],
  },
  {
    id: 8,
    nom: "Division des équipements",
    services: [
      "Service des études techniques",
      "Service des équipements et infrastructures",
      "Service de la propreté de la ville",
    ],
  },
  {
    id: 9,
    nom: "Division de l’action sociale",
    services: [
      "Service de la coordination sociale intersectorielle",
      "Service du suivi et évaluation",
      "Service de la communication",
      "Service de la formation et renforcement des capacités",
    ],
  },
];

function Indicateurs({ token }) {
  const [indicateurs, setIndicateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ valeur: "", annee: "", mois: "" });
  const [addForm, setAddForm] = useState({
    nom: "",
    valeur: "",
    mois: "",
    annee: "",
    division_id: "",
    service: "",
    dynamique: false,
  });
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    fetchAll();
  }, [token]);

  async function fetchAll() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/indicateurs`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des indicateurs");
      const data = await res.json();
      setIndicateurs(data.data || data || []);
    } catch (err) {
      setError(err.message || "Erreur de chargement des indicateurs");
    } finally {
      setLoading(false);
    }
  }

  function parseHistory(valeurs) {
    try {
      const hist = valeurs && typeof valeurs === "string" ? JSON.parse(valeurs) : valeurs;
      return Array.isArray(hist?.history) ? hist.history : [];
    } catch {
      return [];
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setAddForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "division_id") {
      const division = divisionsData.find((d) => d.id === parseInt(value));
      setFilteredServices(division ? division.services : []);
      setAddForm((f) => ({ ...f, service: "" }));
    }
  }

  function calculateDynamicValue() {
    // Exemple de calcul dynamique : (longueur du nom + longueur du service) * 10
    if (addForm.nom && addForm.service) {
      return (addForm.nom.length + addForm.service.length) * 10;
    }
    return 0;
  }

  async function handleAdd(e) {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    try {
  const valeur = addForm.dynamique ? calculateDynamicValue() : addForm.valeur;
  const numericValeur = Number(valeur);
  if (!addForm.nom.trim()) throw new Error("Le nom est requis.");
  if (!addForm.annee.trim()) throw new Error("L'année est requise.");
  if (!addForm.division_id) throw new Error("Veuillez sélectionner une division.");
  if (!addForm.service) throw new Error("Veuillez sélectionner un service.");
  if (!numericValeur || isNaN(numericValeur) || numericValeur <= 0) throw new Error("La valeur doit être un nombre positif.");

  const valeursPayload = {
    history: [
      {
        annee: addForm.annee,
        mois: addForm.mois || null,
        valeur: numericValeur,
      },
    ],
  };

  const res = await fetch(`${API_BASE}/api/indicateurs`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      nom: addForm.nom,
      // envoyer l'objet "valeurs" avec history
      valeurs: valeursPayload,
      mois: addForm.mois || null,
      annee: addForm.annee || null,
      division_id: addForm.division_id,
      service: addForm.service,
    }),
  });
      if (!res.ok) throw new Error("Erreur lors de l'ajout de l'indicateur");
      setAddForm({
        nom: "",
        valeur: "",
        mois: "",
        annee: "",
        division_id: "",
        service: "",
        dynamique: false,
      });
      setFilteredServices([]);
      await fetchAll();
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
      <h2>Tableau de bord des indicateurs</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <div>Chargement…</div>
      ) : (
        <>
          <form onSubmit={handleAdd} style={{ marginBottom: 24, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto", gap: 8 }}>
            <input
              name="nom"
              value={addForm.nom}
              onChange={handleChange}
              placeholder="Nom de l'indicateur"
              required
              style={{ padding: 10, borderRadius: 6, border: "1px solid #e6e6e9" }}
            />
            <input
              name="valeur"
              value={addForm.dynamique ? calculateDynamicValue() : addForm.valeur}
              onChange={handleChange}
              placeholder="Valeur"
              disabled={addForm.dynamique}
              required={!addForm.dynamique}
              style={{ padding: 10, borderRadius: 6, border: "1px solid #e6e6e9" }}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="checkbox"
                name="dynamique"
                checked={addForm.dynamique}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              Valeur dynamique
            </label>
            <input
              name="mois"
              value={addForm.mois}
              onChange={handleChange}
              placeholder="Mois (ex: 09)"
              style={{ padding: 10, borderRadius: 6, border: "1px solid #e6e6e9" }}
            />
            <input
              name="annee"
              value={addForm.annee}
              onChange={handleChange}
              placeholder="Année (ex: 2025)"
              required
              style={{ padding: 10, borderRadius: 6, border: "1px solid #e6e6e9" }}
            />
            <select
              name="division_id"
              value={addForm.division_id}
              onChange={handleChange}
              required
              style={{ padding: 10, borderRadius: 6, border: "1px solid #e6e6e9" }}
            >
              <option value="">Sélectionnez une division...</option>
              {divisionsData.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nom}
                </option>
              ))}
            </select>
            <select
              name="service"
              value={addForm.service}
              onChange={handleChange}
              required
              style={{ padding: 10, borderRadius: 6, border: "1px solid #e6e6e9" }}
            >
              <option value="">Sélectionnez un service...</option>
              {filteredServices.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={actionLoading}
              style={{ background: "#1976d2", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 6 }}
            >
              Ajouter
            </button>
          </form>

          <table border={1} cellPadding={6} style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                <th>Indicateur</th>
                <th>Historique : année, mois, valeur</th>
              </tr>
            </thead>
            <tbody>
              {indicateurs.map((ind) => {
                const history = parseHistory(ind.valeurs);
                return (
                  <tr key={ind.id}>
                    <td>
                      <b>{ind.nom}</b>
                    </td>
                    <td style={{ minWidth: 260 }}>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {history.map((h, k) => (
                          <li key={k}>
                            Année {h.annee} - Mois {h.mois || "-"} : <b>{h.valeur}</b>
                          </li>
                        ))}
                        {history.length === 0 && <li>Aucun historique</li>}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Indicateurs;
// ...fin du fichier...