import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import "../styles/Admin.css";

const API_BASE = process.env.NODE_ENV === "production"
    ? "https://main-api.academy-polyglot.site/api/admin"
    : "http://localhost:5001/api/admin";
const IMG_BASE = process.env.NODE_ENV === "production"
    ? "https://main-api.academy-polyglot.site"
    : "http://localhost:5001";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function imgUrl(p) {
    if (!p) return "";
    if (p.startsWith("http")) return p;
    return IMG_BASE + (p.startsWith("/") ? "" : "/") + p;
}
function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtAMD(n) {
    if (!n && n !== 0) return "—";
    return Number(n).toLocaleString("hy-AM") + " ֏";
}
function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / 86400000);
}

// ─── API HOOK ─────────────────────────────────────────────────────────────────
function useApi(token) {
    return useCallback(async (method, path, body, isFormData = false) => {
        const headers = { "x-admin-token": token };
        if (!isFormData) headers["Content-Type"] = "application/json";
        const opts = { method, headers };
        if (body !== undefined) opts.body = isFormData ? body : JSON.stringify(body);
        const r = await fetch(API_BASE + path, opts);
        if (r.status === 401) throw new Error("__UNAUTHORIZED__");
        const text = await r.text();
        try { return JSON.parse(text); } catch { return text; }
    }, [token]);
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast() {
    const [toasts, setToasts] = useState([]);
    const push = useCallback((msg, type = "ok") => {
        const id = Date.now() + Math.random();
        setToasts(p => [...p, { id, msg, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
    }, []);
    return { toasts, push };
}
function ToastContainer({ toasts }) {
    return (
        <div className="adm-toast-wrap">
            {toasts.map(t => (
                <div key={t.id} className={`adm-toast adm-toast-${t.type}`}>
                    <span>{t.type === "ok" ? "✅" : "❌"}</span>
                    <span>{t.msg}</span>
                </div>
            ))}
        </div>
    );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSave, saving, wide, children }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);
    return (
        <div className="adm-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={`adm-modal${wide ? " adm-modal-wide" : ""}`}>
                <div className="adm-modal-head">
                    <span className="adm-modal-title">{title}</span>
                    <button className="adm-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="adm-modal-body">{children}</div>
                {onSave && (
                    <div className="adm-modal-foot">
                        <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
                        <button className="adm-btn adm-btn-primary" onClick={onSave} disabled={saving}>
                            {saving ? <span className="adm-spinner" /> : "Save"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── LANG TABS ────────────────────────────────────────────────────────────────
const LANGS = [
    { code: "hy", flag: "🇦🇲", label: "HY" },
    { code: "en", flag: "🇬🇧", label: "EN" },
    { code: "ru", flag: "🇷🇺", label: "RU" },
    { code: "ka", flag: "🇬🇪", label: "KA" },
];
function LangTabs({ active, onChange }) {
    return (
        <div className="adm-lang-tabs">
            {LANGS.map(l => (
                <button key={l.code}
                        className={`adm-lang-tab${active === l.code ? " active" : ""}`}
                        onClick={() => onChange(l.code)}>
                    {l.flag} {l.label}
                </button>
            ))}
        </div>
    );
}

// ─── IMG UPLOAD ───────────────────────────────────────────────────────────────
function ImgField({ label, value, onChange, folder, token }) {
    const fileRef = useRef();
    const [uploading, setUploading] = useState(false);
    async function handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const form = new FormData();
            form.append("image", file);
            const r = await fetch(`${API_BASE}/upload?folder=${folder}`, {
                method: "POST", headers: { "x-admin-token": token }, body: form
            });
            const j = await r.json();
            if (j.url) onChange(j.url);
        } finally { setUploading(false); }
    }
    return (
        <div className="adm-f-group adm-full">
            <label className="adm-f-label">{label}</label>
            <div className="adm-img-row">
                <input className="adm-f-input" value={value || ""} onChange={e => onChange(e.target.value)} placeholder="/picture/..." />
                <button className="adm-btn adm-btn-ghost adm-btn-sm" type="button"
                        onClick={() => fileRef.current.click()} disabled={uploading}>
                    {uploading ? <span className="adm-spinner" /> : "📁 Upload"}
                </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            {value && <img className="adm-img-preview" src={imgUrl(value)} alt="" onError={e => e.target.style.display = "none"} />}
        </div>
    );
}

// ─── MULTILANG FIELDS ────────────────────────────────────────────────────────
function MultiLangFields({ fields, form, onChange, activeLang }) {
    return (
        <>
            {fields.map(f => (
                <div key={`${f.name}_${activeLang}`} className={`adm-f-group${f.full ? " adm-full" : ""}`}>
                    <label className="adm-f-label">{f.label} <span className="adm-f-lang">{activeLang}</span></label>
                    {f.textarea
                        ? <textarea className="adm-f-textarea" rows={3}
                                    value={form[`${f.name}_${activeLang}`] || ""}
                                    onChange={e => onChange(`${f.name}_${activeLang}`, e.target.value)} />
                        : <input className="adm-f-input"
                                 value={form[`${f.name}_${activeLang}`] || ""}
                                 onChange={e => onChange(`${f.name}_${activeLang}`, e.target.value)} />
                    }
                </div>
            ))}
        </>
    );
}

// ─── DATA TABLE ───────────────────────────────────────────────────────────────
function DataTable({ id, cols, rows, toolbar, loading, statusFilter, onStatusFilter, statusOptions }) {
    const [q, setQ] = useState("");
    const filtered = useMemo(() => {
        if (!q) return rows;
        return rows.filter(r => Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase()));
    }, [rows, q]);

    return (
        <div className="adm-table-wrap">
            <div className="adm-table-toolbar">
                <input className="adm-search" placeholder={`Search ${id}…`} value={q} onChange={e => setQ(e.target.value)} />
                {statusOptions && (
                    <select className="adm-f-select adm-filter-select" value={statusFilter || ""} onChange={e => onStatusFilter(e.target.value)}>
                        {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                )}
                {toolbar}
            </div>
            {loading ? (
                <div className="adm-loading"><span className="adm-spinner" /> Loading…</div>
            ) : (
                <div className="adm-table-scroll">
                    <table className="adm-data-table">
                        <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
                        <tbody>
                        {filtered.length === 0
                            ? <tr><td colSpan={cols.length} className="adm-empty-cell">No records found</td></tr>
                            : filtered.map((r, i) => <tr key={r.__key || i}>{r.__cells}</tr>)}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function Dashboard({ api }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api("GET", "/dashboard")
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [api]);

    if (loading) return <div className="adm-loading"><span className="adm-spinner" /> Loading…</div>;
    if (!data) return <div className="adm-empty-cell">Failed to load dashboard</div>;

    const { counts, revenue, recentOrders, paymentBreakdown } = data;

    const statCards = [
        { icon: "💰", val: fmtAMD(revenue?.total_revenue), label: "Total Revenue", accent: true },
        { icon: "✅", val: revenue?.completed_orders || 0, label: "Completed Orders" },
        { icon: "⏳", val: revenue?.pending_orders || 0, label: "Pending Orders" },
        { icon: "❌", val: revenue?.failed_orders || 0, label: "Failed Orders" },
        { icon: "🌐", val: counts.products, label: "Products" },
        { icon: "💬", val: counts.comments, label: "Reviews" },
        { icon: "🎓", val: counts.certificates, label: "Certificates" },
        { icon: "📱", val: counts.telegramActive, label: "Active VIP Subs" },
        { icon: "📧", val: counts.subscribers, label: "Subscribers" },
        { icon: "📩", val: counts.contacts, label: "Messages" },
    ];

    return (
        <div>
            <div className="adm-stats-grid">
                {statCards.map(s => (
                    <div key={s.label} className={`adm-stat-card${s.accent ? " adm-stat-accent" : ""}`}>
                        <div className="adm-stat-icon">{s.icon}</div>
                        <div className="adm-stat-val">{s.val}</div>
                        <div className="adm-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {paymentBreakdown?.length > 0 && (
                <div className="adm-table-wrap" style={{ marginTop: 20 }}>
                    <div className="adm-table-toolbar"><strong className="adm-section-title">Revenue by Payment Method</strong></div>
                    <table className="adm-data-table">
                        <thead><tr><th>Provider</th><th>Total Orders</th><th>Completed</th><th>Revenue</th><th>Conv. Rate</th></tr></thead>
                        <tbody>
                        {paymentBreakdown.map(p => (
                            <tr key={p.payment_type}>
                                <td><span className="adm-tag adm-tag-blue">{p.payment_type || "—"}</span></td>
                                <td>{p.total}</td>
                                <td>{p.completed}</td>
                                <td>{fmtAMD(p.revenue)}</td>
                                <td><span className={`adm-tag ${p.total > 0 && p.completed / p.total > 0.5 ? "adm-tag-green" : "adm-tag-yellow"}`}>
                                        {p.total > 0 ? Math.round(p.completed / p.total * 100) : 0}%
                                    </span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {recentOrders?.length > 0 && (
                <div className="adm-table-wrap" style={{ marginTop: 20 }}>
                    <div className="adm-table-toolbar"><strong className="adm-section-title">Recent Orders</strong></div>
                    <table className="adm-data-table">
                        <thead><tr><th>ID</th><th>Customer</th><th>Phone</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                        {recentOrders.map(o => (
                            <tr key={o.id}>
                                <td><span className="adm-tag adm-tag-blue">#{o.id}</span></td>
                                <td>{o.customer_name} {o.customer_surname || ""}</td>
                                <td>{o.customer_phone}</td>
                                <td>{fmtAMD(o.total_amount)}</td>
                                <td><span className="adm-tag adm-tag-blue">{o.payment_type || "—"}</span></td>
                                <td><StatusBadge status={o.status} /></td>
                                <td>{fmtDate(o.created_at)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        completed: "adm-tag-green", pending: "adm-tag-yellow",
        failed: "adm-tag-red", cancelled: "adm-tag-red",
        active: "adm-tag-green", expired: "adm-tag-red",
        refunded: "adm-tag-blue",
    };
    return <span className={`adm-tag ${map[status] || "adm-tag-blue"}`}>{status || "—"}</span>;
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: PRODUCTS
// ═══════════════════════════════════════════════════════════════════
function Products({ api, token, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [activeLang, setActiveLang] = useState("hy");

    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await api("GET", "/products")); } finally { setLoading(false); }
    }, [api]);
    useEffect(() => { load(); }, [load]);

    function setF(k, v) { setForm(p => ({ ...p, [k]: v })); }

    async function save() {
        setSaving(true);
        try {
            if (form.id) await api("PUT", `/products/${form.id}`, form);
            else await api("POST", "/products", form);
            toast("Saved successfully!", "ok");
            setModal(null);
            load();
        } catch { toast("Save failed", "err"); } finally { setSaving(false); }
    }

    async function del(id) {
        if (!window.confirm(`Delete product #${id}? This cannot be undone.`)) return;
        await api("DELETE", `/products/${id}`);
        toast("Product deleted", "ok");
        load();
    }

    const rows = data.map(p => ({
        __key: p.id,
        __cells: (
            <>
                <td><span className="adm-tag adm-tag-blue">{p.id}</span></td>
                <td>{p.img ? <img className="adm-thumb" src={imgUrl(p.img)} alt="" onError={e => e.target.style.display = "none"} /> : <span className="adm-thumb-ph">🌐</span>}</td>
                <td>{p.name_hy}</td>
                <td>{p.name_en}</td>
                <td><span className="adm-tag adm-tag-yellow">{p.price ? fmtAMD(p.price) : "—"}</span></td>
                <td><StatusBadge status={p.status == 1 ? "active" : "hidden"} /></td>
                <td>
                    <div className="adm-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setForm({ ...p }); setActiveLang("hy"); setModal(true); }}>✏️ Edit</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => del(p.id)}>🗑</button>
                    </div>
                </td>
            </>
        ),
    }));

    return (
        <>
            <DataTable id="products" cols={["ID", "Image", "Name (HY)", "Name (EN)", "Price", "Status", "Actions"]}
                       rows={rows} loading={loading}
                       toolbar={<button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => { setForm({ status: 1 }); setActiveLang("hy"); setModal(true); }}>+ Add Product</button>}
            />
            {modal && (
                <Modal title={form.id ? "Edit Product" : "New Product"} onClose={() => setModal(null)} onSave={save} saving={saving} wide>
                    <LangTabs active={activeLang} onChange={setActiveLang} />
                    <div className="adm-form-grid">
                        <MultiLangFields fields={[{ name: "name", label: "Name" }, { name: "description", label: "Description", textarea: true, full: true }]}
                                         form={form} onChange={setF} activeLang={activeLang} />
                        <div className="adm-f-group">
                            <label className="adm-f-label">Price (AMD)</label>
                            <input className="adm-f-input" type="number" value={form.price || ""} onChange={e => setF("price", e.target.value)} />
                        </div>
                        <div className="adm-f-group">
                            <label className="adm-f-label">Status</label>
                            <select className="adm-f-select" value={form.status ?? 1} onChange={e => setF("status", e.target.value)}>
                                <option value={1}>Active</option>
                                <option value={0}>Hidden</option>
                            </select>
                        </div>
                        <ImgField label="Image" value={form.img} onChange={v => setF("img", v)} folder="product" token={token} />
                    </div>
                </Modal>
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: COMMENTS
// ═══════════════════════════════════════════════════════════════════
function Comments({ api, token, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await api("GET", "/comments")); } finally { setLoading(false); }
    }, [api]);
    useEffect(() => { load(); }, [load]);

    function setF(k, v) { setForm(p => ({ ...p, [k]: v })); }
    async function save() {
        setSaving(true);
        try {
            const payload = { ...form, text: form.text || form.comment };
            if (form.id) await api("PUT", `/comments/${form.id}`, payload);
            else await api("POST", "/comments", payload);
            toast("Saved!", "ok"); setModal(null); load();
        } catch { toast("Save failed", "err"); } finally { setSaving(false); }
    }
    async function del(id) {
        if (!window.confirm(`Delete review #${id}?`)) return;
        await api("DELETE", `/comments/${id}`);
        toast("Deleted", "ok"); load();
    }

    const rows = data.map(c => ({
        __key: c.id,
        __cells: (
            <>
                <td><span className="adm-tag adm-tag-blue">{c.id}</span></td>
                <td>{c.img ? <img className="adm-thumb" src={imgUrl(c.img)} alt="" onError={e => e.target.style.display = "none"} /> : <span className="adm-thumb-ph">👤</span>}</td>
                <td>{c.name}</td>
                <td className="adm-truncate" style={{ maxWidth: 260 }}>{c.text || c.comment}</td>
                <td>{"⭐".repeat(Math.min(c.stars || 5, 5))}</td>
                <td><span className="adm-tag adm-tag-blue">{c.lang || "—"}</span></td>
                <td>
                    <div className="adm-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setForm({ ...c }); setModal(true); }}>✏️ Edit</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => del(c.id)}>🗑</button>
                    </div>
                </td>
            </>
        ),
    }));

    return (
        <>
            <DataTable id="reviews" cols={["ID", "Photo", "Name", "Text", "Stars", "Lang", "Actions"]}
                       rows={rows} loading={loading}
                       toolbar={<button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => { setForm({ stars: 5, lang: "hy" }); setModal(true); }}>+ Add Review</button>}
            />
            {modal && (
                <Modal title={form.id ? "Edit Review" : "New Review"} onClose={() => setModal(null)} onSave={save} saving={saving}>
                    <div className="adm-form-grid">
                        <div className="adm-f-group"><label className="adm-f-label">Name</label>
                            <input className="adm-f-input" value={form.name || ""} onChange={e => setF("name", e.target.value)} /></div>
                        <div className="adm-f-group"><label className="adm-f-label">Stars (1–5)</label>
                            <input className="adm-f-input" type="number" min={1} max={5} value={form.stars || 5} onChange={e => setF("stars", e.target.value)} /></div>
                        <div className="adm-f-group adm-full"><label className="adm-f-label">Review Text</label>
                            <textarea className="adm-f-textarea" rows={3} value={form.text || form.comment || ""} onChange={e => setF("text", e.target.value)} /></div>
                        <div className="adm-f-group"><label className="adm-f-label">Language</label>
                            <select className="adm-f-select" value={form.lang || "hy"} onChange={e => setF("lang", e.target.value)}>
                                {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
                            </select></div>
                        <ImgField label="Photo" value={form.img} onChange={v => setF("img", v)} folder="comment" token={token} />
                    </div>
                </Modal>
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: TEACHERS
// ═══════════════════════════════════════════════════════════════════
function Teachers({ api, token, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [activeLang, setActiveLang] = useState("hy");

    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await api("GET", "/teachers")); } finally { setLoading(false); }
    }, [api]);
    useEffect(() => { load(); }, [load]);

    function setF(k, v) { setForm(p => ({ ...p, [k]: v })); }
    async function save() {
        setSaving(true);
        try {
            if (form.id) await api("PUT", `/teachers/${form.id}`, form);
            else await api("POST", "/teachers", form);
            toast("Saved!", "ok"); setModal(null); load();
        } catch { toast("Save failed", "err"); } finally { setSaving(false); }
    }
    async function del(id) {
        if (!window.confirm(`Delete teacher #${id}?`)) return;
        await api("DELETE", `/teachers/${id}`);
        toast("Deleted", "ok"); load();
    }

    const rows = data.map(t => ({
        __key: t.id,
        __cells: (
            <>
                <td><span className="adm-tag adm-tag-blue">{t.id}</span></td>
                <td>{t.img ? <img className="adm-thumb" src={imgUrl(t.img)} alt="" onError={e => e.target.style.display = "none"} /> : <span className="adm-thumb-ph">👩‍🏫</span>}</td>
                <td>{t.name_hy}</td>
                <td>{t.name_en}</td>
                <td>{t.role}</td>
                <td>
                    <div className="adm-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setForm({ ...t }); setActiveLang("hy"); setModal(true); }}>✏️ Edit</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => del(t.id)}>🗑</button>
                    </div>
                </td>
            </>
        ),
    }));

    return (
        <>
            <DataTable id="teachers" cols={["ID", "Photo", "Name (HY)", "Name (EN)", "Role", "Actions"]}
                       rows={rows} loading={loading}
                       toolbar={<button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => { setForm({}); setActiveLang("hy"); setModal(true); }}>+ Add Teacher</button>}
            />
            {modal && (
                <Modal title={form.id ? "Edit Teacher" : "New Teacher"} onClose={() => setModal(null)} onSave={save} saving={saving} wide>
                    <LangTabs active={activeLang} onChange={setActiveLang} />
                    <div className="adm-form-grid">
                        <MultiLangFields fields={[{ name: "name", label: "Name" }, { name: "description", label: "Description", textarea: true, full: true }]}
                                         form={form} onChange={setF} activeLang={activeLang} />
                        <div className="adm-f-group adm-full"><label className="adm-f-label">Role</label>
                            <input className="adm-f-input" value={form.role || ""} onChange={e => setF("role", e.target.value)} /></div>
                        <ImgField label="Photo" value={form.img} onChange={v => setF("img", v)} folder="MyTeam" token={token} />
                    </div>
                </Modal>
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: TEAM
// ═══════════════════════════════════════════════════════════════════
function Team({ api, token, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [activeLang, setActiveLang] = useState("hy");

    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await api("GET", "/team")); } finally { setLoading(false); }
    }, [api]);
    useEffect(() => { load(); }, [load]);

    function setF(k, v) { setForm(p => ({ ...p, [k]: v })); }
    async function save() {
        setSaving(true);
        try {
            if (form.id) await api("PUT", `/team/${form.id}`, form);
            else await api("POST", "/team", form);
            toast("Saved!", "ok"); setModal(null); load();
        } catch { toast("Save failed", "err"); } finally { setSaving(false); }
    }
    async function del(id) {
        if (!window.confirm(`Delete member #${id}?`)) return;
        await api("DELETE", `/team/${id}`);
        toast("Deleted", "ok"); load();
    }

    const rows = data.map(m => ({
        __key: m.id,
        __cells: (
            <>
                <td><span className="adm-tag adm-tag-blue">{m.id}</span></td>
                <td>{m.img ? <img className="adm-thumb" src={imgUrl(m.img)} alt="" onError={e => e.target.style.display = "none"} /> : <span className="adm-thumb-ph">👤</span>}</td>
                <td>{m.name_hy || m.name}</td>
                <td>{m.role_hy || m.role}</td>
                <td><StatusBadge status={m.status == 1 ? "active" : "hidden"} /></td>
                <td>
                    <div className="adm-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setForm({ ...m }); setActiveLang("hy"); setModal(true); }}>✏️ Edit</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => del(m.id)}>🗑</button>
                    </div>
                </td>
            </>
        ),
    }));

    return (
        <>
            <DataTable id="team" cols={["ID", "Photo", "Name (HY)", "Role (HY)", "Status", "Actions"]}
                       rows={rows} loading={loading}
                       toolbar={<button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => { setForm({ status: 1 }); setActiveLang("hy"); setModal(true); }}>+ Add Member</button>}
            />
            {modal && (
                <Modal title={form.id ? "Edit Member" : "New Member"} onClose={() => setModal(null)} onSave={save} saving={saving} wide>
                    <LangTabs active={activeLang} onChange={setActiveLang} />
                    <div className="adm-form-grid">
                        <MultiLangFields fields={[
                            { name: "name", label: "Name" },
                            { name: "role", label: "Role" },
                            { name: "description", label: "Description", textarea: true, full: true },
                        ]} form={form} onChange={setF} activeLang={activeLang} />
                        <div className="adm-f-group"><label className="adm-f-label">Status</label>
                            <select className="adm-f-select" value={form.status ?? 1} onChange={e => setF("status", e.target.value)}>
                                <option value={1}>Visible</option>
                                <option value={0}>Hidden</option>
                            </select></div>
                        <ImgField label="Photo" value={form.img} onChange={v => setF("img", v)} folder="MyTeam" token={token} />
                    </div>
                </Modal>
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: GALLERY
// ═══════════════════════════════════════════════════════════════════
function Gallery({ api, token, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [imgVal, setImgVal] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef();

    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await api("GET", "/gallery")); } finally { setLoading(false); }
    }, [api]);
    useEffect(() => { load(); }, [load]);

    async function handleUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const form = new FormData();
        form.append("image", file);
        try {
            const r = await fetch(`${API_BASE}/upload?folder=gallery`, { method: "POST", headers: { "x-admin-token": token }, body: form });
            const j = await r.json();
            if (j.url) setImgVal(j.url);
        } finally { setUploading(false); }
    }

    async function save() {
        if (!imgVal) { toast("No image selected", "err"); return; }
        setSaving(true);
        try {
            await api("POST", "/gallery", { img: imgVal });
            toast("Image added!", "ok"); setModal(false); setImgVal(""); load();
        } catch { toast("Failed", "err"); } finally { setSaving(false); }
    }

    async function del(id) {
        if (!window.confirm(`Delete image #${id}?`)) return;
        await api("DELETE", `/gallery/${id}`);
        toast("Deleted", "ok"); load();
    }

    return (
        <>
            <div className="adm-table-wrap">
                <div className="adm-table-toolbar">
                    <span className="adm-section-title">Gallery ({data.length} images)</span>
                    <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => { setImgVal(""); setModal(true); }}>+ Add Image</button>
                </div>
                {loading ? <div className="adm-loading"><span className="adm-spinner" /> Loading…</div> : (
                    <div className="adm-gallery-grid">
                        {data.length === 0 && <div className="adm-empty-cell">No images yet</div>}
                        {data.map(g => (
                            <div key={g.id} className="adm-gallery-item">
                                <img src={imgUrl(g.img)} alt="" />
                                <button className="adm-gallery-del" onClick={() => del(g.id)}>🗑 Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {modal && (
                <Modal title="Add Gallery Image" onClose={() => setModal(false)} onSave={save} saving={saving}>
                    <div className="adm-form-grid">
                        <div className="adm-f-group adm-full">
                            <label className="adm-f-label">Upload File</label>
                            <button className="adm-btn adm-btn-ghost" type="button" onClick={() => fileRef.current.click()} disabled={uploading}>
                                {uploading ? <span className="adm-spinner" /> : "📁 Choose File"}
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
                        </div>
                        <div className="adm-f-group adm-full">
                            <label className="adm-f-label">Or paste URL</label>
                            <input className="adm-f-input" value={imgVal} onChange={e => setImgVal(e.target.value)} placeholder="/picture/gallery/..." />
                        </div>
                        {imgVal && <img className="adm-img-preview" src={imgUrl(imgVal)} alt="" style={{ marginTop: 8 }} />}
                    </div>
                </Modal>
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════
function flattenObj(obj, prefix = "") {
    const res = {};
    for (const [k, v] of Object.entries(obj)) {
        const key = prefix ? `${prefix}.${k}` : k;
        if (v !== null && typeof v === "object") Object.assign(res, flattenObj(v, key));
        else res[key] = v;
    }
    return res;
}
function unflattenObj(flat) {
    const res = {};
    for (const [dotKey, val] of Object.entries(flat)) {
        const keys = dotKey.split(".");
        let cur = res;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!cur[keys[i]] || typeof cur[keys[i]] !== "object") cur[keys[i]] = {};
            cur = cur[keys[i]];
        }
        cur[keys[keys.length - 1]] = val;
    }
    return res;
}
function Translations({ api, toast }) {
    const [lang, setLang] = useState("hy");
    const [flat, setFlat] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");

    const loadLang = useCallback(async (l) => {
        setLoading(true);
        try { setFlat(flattenObj(await api("GET", `/translations/${l}`))); }
        catch { toast("Failed to load", "err"); }
        finally { setLoading(false); }
    }, [api, toast]);
    useEffect(() => { loadLang(lang); }, [lang, loadLang]);

    async function save() {
        setSaving(true);
        try {
            await api("PUT", `/translations/${lang}`, unflattenObj(flat));
            toast("Translations saved!", "ok");
        } catch { toast("Save failed", "err"); } finally { setSaving(false); }
    }

    const sections = useMemo(() => {
        const secs = {};
        Object.entries(flat).forEach(([k, v]) => {
            if (search && !k.toLowerCase().includes(search.toLowerCase()) && !String(v).toLowerCase().includes(search.toLowerCase())) return;
            const sec = k.split(".")[0];
            if (!secs[sec]) secs[sec] = [];
            secs[sec].push([k, v]);
        });
        return secs;
    }, [flat, search]);

    return (
        <div className="adm-table-wrap">
            <div className="adm-table-toolbar">
                <LangTabs active={lang} onChange={l => { setLang(l); setSearch(""); }} />
                <input className="adm-search" placeholder="Search keys or values…" value={search} onChange={e => setSearch(e.target.value)} />
                <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={save} disabled={saving}>
                    {saving ? <span className="adm-spinner" /> : "💾 Save"}
                </button>
            </div>
            {loading ? <div className="adm-loading"><span className="adm-spinner" /> Loading translations…</div> : (
                <div className="adm-trans-content">
                    {Object.entries(sections).map(([sec, pairs]) => (
                        <div key={sec} className="adm-trans-section">
                            <div className="adm-trans-sec-head">📁 {sec}</div>
                            {pairs.map(([k, v]) => (
                                <div key={k} className="adm-trans-row">
                                    <div className="adm-trans-key" title={k}>{k}</div>
                                    {String(v).length > 80
                                        ? <textarea className="adm-f-textarea" rows={2} value={v} onChange={e => setFlat(p => ({ ...p, [k]: e.target.value }))} />
                                        : <input className="adm-f-input" value={v} onChange={e => setFlat(p => ({ ...p, [k]: e.target.value }))} />
                                    }
                                </div>
                            ))}
                        </div>
                    ))}
                    {Object.keys(sections).length === 0 && <div className="adm-empty-cell">No matches found</div>}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: ORDERS (fully upgraded)
// ═══════════════════════════════════════════════════════════════════
function Orders({ api, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [detailModal, setDetailModal] = useState(null);
    const [statusModal, setStatusModal] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = statusFilter ? `?status=${statusFilter}` : "";
            const res = await api("GET", `/orders${params}`);
            setData(res.rows || res);
        } finally { setLoading(false); }
    }, [api, statusFilter]);
    useEffect(() => { load(); }, [load]);

    async function updateStatus() {
        if (!newStatus) return;
        setSaving(true);
        try {
            await api("PUT", `/orders/${statusModal.id}/status`, { status: newStatus });
            toast("Status updated!", "ok");
            setStatusModal(null);
            load();
        } catch { toast("Update failed", "err"); } finally { setSaving(false); }
    }

    async function del(id) {
        if (!window.confirm(`Permanently delete order #${id}?`)) return;
        await api("DELETE", `/orders/${id}`);
        toast("Order deleted", "ok");
        load();
    }

    const statusOptions = [
        { value: "", label: "All statuses" },
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const rows = data.map(o => {
        let cart = [];
        try { cart = JSON.parse(o.cart); } catch {}
        const cartStr = Array.isArray(cart) ? cart.map(i => `${i.name || i.name_en || "?"} ×${i.quantity}`).join(", ") : "";
        const hasTelegram = (() => { try { return !!JSON.parse(o.telegram); } catch { return !!o.telegram; } })();
        return {
            __key: o.id,
            __cells: (
                <>
                    <td><span className="adm-tag adm-tag-blue">#{o.id}</span></td>
                    <td>
                        {o.customer_name} {o.customer_surname || ""}
                        {hasTelegram && <span className="adm-tag adm-tag-blue" style={{ marginLeft: 4, fontSize: 10 }}>📱 TG</span>}
                    </td>
                    <td>{o.customer_phone}</td>
                    <td><span className="adm-tag adm-tag-yellow">{fmtAMD(o.total_amount)}</span></td>
                    <td><span className="adm-tag adm-tag-blue">{o.payment_type || "—"}</span></td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>{fmtDate(o.created_at)}</td>
                    <td>
                        <div className="adm-actions">
                            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setDetailModal(o)}>🔍</button>
                            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setStatusModal(o); setNewStatus(o.status); }}>⚙️</button>
                            <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => del(o.id)}>🗑</button>
                        </div>
                    </td>
                </>
            ),
        };
    });

    return (
        <>
            <DataTable id="orders"
                       cols={["ID", "Customer", "Phone", "Amount", "Payment", "Status", "Date", "Actions"]}
                       rows={rows} loading={loading}
                       statusFilter={statusFilter} onStatusFilter={setStatusFilter} statusOptions={statusOptions}
            />

            {/* ORDER DETAIL MODAL */}
            {detailModal && (
                <Modal title={`Order #${detailModal.id} — Details`} onClose={() => setDetailModal(null)} wide>
                    <div className="adm-detail-grid">
                        <div className="adm-detail-row"><span>Customer</span><strong>{detailModal.customer_name} {detailModal.customer_surname}</strong></div>
                        <div className="adm-detail-row"><span>Phone</span><strong>{detailModal.customer_phone}</strong></div>
                        <div className="adm-detail-row"><span>Total Amount</span><strong>{fmtAMD(detailModal.total_amount)}</strong></div>
                        <div className="adm-detail-row"><span>Payment Method</span><strong>{detailModal.payment_type || "—"}</strong></div>
                        <div className="adm-detail-row"><span>Payment ID</span><strong style={{ fontSize: 11, wordBreak: "break-all" }}>{detailModal.payment_id || "—"}</strong></div>
                        <div className="adm-detail-row"><span>Status</span><StatusBadge status={detailModal.status} /></div>
                        <div className="adm-detail-row"><span>Created</span><strong>{fmtDate(detailModal.created_at)}</strong></div>
                        {detailModal.updated_at && <div className="adm-detail-row"><span>Updated</span><strong>{fmtDate(detailModal.updated_at)}</strong></div>}
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div className="adm-trans-sec-head">🛒 Cart Items</div>
                        <table className="adm-data-table" style={{ marginTop: 8 }}>
                            <thead><tr><th>Course</th><th>Type</th><th>Qty</th><th>Price</th></tr></thead>
                            <tbody>
                            {(() => {
                                try {
                                    const cart = JSON.parse(detailModal.cart);
                                    return cart.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.name || item.name_en || item.name_hy || `Product #${item.id}`}</td>
                                            <td><span className="adm-tag adm-tag-blue" style={{ fontSize: 11 }}>{item.selectedType || "—"}</span></td>
                                            <td>{item.quantity}</td>
                                            <td>{fmtAMD(item.price)}</td>
                                        </tr>
                                    ));
                                } catch { return <tr><td colSpan={4}>Unable to parse cart</td></tr>; }
                            })()}
                            </tbody>
                        </table>
                    </div>

                    {/* Telegram info if present */}
                    {(() => {
                        try {
                            const tg = JSON.parse(detailModal.telegram);
                            if (!tg) return null;
                            return (
                                <div style={{ marginTop: 16 }}>
                                    <div className="adm-trans-sec-head">📱 Telegram Account</div>
                                    <div className="adm-detail-grid" style={{ marginTop: 8 }}>
                                        <div className="adm-detail-row"><span>Telegram ID</span><strong>{tg.telegram_id || tg.id}</strong></div>
                                        {tg.username && <div className="adm-detail-row"><span>Username</span><strong>@{tg.username}</strong></div>}
                                        {tg.first_name && <div className="adm-detail-row"><span>Name</span><strong>{tg.first_name}</strong></div>}
                                    </div>
                                </div>
                            );
                        } catch { return null; }
                    })()}
                </Modal>
            )}

            {/* STATUS CHANGE MODAL */}
            {statusModal && (
                <Modal title={`Change Status — Order #${statusModal.id}`} onClose={() => setStatusModal(null)} onSave={updateStatus} saving={saving}>
                    <div className="adm-f-group">
                        <label className="adm-f-label">New Status</label>
                        <select className="adm-f-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                    <div className="adm-detail-row" style={{ marginTop: 12 }}>
                        <span>Current</span><StatusBadge status={statusModal.status} />
                    </div>
                </Modal>
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: NEWSLETTER
// ═══════════════════════════════════════════════════════════════════
function Newsletter({ api, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await api("GET", "/newsletter")); } finally { setLoading(false); }
    }, [api]);
    useEffect(() => { load(); }, [load]);

    async function del(id) {
        if (!window.confirm(`Remove subscriber #${id}?`)) return;
        await api("DELETE", `/newsletter/${id}`);
        toast("Removed", "ok"); load();
    }

    function exportCSV() {
        const header = "ID,Email,Date\n";
        const body = data.map(s => `${s.id},${s.email},${s.created_at || ""}`).join("\n");
        const blob = new Blob([header + body], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "subscribers.csv"; a.click();
        URL.revokeObjectURL(url);
    }

    const rows = data.map(s => ({
        __key: s.id,
        __cells: (
            <>
                <td><span className="adm-tag adm-tag-blue">{s.id}</span></td>
                <td>{s.email}</td>
                <td>{fmtDate(s.created_at)}</td>
                <td><button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => del(s.id)}>🗑</button></td>
            </>
        ),
    }));

    return (
        <DataTable id="subscribers" cols={["ID", "Email", "Date", "Actions"]}
                   rows={rows} loading={loading}
                   toolbar={
                       <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={exportCSV}>📥 Export CSV</button>
                   }
        />
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: CONTACTS (upgraded — read status)
// ═══════════════════════════════════════════════════════════════════
function Contacts({ api, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewModal, setViewModal] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try { setData(await api("GET", "/contacts")); } finally { setLoading(false); }
    }, [api]);
    useEffect(() => { load(); }, [load]);

    async function markRead(id) {
        try { await api("PUT", `/contacts/${id}/read`); } catch {}
        setData(p => p.map(c => c.id === id ? { ...c, is_read: 1 } : c));
    }

    async function del(id) {
        if (!window.confirm(`Delete message #${id}?`)) return;
        await api("DELETE", `/contacts/${id}`);
        toast("Deleted", "ok"); load();
    }

    const rows = data.map(c => ({
        __key: c.id,
        __cells: (
            <>
                <td>
                    <span className="adm-tag adm-tag-blue">{c.id}</span>
                    {!c.is_read && <span className="adm-unread-dot" title="Unread" />}
                </td>
                <td style={{ fontWeight: c.is_read ? 400 : 600 }}>{c.name}</td>
                <td>{c.phone}</td>
                <td className="adm-truncate" style={{ maxWidth: 240 }}>{c.message}</td>
                <td>{fmtDate(c.created_at)}</td>
                <td>
                    <div className="adm-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setViewModal(c); markRead(c.id); }}>👁 View</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => del(c.id)}>🗑</button>
                    </div>
                </td>
            </>
        ),
    }));

    return (
        <>
            <DataTable id="messages" cols={["ID", "Name", "Phone", "Message", "Date", "Actions"]}
                       rows={rows} loading={loading}
            />
            {viewModal && (
                <Modal title={`Message from ${viewModal.name}`} onClose={() => setViewModal(null)}>
                    <div className="adm-detail-grid">
                        <div className="adm-detail-row"><span>Name</span><strong>{viewModal.name}</strong></div>
                        <div className="adm-detail-row"><span>Phone</span><strong>{viewModal.phone}</strong></div>
                        <div className="adm-detail-row"><span>Date</span><strong>{fmtDate(viewModal.created_at)}</strong></div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <div className="adm-trans-sec-head">Message</div>
                        <p style={{ marginTop: 10, lineHeight: 1.7, color: "var(--adm-text)" }}>{viewModal.message || "—"}</p>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <a className="adm-btn adm-btn-primary" href={`tel:${viewModal.phone}`}>📞 Call</a>
                    </div>
                </Modal>
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: CERTIFICATES
// ═══════════════════════════════════════════════════════════════════
// Exact level options mirroring CertificateForm.js
const CERT_LEVELS = [
    { value: "English Level 0-A1",   label: "English 0-A1" },
    { value: "English Level A1-A2",  label: "English A1-A2" },
    { value: "English Level A2-B1",  label: "English A2-B1" },
    { value: "English Level B1-B2",  label: "English B1-B2" },
    { value: "English Level B2-C1",  label: "English B2-C1" },
    { value: "English Level C1-C2",  label: "English C1-C2" },
    { value: "Speaking club A1-A2",  label: "Speaking Club A1-A2" },
    { value: "Speaking club B1-B2",  label: "Speaking Club B1-B2" },
    { value: "Speaking club C1",     label: "Speaking Club C1" },
    { value: "Armenian easy",        label: "Armenian (easy)" },
    { value: "Russian Level 0-A1",   label: "Russian 0-A1" },
    { value: "Russian Level A1-A2",  label: "Russian A1-A2" },
    { value: "Russian Level A2-B1",  label: "Russian A2-B1" },
    { value: "Russian Level B1-B2",  label: "Russian B1-B2" },
    { value: "Russian Level B2-C1",  label: "Russian B2-C1" },
    { value: "German Level 0-A1",    label: "German 0-A1" },
    { value: "German Level A1-A2",   label: "German A1-A2" },
    { value: "German Level A2-B1",   label: "German A2-B1" },
    { value: "German Level B1-B2",   label: "German B1-B2" },
    { value: "Spanish Level 0-A1",   label: "Spanish 0-A1" },
    { value: "Spanish Level A1-A2",  label: "Spanish A1-A2" },
    { value: "Spanish Level A2-B1",  label: "Spanish A2-B1" },
    { value: "French Level 0-A1",    label: "French 0-A1" },
    { value: "French Level A1-A2",   label: "French A1-A2" },
    { value: "French Level A2-B1",   label: "French A2-B1" },
];

// Course format options — values stored in DB must match what the frontend renders
// CertificateForm uses translated strings (Individual/Անհատական/Индивидуальный/ინდივიდუალური)
// The DB stores whatever language was active when the form was filled.
// Admin always uses the Armenian canonical values so existing records remain consistent.
const CERT_FORMATS = [
    { value: "Անհատական", label: "Անհատական (Individual)" },
    { value: "Խմբային",   label: "Խմբային (Group)" },
    { value: "Individual", label: "Individual (EN)" },
    { value: "Group",      label: "Group (EN)" },
    { value: "Индивидуальный", label: "Индивидуальный (RU)" },
    { value: "Групповой",      label: "Групповой (RU)" },
    { value: "ინდივიდუალური",  label: "ინდივიდუალური (KA)" },
    { value: "ჯგუფური",        label: "ჯგუფური (KA)" },
];

const CERT_PROGRAMS = [
    { value: "Քեմբրիջյան",    label: "Քեմբրիջյան (HY)" },
    { value: "Cambridge",      label: "Cambridge (EN)" },
    { value: "Кембриджская",   label: "Кембриджская (RU)" },
    { value: "კემბრიჯის",      label: "კემბრიჯის (KA)" },
];

const CERT_ATTENDANCE_OPTIONS = [
    "32", "40", "48", "56", "64", "72", "80", "96", "108", "120",
];

function Certificates({ api, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [viewModal, setViewModal] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search so we don't fire on every keystroke
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = debouncedSearch ? `?q=${encodeURIComponent(debouncedSearch)}` : "";
            setData(await api("GET", `/certificates${params}`));
        } finally { setLoading(false); }
    }, [api, debouncedSearch]);
    useEffect(() => { load(); }, [load]);

    function setF(k, v) { setForm(p => ({ ...p, [k]: v })); }

    function openNew() {
        setForm({
            issue_date:   new Date().toISOString().split("T")[0],
            program:      "Քեմбրिджयान",
            course_format: "Անհատական",
        });
        setModal(true);
    }

    function openEdit(c) {
        setForm({ ...c });
        setModal(true);
    }

    async function save() {
        const required = ["full_name", "certificate_code", "course_name", "issue_date", "program", "attendance", "course_format"];
        const missing = required.filter(k => !form[k]?.toString().trim());
        if (missing.length) {
            toast(`Required fields missing: ${missing.join(", ")}`, "err");
            return;
        }
        // Duplicate code check for new certificates
        if (!form.id) {
            try {
                const existing = await api("GET", `/certificates?q=${encodeURIComponent(form.certificate_code)}`);
                if (Array.isArray(existing) && existing.some(c => c.certificate_code === form.certificate_code)) {
                    toast(`Certificate code "${form.certificate_code}" already exists`, "err");
                    return;
                }
            } catch {}
        }
        setSaving(true);
        try {
            if (form.id) await api("PUT", `/certificates/${form.id}`, form);
            else await api("POST", "/certificates", form);
            toast(form.id ? "Certificate updated!" : "Certificate issued!", "ok");
            setModal(null);
            load();
        } catch { toast("Save failed", "err"); } finally { setSaving(false); }
    }

    async function del(id, code) {
        if (!window.confirm(`Permanently delete certificate #${id}\nCode: ${code}\n\nThis cannot be undone.`)) return;
        await api("DELETE", `/certificates/${id}`);
        toast("Certificate deleted", "ok");
        load();
    }

    function exportCSV() {
        const header = "ID,Code,Full Name,Course,Level,Program,Format,Attendance,Issue Date\n";
        const body = data.map(c =>
            [c.id, c.certificate_code, `"${c.full_name}"`, `"${c.course_name}"`,
                `"${c.level || ""}"`, `"${c.program || ""}"`, `"${c.course_format || ""}"`,
                c.attendance || "", c.issue_date ? String(c.issue_date).split("T")[0] : ""]
                .join(",")
        ).join("\n");
        const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `certificates_${new Date().toISOString().split("T")[0]}.csv`;
        a.click(); URL.revokeObjectURL(url);
    }

    const rows = data.map(c => ({
        __key: c.id,
        __cells: (
            <>
                <td><span className="adm-tag adm-tag-blue">{c.id}</span></td>
                <td><code className="adm-code">{c.certificate_code}</code></td>
                <td style={{ fontWeight: 500 }}>{c.full_name}</td>
                <td>{c.course_name}</td>
                <td>{c.level
                    ? <span className="adm-tag adm-tag-yellow" style={{ fontSize: 11 }}>{c.level}</span>
                    : "—"}
                </td>
                <td>{c.course_format || "—"}</td>
                <td>{c.attendance || "—"}</td>
                <td>{c.issue_date ? String(c.issue_date).split("T")[0] : "—"}</td>
                <td>
                    <div className="adm-actions">
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setViewModal(c)} title="Preview">👁</button>
                        <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => openEdit(c)} title="Edit">✏️</button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => del(c.id, c.certificate_code)} title="Delete">🗑</button>
                    </div>
                </td>
            </>
        ),
    }));

    return (
        <>
            <div className="adm-table-wrap">
                <div className="adm-table-toolbar">
                    <input className="adm-search"
                           placeholder="Search by name, code, or course…"
                           value={search}
                           onChange={e => setSearch(e.target.value)} />
                    <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={exportCSV}>📥 CSV</button>
                    <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={openNew}>
                        + Issue Certificate
                    </button>
                </div>
                {loading ? <div className="adm-loading"><span className="adm-spinner" /> Loading…</div> : (
                    <div className="adm-table-scroll">
                        <table className="adm-data-table">
                            <thead>
                            <tr>
                                <th>ID</th><th>Code</th><th>Full Name</th><th>Course</th>
                                <th>Level</th><th>Format</th><th>Hours</th><th>Issue Date</th><th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows.length === 0
                                ? <tr><td colSpan={9} className="adm-empty-cell">No certificates found</td></tr>
                                : rows.map((r, i) => <tr key={r.__key || i}>{r.__cells}</tr>)}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── ISSUE / EDIT MODAL ── */}
            {modal && (
                <Modal
                    title={form.id ? `Edit Certificate — ${form.certificate_code}` : "Issue New Certificate"}
                    onClose={() => setModal(null)}
                    onSave={save}
                    saving={saving}
                    wide
                >
                    <div className="adm-form-grid">

                        {/* Full Name */}
                        <div className="adm-f-group adm-full">
                            <label className="adm-f-label">Full Name <span className="adm-required">*</span></label>
                            <input className="adm-f-input" value={form.full_name || ""}
                                   onChange={e => setF("full_name", e.target.value)}
                                   placeholder="e.g. Ani Petrosyan" autoFocus />
                        </div>

                        {/* Certificate Code */}
                        <div className="adm-f-group">
                            <label className="adm-f-label">Certificate Code <span className="adm-required">*</span></label>
                            <input className="adm-f-input adm-mono"
                                   value={form.certificate_code || ""}
                                   onChange={e => setF("certificate_code", e.target.value.toUpperCase())}
                                   placeholder="PA-2025-EN-001" />
                            <span className="adm-f-hint">Must be unique. Used for public verification.</span>
                        </div>

                        {/* Issue Date */}
                        <div className="adm-f-group">
                            <label className="adm-f-label">Issue Date <span className="adm-required">*</span></label>
                            <input className="adm-f-input" type="date"
                                   value={form.issue_date ? String(form.issue_date).split("T")[0] : ""}
                                   onChange={e => setF("issue_date", e.target.value)} />
                        </div>

                        {/* Course Name */}
                        <div className="adm-f-group adm-full">
                            <label className="adm-f-label">Course Name <span className="adm-required">*</span></label>
                            <input className="adm-f-input" value={form.course_name || ""}
                                   onChange={e => setF("course_name", e.target.value)}
                                   placeholder="e.g. Անգլերեն / English / Английский" />
                        </div>

                        {/* Level — exact dropdown matching CertificateForm.js */}
                        <div className="adm-f-group adm-full">
                            <label className="adm-f-label">Level <span className="adm-required">*</span></label>
                            <select className="adm-f-select" value={form.level || ""}
                                    onChange={e => setF("level", e.target.value)}>
                                <option value="">— Select level —</option>
                                <optgroup label="English">
                                    {CERT_LEVELS.filter(l => l.value.startsWith("English")).map(l =>
                                        <option key={l.value} value={l.value}>{l.label}</option>)}
                                </optgroup>
                                <optgroup label="Speaking Club">
                                    {CERT_LEVELS.filter(l => l.value.startsWith("Speaking")).map(l =>
                                        <option key={l.value} value={l.value}>{l.label}</option>)}
                                </optgroup>
                                <optgroup label="Armenian">
                                    {CERT_LEVELS.filter(l => l.value.startsWith("Armenian")).map(l =>
                                        <option key={l.value} value={l.value}>{l.label}</option>)}
                                </optgroup>
                                <optgroup label="Russian">
                                    {CERT_LEVELS.filter(l => l.value.startsWith("Russian")).map(l =>
                                        <option key={l.value} value={l.value}>{l.label}</option>)}
                                </optgroup>
                                <optgroup label="German">
                                    {CERT_LEVELS.filter(l => l.value.startsWith("German")).map(l =>
                                        <option key={l.value} value={l.value}>{l.label}</option>)}
                                </optgroup>
                                <optgroup label="Spanish">
                                    {CERT_LEVELS.filter(l => l.value.startsWith("Spanish")).map(l =>
                                        <option key={l.value} value={l.value}>{l.label}</option>)}
                                </optgroup>
                                <optgroup label="French">
                                    {CERT_LEVELS.filter(l => l.value.startsWith("French")).map(l =>
                                        <option key={l.value} value={l.value}>{l.label}</option>)}
                                </optgroup>
                            </select>
                        </div>

                        {/* Program */}
                        <div className="adm-f-group">
                            <label className="adm-f-label">Teaching Program <span className="adm-required">*</span></label>
                            <select className="adm-f-select" value={form.program || ""}
                                    onChange={e => setF("program", e.target.value)}>
                                <option value="">— Select —</option>
                                {CERT_PROGRAMS.map(p =>
                                    <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </div>

                        {/* Course Format */}
                        <div className="adm-f-group">
                            <label className="adm-f-label">Course Format <span className="adm-required">*</span></label>
                            <select className="adm-f-select" value={form.course_format || ""}
                                    onChange={e => setF("course_format", e.target.value)}>
                                <option value="">— Select —</option>
                                {CERT_FORMATS.map(f =>
                                    <option key={f.value} value={f.value}>{f.label}</option>)}
                            </select>
                        </div>

                        {/* Attendance hours */}
                        <div className="adm-f-group">
                            <label className="adm-f-label">Attended Hours <span className="adm-required">*</span></label>
                            <select className="adm-f-select" value={form.attendance || ""}
                                    onChange={e => setF("attendance", e.target.value)}>
                                <option value="">— Select —</option>
                                {CERT_ATTENDANCE_OPTIONS.map(h =>
                                    <option key={h} value={h}>{h} hours</option>)}
                            </select>
                            <span className="adm-f-hint">Or type custom: </span>
                            <input className="adm-f-input" style={{ marginTop: 4 }}
                                   value={form.attendance || ""}
                                   onChange={e => setF("attendance", e.target.value)}
                                   placeholder="e.g. 29 / 48" />
                        </div>

                        <div className="adm-f-group">
                            <label className="adm-f-label">Issue Date <span className="adm-required">*</span></label>
                            <input className="adm-f-input" type="date"
                                   value={form.issue_date ? String(form.issue_date).split("T")[0] : ""}
                                   onChange={e => setF("issue_date", e.target.value)} />
                        </div>
                    </div>
                </Modal>
            )}

            {/* ── CERTIFICATE PREVIEW MODAL ── */}
            {viewModal && (
                <Modal
                    title={`Certificate Preview — ${viewModal.certificate_code}`}
                    onClose={() => setViewModal(null)}
                    wide
                >
                    <div className="adm-cert-preview">
                        <div className="adm-cert-verified">✔ Certificate is Valid</div>

                        <section className="adm-cert-section">
                            <div className="adm-cert-section-title">🎓 Student Information</div>
                            <div className="adm-detail-grid">
                                <div className="adm-detail-row"><span>Full Name</span><strong>{viewModal.full_name}</strong></div>
                                <div className="adm-detail-row"><span>Course Language</span><strong>{viewModal.course_name}</strong></div>
                                <div className="adm-detail-row"><span>Level</span><strong>{viewModal.level || "—"}</strong></div>
                                <div className="adm-detail-row"><span>Course Format</span><strong>{viewModal.course_format || "—"}</strong></div>
                                <div className="adm-detail-row"><span>Teaching Program</span><strong>{viewModal.program || "—"}</strong></div>
                            </div>
                        </section>

                        <section className="adm-cert-section">
                            <div className="adm-cert-section-title">📄 Attendance</div>
                            <div className="adm-detail-grid">
                                <div className="adm-detail-row">
                                    <span>Attended Hours</span>
                                    <strong>{viewModal.attendance || "—"}</strong>
                                </div>
                            </div>
                        </section>

                        <section className="adm-cert-section">
                            <div className="adm-cert-section-title">📋 Certificate Details</div>
                            <div className="adm-detail-grid">
                                <div className="adm-detail-row"><span>Issue Date</span><strong>{viewModal.issue_date ? String(viewModal.issue_date).split("T")[0] : "—"}</strong></div>
                                <div className="adm-detail-row"><span>Certificate Code</span><code className="adm-code">{viewModal.certificate_code}</code></div>
                                <div className="adm-detail-row"><span>Validity</span><strong>Unlimited</strong></div>
                            </div>
                        </section>

                        <section className="adm-cert-section adm-cert-note">
                            <div className="adm-cert-section-title">📝 Note</div>
                            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--adm-text2)", marginTop: 6 }}>
                                Out of the total course program, 32–48 academic hours are intended for the development
                                of speaking skills and are conducted at the student's discretion.
                            </p>
                            <p style={{ fontSize: 12, color: "var(--adm-red)", marginTop: 8, fontWeight: 500 }}>
                                This certificate is a document confirming completion of training and is not a state diploma
                                or qualification certificate.
                            </p>
                        </section>

                        <section className="adm-cert-section">
                            <div className="adm-cert-section-title">⚖️ Legal Basis</div>
                            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--adm-text2)", marginTop: 6 }}>
                                The certificate was issued by Polyglot Academy. The course was conducted in accordance
                                with the regulations established by the Ministry of Education, Science, Culture and Sports
                                of the Republic of Armenia.
                            </p>
                        </section>

                        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setViewModal(null); openEdit(viewModal); }}>✏️ Edit this certificate</button>
                            <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => { setViewModal(null); del(viewModal.id, viewModal.certificate_code); }}>🗑 Delete</button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: TELEGRAM VIP SUBSCRIPTIONS (NEW)
// ═══════════════════════════════════════════════════════════════════
function TelegramSubs({ api, toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("active");
    const [extendModal, setExtendModal] = useState(null);
    const [days, setDays] = useState(30);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = statusFilter ? `?status=${statusFilter}` : "";
            setData(await api("GET", `/telegram-subs${params}`));
        } finally { setLoading(false); }
    }, [api, statusFilter]);
    useEffect(() => { load(); }, [load]);

    async function extend() {
        setSaving(true);
        try {
            await api("PUT", `/telegram-subs/${extendModal.id}/extend`, { days });
            toast(`Extended by ${days} days!`, "ok");
            setExtendModal(null); load();
        } catch { toast("Failed", "err"); } finally { setSaving(false); }
    }

    async function cancel(id) {
        if (!window.confirm(`Cancel subscription #${id}? This will mark it as expired.`)) return;
        await api("PUT", `/telegram-subs/${id}/cancel`);
        toast("Subscription cancelled", "ok"); load();
    }

    async function del(id) {
        if (!window.confirm(`Delete subscription record #${id}?`)) return;
        await api("DELETE", `/telegram-subs/${id}`);
        toast("Deleted", "ok"); load();
    }

    const statusOptions = [
        { value: "", label: "All statuses" },
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
    ];

    const planLabels = { telegram_1m: "1 Month", telegram_6m: "6 Months", telegram_1y: "1 Year" };

    const rows = data.map(s => {
        const left = daysUntil(s.expire_at);
        const expiring = left !== null && left <= 5 && left > 0;
        return {
            __key: s.id,
            __cells: (
                <>
                    <td><span className="adm-tag adm-tag-blue">{s.id}</span></td>
                    <td>
                        <div>{s.telegram_id}</div>
                        {s.username && <div style={{ fontSize: 11, color: "var(--adm-text2)" }}>@{s.username}</div>}
                    </td>
                    <td><span className="adm-tag adm-tag-blue">{planLabels[s.plan] || s.plan}</span></td>
                    <td>
                        <span style={{ color: expiring ? "var(--adm-yellow)" : "inherit" }}>
                            {fmtDate(s.expire_at)}
                        </span>
                        {expiring && <span className="adm-tag adm-tag-yellow" style={{ marginLeft: 6, fontSize: 10 }}>⚠️ {left}d</span>}
                        {left !== null && left <= 0 && s.status === "active" && <span className="adm-tag adm-tag-red" style={{ marginLeft: 6, fontSize: 10 }}>Expired</span>}
                    </td>
                    <td>
                        <span className="adm-tag adm-tag-blue" style={{ fontSize: 10 }}>
                            {s.notified_3d ? "✓5d" : "—"} {s.notified_1d ? "✓1d" : "—"}
                        </span>
                    </td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>
                        <div className="adm-actions">
                            <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setExtendModal(s); setDays(30); }}>➕ Extend</button>
                            {s.status === "active" && <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => cancel(s.id)}>✕ Cancel</button>}
                            <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => del(s.id)}>🗑</button>
                        </div>
                    </td>
                </>
            ),
        };
    });

    return (
        <>
            <DataTable id="telegram-subs"
                       cols={["ID", "Telegram User", "Plan", "Expires", "Notified", "Status", "Actions"]}
                       rows={rows} loading={loading}
                       statusFilter={statusFilter} onStatusFilter={setStatusFilter} statusOptions={statusOptions}
            />

            {extendModal && (
                <Modal title={`Extend Subscription #${extendModal.id}`} onClose={() => setExtendModal(null)} onSave={extend} saving={saving}>
                    <div className="adm-detail-grid" style={{ marginBottom: 16 }}>
                        <div className="adm-detail-row"><span>Telegram ID</span><strong>{extendModal.telegram_id}</strong></div>
                        {extendModal.username && <div className="adm-detail-row"><span>Username</span><strong>@{extendModal.username}</strong></div>}
                        <div className="adm-detail-row"><span>Current Expiry</span><strong>{fmtDate(extendModal.expire_at)}</strong></div>
                        <div className="adm-detail-row"><span>Plan</span><strong>{planLabels[extendModal.plan] || extendModal.plan}</strong></div>
                    </div>
                    <div className="adm-f-group">
                        <label className="adm-f-label">Extend by (days)</label>
                        <select className="adm-f-select" value={days} onChange={e => setDays(Number(e.target.value))}>
                            <option value={7}>7 days</option>
                            <option value={30}>30 days (1 month)</option>
                            <option value={90}>90 days (3 months)</option>
                            <option value={180}>180 days (6 months)</option>
                            <option value={365}>365 days (1 year)</option>
                        </select>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 13, color: "var(--adm-text2)" }}>
                        New expiry: <strong>{(() => {
                        const base = new Date(extendModal.expire_at) > new Date() ? new Date(extendModal.expire_at) : new Date();
                        base.setDate(base.getDate() + days);
                        return fmtDate(base);
                    })()}</strong>
                    </div>
                </Modal>
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL: SYSTEM HEALTH (NEW)
// ═══════════════════════════════════════════════════════════════════
function SystemHealth({ api }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(() => {
        setLoading(true);
        api("GET", "/health").then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    }, [api]);
    useEffect(() => { load(); }, [load]);

    if (loading) return <div className="adm-loading"><span className="adm-spinner" /> Checking systems…</div>;
    if (!data) return <div className="adm-empty-cell">Health check failed</div>;

    const { checks } = data;

    function VarRow({ item }) {
        return (
            <div className="adm-detail-row">
                <span className="adm-mono" style={{ fontSize: 12 }}>{item.key}</span>
                <span className={`adm-tag ${item.set ? "adm-tag-green" : "adm-tag-red"}`}>{item.set ? "✓ Set" : "✗ Missing"}</span>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <h3 style={{ color: "var(--adm-text)", fontFamily: "'DM Serif Display', serif", fontSize: 18 }}>System Status</h3>
                <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={load}>↺ Refresh</button>
                <span style={{ fontSize: 12, color: "var(--adm-text3)" }}>Last checked: {fmtDate(data.timestamp)}</span>
            </div>

            {/* DATABASE */}
            <div className="adm-table-wrap" style={{ marginBottom: 16 }}>
                <div className="adm-table-toolbar">
                    <strong className="adm-section-title">🗄 Database</strong>
                    <span className={`adm-tag ${checks.database?.status === "ok" ? "adm-tag-green" : "adm-tag-red"}`}>
                        {checks.database?.status === "ok" ? "✓ Connected" : "✗ Error"}
                    </span>
                </div>
            </div>

            {/* PAYMENT PROVIDERS */}
            <div className="adm-table-wrap" style={{ marginBottom: 16 }}>
                <div className="adm-table-toolbar"><strong className="adm-section-title">💳 Payment Providers</strong></div>
                <div style={{ padding: "0 16px 16px" }}>
                    {Object.entries(checks.payments || {}).map(([name, info]) => (
                        <div key={name} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <strong style={{ color: "var(--adm-text)", fontSize: 13 }}>{name.toUpperCase()}</strong>
                                <span className={`adm-tag ${info.status === "configured" ? "adm-tag-green" : "adm-tag-red"}`}>{info.status}</span>
                            </div>
                            {info.vars?.map(v => <VarRow key={v.key} item={v} />)}
                        </div>
                    ))}
                </div>
            </div>

            {/* INTEGRATIONS */}
            <div className="adm-table-wrap" style={{ marginBottom: 16 }}>
                <div className="adm-table-toolbar"><strong className="adm-section-title">🔗 Integrations</strong></div>
                <div style={{ padding: "0 16px 16px" }}>
                    {Object.values(checks.integrations || {}).map(item => <VarRow key={item.key} item={item} />)}
                </div>
            </div>

            {/* CRON */}
            {checks.cron && (
                <div className="adm-table-wrap">
                    <div className="adm-table-toolbar"><strong className="adm-section-title">⏰ Cron Jobs</strong></div>
                    <div style={{ padding: "8px 16px 16px" }}>
                        <div className="adm-detail-row">
                            <span>Last subscription expiry processed</span>
                            <strong>{checks.cron.last_expiry_processed ? fmtDate(checks.cron.last_expiry_processed) : "Never"}</strong>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// NAV CONFIG
// ═══════════════════════════════════════════════════════════════════
const NAV = [
    { id: "dashboard",    icon: "📊", label: "Dashboard",         section: "Overview" },
    { id: "products",     icon: "🌐", label: "Products / Courses", section: "Content" },
    { id: "comments",     icon: "💬", label: "Reviews",            section: null },
    { id: "teachers",     icon: "👨‍🏫", label: "Teachers",          section: null },
    { id: "team",         icon: "👥", label: "Our Team",           section: null },
    { id: "gallery",      icon: "🖼",  label: "Gallery",            section: null },
    { id: "certificates", icon: "🎓", label: "Certificates",       section: "Academy" },
    { id: "telegram",     icon: "📱", label: "Telegram VIP",       section: null },
    { id: "translations", icon: "🌍", label: "Languages & Text",   section: "Settings" },
    { id: "orders",       icon: "🛒", label: "Orders",             section: "Business" },
    { id: "newsletter",   icon: "📧", label: "Subscribers",        section: null },
    { id: "contacts",     icon: "📩", label: "Messages",           section: null },
    { id: "health",       icon: "⚙️", label: "System Health",      section: "Operations" },
];

const PANEL_TITLES = {
    dashboard: "Dashboard", products: "Products / Courses", comments: "Reviews",
    teachers: "Teachers", team: "Our Team", gallery: "Gallery",
    certificates: "Certificates", telegram: "Telegram VIP Subscriptions",
    translations: "Languages & Translations", orders: "Orders",
    newsletter: "Newsletter Subscribers", contacts: "Contact Messages",
    health: "System Health",
};

// ═══════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function AdminPage() {
    const [token, setToken]     = useState(() => localStorage.getItem("adm_token") || "");
    const [verified, setVerified] = useState(false);
    const [checking, setChecking] = useState(true);
    const [panel, setPanel]     = useState("dashboard");
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [loginErr, setLoginErr]   = useState("");
    const [loggingIn, setLoggingIn] = useState(false);
    const { toasts, push: toast } = useToast();
    const api = useApi(token);

    // Verify existing token
    useEffect(() => {
        if (!token) { setChecking(false); return; }
        fetch(API_BASE + "/verify", { headers: { "x-admin-token": token } })
            .then(r => r.json())
            .then(j => { if (j.valid) setVerified(true); else setToken(""); })
            .catch(() => setToken(""))
            .finally(() => setChecking(false));
    }, []); // eslint-disable-line

    async function login() {
        setLoggingIn(true); setLoginErr("");
        try {
            const r = await fetch(API_BASE + "/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginForm),
            });
            const j = await r.json();
            if (r.ok && j.token) {
                localStorage.setItem("adm_token", j.token);
                setToken(j.token); setVerified(true);
            } else { setLoginErr(j.error || "Invalid credentials"); }
        } catch { setLoginErr("Cannot reach server."); } finally { setLoggingIn(false); }
    }

    function logout() {
        localStorage.removeItem("adm_token");
        setToken(""); setVerified(false);
    }

    const handleApi = useCallback(async (method, path, body, isFormData) => {
        try { return await api(method, path, body, isFormData); }
        catch (e) { if (e.message === "__UNAUTHORIZED__") logout(); throw e; }
    }, [api]); // eslint-disable-line

    // ── LOADING ──
    if (checking) return (
        <div className="adm-full-center"><span className="adm-spinner adm-spinner-lg" /></div>
    );

    // ── LOGIN ──
    if (!verified) return (
        <div className="adm-full-center adm-login-bg">
            <div className="adm-login-card">
                <div className="adm-login-logo">Polyglot <span>Academy</span></div>
                <div className="adm-login-sub">Admin Panel</div>
                <div className="adm-field">
                    <label>Username</label>
                    <input type="text" value={loginForm.username} placeholder="admin"
                           autoComplete="username"
                           onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                           onKeyDown={e => e.key === "Enter" && login()} />
                </div>
                <div className="adm-field">
                    <label>Password</label>
                    <input type="password" value={loginForm.password} placeholder="••••••••"
                           autoComplete="current-password"
                           onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                           onKeyDown={e => e.key === "Enter" && login()} />
                </div>
                <button className="adm-btn adm-btn-primary adm-btn-full" onClick={login} disabled={loggingIn}>
                    {loggingIn ? <span className="adm-spinner" /> : "Sign In"}
                </button>
                {loginErr && <div className="adm-login-err">{loginErr}</div>}
            </div>
            <ToastContainer toasts={toasts} />
        </div>
    );

    // ── ADMIN ──
    const panelMap = {
        dashboard:    <Dashboard    api={handleApi} />,
        products:     <Products     api={handleApi} token={token} toast={toast} />,
        comments:     <Comments     api={handleApi} token={token} toast={toast} />,
        teachers:     <Teachers     api={handleApi} token={token} toast={toast} />,
        team:         <Team         api={handleApi} token={token} toast={toast} />,
        gallery:      <Gallery      api={handleApi} token={token} toast={toast} />,
        certificates: <Certificates api={handleApi} toast={toast} />,
        telegram:     <TelegramSubs api={handleApi} toast={toast} />,
        translations: <Translations api={handleApi} toast={toast} />,
        orders:       <Orders       api={handleApi} toast={toast} />,
        newsletter:   <Newsletter   api={handleApi} toast={toast} />,
        contacts:     <Contacts     api={handleApi} toast={toast} />,
        health:       <SystemHealth api={handleApi} />,
    };

    let lastSection = null;

    return (
        <div className="adm-layout">
            <aside className="adm-sidebar">
                <div className="adm-sidebar-head">
                    <div className="adm-sidebar-logo">Polyglot <span>Admin</span></div>
                    <div className="adm-sidebar-badge">Control Panel</div>
                </div>
                <nav className="adm-sidebar-nav">
                    {NAV.map(item => {
                        const showSection = item.section && item.section !== lastSection;
                        if (item.section) lastSection = item.section;
                        return (
                            <React.Fragment key={item.id}>
                                {showSection && <div className="adm-nav-section">{item.section}</div>}
                                <div className={`adm-nav-item${panel === item.id ? " active" : ""}`}
                                     onClick={() => setPanel(item.id)}>
                                    <span className="adm-nav-icon">{item.icon}</span>
                                    {item.label}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </nav>
                <div className="adm-sidebar-foot">
                    <button className="adm-btn adm-btn-ghost adm-btn-full adm-btn-sm" onClick={logout}>⬅ Sign Out</button>
                </div>
            </aside>

            <div className="adm-main">
                <div className="adm-topbar">
                    <div className="adm-topbar-title">{PANEL_TITLES[panel]}</div>
                    <div className="adm-topbar-right">
                        <div className="adm-user-chip">
                            <div className="adm-avatar">A</div>
                            <span>Admin</span>
                        </div>
                    </div>
                </div>
                <div className="adm-content">
                    {panelMap[panel]}
                </div>
            </div>

            <ToastContainer toasts={toasts} />
        </div>
    );
}