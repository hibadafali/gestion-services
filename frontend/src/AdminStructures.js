import React, { useState, useEffect } from "react";

function AdminStructures({ token }) {
  const [structures, setStructures] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nom: "", division: "", service: "" });
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState("structures");

  useEffect(() => {
    fetchAll();
  }, []);

  function fetchAll() {
    setLoading(true);
    Promise.all([
      fetch("/api/entite-prefectures", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch("/api/divisions", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch("/api/services", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([str, div, serv]) => {
        setStructures(str);
        setDivisions(div);
        setServices(serv);
      })
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }

  // --- STRUCTURES (EntitePrefecture)
  function handleStructureSubmit(e) {
    e.preventDefault();
    setError("");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/entite-prefectures/${editing}` : "/api/entite-prefectures";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nom: form.nom }),
    })
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).message || "Erreur");
        return r.json();
      })
      .then(() => {
        setForm({ nom: "", division: "", service: "" });
        setEditing(null);
        fetchAll();
      })
      .catch(err => setError(err.message));
  }
  function handleStructureEdit(s) {
    setEditing(s.id);
    setForm({ nom: s.nom, division: "", service: "" });
  }
  function handleStructureDelete(id) {
    if (!window.confirm("Supprimer cette structure ?")) return;
    fetch(`/api/entite-prefectures/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchAll())
      .catch(() => setError("Erreur suppression"));
  }

  // --- DIVISIONS
  function handleDivisionSubmit(e) {
    e.preventDefault();
    setError("");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/divisions/${editing}` : "/api/divisions";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nom: form.nom, entite_prefecture_id: form.division }),
    })
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).message || "Erreur");
        return r.json();
      })
      .then(() => {
        setForm({ nom: "", division: "", service: "" });
        setEditing(null);
        fetchAll();
      })
      .catch(err => setError(err.message));
  }
  function handleDivisionEdit(d) {
    setEditing(d.id);
    setForm({ nom: d.nom, division: d.entite_prefecture_id, service: "" });
  }
  function handleDivisionDelete(id) {
    if (!window.confirm("Supprimer cette division ?")) return;
    fetch(`/api/divisions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchAll())
      .catch(() => setError("Erreur suppression"));
  }

  // --- SERVICES
  function handleServiceSubmit(e) {
    e.preventDefault();
    setError("");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/services/${editing}` : "/api/services";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nom: form.nom, division_id: form.service }),
    })
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).message || "Erreur");
        return r.json();
      })
      .then(() => {
        setForm({ nom: "", division: "", service: "" });
        setEditing(null);
        fetchAll();
      })
      .catch(err => setError(err.message));
  }
  function handleServiceEdit(sv) {
    setEditing(sv.id);
    setForm({ nom: sv.nom, division: "", service: sv.division_id });
  }
  function handleServiceDelete(id) {
    if (!window.confirm("Supprimer ce service ?")) return;
    fetch(`/api/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchAll())
      .catch(() => setError("Erreur suppression"));
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>Gestion des structures, divisions et services</h2>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <button onClick={() => { setTab("structures"); setEditing(null); setForm({ nom: "", division: "", service: "" }); }} style={{ background: tab === "structures" ? "#1976d2" : "#eee", color: tab === "structures" ? "#fff" : "#222", padding: 8, borderRadius: 4 }}>Structures</button>
        <button onClick={() => { setTab("divisions"); setEditing(null); setForm({ nom: "", division: "", service: "" }); }} style={{ background: tab === "divisions" ? "#1976d2" : "#eee", color: tab === "divisions" ? "#fff" : "#222", padding: 8, borderRadius: 4 }}>Divisions</button>
        <button onClick={() => { setTab("services"); setEditing(null); setForm({ nom: "", division: "", service: "" }); }} style={{ background: tab === "services" ? "#1976d2" : "#eee", color: tab === "services" ? "#fff" : "#222", padding: 8, borderRadius: 4 }}>Services</button>
      </div>
      {loading ? (<div>Chargement...</div>) : (
        <>
          {tab === "structures" && (
            <>
              <form onSubmit={handleStructureSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input name="nom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Nom de la structure" required style={{ flex: 2 }} />
                <button type="submit" style={{ flex: 1, background: "#1976d2", color: "#fff", border: 0, borderRadius: 4, padding: 8 }}>{editing ? "Mettre à jour" : "Ajouter"}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ nom: "", division: "", service: "" }); }}>Annuler</button>}
              </form>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr><th>Nom</th><th></th></tr></thead>
                <tbody>
                  {structures.map(s => (
                    <tr key={s.id}>
                      <td>{s.nom}</td>
                      <td>
                        <button onClick={() => handleStructureEdit(s)} style={{ marginRight: 8 }}>Éditer</button>
                        <button onClick={() => handleStructureDelete(s.id)} style={{ color: "red" }}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {tab === "divisions" && (
            <>
              <form onSubmit={handleDivisionSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input name="nom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Nom de la division" required style={{ flex: 2 }} />
                <select name="division" value={form.division} onChange={e => setForm(f => ({ ...f, division: e.target.value }))} required style={{ flex: 2 }}>
                  <option value="">Structure...</option>
                  {structures.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                </select>
                <button type="submit" style={{ flex: 1, background: "#1976d2", color: "#fff", border: 0, borderRadius: 4, padding: 8 }}>{editing ? "Mettre à jour" : "Ajouter"}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ nom: "", division: "", service: "" }); }}>Annuler</button>}
              </form>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr><th>Nom</th><th>Structure</th><th></th></tr></thead>
                <tbody>
                  {divisions.map(d => (
                    <tr key={d.id}>
                      <td>{d.nom}</td>
                      <td>{structures.find(s => s.id === d.entite_prefecture_id)?.nom || ""}</td>
                      <td>
                        <button onClick={() => handleDivisionEdit(d)} style={{ marginRight: 8 }}>Éditer</button>
                        <button onClick={() => handleDivisionDelete(d.id)} style={{ color: "red" }}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {tab === "services" && (
            <>
              <form onSubmit={handleServiceSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input name="nom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Nom du service" required style={{ flex: 2 }} />
                <select name="service" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} required style={{ flex: 2 }}>
                  <option value="">Division...</option>
                  {divisions.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
                </select>
                <button type="submit" style={{ flex: 1, background: "#1976d2", color: "#fff", border: 0, borderRadius: 4, padding: 8 }}>{editing ? "Mettre à jour" : "Ajouter"}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ nom: "", division: "", service: "" }); }}>Annuler</button>}
              </form>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr><th>Nom</th><th>Division</th><th></th></tr></thead>
                <tbody>
                  {services.map(sv => (
                    <tr key={sv.id}>
                      <td>{sv.nom}</td>
                      <td>{divisions.find(d => d.id === sv.division_id)?.nom || ""}</td>
                      <td>
                        <button onClick={() => handleServiceEdit(sv)} style={{ marginRight: 8 }}>Éditer</button>
                        <button onClick={() => handleServiceDelete(sv.id)} style={{ color: "red" }}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AdminStructures;
