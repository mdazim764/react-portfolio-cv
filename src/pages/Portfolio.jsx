import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Menu, X, ExternalLink, Send, Mail, Phone, GraduationCap } from 'lucide-react';

const API = 'https://azim-portfolio-backend.onrender.com/api';

// === CUSTOM BRAND ICONS (Since Lucide removed them!) ===
const GithubIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);


export default function Portfolio() {
  const [data, setData] = useState({ profile: [], experience: [], education: [], projects: [], skills: [], achievements: [], courses: [] });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/profile`).then(res => res.json()),
      fetch(`${API}/experience`).then(res => res.json()),
      fetch(`${API}/education`).then(res => res.json()),
      fetch(`${API}/projects`).then(res => res.json()),
      fetch(`${API}/skills`).then(res => res.json()),
      fetch(`${API}/achievements`).then(res => res.json()),
      fetch(`${API}/courses`).then(res => res.json())
    ]).then(([profile, experience, education, projects, skills, achievements, courses]) => {
      setData({ profile, experience, education, projects, skills, achievements, courses });
      setLoading(false);
    }).catch(err => { console.error(err); setLoading(false); });
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if(theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, [theme]);

  // SMTP Contact Form Handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        alert("✅ Message sent securely to Azim's inbox!");
        setContactForm({ email: '', message: '' }); 
      } else {
        alert("❌ Failed to send message. Is backend running?");
      }
    } catch (err) { alert("❌ Error connecting to server."); }
    setIsSending(false);
  };

  const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0d9488', flexDirection: 'column' }}>
        <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid rgba(13, 148, 136, 0.2)', borderTopColor: '#0d9488', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
        <h2 style={{ fontFamily: 'Space Grotesk' }}>Fetching Database...</h2>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const p = data.profile[0] || {}; 

  return (
    <>
      <style>{`
        :root {
          --bg: #f8fafc; --text-main: #0f172a; --text-muted: #64748b;
          --card-bg: rgba(255, 255, 255, 0.7); --card-border: rgba(255, 255, 255, 0.6);
          --brand: #0d9488; --brand-glow: rgba(13, 148, 136, 0.15); --accent: #f97316;
          --blob-1: rgba(13, 148, 136, 0.15); --blob-2: rgba(249, 115, 22, 0.12);
          --input-bg: rgba(0,0,0,0.03);
        }
        [data-theme="dark"] {
          --bg: #090e17; --text-main: #f1f5f9; --text-muted: #94a3b8;
          --card-bg: rgba(16, 23, 42, 0.6); --card-border: rgba(255, 255, 255, 0.05);
          --brand: #2dd4bf; --brand-glow: rgba(45, 212, 191, 0.2); --accent: #fb923c;
          --blob-1: rgba(45, 212, 191, 0.12); --blob-2: rgba(251, 146, 60, 0.1);
          --input-bg: rgba(255,255,255,0.05);
        }
        
        body { background: var(--bg); color: var(--text-main); transition: 0.3s; scroll-behavior: smooth; overflow-x: hidden; }
        .bg-blob { position: fixed; border-radius: 50%; filter: blur(100px); z-index: -1; animation: float 15s infinite ease-in-out alternate; }
        .b1 { width: 400px; height: 400px; background: var(--blob-1); top: -100px; left: -100px; }
        .b2 { width: 500px; height: 500px; background: var(--blob-2); bottom: -100px; right: -200px; }
        @keyframes float { 100% { transform: translateY(50px) translateX(50px) scale(1.1); } }
        
        .page { max-width: 1250px; margin: 0 auto; padding: 20px 24px 60px; position: relative; z-index: 1; }
        
        nav { position: sticky; top: 20px; z-index: 50; display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; border: 1px solid var(--card-border); background: var(--card-bg); backdrop-filter: blur(20px); border-radius: 99px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: 0.3s;}
        .nav-links { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .nav-links a { text-decoration: none; color: var(--text-muted); font-size: 0.95rem; font-weight: 600; padding: 8px 16px; border-radius: 99px; transition: 0.2s; }
        .nav-links a:hover { color: var(--brand); background: var(--brand-glow); }
        .menu-toggle { display: none; background: transparent; border: none; color: var(--text-main); cursor: pointer; }
        
        .glass-card { background: var(--card-bg); border: 1px solid var(--card-border); backdrop-filter: blur(16px); border-radius: 24px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); transition: 0.3s; }
        .interactive:hover { transform: translateY(-5px); border-color: var(--brand); box-shadow: 0 15px 35px var(--brand-glow); }
        
        .sec-title { font-family: "Space Grotesk", sans-serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 30px; display: inline-block; }
        .sec-title::after { content: '.'; color: var(--brand); }
        .h1-title { font-family: "Space Grotesk", sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; line-height: 1.1; margin-bottom: 12px; letter-spacing: -1px; }
        .eyebrow-tag { display: inline-block; background: var(--brand-glow); color: var(--brand); font-size: 0.8rem; font-weight: 800; padding: 6px 14px; border-radius: 99px; text-transform: uppercase; margin-bottom: 15px; border: 1px solid rgba(45, 212, 191, 0.2); }
        
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        
        .btn-main { background: var(--brand); color: #fff; padding: 14px 28px; border-radius: 12px; border: none; text-decoration: none; font-weight: 700; transition: 0.3s; display: inline-flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 5px 20px var(--brand-glow); cursor:pointer; font-size:1rem;}
        .btn-main:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .btn-outline { background: transparent; border: 2px solid var(--card-border); color: var(--text-main); padding: 12px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; transition: 0.3s; display: inline-flex; align-items:center; justify-content:center; }
        .btn-outline:hover { border-color: var(--brand); background: var(--brand-glow); color: var(--brand); }

        .contact-link { display: flex; align-items: center; gap: 15px; text-decoration: none; color: var(--text-main); font-weight: 600; padding: 16px; border: 1px solid var(--card-border); background: var(--card-bg); border-radius: 12px; transition: 0.3s; font-size: 0.95rem; }
        .contact-link:hover { background: var(--brand-glow); border-color: var(--brand); color: var(--brand); transform: translateX(5px); }

        .chip { padding: 6px 14px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; background: var(--brand-glow); color: var(--brand); border: 1px solid rgba(45, 212, 191, 0.2); display: inline-block; }
        
        .form-input { width: 100%; padding: 16px; background: var(--input-bg); border: 1px solid var(--card-border); color: var(--text-main); border-radius: 12px; font-family: inherit; font-size: 1rem; margin-bottom: 15px; outline: none; transition: 0.2s; }
        .form-input:focus { border-color: var(--brand); box-shadow: 0 0 0 4px var(--brand-glow); }

        .hero-header { display: flex; justify-content: space-between; align-items: center; gap: 40px; }
        
        @media (max-width: 980px) { .grid-3, .grid-2 { grid-template-columns: 1fr; } .hero-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 760px) {
          .nav-links { display: none; width: 100%; flex-direction: column; padding-top: 15px; margin-top: 15px; border-top: 1px solid var(--card-border); }
          .nav-links.open { display: flex; } .menu-toggle { display: block; } nav { flex-wrap: wrap; border-radius: 24px; top: 10px; }
          .hero-header { flex-direction: column-reverse; align-items: flex-start; gap: 20px;}
        }
      `}</style>

      <div className="bg-blob b1"></div>
      <div className="bg-blob b2"></div>

      <div className="page">
        {/* === NAVIGATION === */}
        <nav>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--brand)' }}>
            AK <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/</span> PORTFOLIO
          </div>
          
          <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
            {['About', 'Experience', 'Projects', 'Skills', 'Education'].map(link => (
              <a href={`#${link.toLowerCase()}`} key={link} onClick={() => setIsMobileMenuOpen(false)}>{link}</a>
            ))}
            <a href="/admin" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Workspace <ExternalLink size={14}/></a>
            
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px 10px', color: 'var(--text-main)' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {/* === HERO SECTION === */}
        <motion.section 
          className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px', marginTop: '40px' }}
          initial="hidden" animate="visible" variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="glass-card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--brand-glow) 0%, transparent 60%)', opacity: 0.5, zIndex: -1 }}></div>
            
            <div className="hero-header">
              <div style={{ flex: 1 }}>
                <span className="eyebrow-tag">{p.eyebrow}</span>
                <h1 className="h1-title">{p.name}</h1>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>{p.heroSubtitle}</h2>
              </div>
              
              {p.imageUrl && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div style={{ position: 'absolute', inset: -8, background: 'linear-gradient(135deg, var(--brand), var(--accent))', borderRadius: '40px', opacity: 0.4, filter: 'blur(12px)' }}></div>
                  <img src={p.imageUrl} alt="Profile" style={{ width: '160px', height: '160px', borderRadius: '35px', objectFit: 'cover', flexShrink: 0, border: '3px solid var(--card-bg)', position: 'relative', zIndex: 1, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                </div>
              )}
            </div>
            
            <p style={{ marginTop: '24px', fontSize: '1.1rem', lineHeight: '1.6' }}>{p.heroLead}</p>
            <div style={{ display: 'flex', flexWrap:'wrap', gap: '15px', marginTop: '30px' }}>
              <a href="#projects" className="btn-main">View Work</a>
              <a href="#contact" className="btn-outline">Let's Talk</a>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
            <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--brand)', textTransform: 'uppercase', fontWeight: 800 }}>Program</span>
              <p style={{ fontWeight: '600', marginTop: '4px' }}>{p.currentProgram}</p>
            </div>
            <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--brand)', textTransform: 'uppercase', fontWeight: 800 }}>Specialization</span>
              <p style={{ fontWeight: '600', marginTop: '4px' }}>{p.specialization}</p>
            </div>
            <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--brand)', textTransform: 'uppercase', fontWeight: 800 }}>Contact</span>
              <p style={{ fontWeight: '600', marginTop: '4px', fontSize: '0.9rem' }}>{p.phone} <br/> {p.emailPersonal}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={p.github} target="_blank" className="btn-outline" style={{ flex: 1, padding: '12px', gap: '8px', fontSize: '0.9rem' }}><GithubIcon size={18}/> GitHub</a>
              <a href={p.linkedin} target="_blank" className="btn-main" style={{ flex: 1, padding: '12px', background: '#0077b5', boxShadow: 'none', gap: '8px', fontSize: '0.9rem' }}><LinkedinIcon size={18}/> LinkedIn</a>
            </div>
          </motion.div>
        </motion.section>
        
        <motion.section id="about" style={{ marginTop: '80px' }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}>
          <h3 className="sec-title">About Me</h3>
          <div className="glass-card" style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem' }}>
            {p.aboutText && p.aboutText.split('\n').filter(t => t.trim() !== '').map((para, i) => <p key={i} style={{ marginBottom: '15px' }}>{para}</p>)}
          </div>
        </motion.section>

        <motion.section id="experience" style={{ marginTop: '80px' }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}>
          <h3 className="sec-title">Experience</h3>
          <div className="grid-2">
            {data.experience.map(exp => (
              <div key={exp._id} className="glass-card interactive">
                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '1.3rem', marginBottom: '5px' }}>{exp.role}</h4>
                <p style={{ color: 'var(--brand)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '15px' }}>{exp.company} &bull; {exp.durationMeta}</p>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {exp.bullets.map((b, i) => <li key={i} style={{ marginBottom: '6px' }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section id="projects" style={{ marginTop: '80px' }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
          <h3 className="sec-title">Featured Projects</h3>
          <div className="grid-3">
            {data.projects
            .sort((a, b) => parseInt(b.year) - parseInt(a.year)) // Sort by year
            .map(proj => (
              <motion.div variants={fadeInUp} key={proj._id} className="glass-card interactive">
                <span className="eyebrow-tag" style={{ padding: '4px 10px', fontSize: '0.75rem', marginBottom: '15px' }}>{proj.year}</span>
                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '1.3rem', marginBottom: '10px' }}>{proj.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>{proj.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {proj.technologies.map(t => <span key={t} className="chip">{t}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="skills" style={{ marginTop: '80px' }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}>
          <h3 className="sec-title">Technical Arsenal</h3>
          <div className="grid-2">
            {data.skills.map(skill => (
              <div key={skill._id} className="glass-card interactive" style={{ padding: '24px' }}>
                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', marginBottom: '15px' }}>{skill.category}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skill.items.map(t => <span key={t} className="chip" style={{ background: 'transparent' }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section id="education" style={{ marginTop: '80px' }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}>
          <div className="grid-2">
            <div>
              <h3 className="sec-title">Academic Background</h3>
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {data.education
                .sort((a, b) => parseInt(b.duration.split('-')[0]) > parseInt(a.duration.split('-')[0]) ? 1 : -1)
                .map(edu => (
                  <div key={edu._id} style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{edu.degree}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>{edu.duration}<br/>{edu.grade && <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>{edu.grade}</span>}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '5px' }}>{edu.institute}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="sec-title">Achievements</h3>
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                {data.achievements.map(ach => (
                  <div key={ach._id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }}></div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', fontSize: '1.05rem' }}>{ach.title}</strong>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{ach.description}</span>
                    </div>
                    <span style={{ color: 'var(--brand)', fontWeight: 800, fontSize: '0.9rem' }}>{ach.year}</span>
                  </div>
                ))}
              </div>
              <h3 className="sec-title" style={{ marginTop: '20px', fontSize: '1.4rem' }}>Coursework</h3>
              <div className="glass-card">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {data.courses.map(c => <span key={c._id} className="chip">{c.name}</span>)}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* === THE NEW CONTACT + ICONS === */}
        <motion.section id="contact" style={{ margin: '100px 0 80px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(13, 148, 136, 0.05) 100%)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px', padding: '50px' }}>
            
            {/* The Direct Messaging UI */}
            <div>
              <h3 className="sec-title">Start a Conversation.</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '25px' }}>{p.contactIntro}</p>
              
              <form onSubmit={handleContactSubmit} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '24px', borderRadius: '16px' }}>
                <input type="email" className="form-input" placeholder="Your Email Address" required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                <textarea className="form-input" rows="4" placeholder="What's on your mind?" required value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} />
                <button type="submit" disabled={isSending} className="btn-main" style={{ width: '100%', padding: '16px' }}>
                  {isSending ? 'Sending securely...' : <><Send size={18}/> Send Message Directly</>}
                </button>
              </form>
            </div>
            
            {/* Icon-Based Contact Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Direct Connect Links</h4>
              <a href={`mailto:${p.emailAcademic}`} className="contact-link"><GraduationCap size={20}/> Academic: {p.emailAcademic}</a>
              <a href={`mailto:${p.emailPersonal}`} className="contact-link"><Mail size={20}/> Personal: {p.emailPersonal}</a>
              <a href={`tel:${p.phone}`} className="contact-link"><Phone size={20}/> Phone: {p.phone}</a>
              <a href={p.github} target="_blank" className="contact-link"><GithubIcon size={20}/> GitHub Activity</a>
              <a href={p.linkedin} target="_blank" className="contact-link" style={{ color: '#0077b5', borderColor: 'rgba(0, 119, 181, 0.3)' }}><LinkedinIcon size={20}/> LinkedIn Network</a>
            </div>

          </div>
        </motion.section>

        <footer style={{ textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--card-border)', paddingTop: '30px' }}>
          <p style={{ fontWeight: 600 }}>Designed dynamically using the MERN Stack by Azim</p>
          <p style={{ fontSize: '0.85rem' }}>&copy; {new Date().getFullYear()} All rights reserved. <a href="/admin" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Workspace Access</a></p>
        </footer>

      </div>
    </>
  );
}