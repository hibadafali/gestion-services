import React, { useState, useEffect } from "react";

function AdminUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    type: "interne",
    is_admin: false,
    division_id: "",
    service_id: "",
    pachalik_id: "",
    annexe_id: "",
    telephone: "",
    adresse: ""
  });
  const [editing, setEditing] = useState(null);

  // Divisions et services (structure inchangée)
  const [divisions, setDivisions] = useState([
    {
      id: "1",
      nom: "Division des collectivités locales",
      services: [
        { id: "1", nom: "Service des conseils élus" },
        { id: "2", nom: "Service des finances locales et personnel" },
        { id: "3", nom: "Service du patrimoine, planification et programmation" },
        { id: "4", nom: "Service de contrôle de la gestion des services publics communaux" },
        { id: "5", nom: "Service de l’état civil" }
      ]
    },
    {
      id: "2",
      nom: "Division des ressources humaines et des affaires générales",
      services: [
        { id: "6", nom: "Service des ressources humaines" },
        { id: "7", nom: "Service de la formation continue" },
        { id: "8", nom: "Service des moyens généraux et de la logistique" }
      ]
    },
    {
      id: "3",
      nom: "Division du budget et des marchés",
      services: [
        { id: "9", nom: "Service du budget" },
        { id: "10", nom: "Service de la comptabilité" },
        { id: "11", nom: "Service des marchés" }
      ]
    },
    {
      id: "4",
      nom: "Division des systèmes d’information et de communication et gestion",
      services: [
        { id: "12", nom: "Service des systèmes d’information et communication" },
        { id: "13", nom: "Service de contrôle de gestion" }
      ]
    },
    {
      id: "5",
      nom: "Division du développement rural",
      services: [
        { id: "14", nom: "Service des terres collectives" },
        { id: "15", nom: "Service du développement rural" }
      ]
    },
    {
      id: "6",
      nom: "Division des affaires économiques et de la coordination",
      services: [
        { id: "16", nom: "Service de planification économique et programmation" },
        { id: "17", nom: "Service de l’action économique et du contrôle" },
        { id: "18", nom: "Service des affaires touristiques et du transport" },
        { id: "19", nom: "Service de l’animation culturelle et sportive" }
      ]
    },
    {
      id: "7",
      nom: "Division de l’urbanisme et de l’environnement",
      services: [
        { id: "20", nom: "Service de l’urbanisme et du contrôle des constructions" },
        { id: "21", nom: "Service de l’environnement" },
        { id: "22", nom: "Service de gestion des risques naturels" }
      ]
    },
    {
      id: "8",
      nom: "Division des équipements",
      services: [
        { id: "23", nom: "Service des études techniques" },
        { id: "24", nom: "Service des équipements et infrastructures" },
        { id: "25", nom: "Service de la propreté de la ville" }
      ]
    },
    {
      id: "9",
      nom: "Division de l’action sociale",
      services: [
        { id: "26", nom: "Service de la coordination sociale intersectorielle" },
        { id: "27", nom: "Service du suivi et évaluation" },
        { id: "28", nom: "Service de la communication" },
        { id: "29", nom: "Service de la formation et renforcement des capacités" }
      ]
    }
  ]);
  const [newService, setNewService] = useState({ division_id: "", nom: "" });

  // Pachalik et annexes (structure inchangée)
  const [pachaliks, setPachaliks] = useState([
    { id: "1", nom: "Pachalik M’CHOUAR KASBAH" },
    { id: "2", nom: "Pachalik MASSIRA ANNAKHIL" },
    { id: "3", nom: "Pachalik TASSOULIANTE" },
    { id: "4", nom: "Pachalik TAMENSOURT" }
  ]);
  const [annexes, setAnnexes] = useState([
    { id: "1", nom: "AA M’CHOUAR", pachalik_id: "1" },
    { id: "2", nom: "AA KASBAH", pachalik_id: "1" },
    { id: "3", nom: "AA SIDI YOUSSEF BEN ALI", pachalik_id: "2" },
    { id: "4", nom: "AA SYBA NORD", pachalik_id: "3" },
    { id: "5", nom: "AA SYBA SUD", pachalik_id: "3" },
    { id: "6", nom: "AA JAMAA LAFNA", pachalik_id: "4" },
    { id: "7", nom: "AA BAB DOUKKALA", pachalik_id: "4" },
    { id: "8", nom: "AA BAB TAGHZOUT", pachalik_id: "4" },
    { id: "9", nom: "AA BAB GHMAT", pachalik_id: "4" },
    { id: "10", nom: "AA BAB D’BAGH", pachalik_id: "4" },
    { id: "11", nom: "AA AL FATH", pachalik_id: "4" },
    { id: "12", nom: "AA ATLAS", pachalik_id: "4" },
    { id: "13", nom: "AA HAY HASSANI", pachalik_id: "2" },
    { id: "14", nom: "AA HAY NAHDA", pachalik_id: "2" },
    { id: "15", nom: "AA HAY SIDI GHANEM", pachalik_id: "2" },
    { id: "16", nom: "AA BOUKHAZAR", pachalik_id: "3" },
    { id: "17", nom: "AA SIDI YOUB", pachalik_id: "3" },
    { id: "18", nom: "AA ASKJELD", pachalik_id: "3" }
  ]);
  const [newAnnexe, setNewAnnexe] = useState({ pachalik_id: "", nom: "" });

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => setError(err.message));
  }, [token, success]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  // Ajouter un service à une division
  function handleAddService(e) {
    e.preventDefault();
    if (!newService.division_id || !newService.nom) return;
    setDivisions(divs =>
      divs.map(div =>
        div.id === newService.division_id
          ? {
              ...div,
              services: [
                ...div.services,
                {
                  id: `${div.services.length + 1000}`,
                  nom: newService.nom
                }
              ]
            }
          : div
      )
    );
    setNewService({ division_id: "", nom: "" });
  }

  // Ajouter une annexe à un pachalik
  function handleAddAnnexe(e) {
    e.preventDefault();
    if (!newAnnexe.pachalik_id || !newAnnexe.nom) return;
    setAnnexes(a => [
      ...a,
      { id: `${a.length + 1000}`, nom: newAnnexe.nom, pachalik_id: newAnnexe.pachalik_id }
    ]);
    setNewAnnexe({ pachalik_id: "", nom: "" });
  }

  // Services filtrés selon la division sélectionnée
  const servicesFiltered =
    divisions.find(d => d.id === form.division_id)?.services || [];

  // Annexes filtrées selon le pachalik sélectionné
  const annexesFiltered =
    annexes.filter(a => a.pachalik_id === form.pachalik_id);

  // Ajouter ou modifier un utilisateur
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      let url = "http://127.0.0.1:8000/api/users";
      let method = "POST";
      if (editing) {
        url = `http://127.0.0.1:8000/api/users/${editing}`;
        method = "PUT";
      }
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de l'enregistrement");
      }
      setSuccess(editing ? "Utilisateur modifié !" : "Utilisateur ajouté !");
      setForm({
        name: "",
        email: "",
        password: "",
        type: "interne",
        is_admin: false,
        division_id: "",
        service_id: "",
        pachalik_id: "",
        annexe_id: "",
        telephone: "",
        adresse: ""
      });
      setEditing(null);
    } catch (err) {
      setError(err.message);
    }
  }

  // Supprimer un utilisateur
  async function handleDelete(id) {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la suppression");
      }
      setSuccess("Utilisateur supprimé !");
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Pré-remplir le formulaire pour modification
  function handleEdit(user) {
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      type: user.type || "interne",
      is_admin: !!user.is_admin,
      division_id: user.division_id || "",
      service_id: user.service_id || "",
      pachalik_id: user.pachalik_id || "",
      annexe_id: user.annexe_id || "",
      telephone: user.telephone || "",
      adresse: user.adresse || ""
    });
    setEditing(user.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h2>Gestion des Utilisateurs</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: 12 }}>{success}</div>}

      {/* Ajouter un service à une division */}
      <div style={{ background: "#f9fafb", padding: 20, borderRadius: 12, marginBottom: 32 }}>
        <h4>Ajouter un service à une division</h4>
        <form onSubmit={handleAddService} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <select
            value={newService.division_id}
            onChange={e => setNewService(s => ({ ...s, division_id: e.target.value }))}
            style={{ padding: 8, borderRadius: 8 }}
            required
          >
            <option value="">Sélectionner une division</option>
            {divisions.map(div => (
              <option key={div.id} value={div.id}>{div.nom}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nom du nouveau service"
            value={newService.nom}
            onChange={e => setNewService(s => ({ ...s, nom: e.target.value }))}
            style={{ padding: 8, borderRadius: 8 }}
            required
          />
          <button type="submit" style={{ padding: "8px 16px", borderRadius: 8, background: "#2563eb", color: "white", border: "none" }}>
            Ajouter Service
          </button>
        </form>
      </div>

      {/* Ajouter une annexe à un pachalik */}
      <div style={{ background: "#f9fafb", padding: 20, borderRadius: 12, marginBottom: 32 }}>
        <h4>Ajouter une annexe à un pachalik</h4>
        <form onSubmit={handleAddAnnexe} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <select
            value={newAnnexe.pachalik_id}
            onChange={e => setNewAnnexe(s => ({ ...s, pachalik_id: e.target.value }))}
            style={{ padding: 8, borderRadius: 8 }}
            required
          >
            <option value="">Sélectionner un pachalik</option>
            {pachaliks.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nom de la nouvelle annexe"
            value={newAnnexe.nom}
            onChange={e => setNewAnnexe(s => ({ ...s, nom: e.target.value }))}
            style={{ padding: 8, borderRadius: 8 }}
            required
          />
          <button type="submit" style={{ padding: "8px 16px", borderRadius: 8, background: "#2563eb", color: "white", border: "none" }}>
            Ajouter Annexe
          </button>
        </form>
      </div>

      {/* Formulaire utilisateur */}
      <form
        onSubmit={handleSubmit}
        style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px #e5e7eb", marginBottom: 32 }}
      >
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <input
            name="name"
            type="text"
            placeholder="Nom complet"
            value={form.name}
            onChange={handleChange}
            style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            required
            disabled={!!editing}
          />
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <input
            name="password"
            type="password"
            placeholder={editing ? "Laisser vide pour ne pas changer" : "Mot de passe"}
            value={form.password}
            onChange={handleChange}
            style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            required={!editing}
          />
          <input
            name="telephone"
            type="text"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={handleChange}
            style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            name="adresse"
            type="text"
            placeholder="Adresse"
            value={form.adresse}
            onChange={handleChange}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              name="is_admin"
              checked={form.is_admin}
              onChange={handleChange}
              style={{ marginRight: 8 }}
            />
            Administrateur
          </label>
        </div>
        {/* Affectation interne */}
        {form.type === "interne" && (
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label>Division</label>
              <select
                name="division_id"
                value={form.division_id}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                required
              >
                <option value="">Sélectionner une division</option>
                {divisions.map(div => (
                  <option key={div.id} value={div.id}>{div.nom}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Service</label>
              <select
                name="service_id"
                value={form.service_id}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                required
                disabled={!form.division_id}
              >
                <option value="">Sélectionner un service</option>
                {servicesFiltered.map(s => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        {/* Affectation externe */}
        {form.type === "externe" && (
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label>Pachalik</label>
              <select
                name="pachalik_id"
                value={form.pachalik_id}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                required
              >
                <option value="">Sélectionner un pachalik</option>
                {pachaliks.map(p => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Annexe</label>
              <select
                name="annexe_id"
                value={form.annexe_id}
                onChange={handleChange}
                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                required
                disabled={!form.pachalik_id}
              >
                <option value="">Sélectionner une annexe</option>
                {annexesFiltered.map(a => (
                  <option key={a.id} value={a.id}>{a.nom}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <label>Type d'utilisateur</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
          >
            <option value="interne">Interne (Division/Service)</option>
            <option value="externe">Externe (Pachalik/Annexe)</option>
          </select>
        </div>
        <button type="submit" style={{ padding: "12px 32px", borderRadius: 8, background: "#10b981", color: "white", border: "none", fontWeight: "bold" }}>
          {editing ? "Modifier" : "Enregistrer"} Utilisateur
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                name: "",
                email: "",
                password: "",
                type: "interne",
                is_admin: false,
                division_id: "",
                service_id: "",
                pachalik_id: "",
                annexe_id: "",
                telephone: "",
                adresse: ""
              });
            }}
            style={{ marginLeft: 16, padding: "12px 32px", borderRadius: 8, background: "#e5e7eb", color: "#1e293b", border: "none", fontWeight: "bold" }}
          >
            Annuler
          </button>
        )}
      </form>

      {/* Tableau des utilisateurs */}
      <div style={{ marginTop: 32 }}>
        <h3>Liste des utilisateurs</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ border: "1px solid #e5e7eb", padding: 8 }}>Nom</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 8 }}>Email</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 8 }}>Type</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 8 }}>Division</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 8 }}>Service</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 8 }}>Pachalik</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 8 }}>Annexe</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 8 }}>Admin</th>
              <th style={{ border: "1px solid #e5e7eb", padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 16, color: "#64748b" }}>
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{u.name}</td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{u.email}</td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{u.type}</td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>
                    {divisions.find(d => d.id === String(u.division_id))?.nom || ""}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>
                    {divisions
                      .find(d => d.id === String(u.division_id))
                      ?.services.find(s => s.id === String(u.service_id))?.nom || ""}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>
                    {pachaliks.find(p => p.id === String(u.pachalik_id))?.nom || ""}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>
                    {annexes.find(a => a.id === String(u.annexe_id))?.nom || ""}
                  </td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{u.is_admin ? "Oui" : "Non"}</td>
                  <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>
                    <button
                      onClick={() => handleEdit(u)}
                      style={{ marginRight: 8, padding: "4px 12px", borderRadius: 6, background: "#2563eb", color: "white", border: "none" }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{ padding: "4px 12px", borderRadius: 6, background: "#e57373", color: "white", border: "none" }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;