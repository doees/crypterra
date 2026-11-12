'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Hexagon, Crosshair, FlaskConical, Map, Mail, ChevronRight, LockKeyhole, Radio, X, Menu, Fingerprint, ShieldCheck, Zap, Check, Copy, Terminal } from 'lucide-react';

import CipherLab from './cipher-lab';
import MissionDialog from './mission-dialog';
import { readProgress } from '../lib/ciphers';

const missions = [
 { name: 'The Genesis Signal', type: 'VIGENÈRE + COLUMNAR', level: 'Challenging', xp: 450, icon: Radio, art: 'signal', story: 'Recover a hidden keyword from a relay log, then reconstruct a shuffled rendezvous. Two layers. One fragment.' },
 { name: 'Ghost in the Grid', type: 'XOR + VIGENÈRE', level: 'Advanced', xp: 750, icon: Fingerprint, art: 'ghost', story: 'Unmask a repeating-key packet. Carry its recovered route key into an encrypted blackout schedule.' },
 { name: 'The Obsidian Vault', type: 'RAIL FENCE + DOUBLE SEAL', level: 'Expert', xp: 1200, icon: LockKeyhole, art: 'vault', story: 'Reconstruct a zigzag transmission, then reverse two encryption layers in the correct order to breach the archive.' },
];
const navs = ['Overview', 'Missions', 'Cipher Lab', 'Treasure Map', 'Secret Messages'];
function Globe() {
 const dotsRef = useRef<SVGGElement>(null);
 const sceneRef = useRef<HTMLDivElement>(null);
 const dots = Array.from({length: 750}, (_, i) => {
   const y = 1 - (i / 749) * 2;
   const radius = Math.sqrt(1 - y*y);
   const angle = i * 2.39996;
   const x = Math.cos(angle)*radius;
   const z = Math.sin(angle)*radius;
   const land = Math.sin((250+x*190)*.026+Math.cos((250+y*190)*.021)*2)+Math.cos((250+y*190)*.032)+Math.sin((500+(x+y)*190)*.038)>.35;
   return { x, y, z, land, i };
 });
 // Keep animation off React's render path and stop work when the globe is hidden.
 useEffect(() => {
   const group = dotsRef.current;
   const scene = sceneRef.current;
   if (!group || !scene) return;
   const circles = Array.from(group.querySelectorAll('circle'));
   const points = circles.map(circle => ({
     x: Number(circle.dataset.x), y: Number(circle.dataset.y), z: Number(circle.dataset.z),
   }));
   const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
   let frame = 0, previous = 0, rotation = 0, visible = true;
   const paint = () => {
     const cos = Math.cos(rotation), sin = Math.sin(rotation);
     circles.forEach((circle, index) => {
       const point = points[index];
       const x = point.x*cos + point.z*sin;
       const z = point.z*cos - point.x*sin;
       circle.setAttribute('cx', String(250+x*190));
       circle.setAttribute('opacity', z > -.08 ? String(Math.max(0, .25+z*.65)) : '0');
     });
   };
   const tick = (time: number) => {
     if (!visible || document.hidden) previous = 0;
     else if (!previous || time-previous >= 1000/30) {
       // One revolution in 36 seconds; cap delta after a suspended tab.
       if (previous) rotation += Math.min(time-previous, 80) * Math.PI*2/36000;
       previous = time;
       paint();
     }
     frame = requestAnimationFrame(tick);
   };
   const restart = () => {
     cancelAnimationFrame(frame);
     previous = 0;
     if (preference.matches) { rotation = 0; paint(); }
     else frame = requestAnimationFrame(tick);
   };
   const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
   observer.observe(scene);
   preference.addEventListener('change', restart);
   restart();
   return () => { cancelAnimationFrame(frame); observer.disconnect(); preference.removeEventListener('change', restart); };
 }, []);

 return <div className="globe-scene" ref={sceneRef}><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="globe-label top-label"><span className="status-dot"/> ENCRYPTED WORLD NETWORK</div><svg viewBox="0 0 500 500" className="globe" role="img" aria-label="Holographic globe of the CRYPTERRA network"><defs><radialGradient id="sphere"><stop offset="0" stopColor="#0d392b" stopOpacity=".2"/><stop offset=".85" stopColor="#104b3c" stopOpacity=".15"/><stop offset="1" stopColor="#51ffbb" stopOpacity=".25"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="3"/></filter><clipPath id="clip"><circle cx="250" cy="250" r="190"/></clipPath></defs><circle cx="250" cy="250" r="190" fill="url(#sphere)" stroke="#5dedbd" strokeOpacity=".35"/><g clipPath="url(#clip)" fill="none" stroke="#47d6a5" strokeWidth=".6" opacity=".22">{[-150,-100,-50,0,50,100,150].map(n=><ellipse key={n} cx="250" cy={250+n} rx={Math.sqrt(190*190-n*n)} ry="22"/>)}{[35,80,130,175].map(n=><ellipse key={n} cx="250" cy="250" rx={n} ry="190"/>)}<path d="M60 250H440M250 60V440"/></g><g ref={dotsRef} className="globe-points">{dots.map(p=><circle key={p.i} data-x={p.x} data-y={p.y} data-z={p.z} cx={250+p.x*190} cy={250+p.y*190} r={p.land?1.7:.65} fill={p.land?'#67f5bc':'#207960'} opacity={p.z > -.08 ? Math.max(0,.25+p.z*.65) : 0}/>)}</g><path className="signal-flow" d="M140 200 Q220 65 339 178 Q385 270 286 332" fill="none" stroke="#9cff69" strokeWidth="1" strokeDasharray="4 5"/><path d="M140 200 Q230 290 286 332" fill="none" stroke="#58e5dd" strokeWidth=".7"/>{[[140,200],[339,178],[286,332]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="12" fill="#b4ff67" opacity=".2"/><circle cx={x} cy={y} r="4" fill="#bdff7a"/><circle className="signal-pulse" style={{animationDelay: `${i*.75}s`, transformOrigin: `${x}px ${y}px`}} cx={x} cy={y} r="19" fill="none" stroke="#b4ff67" strokeWidth=".5" opacity=".5"/></g>)}</svg><div className="coordinate">35° 40′ 22.8″ N<br/><span>139° 42′ 18.6″ E</span></div><div className="node-tag"><span className="status-dot"/> SIGNAL DETECTED <ArrowUpRight size={12}/></div><div className="globe-bottom">GLOBAL GRID <span>●</span> ONLINE <i/> 256-BIT ENCRYPTION</div></div>;
}
export default function Home() {
 const [page,setPage]=useState('Overview'); const [menu,setMenu]=useState(false); const [active,setActive]=useState<number|null>(null);
 const [progress,setProgress]=useState<number[]>([0,0,0]); const [filter,setFilter]=useState('All missions');
 useEffect(()=>{try{setProgress(readProgress(localStorage.getItem('crypterra-progress-v2')));}catch{}},[]);
 const solved=progress.flatMap((n,i)=>n===2?[i]:[]);
 const xp=solved.reduce((sum,i)=>sum+missions[i].xp,0);
 const go=(p:string)=>{setPage(p);setMenu(false);};
 const open=(i:number)=>setActive(i);
 const advance=(stage:number)=>{
  if(active===null)return;
  const next=progress.map((n,i)=>i===active?Math.max(n,stage):n);
  setProgress(next);try{localStorage.setItem('crypterra-progress-v2',JSON.stringify(next));}catch{}
 };
 return <div className="app-shell"><header><a href="#" className="brand" onClick={()=>go('Overview')}><div className="brand-icon"><Hexagon/><span/></div>CRYPTERRA<span className="brand-period">.</span></a><nav aria-label="Main navigation">{navs.map(n=><button key={n} onClick={()=>go(n)} className={page===n?'selected':''}>{n==='Overview'?'Home':n}{n==='Secret Messages'&&<span className="nav-count">03</span>}</button>)}</nav><button className="agent-chip" onClick={()=>go('Treasure Map')}><span className="status-dot"/> EXPLORER_001 <div className="avatar">E</div></button><button className="menu-button" aria-label="Toggle navigation" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>{menu&&<div className="mobile-nav">{navs.map(n=><button key={n} onClick={()=>go(n)}>{n}</button>)}</div>}
 <main><div className="system-strip"><span><span className="status-dot"/> SYSTEM ONLINE <i/> SECURE CONNECTION ESTABLISHED</span><span>THE WORLD IS A PUZZLE. <b>FIND YOUR KEY.</b></span></div>
 <AnimatePresence mode="wait"><motion.div key={page} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3}}>
 {page==='Overview'&&<><section className="hero"><div className="hero-copy"><div className="eyebrow"><span/> THE NEXT FRONTIER OF CRYPTOGRAPHY</div><h1>Every secret has<br/>a <em>way in.</em></h1><p>A world of encrypted mysteries. A trail of hidden clues.<br className="desktop-break"/> Decode the unknown. Claim what lies beyond.</p><div className="hero-actions"><button className="primary" onClick={()=>open(0)}>Begin your journey <ArrowUpRight size={19}/></button><button className="secondary" onClick={()=>go('Cipher Lab')}><Terminal size={17}/> Explore Cipher Lab <ArrowRight size={16}/></button></div><div className="hero-note"><ShieldCheck size={14}/> No wallet needed. Just a curious mind.</div></div><Globe/><div className="hero-index">01 <span>/ THE DISCOVERY</span></div></section><section className="stats-bar"><div><Crosshair/><p><strong>03</strong><span>MISSIONS TO DISCOVER</span></p></div><div><LockKeyhole/><p><strong>05</strong><span>ENCRYPTION SYSTEMS</span></p></div><div><Hexagon/><p><strong>{solved.length}<small> / 3</small></strong><span>TREASURES UNLOCKED</span></p></div><div className="network-stat"><span className="status-dot"/><p><strong>The grid is alive.</strong><span>YOUR ADVENTURE STARTS HERE</span></p><div className="wave">▂▅▃▇▅▂▆▃▅▇▃▁</div></div></section></>}
 {(page==='Overview'||page==='Missions')&&<section className="missions-section"><div className="section-heading"><div><div className="eyebrow muted">// YOUR NEXT CHALLENGE</div><h2>{page==='Overview'?'The unknown is calling.':'Mission control.'}</h2></div>{page==='Overview'?<button className="text-button" onClick={()=>go('Missions')}>View all missions <ArrowUpRight size={17}/></button>:<select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Filter missions"><option>All missions</option><option>Unsolved</option><option>Completed</option></select>}</div><p className="campaign-note"><span>CAMPAIGN 02 / SIX ENCRYPTED LAYERS</span> Multi-stage challenges. Recover keys, reverse cipher layers, and submit complete transmissions. Progress from the original training missions is kept separately.</p><div className="mission-grid">{missions.map((m,i)=>({m,i})).filter(({i})=>filter==='All missions'||(filter==='Completed'?solved.includes(i):!solved.includes(i))).map(({m,i})=><button className="mission-card" key={m.name} onClick={()=>open(i)}><div className={'mission-art '+m.art}><span className={'difficulty level-'+i}>{solved.includes(i)?'✓ COMPLETED':m.level.toUpperCase()}</span><span className="mission-number">M_00{i+1}</span><div className="art-grid"/><div className="art-symbol"><m.icon strokeWidth={.8}/></div>{i===0&&<div className="radio-rings"><i/><i/><i/></div>}{i===1&&<div className="binary">010010 101101 001101<br/>101101 010010 100101<br/>001011 101010 011010</div>}{i===2&&<div className="vault-diamond"/>}<span className="art-caption">{i===0?'INCOMING TRANSMISSION':i===1?'IDENTITY UNKNOWN':'RESTRICTED ACCESS'}</span></div><div className="mission-info"><div className="card-category">{m.type}<span><Zap size={12}/> {m.xp} XP</span></div><h3>{m.name}<ArrowUpRight size={20}/></h3><p>{m.story}</p><div className="card-footer"><span>{solved.includes(i)?'Revisit mission':`Decrypt mission · ${progress[i]}/2 layers`}</span><ArrowRight size={16}/></div></div></button>)}</div></section>}
 {page==='Cipher Lab'&&<CipherLab/>}
 {page==='Treasure Map'&&<section className="tool-section"><div className="eyebrow">// FOLLOW THE SIGNAL</div><h1 className="page-title">The treasure <em>grid.</em></h1><p className="subtext">Three fragments. One hidden world. Complete missions to illuminate the network.</p><div className="map-panel"><div className="map-lines"/><svg viewBox="0 0 1000 300" preserveAspectRatio="none"><path d="M170 170 Q350 20 500 160 T830 140" stroke="#8df7b2" strokeWidth="1" strokeDasharray="6 8" fill="none"/></svg>{missions.map((m,i)=><button className={'map-node node-'+i+(solved.includes(i)?' unlocked':'')} key={i} onClick={()=>open(i)}><span className="node-icon">{solved.includes(i)?<Check/>:<m.icon/>}</span><b>0{i+1} / {m.name}</b><small>{solved.includes(i)?'FRAGMENT RECOVERED':'SIGNAL AWAITING DECRYPTION'}</small></button>)}</div><div className="progress-panel"><div><Hexagon/><h3>{solved.length===3?'All treasures recovered.':'Your discovery progress'}</h3></div><span>{solved.length} / 3 FRAGMENTS · {xp} XP</span><div className="progress-track"><i style={{width:`${solved.length/3*100}%`}}/></div>{solved.length===3&&<p>The final coordinates are yours: 35.672999, 139.705167. Welcome to the inner circle, explorer.</p>}</div></section>}
 {page==='Secret Messages'&&<section className="tool-section"><div className="eyebrow">// INTERCEPTED TRANSMISSIONS</div><h1 className="page-title">Between the <em>lines.</em></h1><p className="subtext">The network has something to tell you. Recover each fragment to reveal its message.</p><div className="messages">{missions.map((m,i)=><div className="panel message" key={i}><div className="message-icon">{solved.includes(i)?<Mail/>:<LockKeyhole/>}</div><div><span className="card-category">TRANSMISSION 00{i+1} · {solved.includes(i)?'DECRYPTED':'ENCRYPTED'}</span><h3>{solved.includes(i)?['The beginning is a choice.','You were never alone in the grid.','The greatest treasure is the truth you uncover.'][i]:['RELAY // TWO LAYERS LOCKED','PACKET // TWO LAYERS LOCKED','ARCHIVE // TWO LAYERS LOCKED'][i]}</h3><p>{solved.includes(i)?'Fragment verified. Keep following the signal.':`Complete ${m.name} to reveal this transmission.`}</p></div><button className="icon-button" aria-label={'Open '+m.name} onClick={()=>open(i)}><ArrowUpRight/></button></div>)}</div></section>}
 </motion.div></AnimatePresence><section className="bottom-banner"><div><span className="status-dot"/> BUILT FOR THE CURIOUS.</div><p>Some see noise. <span>You see a possibility.</span></p><button onClick={()=>go('Cipher Lab')}>Enter the Cipher Lab <ArrowUpRight size={17}/></button></section></main><footer><a className="footer-brand" onClick={()=>go('Overview')}>CRYPTERRA.</a><span>© {new Date().getFullYear()} CRYPTERRA · DECODE YOUR REALITY</span><span className="footer-status"><span className="status-dot"/> ALL SYSTEMS OPERATIONAL</span></footer>
 <AnimatePresence>{active!==null&&<MissionDialog key={active} index={active} name={missions[active].name} xp={missions[active].xp} completed={progress[active]} onAdvance={advance} onClose={()=>setActive(null)} onLab={()=>{setActive(null);go('Cipher Lab');}} onMap={()=>{setActive(null);go('Treasure Map');}}/>}</AnimatePresence></div>;
}
