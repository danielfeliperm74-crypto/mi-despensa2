import { useState, useMemo, useEffect } from "react";

const SAMPLE = [
  { id: 1, name: "Arroz",  quantity: 2, unit: "kg",   category: "Granos",      expiryDate: "2026-07-15", emoji: "🌾" },
  { id: 2, name: "Leche",  quantity: 3, unit: "L",    category: "Lácteos",     expiryDate: "2026-06-02", emoji: "🥛" },
  { id: 3, name: "Pasta",  quantity: 4, unit: "paq",  category: "Granos",      expiryDate: "2027-01-10", emoji: "🍝" },
  { id: 4, name: "Aceite", quantity: 1, unit: "L",    category: "Condimentos", expiryDate: "2026-12-01", emoji: "🫒" },
];

const CATEGORIES = ["Granos","Lácteos","Carnes","Verduras","Frutas","Condimentos","Bebidas","Snacks","Otros"];
const UNITS      = ["kg","g","L","ml","paq","lata","pote","unidad","docena"];
const EMOJIS     = ["🌾","🥛","🍖","🥦","🍎","🫒","🧃","🍪","🫙","🥚","🧀","🍅","🥕","🧅","🧄","🫘","🌽","🍞"];
const BLANK      = { name:"", quantity:1, unit:"paq", category:"Otros", expiryDate:"", emoji:"🫙" };

const load = () => { try { const s = localStorage.getItem("despensa"); return s ? JSON.parse(s) : SAMPLE; } catch { return SAMPLE; } };
const save = (data) => { try { localStorage.setItem("despensa", JSON.stringify(data)); } catch {} };

const days = (d) => { const t = new Date(); t.setHours(0,0,0,0); return Math.ceil((new Date(d)-t)/86400000); };

function Badge({ d }) {
  if (d < 0)  return <b style={{...B.badge, background:"#3d2b1f", color:"#fff"}}>Vencido</b>;
  if (d === 0) return <b style={{...B.badge, background:"#c62828", color:"#fff"}}>Hoy</b>;
  if (d <= 3) return <b style={{...B.badge, background:"#e6834a", color:"#fff"}}>{d}d</b>;
  if (d <= 7) return <b style={{...B.badge, background:"#e6b84a", color:"#3d2b1f"}}>{d}d</b>;
  return <b style={{...B.badge, background:"#e8f5e9", color:"#2e7d32"}}>{d}d</b>;
}

export default function App() {
  const [items,     setItems]     = useState(load);
  const [form,      setForm]      = useState(BLANK);
  const [editId,    setEditId]    = useState(null);
  const [open,      setOpen]      = useState(false);
  const [filter,    setFilter]    = useState("Todos");
  const [sort,      setSort]      = useState("expiry");
  const [q,         setQ]         = useState("");

  useEffect(() => save(items), [items]);

  const alerts = useMemo(() => items.filter(p => days(p.expiryDate) <= 7), [items]);

  const list = useMemo(() => {
    const sq = q.toLowerCase();
    let r = items
      .filter(p => filter === "Todos" || p.category === filter)
      .filter(p => !sq || p.name.toLowerCase().includes(sq) || p.category.toLowerCase().includes(sq));
    if (sort === "expiry")    r = [...r].sort((a,b) => new Date(a.expiryDate)-new Date(b.expiryDate));
    if (sort === "name")      r = [...r].sort((a,b) => a.name.localeCompare(b.name));
    if (sort === "category")  r = [...r].sort((a,b) => a.category.localeCompare(b.category));
    return r;
  }, [items, filter, sort, q]);

  const submit = () => {
    if (!form.name || !form.expiryDate) return;
    if (editId) {
      setItems(ps => ps.map(p => p.id === editId ? { ...form, id: editId } : p));
      setEditId(null);
    } else {
      setItems(ps => [...ps, { ...form, id: Date.now() }]);
    }
    setForm(BLANK); setOpen(false);
  };

  const edit = (p) => { setForm({ name:p.name, quantity:p.quantity, unit:p.unit, category:p.category, expiryDate:p.expiryDate, emoji:p.emoji }); setEditId(p.id); setOpen(true); };
  const del  = (id) => { if (confirm("¿Eliminar?")) setItems(ps => ps.filter(p => p.id !== id)); };
  const cats = ["Todos", ...CATEGORIES];

  return (
    <div style={B.root}>
      <div style={B.bg}/>

      {/* Header */}
      <header style={B.header}>
        <div style={B.hInner}>
          <div>
            <h1 style={B.title}>🫙 Mi Despensa</h1>
            <p style={B.sub}>{items.length} productos · {alerts.length} alertas · <span style={{color:"#c67c2a",fontSize:11}}>guardado en tu celular</span></p>
          </div>
          <button style={B.addBtn} onClick={() => { setOpen(!open); setEditId(null); setForm(BLANK); }}>
            {open ? "✕" : "+ Añadir"}
          </button>
        </div>
      </header>

      <div style={B.main}>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={B.alert}>
            <span style={{fontSize:18}}>⚠️</span>
            <div>
              <strong style={{display:"block", fontSize:13, color:"#7a5c1e", marginBottom:6}}>Próximos a vencer</strong>
              <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
                {alerts.map(p => (
                  <span key={p.id} style={B.chip}>{p.emoji} {p.name} — <Badge d={days(p.expiryDate)}/></span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {open && (
          <div style={B.card}>
            <h2 style={{margin:"0 0 14px", fontSize:16, color:"#3d2b1f"}}>{editId ? "Editar producto" : "Nuevo producto"}</h2>
            <div style={B.grid3}>
              <div style={B.field}>
                <label style={B.lbl}>Emoji</label>
                <select style={B.inp} value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))}>
                  {EMOJIS.map(e=><option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div style={{...B.field, gridColumn:"span 2"}}>
                <label style={B.lbl}>Nombre *</label>
                <input style={B.inp} placeholder="Ej: Arroz" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              </div>
              <div style={B.field}>
                <label style={B.lbl}>Cantidad</label>
                <input style={B.inp} type="number" min="0" step="0.1" value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:parseFloat(e.target.value)||0}))}/>
              </div>
              <div style={B.field}>
                <label style={B.lbl}>Unidad</label>
                <select style={B.inp} value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}>
                  {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div style={B.field}>
                <label style={B.lbl}>Categoría</label>
                <select style={B.inp} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{...B.field, gridColumn:"span 3"}}>
                <label style={B.lbl}>Fecha de vencimiento *</label>
                <input style={B.inp} type="date" value={form.expiryDate} onChange={e=>setForm(f=>({...f,expiryDate:e.target.value}))}/>
              </div>
            </div>
            <button style={B.saveBtn} onClick={submit}>{editId ? "Guardar cambios" : "Añadir producto"}</button>
          </div>
        )}

        {/* Search */}
        <div style={B.search}>
          <span style={{opacity:.5}}>🔍</span>
          <input style={B.sInput} placeholder="Buscar…" value={q} onChange={e=>setQ(e.target.value)}/>
          {q && <button style={B.sX} onClick={()=>setQ("")}>✕</button>}
        </div>

        {/* Filters */}
        <div style={B.controls}>
          <div style={{display:"flex", gap:5, flexWrap:"wrap", flex:1}}>
            {cats.map(c=>(
              <button key={c} style={{...B.fBtn, ...(filter===c?B.fActive:{})}} onClick={()=>setFilter(c)}>{c}</button>
            ))}
          </div>
          <select style={B.sortSel} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="expiry">Por vencimiento</option>
            <option value="name">Por nombre</option>
            <option value="category">Por categoría</option>
          </select>
        </div>

        {/* Grid */}
        <div style={B.pgrid}>
          {list.length === 0 && <p style={{gridColumn:"1/-1", textAlign:"center", color:"#a07a4e", padding:"32px 0"}}>{q ? `No se encontró "${q}"` : "No hay productos aquí"}</p>}
          {list.map(p => {
            const d = days(p.expiryDate);
            return (
              <div key={p.id} style={{...B.pcard, ...(d<=3?{borderColor:"#e6834a", background:"#fff9f5"}:{})}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4}}>
                  <span style={{fontSize:26}}>{p.emoji}</span>
                  <div style={{display:"flex", gap:3}}>
                    <button style={B.icon} onClick={()=>edit(p)}>✏️</button>
                    <button style={B.icon} onClick={()=>del(p.id)}>🗑️</button>
                  </div>
                </div>
                <p style={{margin:0, fontSize:14, fontWeight:700, color:"#3d2b1f"}}>{p.name}</p>
                <p style={{margin:"2px 0 0", fontSize:11, color:"#a07a4e", textTransform:"uppercase", letterSpacing:".4px"}}>{p.category}</p>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8}}>
                  <span style={{fontSize:13, fontWeight:600, color:"#5a3e28"}}>{p.quantity} {p.unit}</span>
                  <Badge d={d}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const B = {
  root:    { minHeight:"100vh", fontFamily:"Georgia,serif", background:"#fdf6ec", position:"relative", overflowX:"hidden" },
  bg:      { position:"fixed", inset:0, zIndex:0, background:"radial-gradient(ellipse at 20% 10%,#f5e6c8 0%,transparent 60%),radial-gradient(ellipse at 80% 90%,#e8d5b0 0%,transparent 55%)", pointerEvents:"none" },
  header:  { position:"sticky", top:0, zIndex:10, background:"rgba(253,246,236,0.93)", backdropFilter:"blur(12px)", borderBottom:"2px solid #d4a96a", padding:"0 20px" },
  hInner:  { maxWidth:860, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0" },
  title:   { margin:0, fontSize:24, fontWeight:700, color:"#3d2b1f" },
  sub:     { margin:"2px 0 0", fontSize:12, color:"#8c6a3f" },
  addBtn:  { background:"#3d2b1f", color:"#fdf6ec", border:"none", borderRadius:8, padding:"10px 18px", fontSize:14, fontFamily:"inherit", cursor:"pointer", fontWeight:600 },
  main:    { maxWidth:860, margin:"0 auto", padding:"20px 14px 48px", position:"relative", zIndex:1 },
  alert:   { background:"#fff8e8", border:"1.5px solid #e6b84a", borderRadius:12, padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start", marginBottom:16 },
  chip:    { background:"#fff", border:"1px solid #e6b84a", borderRadius:20, padding:"2px 9px", fontSize:12, color:"#3d2b1f", display:"inline-flex", alignItems:"center", gap:4 },
  card:    { background:"#fff", border:"1.5px solid #d4a96a", borderRadius:14, padding:"18px 20px", marginBottom:16, boxShadow:"0 4px 20px rgba(61,43,31,0.07)" },
  grid3:   { display:"grid", gridTemplateColumns:"70px 1fr 1fr", gap:10, marginBottom:14 },
  field:   { display:"flex", flexDirection:"column", gap:3 },
  lbl:     { fontSize:11, color:"#8c6a3f", fontWeight:600, textTransform:"uppercase", letterSpacing:".5px" },
  inp:     { border:"1.5px solid #d4a96a", borderRadius:7, padding:"7px 9px", fontSize:13, color:"#3d2b1f", background:"#fdf6ec", fontFamily:"inherit", outline:"none" },
  saveBtn: { background:"#c67c2a", color:"#fff", border:"none", borderRadius:8, padding:"10px 22px", fontSize:14, fontFamily:"inherit", cursor:"pointer", fontWeight:600 },
  search:  { display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1.5px solid #d4a96a", borderRadius:10, padding:"7px 12px", marginBottom:12, boxShadow:"0 2px 8px rgba(61,43,31,0.05)" },
  sInput:  { flex:1, border:"none", outline:"none", fontSize:13, color:"#3d2b1f", background:"transparent", fontFamily:"inherit" },
  sX:      { background:"transparent", border:"none", cursor:"pointer", color:"#a07a4e", fontSize:12 },
  controls:{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:16 },
  fBtn:    { background:"transparent", border:"1.5px solid #d4a96a", borderRadius:20, padding:"4px 12px", fontSize:12, color:"#8c6a3f", fontFamily:"inherit", cursor:"pointer" },
  fActive: { background:"#3d2b1f", color:"#fdf6ec", borderColor:"#3d2b1f" },
  sortSel: { border:"1.5px solid #d4a96a", borderRadius:8, padding:"5px 9px", fontSize:12, color:"#3d2b1f", background:"#fdf6ec", fontFamily:"inherit", cursor:"pointer" },
  pgrid:   { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 },
  pcard:   { background:"#fff", border:"1.5px solid #e0c89a", borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:3, boxShadow:"0 2px 10px rgba(61,43,31,0.05)" },
  icon:    { background:"transparent", border:"none", cursor:"pointer", fontSize:13, padding:"2px 3px", borderRadius:4, opacity:.6 },
  badge:   { borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700, fontStyle:"normal" },
};
