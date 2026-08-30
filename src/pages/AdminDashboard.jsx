import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Cropper from 'react-cropper';
import { 
  LayoutDashboard, FileText, User, FolderGit2, Briefcase, GraduationCap, 
  Wrench, Award, BookOpen, LogOut, ChevronLeft, ChevronRight, Edit3, Trash2, Check, Sun, Moon
} from 'lucide-react';

const API = 'https://azim-portfolio-backend.onrender.com/api';
const COLLEGE_LOGO = "https://upload.wikimedia.org/wikipedia/commons/b/b9/IIT-Patna.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"; 

export default function AdminDashboard({ setAuth }) {
  // === MASTER STATE ===
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isExpanded, setIsExpanded] = useState(true); 
  const [activeTab, setActiveTab] = useState('builder');
  const [data, setData] = useState({ profile: [], experience: [], education: [], projects: [], skills: [], achievements: [], courses: [] });
  const [selected, setSelected] = useState({ experience: [], education: [], projects: [], skills: [], courses: [], achievements: [] });
  
  const [form, setForm] = useState({}); 
  const [imageFile, setImageFile] = useState(null); 
  
  const resumeRef = useRef(null);
  const cropperRef = useRef(null);

  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#0f172a' : '#f1f5f9', sidebar: isDark ? '#020617' : '#0f172a',
    sidebarBtnBg: isDark ? '#1e293b' : '#1e293b', cardBg: isDark ? '#1e293b' : 'white',
    border: isDark ? '#334155' : '#e2e8f0', textMain: isDark ? '#f8fafc' : '#0f172a',
    textMuted: isDark ? '#94a3b8' : '#64748b', inputBg: isDark ? '#0f172a' : '#f8fafc',
    builderLeft: isDark ? '#1e293b' : 'white', builderRight: isDark ? '#020617' : '#cbd5e1'
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if(theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, [theme]);

  // === DATA FETCHING ===
  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const endpoints = ['profile', 'experience', 'education', 'projects', 'skills', 'achievements', 'courses'];
      const responses = await Promise.all(endpoints.map(ep => fetch(`${API}/${ep}`).then(res => res.json())));
      
      const newData = {}; endpoints.forEach((ep, i) => newData[ep] = responses[i]); setData(newData);

      if (selected.projects.length === 0 && newData.projects.length > 0) {
        setSelected({
          experience: newData.experience.map(e => e._id), education: newData.education.map(e => e._id),
          projects: newData.projects.map(p => p._id), skills: newData.skills.map(s => s._id),
          courses: newData.courses.map(c => c._id), achievements: newData.achievements.map(a => a._id)
        });
      }
    } catch (err) { console.error("API Error:", err); }
  };

  useEffect(() => { fetchData(); }, []);
  
  useEffect(() => {
    if(activeTab === 'profile' && data.profile.length > 0) setForm(data.profile[0]);
    else if (activeTab !== 'builder') setForm({}); 
  }, [activeTab, data.profile]);

  // === API CONTROLS ===
  const apiCall = async (endpoint, method = 'GET', body = null) => {
    const opt = { method, headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } };
    if (body) { opt.headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body); }
    const res = await fetch(`${API}/${endpoint}`, opt);
    if (res.status === 401 || res.status === 403) handleLogout();
    fetchData(); return res.json();
  };

  const handleSubmit = async (e, endpoint, formatter) => {
    e.preventDefault(); const payload = formatter ? formatter(form) : form;
    if (form._id) await apiCall(`${endpoint}/${form._id}`, 'PUT', payload);
    else await apiCall(endpoint, 'POST', payload); setForm({}); 
  };

  const handleDelete = async (endpoint, id) => { if(window.confirm("Erase this permanently?")) await apiCall(`${endpoint}/${id}`, 'DELETE'); };
  const handleEdit = (item) => { setForm(item); document.querySelector('.main-area').scrollTo(0,0); };
  const handleLogout = () => { localStorage.removeItem('adminToken'); setAuth(false); };
  
  const handleDownloadPdf = useReactToPrint({ 
    contentRef: resumeRef, 
    documentTitle: 'Azim_Khairdi_Resume',
    pageStyle: `@media print { @page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; } }`
  });

  const toggleSelection = (cat, id) => setSelected(p => ({ ...p, [cat]: p[cat].includes(id) ? p[cat].filter(i => i !== id) : [...p[cat], id] }));

  const onCrop = () => {
    const cropper = cropperRef?.current?.cropper;
    if (cropper) {
      setForm({ ...form, imageUrl: cropper.getCroppedCanvas({width: 300, height: 300}).toDataURL('image/jpeg', 0.8) });
      setImageFile(null); 
    }
  };

  // ========================================================
  // 🔥 FIX: PURE JAVASCRIPT RENDERING HELPER FUNCTIONS
  // (Using {} instead of < /> to stop React from re-mounting)
  // ========================================================

  const renderNavBtn = (id, Icon, label) => (
    <button key={id} onClick={() => setActiveTab(id)} title={!isExpanded ? label : ''} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', backgroundColor: activeTab === id ? (isDark?'rgba(45, 212, 191, 0.15)':'rgba(45, 212, 191, 0.1)') : 'transparent', color: activeTab === id ? '#2dd4bf' : '#94a3b8', border: 'none', borderRight: activeTab === id ? '3px solid #2dd4bf' : '3px solid transparent', cursor: 'pointer', transition: '0.2s', width: '100%', overflow: 'hidden' }}>
      <Icon size={22} style={{ minWidth: '22px' }}/> {isExpanded && <span style={{ fontWeight: activeTab === id ? 'bold' : '500', whiteSpace:'nowrap', fontFamily:'"Manrope", sans-serif' }}>{label}</span>}
    </button>
  );

  const renderInput = (label, field, isArea, placeholder) => (
    <div key={field} style={{ flex: 1, marginBottom: '15px' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', color: colors.textMuted, fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</label>
      {isArea ? (
        <textarea placeholder={placeholder} value={form[field] || ''} onChange={(e) => setForm({...form, [field]: e.target.value})} rows="3" style={{ width: '100%', padding: '14px', border: `1px solid ${colors.border}`, borderRadius: '10px', background: colors.inputBg, color: colors.textMain, outlineColor: '#2dd4bf', fontSize: '1rem', transition:'0.2s' }} required />
      ) : (
        <input placeholder={placeholder} value={form[field] || ''} onChange={(e) => setForm({...form, [field]: e.target.value})} style={{ width: '100%', padding: '14px', border: `1px solid ${colors.border}`, borderRadius: '10px', background: colors.inputBg, color: colors.textMain, outlineColor: '#2dd4bf', fontSize: '1rem', transition:'0.2s' }} required />
      )}
    </div>
  );

  const renderListItem = (item, endpoint, title, subtitle, badges) => (
    <div key={item._id} style={{ padding: '24px', background: colors.cardBg, borderRadius: '16px', border: `1px solid ${colors.border}`, marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition:'0.2s' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', color: colors.textMain, fontSize: '1.15rem', fontFamily:'Space Grotesk' }}>{title}</h4>
        {subtitle && <p style={{ margin: 0, color: colors.textMuted, fontSize: '0.9rem', lineHeight:'1.5' }}>{subtitle}</p>}
        {badges && <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>{badges.map((b, i) => <span key={i} style={{ background: 'rgba(13, 148, 136, 0.1)', color: '#2dd4bf', padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight:'800' }}>{b}</span>)}</div>}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="button" onClick={() => handleEdit(item)} style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706', border: 'none', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', display:'flex', alignItems:'center', gap:'6px', fontWeight:'bold' }}><Edit3 size={18}/> Edit</button>
        <button type="button" onClick={() => handleDelete(endpoint, item._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', display:'flex', alignItems:'center', gap:'6px', fontWeight:'bold' }}><Trash2 size={18}/> Del</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: colors.bg, overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: isExpanded ? '280px' : '80px', backgroundColor: colors.sidebar, display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', borderRight: `1px solid ${colors.border}`, zIndex: 50 }}>
        <div style={{ padding: '30px 24px', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#2dd4bf', color: '#0f172a', padding: '8px', borderRadius: '8px', minWidth: '40px', display:'flex', alignItems:'center', justifyContent:'center' }}><LayoutDashboard size={24} /></div>
            {isExpanded && <h2 style={{ color: 'white', fontSize: '1.2rem', margin: 0, whiteSpace:'nowrap', fontFamily: '"Space Grotesk", sans-serif' }}>Admin Panel</h2>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          {renderNavBtn('builder', FileText, 'ATS Resume Builder')}
          <div style={{ height: '1px', background: isDark?'#1e293b':'#334155', margin: '15px 20px', opacity: 0.5 }}></div>
          {renderNavBtn('profile', User, 'Profile & Hero')}
          {renderNavBtn('projects', FolderGit2, 'Projects')}
          {renderNavBtn('experience', Briefcase, 'Experience')}
          {renderNavBtn('education', GraduationCap, 'Education')}
          {renderNavBtn('skills', Wrench, 'Technical Skills')}
          {renderNavBtn('achievements', Award, 'Achievements')}
          {renderNavBtn('courses', BookOpen, 'Courses')}
        </div>
        <div style={{ padding: '15px', borderTop: `1px solid ${isDark?'#1e293b':'#334155'}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', backgroundColor: colors.sidebarBtnBg, color: '#f8fafc', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>{isDark ? <Sun size={20} /> : <Moon size={20} />} {isExpanded && (isDark ? "Light Mode" : "Dark Mode")}</button>
          <div style={{display:'flex', gap:'10px'}}>
            <button onClick={() => setIsExpanded(!isExpanded)} style={{ padding: '12px', flex: isExpanded ? 0 : 1, backgroundColor: colors.sidebarBtnBg, color: '#f8fafc', border: 'none', borderRadius: '10px', cursor: 'pointer', display:'flex', justifyContent:'center' }}>{isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}</button>
            {isExpanded && <button onClick={handleLogout} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius:'10px', cursor: 'pointer', fontWeight: 'bold' }}><LogOut size={20}/> Logout</button>}
          </div>
        </div>
      </aside>

      <main className="main-area" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        
        {/* === ATS RESUME BUILDER (Unchanged structure) === */}
        {activeTab === 'builder' && (
          <div style={{ display: 'flex', height: '100%', flex: 1 }}>
            
            <div style={{ width: '380px', minWidth: '380px', backgroundColor: colors.builderLeft, borderRight: `1px solid ${colors.border}`, padding: '30px', overflowY: 'auto' }}>
              <h2 style={{ fontSize: '1.6rem', color: colors.textMain, marginBottom: '8px', fontFamily:'Space Grotesk' }}>Resume Engine</h2>
              <p style={{ color: colors.textMuted, fontSize: '0.85rem', marginBottom: '24px' }}>Perfect IIT Patna Format.</p>
              <button onClick={handleDownloadPdf} style={{ width: '100%', padding: '16px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize:'1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(249, 115, 22, 0.25)', marginBottom: '30px', transition: '0.3s' }}><FileText size={20} /> Download PDF</button>

              {['projects', 'experience', 'skills', 'education', 'achievements', 'courses'].map(cat => (
                <div key={cat} style={{ marginBottom: '30px' }}>
                  <h4 style={{ textTransform:'uppercase', color: '#2dd4bf', fontSize:'0.85rem', letterSpacing:'1px', borderBottom: `2px solid ${colors.border}`, paddingBottom: '10px', marginBottom: '12px', fontWeight:'800' }}>{cat}</h4>
                  {data[cat].map(item => (
                    <label key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', cursor: 'pointer', fontSize: '0.95rem', color: colors.textMain, fontWeight:'500' }}>
                      <input type="checkbox" checked={selected[cat].includes(item._id)} onChange={() => toggleSelection(cat, item._id)} style={{ width: '20px', height: '20px', accentColor:'#0d9488', cursor:'pointer' }}/>
                      {item.title || item.company || item.category || item.degree || item.name}
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {/* PREVIEW CONTAINER - COLLEGE LATEX EXACT CLONE */}
            <div style={{ flex: 1, padding: '40px', backgroundColor: colors.builderRight, display: 'flex', justifyContent: 'center', alignItems:'flex-start', overflowY: 'auto' }}>
              <div ref={resumeRef} style={{ width: '210mm', minHeight: '297mm', backgroundColor: 'white', padding: '12mm 15mm', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', color: '#000', fontFamily: "'Times New Roman', Times, serif", textAlign: 'left', lineHeight: '1.25', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <img src={COLLEGE_LOGO} alt="IITP Logo" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                    <div>
                      <h1 style={{ margin: '0 0 2px 0', fontSize: '18pt', fontWeight: 'bold' }}>{data.profile[0]?.name || 'Azim Khairdi'}</h1>
                      <div style={{ fontSize: '10.5pt' }}>Roll No.: 2611CS05</div>
                      <div style={{ fontSize: '10.5pt' }}>{data.profile[0]?.currentProgram || 'M.Tech (Computer Science and Engineering)'}</div>
                      <div style={{ fontSize: '10.5pt' }}>Indian Institute of Technology, Patna</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '10.5pt' }}>
                    <div>+91-{data.profile[0]?.phone?.replace('+91', '')?.trim() || '8600836379'}</div>
                    <div>{data.profile[0]?.emailPersonal}</div>
                    <div>{data.profile[0]?.emailAcademic}</div>
                    <div>Github | LinkedIn</div>
                  </div>
                </div>

                {selected.education.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ textTransform: 'uppercase', fontSize: '11.5pt', fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: '1px', marginBottom: '4px' }}>Education</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '10pt' }}>
                      <thead><tr><th style={{ border: '1px solid black', padding: '3px' }}>Degree/Certificate</th><th style={{ border: '1px solid black', padding: '3px' }}>Institute/Board</th><th style={{ border: '1px solid black', padding: '3px' }}>CGPA/Percentage</th><th style={{ border: '1px solid black', padding: '3px' }}>Year</th></tr></thead>
                      <tbody>
                        {data.education.filter(e => selected.education.includes(e._id))
                        .sort((a, b) => parseInt(b.duration.split('-')[0]) > parseInt(a.duration.split('-')[0]) ? 1 : -1)
                        .map(edu => (
                          <tr key={edu._id}><td style={{ border: '1px solid black', padding: '3px', fontWeight: edu.degree.includes('Tech') ? 'bold' : 'normal' }}>{edu.degree}</td><td style={{ border: '1px solid black', padding: '3px' }}>{edu.institute}</td><td style={{ border: '1px solid black', padding: '3px' }}>{edu.grade}</td><td style={{ border: '1px solid black', padding: '3px' }}>{edu.duration}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selected.experience.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ textTransform: 'uppercase', fontSize: '11.5pt', fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: '1px', marginBottom: '5px' }}>Experience</div>
                    {data.experience.filter(e => selected.experience.includes(e._id)).map(exp => {
                      const splitMeta = exp.durationMeta?.split('|') || [exp.durationMeta];
                      const dateText = splitMeta[1]?.trim() || exp.durationMeta;
                      const locText = splitMeta[0]?.trim() || '';
                      return (
                      <div key={exp._id} style={{ marginBottom: '8px', fontSize: '10.5pt' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold' }}>• {exp.company}</span><span style={{ fontStyle: 'italic', fontSize: '10pt' }}>{dateText}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', paddingLeft: '10px' }}><span style={{ fontStyle: 'italic' }}>{exp.role}</span><span style={{ fontStyle: 'italic', fontSize: '10pt' }}>{locText}</span></div>
                        <ul style={{ margin: 0, paddingLeft: '10px', fontSize: '10pt', listStyleType: 'none' }}>
                          {exp.bullets.map((b, i) => <li key={i} style={{ marginBottom: '2px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}><span style={{ fontWeight: 'normal' }}>–</span><span>{b}</span></li>)}
                        </ul>
                      </div>
                    )})}
                  </div>
                )}

                {selected.projects.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ textTransform: 'uppercase', fontSize: '11.5pt', fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: '1px', marginBottom: '5px' }}>Projects</div>
                    {data.projects.filter(p => selected.projects.includes(p._id)).sort((a, b) => parseInt(b.year) - parseInt(a.year)).map(proj => (
                      <div key={proj._id} style={{ marginBottom: '8px', fontSize: '10.5pt' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>• {proj.title}</span><span style={{ fontStyle: 'italic', fontSize: '10pt' }}>{proj.year}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', paddingLeft: '10px' }}><span style={{ fontStyle: 'italic' }}>{proj.technologies.join(', ')}</span><span style={{ fontStyle: 'italic', fontSize: '10pt' }}>Github</span></div>
                        <div style={{ fontSize: '10pt', paddingLeft: '10px' }}>– {proj.description}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PDF: TECHNICAL SKILLS */}
                {selected.skills.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ textTransform: 'uppercase', fontSize: '11.5pt', fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: '1px', marginBottom: '5px' }}>Technical Skills</div>
                    <div style={{ fontSize: '10pt', lineHeight: '1.5' }}>
                      {data.skills.filter(s => selected.skills.includes(s._id)).map(skill => (
                        
                        <span key={skill._id} style={{ display: 'inline-block', marginRight: '24px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold' }}>• {skill.category}:</span> {skill.items.join(', ')}
                        </span>

                      ))}
                    </div>
                  </div>
                )}

                {selected.achievements.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ textTransform: 'uppercase', fontSize: '11.5pt', fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: '1px', marginBottom: '5px' }}>Achievements</div>
                    <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '10.5pt' }}>
                      {data.achievements.filter(a => selected.achievements.includes(a._id)).map(ach => (
                        <li key={ach._id} style={{marginBottom: '2px', listStyleType: 'disc'}}><span style={{ fontWeight: 'bold' }}>{ach.title}</span> ({ach.year}) - {ach.description}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.courses.length > 0 && (
                  <div>
                    <div style={{ textTransform: 'uppercase', fontSize: '11.5pt', fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: '1px', marginBottom: '5px' }}>Key Courses Taken</div>
                    <div style={{ fontSize: '10pt' }}>{data.courses.filter(c => selected.courses.includes(c._id)).map(c=>c.name).join(', ')}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === CRUD FORMS === */}
        {activeTab !== 'builder' && (
          <div style={{ padding: '50px', width: '100%', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
            
            <div style={{ background: colors.cardBg, padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`, marginBottom: '50px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:`1px solid ${colors.border}`, paddingBottom:'20px', marginBottom:'30px' }}>
                <h2 style={{ display:'flex', alignItems:'center', gap:'12px', fontSize:'1.8rem', color:colors.textMain, fontFamily:'Space Grotesk' }}>
                  <div style={{ background: 'rgba(13, 148, 136, 0.1)', padding: '10px', borderRadius:'12px', display:'flex' }}><Edit3 color="#2dd4bf" size={24}/></div>
                  {form._id ? `Update ${activeTab} Record` : `Create New ${activeTab}`}
                </h2>
                {form._id && <button onClick={() => setForm({})} style={{ background: 'transparent', border:`1px solid ${colors.border}`, padding:'10px 16px', borderRadius:'12px', fontWeight:'bold', color:colors.textMain, cursor:'pointer' }}>+ Cancel & Add New</button>}
              </div>

              {/* Profiles */}
              {activeTab === 'profile' && (
                <form onSubmit={(e) => handleSubmit(e, 'profile')}>
                  <div style={{ display: 'flex', gap: '30px', alignItems:'center', marginBottom: '30px', padding: '30px', background:colors.inputBg, border: `1px dashed ${colors.border}`, borderRadius:'20px' }}>
                    <img src={form.imageUrl || "https://via.placeholder.com/100"} alt="Avatar" style={{ width:'120px', height:'120px', borderRadius:'30px', objectFit:'cover', boxShadow:'0 10px 25px rgba(0,0,0,0.2)' }} />
                    <div>
                      <p style={{ fontWeight:'bold', fontSize:'1rem', marginBottom:'12px', color:colors.textMain }}>Upload Hero Avatar</p>
                      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ padding:'10px', background:colors.cardBg, color:colors.textMain, borderRadius:'10px', border:`1px solid ${colors.border}`, width: '100%' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {renderInput("Name", "name", false, "e.g. Azim M. G. Khairdi")}
                    {renderInput("Eyebrow Tag", "eyebrow", false, "e.g. M.Tech CSE | IIT Patna")}
                  </div>
                  {renderInput("Hero Subtitle", "heroSubtitle", false, "e.g. Software Engineer building robust products.")}
                  {renderInput("Hero Lead Paragraph", "heroLead", true, "e.g. I work across backend systems and mobile...")}
                  {renderInput("About Me", "aboutText", true, "e.g. My software journey began with deep curiosity...")}
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {renderInput("Current Program", "currentProgram", false, "e.g. M.Tech in CSE, IIT Patna")}
                    {renderInput("Specialization", "specialization", false, "e.g. Backend, React Native")}
                  </div>
                  <h4 style={{ margin: '30px 0 20px', color:colors.textMain, borderBottom: `1px solid ${colors.border}`, paddingBottom:'10px', fontFamily:'Space Grotesk' }}>Contact Rounting</h4>
                  <div style={{ display: 'flex', gap: '20px', flexWrap:'wrap' }}>
                    <div style={{minWidth:'300px', flex:1}}>{renderInput("Academic Email", "emailAcademic", false, "e.g. azim@iitp.ac.in")}</div>
                    <div style={{minWidth:'300px', flex:1}}>{renderInput("Personal Email", "emailPersonal", false, "e.g. khairdi@gmail.com")}</div>
                    <div style={{minWidth:'300px', flex:1}}>{renderInput("Phone", "phone", false, "e.g. +91 8600836379")}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {renderInput("GitHub URL", "github", false, "e.g. https://github.com/mdazim764")}
                    {renderInput("LinkedIn URL", "linkedin", false, "e.g. https://linkedin.com/in/azim...")}
                  </div>
                  <button type="submit" style={{ width:'100%', background:'#2dd4bf', color:'#020617', padding:'18px', borderRadius:'14px', border:'none', fontSize:'1.1rem', fontWeight:'bold', cursor:'pointer', marginTop:'20px', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px' }}><Check size={20}/> Deploy Master Profile</button>
                </form>
              )}

              {/* Projects */}
              {activeTab === 'projects' && (
                <form onSubmit={(e) => handleSubmit(e, 'projects', f => ({...f, technologies: Array.isArray(f.technologies) ? f.technologies : f.technologies.split(',').map(x=>x.trim())}))}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{flex:3}}>{renderInput("Project Title", "title", false, "e.g. Kheti Sathi (Agri-Tech Mobile App)")}</div>
                    <div style={{flex:1}}>{renderInput("Year", "year", false, "e.g. 2025")}</div>
                  </div>
                  {renderInput("Technologies (comma separated)", "technologies", false, "e.g. React Native, Node.js, AI")}
                  {renderInput("Description", "description", true, "e.g. Built an AI-driven agricultural app...")}
                  <button type="submit" style={{ width:'100%', background:'#2dd4bf', color:'#020617', padding:'18px', borderRadius:'14px', border:'none', fontSize:'1.1rem', fontWeight:'bold', cursor:'pointer' }}>{form._id ? 'Update Project' : 'Publish Project'}</button>
                </form>
              )}

              {/* Experience */}
              {activeTab === 'experience' && (
                <form onSubmit={(e) => handleSubmit(e, 'experience', f => ({...f, bullets: Array.isArray(f.bullets) ? f.bullets : f.bullets.split('\n').filter(x=>x.trim())}))}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {renderInput("Company", "company", false, "e.g. Sciqus Infotech Pvt. Ltd.")}
                    {renderInput("Role", "role", false, "e.g. Trainee Software Engineer")}
                  </div>
                  {renderInput("Duration Meta (Location | Date)", "durationMeta", false, "e.g. Remote / India | Feb 2025 - Aug 2025")}
                  {renderInput("Bullet Points (Press Enter for new line)", "bullets", true, "Developed and deployed cross-platform apps...\nIntegrated REST APIs...")}
                  <button type="submit" style={{ width:'100%', background:'#2dd4bf', color:'#020617', padding:'18px', borderRadius:'14px', border:'none', fontSize:'1.1rem', fontWeight:'bold', cursor:'pointer' }}>Save Experience</button>
                </form>
              )}

              {/* Education */}
              {activeTab === 'education' && (
                <form onSubmit={(e) => handleSubmit(e, 'education')}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {renderInput("Degree", "degree", false, "e.g. B.Tech in CSE")}
                    <div style={{flex:2}}>{renderInput("Institute", "institute", false, "e.g. N.K. Orchid College")}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {renderInput("Duration", "duration", false, "e.g. 2022-2025")}
                    {renderInput("Grade / CGPA", "grade", false, "e.g. 7.35 CGPA")}
                  </div>
                  <button type="submit" style={{ width:'100%', background:'#2dd4bf', color:'#020617', padding:'18px', borderRadius:'14px', border:'none', fontSize:'1.1rem', fontWeight:'bold', cursor:'pointer' }}>Save Education</button>
                </form>
              )}

              {/* Skills */}
              {activeTab === 'skills' && (
                <form onSubmit={(e) => handleSubmit(e, 'skills', f => ({...f, items: Array.isArray(f.items) ? f.items : f.items.split(',').map(x=>x.trim())}))}>
                  {renderInput("Skill Category", "category", false, "e.g. Programming")}
                  {renderInput("Skills (comma separated)", "items", false, "e.g. C++, Java, Python, React")}
                  <button type="submit" style={{ width:'100%', background:'#2dd4bf', color:'#020617', padding:'18px', borderRadius:'14px', border:'none', fontSize:'1.1rem', fontWeight:'bold', cursor:'pointer' }}>Save Skill Set</button>
                </form>
              )}

              {/* Achievements */}
              {activeTab === 'achievements' && (
                <form onSubmit={(e) => handleSubmit(e, 'achievements')}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{flex:3}}>{renderInput("Title", "title", false, "e.g. 1st Position - Smart India Hackathon")}</div>
                    <div style={{flex:1}}>{renderInput("Year", "year", false, "e.g. 2019")}</div>
                  </div>
                  {renderInput("Short Description", "description", false, "e.g. Won INR 1 Lakh cash prize.")}
                  <button type="submit" style={{ width:'100%', background:'#2dd4bf', color:'#020617', padding:'18px', borderRadius:'14px', border:'none', fontSize:'1.1rem', fontWeight:'bold', cursor:'pointer' }}>Save Achievement</button>
                </form>
              )}

              {/* Courses */}
              {activeTab === 'courses' && (
                <form onSubmit={(e) => handleSubmit(e, 'courses')}>
                  {renderInput("Course Name", "name", false, "e.g. Data Structures and Algorithms")}
                  <button type="submit" style={{ width:'100%', background:'#2dd4bf', color:'#020617', padding:'18px', borderRadius:'14px', border:'none', fontSize:'1.1rem', fontWeight:'bold', cursor:'pointer' }}>Add Course</button>
                </form>
              )}
            </div>

            {/* List View Below the Form */}
            <h3 style={{ marginBottom: '24px', color:colors.textMain, fontFamily:'Space Grotesk', fontSize:'1.6rem' }}>Existing Database Records</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTab === 'projects' && data.projects.map(p => renderListItem(p, "projects", `${p.title} (${p.year})`, p.description, p.technologies))}
              {activeTab === 'experience' && data.experience.map(p => renderListItem(p, "experience", `${p.role} @ ${p.company}`, p.durationMeta))}
              {activeTab === 'education' && data.education.map(p => renderListItem(p, "education", p.degree, `${p.institute} | ${p.duration}`))}
              {activeTab === 'skills' && data.skills.map(p => renderListItem(p, "skills", p.category, null, p.items))}
              {activeTab === 'achievements' && data.achievements.map(p => renderListItem(p, "achievements", `${p.title} (${p.year})`, p.description))}
              {activeTab === 'courses' && <div style={{display:'flex', gap:'12px', flexWrap:'wrap'}}>{data.courses.map(p => renderListItem(p, "courses", p.name))}</div>}
            </div>
          </div>
        )}

        {/* IMAGE CROPPER MODAL */}
        {imageFile && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
            <div style={{ background: '#1e293b', padding: '30px', borderRadius: '24px', width: '500px', border: '1px solid #334155', boxShadow:'0 20px 50px rgba(0,0,0,0.5)' }}>
              <h3 style={{ color: 'white', marginBottom: '20px', fontFamily:'Space Grotesk', fontSize:'1.4rem' }}>Adjust Avatar Grid (1:1)</h3>
              <div style={{ height: '350px', background: '#000', borderRadius:'16px', overflow:'hidden', marginBottom:'20px' }}>
                <Cropper src={URL.createObjectURL(imageFile)} style={{ height: "100%", width: "100%" }} aspectRatio={1} guides={true} ref={cropperRef} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={onCrop} style={{ flex: 1, padding: '16px', background: '#2dd4bf', color: '#0f172a', fontWeight: 'bold', fontSize:'1.1rem', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Apply & Compress</button>
                <button onClick={() => setImageFile(null)} style={{ padding: '16px 30px', background: '#334155', color: 'white', border: 'none', borderRadius: '12px', fontWeight:'bold', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}