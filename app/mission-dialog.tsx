'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X, Map, FlaskConical } from 'lucide-react';
import { campaignStages } from '../lib/missions';
import { answerDigest } from '../lib/ciphers';
type Props={index:number;name:string;xp:number;completed:number;onAdvance:(stage:number)=>void;onClose:()=>void;onLab:()=>void;onMap:()=>void};
export default function MissionDialog({index,name,xp,completed,onAdvance,onClose,onLab,onMap}:Props) {
 const [stage,setStage]=useState(Math.min(completed,1));
 const [answer,setAnswer]=useState(''); const [feedback,setFeedback]=useState('');
 const [hints,setHints]=useState(0); const [busy,setBusy]=useState(false);
 const [notes,setNotes]=useState('');const alive=useRef(true);
 useEffect(()=>{alive.current=true;try{setNotes(localStorage.getItem(`crypterra-notes-v2-${index}`)||'');}catch{}return()=>{alive.current=false;};},[index]);
 const puzzle=campaignStages[index][stage];const verified=completed>stage;
 const selectStage=(next:number)=>{setStage(next);setAnswer('');setFeedback('');setHints(0);};
 const submit=async()=>{
  if(busy||verified)return;setBusy(true);
  try { const result=await answerDigest(answer);if(!alive.current)return;
   if(result===puzzle.digest){onAdvance(stage+1);setFeedback(stage===0?'LAYER VERIFIED. Keep the recovered key in your field notes.':'ACCESS GRANTED. Both layers verified. Treasure fragment recovered.');}
   else setFeedback('ACCESS DENIED. Submit the entire decoded message. Check the key, layer order, and padding.');
  }catch{if(alive.current)setFeedback('Verification unavailable. Use HTTPS and try again.');}
  finally{if(alive.current)setBusy(false);}
 };
 return <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.section role="dialog" aria-modal="true" aria-labelledby="mission-title" className="mission-modal challenge-modal" initial={{scale:.95,y:20}} animate={{scale:1,y:0}} onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const els=e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input,textarea');const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}}}><div className="modal-top"><span className="eyebrow">// EXPERT CAMPAIGN · MISSION 00{index+1}</span><button className="icon-button" aria-label="Close mission" onClick={onClose}><X/></button></div><h2 id="mission-title">{name}</h2><div className="stage-tabs">{campaignStages[index].map((s,i)=><button key={s.title} disabled={i>completed||busy} className={stage===i?'current':''} onClick={()=>selectStage(i)}>{completed>i?'✓':`0${i+1}`} / {s.title}</button>)}</div><div className="eyebrow">LAYER {stage+1} OF 2 · {puzzle.algorithm.toUpperCase()}</div><p>{puzzle.brief}</p><pre className="evidence">{puzzle.evidence}</pre><div className="transmission"><span>INTERCEPTED TRANSMISSION · {puzzle.code.replace(/\s/g,'').length} SYMBOLS</span><code>{puzzle.code}</code></div><p className="submission-prompt">{puzzle.prompt} Spaces and letter case do not affect verification.</p>{!verified&&<form onSubmit={e=>{e.preventDefault();void submit();}}><label htmlFor="answer">FULL DECODED TRANSMISSION</label><input autoFocus id="answer" value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Reconstruct the full message…" autoComplete="off" required disabled={busy}/><button className="primary" type="submit" disabled={busy}>{busy?'Verifying…':'Verify transmission'}<ArrowRight size={17}/></button></form>}<div className="modal-bottom"><button className="text-button" disabled={hints>=puzzle.hints.length} onClick={()=>setHints(n=>n+1)}>Reveal clue {Math.min(hints+1,2)} / 2</button><span>{xp} XP · BOTH LAYERS REQUIRED</span></div>{puzzle.hints.slice(0,hints).map((h,i)=><p className="hint" key={h}>CLUE {i+1} / {h}</p>)}<div aria-live="polite" className={verified?'feedback success':'feedback'}>{feedback||(verified?'LAYER ALREADY VERIFIED.':'')}</div>{verified&&stage===0&&<button className="primary" onClick={()=>selectStage(1)}>Continue to layer 2 <ArrowRight size={17}/></button>}{verified&&stage===1&&<button className="primary" onClick={onMap}>View recovered fragment <Map size={16}/></button>}<label htmlFor="field-notes">FIELD NOTES · SAVED ON THIS DEVICE</label><textarea id="field-notes" rows={3} value={notes} placeholder="Record keys and intermediate results before switching tools…" onChange={e=>{setNotes(e.target.value);try{localStorage.setItem(`crypterra-notes-v2-${index}`,e.target.value);}catch{}}}/><button className="secondary lab-link" onClick={onLab}><FlaskConical size={16}/> Open Cipher Lab · progress & notes saved</button></motion.section></motion.div>;
}
