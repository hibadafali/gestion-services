// ...existing code...
import React, { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

function PriorityPill({ priority }) {
  const map = {
    urgente: { bg: "#fff1f0", color: "#ef4444" },
    haute: { bg: "#fff7ed", color: "#f97316" },
    normale: { bg: "#ecfdf5", color: "#059669" },
    faible: { bg: "#eef2ff", color: "#6366f1" },
  };
  const style = map[priority] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      padding: "4px 8px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      textTransform: "capitalize"
    }}>{priority ?? "normale"}</span>
  );
}

function StatusBadge({ statut }) {
  const map = {
    en_attente: { bg: "#fff7ed", color: "#f97316", label: "En attente" },
    traite: { bg: "#ecfdf5", color: "#059669", label: "Traité" },
    annule: { bg: "#fff1f0", color: "#ef4444", label: "Annulé" },
  };
  const s = map[statut] || { bg: "#f3f4f6", color: "#374151", label: statut ?? "N/A" };
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      padding: "6px 10px",
      borderRadius: 8,
      fontWeight: 700,
      fontSize: 13
    }}>{s.label}</span>
  );
}

function Avatar({ name }) {
  const initials = (name || "").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase() || "U";
  return (
    <div style={{
      width: 46, height: 46, borderRadius: 10,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg,#f3e8ff,#ffd7e2)",
      color: "#4c1d95", fontWeight: 800, fontSize: 16, boxShadow: "0 4px 18px rgba(16,24,40,0.06)"
    }}>{initials}</div>
  );
}

function CommentCard({ d, onReplyClick, onEditClick, onDeleteClick }) {
  return (
    <div style={{
      display: "flex", gap: 16, padding: 16, borderRadius: 12,
      background: "white", boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
      border: "1px solid rgba(15,23,42,0.03)"
    }}>
      <div style={{ flexShrink: 0 }}>
        <Avatar name={d.user?.name} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{d.objet ?? `Demande #${d.id}`}</div>
            <div style={{ marginTop: 6, color: "#475569", fontSize: 13 }}>{d.commentaire}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#475569", fontSize: 13 }}>
                <strong style={{ fontWeight: 700, marginRight: 6 }}>{d.user?.name}</strong>
                <span style={{ opacity: 0.75 }}>{d.user?.type}</span>
              </div>
              <div style={{ marginLeft: 6 }}><PriorityPill priority={d.priorite} /></div>
              <div style={{ marginLeft: 6 }}><StatusBadge statut={d.statut} /></div>
            </div>
          </div>
          <div style={{ textAlign: "right", minWidth: 140 }}>
            <div style={{ color: "#94a3b8", fontSize: 13 }}>{d.service?.nom ?? "Service inconnu"}</div>
            <div style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>{formatDate(d.created_at)}</div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => onEditClick && onEditClick(d)} style={{ background: "#60a5fa", border: `1px solid #3b82f6`, borderRadius: 6, padding: "6px 8px", color: "white" }}>Modifier</button>
              <button onClick={() => onDeleteClick && onDeleteClick(d)} style={{ background: "#ef4444", border: "none", borderRadius: 6, padding: "6px 8px", color: "white" }}>Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Commentaires({ token, user, services }) {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [commentaire, setCommentaire] = useState("");
  const [destService, setDestService] = useState("");
  const [objet, setObjet] = useState("");
  const [selected, setSelected] = useState(null); // demande sélectionnée pour réponse
  const [reponse, setReponse] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDemandes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function fetchDemandes() {
    setLoading(true);
    setError("");
    fetch(`${API_BASE}/api/demandes`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        Accept: "application/json",
      },
      credentials: "include",
    })
      .then(async (r) => {
        const txt = await r.text();
        let json;
        try { json = txt ? JSON.parse(txt) : null; } catch (e) { json = null; }
        if (!r.ok) throw json || new Error(`HTTP ${r.status}`);
        const payload = Array.isArray(json) ? json : (json && json.data ? json.data : []);
        const mapped = payload.map(d => ({
          ...d,
          commentaire: d.contenu ?? d.commentaire ?? "",
          service_dest_id: d.service_id ?? d.service_dest_id ?? (d.service?.id ?? null),
          reponse: d.reponse ?? null,
        }));
        setDemandes(mapped);
      })
      .catch((err) => {
        console.error("fetchDemandes error", err);
        setError("Erreur de chargement");
        setDemandes([]);
      })
      .finally(() => setLoading(false));
  }

  function startEdit(d) {
    setEditingId(d.id);
    setCommentaire(d.commentaire || "");
    setDestService(d.service_dest_id || d.service?.id || "");
    setObjet(d.objet || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(d) {
    if (!window.confirm("Supprimer cette demande ?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/demandes/${d.id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          Accept: "application/json",
        },
        credentials: "include",
      });
      const txt = await res.text();
      let json; try { json = txt ? JSON.parse(txt) : null } catch(e) { json = null; }
      if (!res.ok) throw json || new Error(`HTTP ${res.status}`);
      // mise à jour locale
      setDemandes(prev => prev.filter(it => it.id !== d.id));
    } catch (err) {
      console.error("delete error", err);
      alert("Erreur lors de la suppression");
    }
  }

  function handleSend(e) {
    e.preventDefault();
    setError("");
    if (!destService) { setError("Choisissez un service"); return; }

    const payload = {
      objet: (objet || commentaire || "").slice(0, 80) || "Demande",
      contenu: commentaire,
      service_id: destService,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_BASE}/api/demandes/${editingId}` : `${API_BASE}/api/demandes`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then(async (r) => {
        const txt = await r.text();
        let json; try { json = txt ? JSON.parse(txt) : null } catch(e) { json = null; }
        if (!r.ok) throw json || new Error(`HTTP ${r.status}`);
        return json;
      })
      .then(() => {
        setCommentaire("");
        setDestService("");
        setObjet("");
        setEditingId(null);
        fetchDemandes();
      })
      .catch((err) => setError(err.message || "Erreur"));
  }

  function handleReply(e) {
    e.preventDefault();
    setError("");
    if (!selected) return;
    if (!reponse) { setError("Écrivez une réponse"); return; }
    fetch(`${API_BASE}/api/demandes/${selected.id}/reponse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
        Accept: "application/json",
      },
      body: JSON.stringify({ contenu: reponse }),
      credentials: "include",
    })
      .then(async (r) => {
        const txt = await r.text();
        let json;
        try { json = txt ? JSON.parse(txt) : null; } catch (e) { json = null; }
        if (!r.ok) throw json || new Error(`HTTP ${r.status}`);
        return json;
      })
      .then(() => {
        setReponse("");
        setSelected(null);
        fetchDemandes();
      })
      .catch((err) => setError(err.message || "Erreur"));
  }

  return (
    <div style={{ maxWidth: 1100, margin: "28px auto", padding: "0 16px" }}>
      <h2 style={{ fontSize: 26, marginBottom: 12 }}>Gestion des demandes</h2>
      <p style={{ color: "#64748b", marginTop: 0 }}>Créez, suivez et répondez aux demandes depuis une interface claire et moderne.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginTop: 18 }}>
        {/* Left: list */}
        <div>
          {error && <div style={{ marginBottom: 12, color: "#b91c1c", fontWeight: 700 }}>{error}</div>}
          {loading ? (
            <div style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>Chargement des demandes...</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {demandes.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "#94a3b8", borderRadius: 12, background: "white", boxShadow: "0 6px 18px rgba(15,23,42,0.04)" }}>Aucune demande</div>
              ) : demandes.map(d => (
                <CommentCard
                  key={d.id}
                  d={d}
                  onReplyClick={(dt) => { setSelected(dt); setReponse(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  onEditClick={(dt) => startEdit(dt)}
                  onDeleteClick={(dt) => handleDelete(dt)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: composer / reply */}
        <aside style={{ position: "sticky", top: 20, alignSelf: "start" }}>
          <div style={{ padding: 16, borderRadius: 12, background: "linear-gradient(180deg,#fff,#fbfbff)", boxShadow: "0 6px 20px rgba(2,6,23,0.04)", border: "1px solid rgba(15,23,42,0.03)" }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>{editingId ? "Modifier la demande" : "Nouvelle demande"}</h3>
            <form onSubmit={handleSend} style={{ marginTop: 12 }}>
              <input value={objet} onChange={e => setObjet(e.target.value)} placeholder="Objet (optionnel)" style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e6e6e9", marginBottom: 8 }} />
              <textarea value={commentaire} onChange={e => setCommentaire(e.target.value)} placeholder="Décrivez votre demande..." rows={4} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e6e6e9", resize: "vertical" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <select value={destService} onChange={e => setDestService(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #e6e6e9" }}>
                  <option value="">Choisir le service</option>
                  {(services || []).map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                </select>
                <div style={{ display: "flex", gap: 8 }}>
                  {editingId && <button type="button" onClick={() => { setEditingId(null); setCommentaire(""); setDestService(""); setObjet(""); }} style={{ background: "#f3f4f6", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>}
                  <button type="submit" style={{ background: "#0ea5a1", color: "white", border: "none", padding: "10px 14px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>{editingId ? "Enregistrer" : "Envoyer"}</button>
                </div>
              </div>
            </form>
          </div>

          {selected && (
            <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: "white", boxShadow: "0 6px 20px rgba(2,6,23,0.04)", border: "1px solid rgba(15,23,42,0.03)" }}>
              <h4 style={{ margin: 0, fontSize: 16 }}>Répondre à :</h4>
              <div style={{ marginTop: 8, fontWeight: 700 }}>{selected.objet}</div>
              <textarea value={reponse} onChange={e => setReponse(e.target.value)} rows={4} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e6e6e9", marginTop: 10 }} />
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button onClick={handleReply} style={{ background: "linear-gradient(90deg,#6366f1,#06b6d4)", color: "white", border: "none", padding: "10px 14px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Envoyer la réponse</button>
                <button onClick={() => setSelected(null)} style={{ background: "#f3f4f6", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Commentaires;
// ...existing code...