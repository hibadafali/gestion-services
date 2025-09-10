import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

function getValue(data, nom, mois, annee) {
  const targetM = Number.parseInt(mois, 10);
  const targetA = Number.parseInt(annee, 10);

  const candidates = data.filter(i => i.nom === nom);

  // 1) Rechercher PRIORITAIREMENT dans toutes les history des candidats (match exact)
  for (const item of candidates) {
    let valeurs = item.valeurs;
    if (typeof valeurs === "string") {
      try { valeurs = JSON.parse(valeurs); } catch { valeurs = null; }
    }
    const history = Array.isArray(valeurs?.history) ? valeurs.history : null;
    if (history) {
      const found = history.find(h => {
        const hm = h.mois === undefined ? NaN : Number.parseInt(h.mois, 10);
        const hy = h.annee === undefined ? NaN : Number.parseInt(h.annee, 10);
        return hm === targetM && hy === targetA;
      });
      if (found) {
        const v = found.valeur ?? found.value ?? found.valeurs;
        const num = parseFloat(v);
        const out = Number.isFinite(num) ? num : null;
        console.debug(`[getValue][history] nom=${nom} ${mois}/${annee} ->`, out, found);
        return out;
      }
    }
  }

  // 2) Rechercher dans les enregistrements top-level qui ont mois ET annee explicitement (match exact)
  for (const item of candidates) {
    if (item.mois !== undefined && item.annee !== undefined &&
        Number.parseInt(item.mois, 10) === targetM &&
        Number.parseInt(item.annee, 10) === targetA) {
      const scalar = item.valeur ?? item.value ?? item.valeurs;
      if (scalar !== undefined && scalar !== null && (typeof scalar === "string" || typeof scalar === "number")) {
        const num = parseFloat(scalar);
        const out = Number.isFinite(num) ? num : null;
        console.debug(`[getValue][top-level] nom=${nom} ${mois}/${annee} ->`, out, item);
        return out;
      }
    }
  }

  // 3) Fallback intelligent : construire une timeline globale et retourner
  //    - si le mois demandé existe => exact trouvé plus haut
  //    - sinon => retourner la dernière valeur connue (la plus récente) <= target si possible, sinon la dernière disponible
  const entries = [];

  for (const item of candidates) {
    // top-level dated scalar
    if (item.mois !== undefined && item.annee !== undefined) {
      const m = Number.parseInt(item.mois, 10);
      const y = Number.parseInt(item.annee, 10);
      const scalar = item.valeur ?? item.value ?? item.valeurs;
      const num = (scalar === null || scalar === undefined) ? null : parseFloat(scalar);
      entries.push({ mois: m, annee: y, valeur: Number.isFinite(num) ? num : null, source: item });
    }

    // history inside valeurs
    let valeurs = item.valeurs;
    if (typeof valeurs === "string") {
      try { valeurs = JSON.parse(valeurs); } catch { valeurs = null; }
    }
    const history = Array.isArray(valeurs?.history) ? valeurs.history : null;
    if (history) {
      for (const h of history) {
        const hm = h.mois === undefined ? null : Number.parseInt(h.mois, 10);
        const hy = h.annee === undefined ? null : Number.parseInt(h.annee, 10);
        const v = h.valeur ?? h.value ?? h.valeurs;
        const num = (v === null || v === undefined) ? null : parseFloat(v);
        if (hy !== null && hm !== null) {
          entries.push({ mois: hm, annee: hy, valeur: Number.isFinite(num) ? num : null, source: h });
        }
      }
    }

    // undated scalar (global) — treat as very recent fallback
    const scalar = item.valeur ?? item.value ?? item.valeurs;
    if ((item.mois === undefined && item.annee === undefined) && (typeof scalar === "string" || typeof scalar === "number")) {
      const num = parseFloat(scalar);
      // mark as undated with very large date so it becomes last
      entries.push({ mois: 12, annee: 9999, valeur: Number.isFinite(num) ? num : null, source: item });
    }
  }

  if (entries.length === 0) {
    console.debug(`[getValue][not-found] nom=${nom} ${mois}/${annee} -> null (no entries)`);
    return null;
  }

  // trier chronologiquement asc
  entries.sort((a, b) => {
    if (a.annee === b.annee) return a.mois - b.mois;
    return a.annee - b.annee;
  });

  // si l'utilisateur a fourni un mois/année, chercher la dernière entrée <= cible,
  // sinon retourner la dernière disponible
  if (!Number.isNaN(targetM) && !Number.isNaN(targetA)) {
    let chosen = null;
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (e.annee < targetA || (e.annee === targetA && e.mois <= targetM)) {
        chosen = e;
        break;
      }
    }
    // si aucune entrée <= cible, prendre la dernière disponible (fallback to latest)
    if (!chosen) chosen = entries[entries.length - 1];
    const out = chosen && Number.isFinite(chosen.valeur) ? chosen.valeur : null;
    console.debug(`[getValue][fallback-last] nom=${nom} ${mois}/${annee} ->`, out, chosen);
    return out;
  }

  // si pas de cible fournie, retourner la dernière disponible
  const last = entries[entries.length - 1];
  const out = last && Number.isFinite(last.valeur) ? last.valeur : null;
  console.debug(`[getValue][fallback-last-no-target] nom=${nom} ->`, out, last);
  return out;
}

function buildGlobalTimeline(indicateurs) {
  const entries = [];
  for (const item of indicateurs) {
    // top-level dated scalar
    if (item.mois !== undefined && item.annee !== undefined) {
      const m = Number.parseInt(item.mois, 10);
      const y = Number.parseInt(item.annee, 10);
      const scalar = item.valeur ?? item.value ?? item.valeurs;
      const num = (scalar === null || scalar === undefined) ? null : parseFloat(scalar);
      entries.push({ nom: item.nom, mois: m, annee: y, valeur: Number.isFinite(num) ? num : null });
    }

    // history entries
    let valeurs = item.valeurs;
    if (typeof valeurs === "string") {
      try { valeurs = JSON.parse(valeurs); } catch { valeurs = null; }
    }
    const history = Array.isArray(valeurs?.history) ? valeurs.history : null;
    if (history) {
      for (const h of history) {
        if (h.mois === undefined || h.annee === undefined) continue;
        const hm = Number.parseInt(h.mois, 10);
        const hy = Number.parseInt(h.annee, 10);
        const v = h.valeur ?? h.value ?? h.valeurs;
        const nv = (v === null || v === undefined) ? null : parseFloat(v);
        entries.push({ nom: item.nom, mois: hm, annee: hy, valeur: Number.isFinite(nv) ? nv : null });
      }
    }

    // undated scalar -> treat as latest fallback
    const scalar = item.valeur ?? item.value ?? item.valeurs;
    if ((item.mois === undefined && item.annee === undefined) && (typeof scalar === "string" || typeof scalar === "number")) {
      const num = parseFloat(scalar);
      entries.push({ nom: item.nom, mois: 12, annee: 9999, valeur: Number.isFinite(num) ? num : null });
    }
  }

  // sort asc (oldest -> newest)
  entries.sort((a, b) => (a.annee - b.annee) || (a.mois - b.mois));
  return entries;
}

function rowDataFactory(indicateurs, moisCourant, anneeCourante) {
  // returns a function rowData(nom) bound to given state
  return function rowData(nom) {
    const timeline = buildGlobalTimeline(indicateurs);

    const targetM = parseInt(moisCourant, 10);
    const targetA = parseInt(anneeCourante, 10);

    // find N: last entry for this nom <= target; otherwise last available for this nom
    let NEntry = null;
    for (let i = timeline.length - 1; i >= 0; i--) {
      const e = timeline[i];
      if (e.nom !== nom) continue;
      if (e.annee < targetA || (e.annee === targetA && e.mois <= targetM)) { NEntry = { ...e, idx: i }; break; }
    }
    if (!NEntry) {
      for (let i = timeline.length - 1; i >= 0; i--) {
        if (timeline[i].nom === nom) { NEntry = { ...timeline[i], idx: i }; break; }
      }
    }

    const N = NEntry ? NEntry.valeur : null;

    // N-1: the globally previous entry in the timeline if exists
    let N_1 = null;
    if (NEntry && typeof NEntry.idx === "number" && NEntry.idx > 0) {
      const prev = timeline[NEntry.idx - 1];
      N_1 = prev ? prev.valeur : null;
    } else {
      // fallback: calendar previous month for same nom
      let moisPrec = (parseInt(moisCourant, 10) - 1);
      let anneePrec = parseInt(anneeCourante, 10);
      if (moisPrec === 0) { moisPrec = 12; anneePrec -= 1; }
      const foundPrev = timeline.slice().reverse().find(e => e.nom === nom && (e.annee < anneePrec || (e.annee === anneePrec && e.mois <= moisPrec)));
      N_1 = foundPrev ? foundPrev.valeur : null;
    }

    // N_12: same month previous year for same nom (from timeline)
    const targetA12 = targetA - 1;
    const N12Entry = timeline.slice().reverse().find(e => e.nom === nom && e.annee === targetA12 && e.mois === targetM);
    const N_12 = N12Entry ? N12Entry.valeur : null;

    const varMois = N_1 !== null && N_1 !== 0 && N !== null ? (((N - N_1) / N_1) * 100).toFixed(2) : null;
    const varAnnee = N_12 !== null && N_12 !== 0 && N !== null ? (((N - N_12) / N_12) * 100).toFixed(2) : null;
    return { N, N_1, N_12, varMois, varAnnee };
  };
}

function TableauIndicateurs({ token, mois, annee }) {
  const [indicateurs, setIndicateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moisCourant, setMoisCourant] = useState(mois || (new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [anneeCourante, setAnneeCourante] = useState(annee || new Date().getFullYear().toString());
  const [selectedIndicateur, setSelectedIndicateur] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ nom: "", valeurs: "", mois: "", annee: "" });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ nom: "", valeur: "", type: "", service_id: "", mois: "", annee: "" });

  const tableRef = useRef();

  useEffect(() => {
    setLoading(true);
    setError("");
    if (!token) {
      setIndicateurs([]);
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/indicateurs", {
      headers: { Accept: "application/json", Authorization: token ? `Bearer ${token}` : undefined },
      credentials: "same-origin"
    })
      .then(async (r) => {
        const txt = await r.text();
        let json;
        try { json = txt ? JSON.parse(txt) : null; } catch (e) { json = null; }
        if (!r.ok) throw json || new Error(`HTTP ${r.status}`);
        const payload = Array.isArray(json) ? json : (json && json.data ? json.data : []);
        setIndicateurs(Array.isArray(payload) ? payload : []);
      })
      .catch((err) => {
        console.error("Erreur de chargement indicateurs:", err);
        setError("Erreur de chargement");
        setIndicateurs([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const nomsIndicateurs = Array.from(new Set(indicateurs.map(i => i.nom)));
  const rowData = rowDataFactory(indicateurs, moisCourant, anneeCourante);

  function getChartData(nom) {
    const labels = [], data = [];
    let m = parseInt(moisCourant, 10), y = parseInt(anneeCourante, 10);
    for (let i = 0; i < 12; i++) {
      labels.unshift(`${String(m).padStart(2, '0')}/${y}`);
      data.unshift(getValue(indicateurs, nom, String(m).padStart(2, '0'), String(y)));
      m--;
      if (m === 0) { m = 12; y--; }
    }
    return {
      labels,
      datasets: [{ label: 'Valeur', data, borderColor: 'rgb(75, 192, 192)', tension: 0.1, fill: false }],
    };
  }

  function handleExportPDF() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(autoTable => {
        const doc = new jsPDF.jsPDF();
        doc.text("Tableau de bord des indicateurs", 14, 16);
        autoTable.default(doc, { html: tableRef.current, startY: 24 });
        doc.save("tableau-indicateurs.pdf");
      });
    });
  }

  async function handleDelete(nom) {
    if (!window.confirm(`Supprimer l'indicateur "${nom}" pour ${moisCourant}/${anneeCourante} ?`)) return;
    let item = indicateurs.find(i => i.nom === nom && (i.mois === moisCourant || i.mois === String(parseInt(moisCourant, 10))) && (i.annee === anneeCourante || i.annee === String(parseInt(anneeCourante, 10))));
    if (!item) item = indicateurs.find(i => i.nom === nom);
    if (!item) { alert("Aucun enregistrement trouvé à supprimer."); return; }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/indicateurs/${item.id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        credentials: "same-origin"
      });
      if (!res.ok) {
        const txt = await res.text();
        let json; try { json = txt ? JSON.parse(txt) : null } catch (e) { json = null }
        throw json || new Error(`HTTP ${res.status}`);
      }
      setIndicateurs(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur lors de la suppression");
    }
  }

 // ...existing code...
function handleModify(nom) {
  let item = indicateurs.find(i => i.nom === nom && (i.mois === moisCourant || i.mois === String(parseInt(moisCourant, 10))) && (i.annee === anneeCourante || i.annee === String(parseInt(anneeCourante, 10))));
  if (!item) item = indicateurs.find(i => i.nom === nom);
  if (!item) { alert("Aucun enregistrement trouvé pour modification."); return; }

  // extraire la dernière valeur scalaire (préférence: dernier history, sinon top-level scalar)
  let extractedValue = "";
  // try history last entry
  let vals = item.valeurs;
  if (typeof vals === "string") {
    try { vals = JSON.parse(vals); } catch { vals = null; }
  }
  const hist = Array.isArray(vals?.history) ? vals.history : null;
  if (hist && hist.length) {
    // trouver le dernier élément ayant une valeur numérique
    for (let i = hist.length - 1; i >= 0; i--) {
      const h = hist[i];
      const v = h?.valeur ?? h?.value ?? h?.valeurs;
      if (v !== undefined && v !== null && v !== "") {
        extractedValue = String(v);
        break;
      }
    }
  }

  // si pas de history, vérifier top-level scalar fields
  if (!extractedValue) {
    const scalar = item.valeur ?? item.value ?? item.valeurs;
    if (scalar !== undefined && scalar !== null && (typeof scalar === "string" || typeof scalar === "number")) {
      extractedValue = String(scalar);
    }
  }

  // extraire mois/annee si présents (top-level ou dernier history)
  let mois = item.mois !== undefined && item.mois !== null ? String(item.mois).padStart(2, "0") : "";
  let annee = item.annee !== undefined && item.annee !== null ? String(item.annee) : "";
  if ((!mois || !annee) && hist && hist.length) {
    const last = hist[hist.length - 1];
    if (!mois && last.mois !== undefined) mois = String(last.mois).padStart(2, "0");
    if (!annee && last.annee !== undefined) annee = String(last.annee);
  }

  setEditingItem(item);
  setEditForm({
    nom: item.nom ?? "",
    // show only the scalar value (not the full JSON)
    valeurs: extractedValue,
    mois,
    annee
  });
  setModalOpen(true);
}
//

  function closeModal() {
    setModalOpen(false);
    setEditingItem(null);
    setEditForm({ nom: "", valeurs: "", mois: "", annee: "" });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const bodyObj = { nom: (editForm.nom || "").trim() };

      // construire 'valeurs' de manière robuste :
      // - si editForm.valeurs est JSON -> parser et envoyer
      // - si nombre simple -> créer valeurs.history avec mois/annee fournis (ou courant)
      let vf = editForm.valeurs;
      let parsed = null;
      if (vf !== undefined && vf !== null && vf !== "") {
        if (typeof vf === "string" && (vf.trim().startsWith("{") || vf.trim().startsWith("["))) {
          try { parsed = JSON.parse(vf); } catch (e) { parsed = null; }
        }
      }

      if (parsed !== null) {
        bodyObj.valeurs = parsed;
      } else if (vf !== undefined && vf !== null && vf !== "") {
        // essayer valeur numérique
        const num = Number(vf);
        const moisInt = editForm.mois !== "" && editForm.mois != null ? parseInt(editForm.mois, 10) : parseInt(moisCourant, 10);
        const anneeInt = editForm.annee !== "" && editForm.annee != null ? parseInt(editForm.annee, 10) : parseInt(anneeCourante, 10);
        if (!Number.isNaN(num)) {
          bodyObj.valeurs = { history: [{ annee: anneeInt, mois: moisInt, valeur: num }] };
          bodyObj.mois = moisInt;
          bodyObj.annee = anneeInt;
        } else {
          // en dernier recours envoyer la chaîne comme-is
          bodyObj.valeurs = vf;
        }
      }

      const res = await fetch(`http://127.0.0.1:8000/api/indicateurs/${editingItem.id}`, {
        method: "PUT",
        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        credentials: "same-origin",
        body: JSON.stringify(bodyObj)
      });

      const txt = await res.text();
      let json; try { json = txt ? JSON.parse(txt) : null } catch (e) { json = null; }
      if (!res.ok) {
        console.error("PUT /api/indicateurs error:", txt, json);
        throw json || new Error(`HTTP ${res.status}`);
      }

      const updated = json?.data || (json?.id ? json : null);
      const newItem = updated || { ...editingItem, nom: bodyObj.nom, valeurs: bodyObj.valeurs };
      setIndicateurs(prev => prev.map(i => i.id === editingItem.id ? newItem : i));
      closeModal();
    } catch (err) {
      console.error("Erreur mise à jour :", err);
      alert("Erreur lors de la mise à jour :\n" + (err.message || JSON.stringify(err) || err));
    }
  }

  function openAddModal() {
    setAddForm({ nom: "", valeur: "", type: "", service_id: "", mois: "", annee: "" });
    setIsAddModalOpen(true);
  }

  function closeAddModal() {
    setIsAddModalOpen(false);
  }

  function handleAddChange(e) {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    if (!((addForm.nom || "").trim()) || addForm.valeur === "" || !((addForm.type || "").trim()) || !addForm.service_id) {
      alert("Le nom, la valeur, le type et le service sont requis.");
      return;
    }

    try {
      const moisInt = addForm.mois !== "" && addForm.mois != null ? parseInt(addForm.mois, 10) : NaN;
      const anneeInt = addForm.annee !== "" && addForm.annee != null ? parseInt(addForm.annee, 10) : NaN;

      const bodyObj = {
        nom: (addForm.nom || "").trim(),
        valeur: addForm.valeur,
        type: (addForm.type || "").trim(),
        valeurs: {
          history: [
            {
              annee: !Number.isNaN(anneeInt) ? anneeInt : (addForm.annee ? parseInt(addForm.annee, 10) : null),
              mois: !Number.isNaN(moisInt) ? moisInt : (addForm.mois ? parseInt(addForm.mois, 10) : null),
              valeur: Number(addForm.valeur)
            }
          ]
        },
        service_id: addForm.service_id
      };

      if (!Number.isNaN(moisInt)) bodyObj.mois = moisInt;
      if (!Number.isNaN(anneeInt)) bodyObj.annee = anneeInt;

      const res = await fetch(`http://127.0.0.1:8000/api/indicateurs`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        credentials: "same-origin",
        body: JSON.stringify(bodyObj)
      });
      const txt = await res.text();
      let json; try { json = txt ? JSON.parse(txt) : null } catch (e) { json = null; }
      if (!res.ok) {
        const serverMsg = json || txt || `HTTP ${res.status}`;
        throw serverMsg;
      }

      const newItem = json?.data || (json?.id ? json : null);
      if (newItem) setIndicateurs(prev => [...prev, newItem]);
      closeAddModal();
    } catch (err) {
      console.error("Erreur d'ajout :", err);
      const errorMessage = (err && (err.message || err.error || JSON.stringify(err))) || "Erreur inconnue";
      alert("Erreur lors de l'ajout :\n" + errorMessage);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto" }}>
      <h2>Tableau de bord des indicateurs</h2>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <label>Mois : <input value={moisCourant} onChange={e => setMoisCourant(e.target.value)} style={{ width: 40 }} /></label>
        <label style={{ marginLeft: 16 }}>Année : <input value={anneeCourante} onChange={e => setAnneeCourante(e.target.value)} style={{ width: 60 }} /></label>
        <button onClick={handleExportPDF} style={{ marginLeft: 24, background: "#475569", color: "#fff", border: 0, borderRadius: 4, padding: "6px 16px", cursor: 'pointer' }}>Exporter PDF</button>
        <button onClick={openAddModal} style={{ marginLeft: 8, background: "#16a34a", color: "#fff", border: 0, borderRadius: 4, padding: "6px 16px", cursor: 'pointer' }}>Ajouter un indicateur</button>
      </div>

      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      {loading ? (<div>Chargement...</div>) : (
        <>
          <table ref={tableRef} style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ minWidth: 200, padding: 8, textAlign: 'left' }}>Indicateur</th>
                <th style={{ padding: 8 }}>Mois courant (N)</th>
                <th style={{ padding: 8 }}>Mois précédent (N-1)</th>
                <th style={{ padding: 8 }}>Var. Mois (%)</th>
                <th style={{ padding: 8 }}>Même mois année précédente (N-12)</th>
                <th style={{ padding: 8 }}>Var. Année (%)</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nomsIndicateurs.map((nom) => {
                const { N, N_1, N_12, varMois, varAnnee } = rowData(nom);
                return (
                  <tr key={nom}>
                    <td style={{ fontWeight: 600, border: '1px solid #e2e8f0', padding: 8 }}>{nom}</td>
                    <td style={{ background: "#f0f9ff", border: '1px solid #e2e8f0', padding: 8, textAlign: 'center' }}>{N !== null ? N : "-"}</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: 8, textAlign: 'center' }}>{N_1 !== null ? N_1 : "-"}</td>
                    <td style={{ color: varMois < 0 ? "#ef4444" : "#059669", border: '1px solid #e2e8f0', padding: 8, textAlign: 'center' }}>{varMois !== null ? varMois + "%" : "-"}</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: 8, textAlign: 'center' }}>{N_12 !== null ? N_12 : "-"}</td>
                    <td style={{ color: varAnnee < 0 ? "#ef4444" : "#059669", border: '1px solid #e2e8f0', padding: 8, textAlign: 'center' }}>{varAnnee !== null ? varAnnee + "%" : "-"}</td>
                    <td style={{ display: "flex", gap: 8, padding: 8, border: '1px solid #e2e8f0', justifyContent: 'center' }}>
                      <button onClick={() => setSelectedIndicateur(nom)} style={{ background: "#e2e8f0", border: `1px solid #cbd5e1`, borderRadius: 4, padding: "2px 8px", color: "#475569", cursor: 'pointer' }}>Voir</button>
                      <button onClick={() => handleModify(nom)} style={{ background: "#60a5fa", border: `1px solid #3b82f6`, borderRadius: 4, padding: "2px 8px", color: "white", cursor: 'pointer' }}>Modifier</button>
                      <button onClick={() => handleDelete(nom)} style={{ background: "#ef4444", border: "none", borderRadius: 4, padding: "2px 8px", color: "white", cursor: 'pointer' }}>Supprimer</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {selectedIndicateur && (
            <div style={{ marginTop: 32, background: "#f8fafc", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(100, 116, 139, 0.15)", border: "1px solid #e2e8f0" }}>
              <h3>Évolution sur 12 mois : {selectedIndicateur}</h3>
              <Line data={getChartData(selectedIndicateur)} options={{ responsive: true, plugins: { legend: { display: false } } }} height={80} />
              <button onClick={() => setSelectedIndicateur("")} style={{ marginTop: 16, background: "#475569", color: "white", border: "none", padding: "8px 16px", borderRadius: 4, cursor: 'pointer' }}>Fermer</button>
            </div>
          )}

          {modalOpen && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
              <div style={{ width: 520, background: "white", borderRadius: 8, padding: 20, boxShadow: "0 6px 24px rgba(0,0,0,0.2)" }}>
                <h3 style={{ marginTop: 0 }}>Modifier un indicateur</h3>
                <form onSubmit={handleEditSubmit} style={{ display: "grid", gap: 12 }}>
                  <label>
                    Nom
                    <input name="nom" value={editForm.nom} onChange={handleEditChange} placeholder="Nom de l'indicateur" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box', marginTop: 4 }} />
                  </label>
                  <label>
                    Valeur 
                    <input name="valeurs" value={editForm.valeurs} onChange={handleEditChange} placeholder="Valeur ou JSON" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box', marginTop: 4 }} />
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <label style={{ flex: 1 }}>Mois<input name="mois" value={editForm.mois} onChange={handleEditChange} placeholder="MM" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box' }} /></label>
                    <label style={{ flex: 1 }}>Année<input name="annee" value={editForm.annee} onChange={handleEditChange} placeholder="YYYY" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box' }} /></label>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                    <button type="button" onClick={closeModal} style={{ padding: "8px 12px", borderRadius: 6, cursor: 'pointer' }}>Annuler</button>
                    <button type="submit" style={{ background: "#60a5fa", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: 'pointer' }}>Modifier</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isAddModalOpen && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
              <div style={{ width: 520, background: "white", borderRadius: 8, padding: 20, boxShadow: "0 6px 24px rgba(0,0,0,0.2)" }}>
                <h3 style={{ marginTop: 0 }}>Ajouter un indicateur</h3>
                <form onSubmit={handleAddSubmit} style={{ display: "grid", gap: 8 }}>
                  <label>Nom<input name="nom" value={addForm.nom} onChange={handleAddChange} placeholder="Nom du nouvel indicateur" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box' }} /></label>
                  <label>Type<input name="type" value={addForm.type} onChange={handleAddChange} placeholder="Type (ex: Financier, Opérationnel)" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box' }} /></label>
                  <label>Valeur<input name="valeur" value={addForm.valeur} onChange={handleAddChange} placeholder="Valeur" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box' }} /></label>
                  <label>Service
                    <input name="service_id" value={addForm.service_id} onChange={handleAddChange} placeholder="ID du service" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box' }} />
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <label style={{ flex: 1 }}>Mois<input name="mois" value={addForm.mois} onChange={handleAddChange} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box' }} /></label>
                    <label style={{ flex: 1 }}>Année<input name="annee" value={addForm.annee} onChange={handleAddChange} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #e5e7eb", boxSizing: 'border-box' }} /></label>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                    <button type="button" onClick={closeAddModal} style={{ padding: "8px 12px", borderRadius: 6, cursor: 'pointer' }}>Annuler</button>
                    <button type="submit" style={{ background: "#16a34a", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: 'pointer' }}>Ajouter</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TableauIndicateurs;