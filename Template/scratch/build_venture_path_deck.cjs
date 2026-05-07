const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve('presentation_output');
const PREV = path.resolve('scratch/previews');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREV, { recursive: true });

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Codex';
pptx.subject = 'Presentation technique Venture Path';
pptx.title = 'Venture Path - Presentation technique';
pptx.company = 'Venture Path';
pptx.lang = 'fr-FR';
pptx.theme = {
  headFontFace: 'Bahnschrift',
  bodyFontFace: 'Segoe UI',
  lang: 'fr-FR',
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.margin = 0;

const W = 13.333, H = 7.5;
const C = {
  ink: '0B1220',
  navy: '132238',
  deep: '0B1F26',
  teal: '13B8A6',
  mint: 'BFEFE8',
  sand: 'F5E9D0',
  amber: 'F2A541',
  coral: 'EB6A5B',
  cream: 'FBF7EE',
  slate: '617080',
  line: 'D6E0DD',
  white: 'FFFFFF',
};
const fontHead = 'Bahnschrift';
const fontBody = 'Segoe UI';

function addBg(slide, variant='light') {
  const bg = variant === 'dark' ? C.deep : C.cream;
  slide.background = { color: bg };
  slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:W, h:H, fill:{color:bg}, line:{color:bg, transparency:100} });
  if (variant === 'dark') {
    slide.addShape(pptx.ShapeType.arc, { x: -1.3, y: -1.1, w: 4.6, h: 4.6, adjustPoint: 0.35, line:{color:C.teal, transparency:70, width:2} });
    slide.addShape(pptx.ShapeType.rect, { x: 10.0, y: -0.3, w: 3.8, h: 8.1, rotate: 12, fill:{color:'18353C', transparency:20}, line:{color:'18353C', transparency:100} });
    slide.addShape(pptx.ShapeType.rect, { x: 10.55, y: -0.6, w: 0.18, h: 8.8, rotate: 12, fill:{color:C.teal, transparency:0}, line:{color:C.teal, transparency:100} });
  } else {
    slide.addShape(pptx.ShapeType.rect, { x: 9.7, y: -0.55, w: 4.2, h: 8.7, rotate: 13, fill:{color:'E7F4F0', transparency:0}, line:{color:'E7F4F0', transparency:100} });
    slide.addShape(pptx.ShapeType.arc, { x: -1.5, y: 4.9, w: 4.1, h: 4.1, line:{color:'D6EEE8', transparency:0, width:2} });
  }
}
function txt(slide, s, x,y,w,h, opt={}) {
  slide.addText(s, {
    x,y,w,h, margin: opt.margin ?? 0.04,
    fontFace: opt.fontFace || fontBody,
    fontSize: opt.size || 16,
    color: opt.color || C.ink,
    bold: !!opt.bold,
    italic: !!opt.italic,
    breakLine: false,
    fit: opt.fit || 'shrink',
    valign: opt.valign || 'top',
    align: opt.align || 'left',
    paraSpaceAfterPt: opt.after ?? 0,
    breakLine: false,
  });
}
function title(slide, eyebrow, heading, sub, variant='light') {
  const dark = variant === 'dark';
  txt(slide, eyebrow.toUpperCase(), 0.7, 0.46, 6.4, 0.25, { size: 8.5, color: dark ? C.mint : C.teal, bold:true, fontFace: fontHead });
  txt(slide, heading, 0.68, 0.78, 8.75, 0.72, { size: 25, color: dark ? C.white : C.ink, bold:true, fontFace: fontHead, fit:'shrink' });
  if (sub) txt(slide, sub, 0.72, 1.44, 8.3, 0.42, { size: 10.5, color: dark ? 'C8D8D5' : C.slate });
}
function footer(slide, i, variant='light') {
  const dark = variant === 'dark';
  txt(slide, `Venture Path | Présentation technique | ${String(i).padStart(2,'0')}`, 0.72, 7.12, 5.5, 0.2, { size: 7.5, color: dark ? '88A09B' : '7C8A88' });
}
function pill(slide, s, x,y,w,color=C.teal, fill='FFFFFF', textColor=C.ink) {
  slide.addShape(pptx.ShapeType.roundRect, { x,y,w,h:0.34, rectRadius:0.08, fill:{color:fill, transparency:0}, line:{color, width:1.1} });
  txt(slide, s, x+0.08, y+0.075, w-0.16, 0.14, { size: 7.8, color:textColor, bold:true, fontFace:fontHead, align:'center' });
}
function card(slide, x,y,w,h, opt={}) {
  slide.addShape(pptx.ShapeType.roundRect, { x,y,w,h, rectRadius:0.08, fill:{color:opt.fill || 'FFFFFF', transparency: opt.trans ?? 0}, line:{color: opt.line || C.line, width: opt.width ?? 1} });
}
function bulletList(slide, items, x,y,w,h,opt={}) {
  const runs = [];
  items.forEach((it, idx) => {
    runs.push({ text: `• ${it}${idx < items.length-1 ? '\n' : ''}`, options: { breakLine: false } });
  });
  slide.addText(runs, { x,y,w,h, fontFace:fontBody, fontSize: opt.size || 11, color: opt.color || C.ink, fit:'shrink', breakLine:false, margin:0.04, breakLine:false, paraSpaceAfterPt: opt.after ?? 4 });
}
function metric(slide, big, label, x,y,w,color=C.teal) {
  txt(slide, big, x, y, w, 0.44, { size: 24, bold:true, color, fontFace:fontHead, align:'center' });
  txt(slide, label, x, y+0.47, w, 0.28, { size: 8.5, color:C.slate, align:'center' });
}
function node(slide, label, x,y,w,h, opt={}) {
  card(slide,x,y,w,h,{fill:opt.fill||'FFFFFF',line:opt.line||C.teal,width:1.2,trans:opt.trans||0});
  txt(slide,label,x+0.1,y+0.11,w-0.2,h-0.18,{size:opt.size||9.5,bold:opt.bold??true,color:opt.color||C.ink,align:'center',valign:'mid',fontFace:fontHead});
}
function arrow(slide, x1,y1,x2,y2,color=C.teal) {
  slide.addShape(pptx.ShapeType.line, { x:x1, y:y1, w:x2-x1, h:y2-y1, line:{color, width:1.4, beginArrowType:'none', endArrowType:'triangle'} });
}

const slides = [];
function addSlide(build) { const s = pptx.addSlide(); slides.push(s); build(s, slides.length); }

addSlide((s,i)=>{
  addBg(s,'dark');
  txt(s,'VENTURE PATH',0.75,0.55,3.2,0.28,{size:10,color:C.mint,bold:true,fontFace:fontHead});
  txt(s,'Plateforme multi-agents pour transformer une idée startup en plan exécutable',0.72,1.35,8.2,1.55,{size:33,color:C.white,bold:true,fontFace:fontHead,fit:'shrink'});
  txt(s,'Présentation technique complète : produit, architecture, tracks A/B/C, APIs, données, sécurité, limites et roadmap.',0.78,3.25,6.55,0.55,{size:13,color:'C8D8D5'});
  pill(s,'React + Vite',0.78,4.35,1.35,C.teal,'0F3036',C.mint);
  pill(s,'Python APIs',2.27,4.35,1.35,C.amber,'362B18','FFE9B6');
  pill(s,'LLM / Agents',3.77,4.35,1.35,C.coral,'3B1D1A','FFD2CB');
  pill(s,'Supabase-ready',5.26,4.35,1.65,C.teal,'0F3036',C.mint);
  txt(s,'Track A',9.95,1.28,1.1,0.25,{size:11,color:C.mint,bold:true,fontFace:fontHead});
  txt(s,'Validate',10.88,1.28,1.2,0.25,{size:11,color:C.white,bold:true,fontFace:fontHead});
  txt(s,'Track B',9.95,2.26,1.1,0.25,{size:11,color:'FFE9B6',bold:true,fontFace:fontHead});
  txt(s,'Legal',10.88,2.26,1.2,0.25,{size:11,color:C.white,bold:true,fontFace:fontHead});
  txt(s,'Track C',9.95,3.24,1.1,0.25,{size:11,color:'FFD2CB',bold:true,fontFace:fontHead});
  txt(s,'Execute',10.88,3.24,1.2,0.25,{size:11,color:C.white,bold:true,fontFace:fontHead});
  slideFooter=''; footer(s,i,'dark');
});

addSlide((s,i)=>{
  addBg(s,'light'); title(s,'01 | Problème','Pourquoi cette plateforme existe','Un fondateur early-stage n’a pas seulement besoin d’une page web : il a besoin d’une chaîne de décision complète.', 'light');
  txt(s,'Le vrai besoin',0.78,2.17,4.0,0.55,{size:24,bold:true,fontFace:fontHead,color:C.ink});
  bulletList(s,[
    'Clarifier une idée encore floue',
    'Comprendre les risques marché, MVP, finance et légal',
    'Transformer des décisions en tâches concrètes',
    'Améliorer le pitch avec un feedback exploitable'
  ],0.82,2.92,4.9,2.0,{size:14});
  card(s,6.25,2.02,5.85,3.75,{fill:'FFFFFF'});
  txt(s,'Hypothèse produit',6.64,2.35,4.9,0.38,{size:21,bold:true,fontFace:fontHead,color:C.teal});
  txt(s,'Une plateforme multi-track réduit la friction entre réflexion, conformité et exécution. Chaque track devient une étape du parcours fondateur, pas un outil isolé.',6.66,2.98,4.75,1.0,{size:16,color:C.ink});
  metric(s,'3','tracks métier',6.65,4.45,1.2,C.teal); metric(s,'4','APIs locales',8.25,4.45,1.2,C.amber); metric(s,'5+','rapports générés',9.85,4.45,1.4,C.coral);
  footer(s,i);
});

addSlide((s,i)=>{
  addBg(s,'dark'); title(s,'02 | Vision produit','Un parcours fondateur en trois mouvements','Chaque track répond à une question différente du cycle startup.', 'dark');
  const xs=[0.78,4.55,8.32]; const heads=['Track A','Track B','Track C']; const names=['Validate Your Idea','Start the Right Way','Launch & Grow']; const colors=[C.teal,C.amber,C.coral];
  xs.forEach((x,idx)=>{ card(s,x,2.18,3.08,3.65,{fill: idx===0?'0F3036':idx===1?'362B18':'3B1D1A',line:colors[idx],width:1.3}); txt(s,heads[idx],x+0.22,2.48,1.4,0.28,{size:11,color:colors[idx],bold:true,fontFace:fontHead}); txt(s,names[idx],x+0.22,2.92,2.42,0.55,{size:19,color:C.white,bold:true,fontFace:fontHead}); bulletList(s,idx===0?['Analyse idée et marché','MVP, opérations, finance','Verdict et incertitudes']:idx===1?['Dossier légal Tunisie','Upload documents','Recherche publique et chatbot']:['Execution Agent','Pitch Coach vidéo','Roadmap actions + Jira'],x+0.26,3.72,2.4,1.4,{size:11.5,color:'D8E4E0'}); });
  footer(s,i,'dark');
});

addSlide((s,i)=>{
  addBg(s,'light'); title(s,'03 | Parcours utilisateur','Du formulaire au livrable actionnable','Le front guide l’utilisateur, les bridges Python orchestrent les agents, puis les résultats reviennent en rapports lisibles.', 'light');
  const y=3.18; node(s,'Founder input\nformulaire / upload',0.75,y,1.65,0.82,{fill:'FFFFFF'}); node(s,'React UI\nroute par hash',3.0,y,1.65,0.82,{fill:'FFFFFF'}); node(s,'API locale\nTrack service',5.25,y,1.65,0.82,{fill:'FFFFFF'}); node(s,'Agent / LLM\ntraitement',7.5,y,1.65,0.82,{fill:'FFFFFF'}); node(s,'Rapport\nJSON / PDF / UI',9.75,y,1.65,0.82,{fill:'FFFFFF'});
  [2.45,4.7,6.95,9.2].forEach(x=>arrow(s,x,y+0.41,x+0.52,y+0.41,C.teal));
  txt(s,'Pattern commun',0.82,5.05,2.2,0.3,{size:16,bold:true,fontFace:fontHead,color:C.ink});
  bulletList(s,['collecte structurée', 'appel HTTP local', 'normalisation du payload', 'orchestration spécialisée', 'rendu UI + export'],3.0,5.05,7.8,0.75,{size:12});
  footer(s,i);
});

addSlide((s,i)=>{
  addBg(s,'dark'); title(s,'04 | Architecture globale','Une SPA React branchée sur des services agents spécialisés','L’architecture reste simple côté navigateur et délègue les traitements lourds à des bridges Python isolés.', 'dark');
  node(s,'React + Vite SPA\nApp.jsx + pages tracks',0.75,2.05,2.45,0.95,{fill:'102B31',line:C.teal,color:C.white});
  node(s,'Supabase-ready\nAuth + tables RLS',0.75,4.2,2.45,0.85,{fill:'102B31',line:C.teal,color:C.white});
  node(s,'Track A API\n:5055 analyze/report',4.2,1.5,2.2,0.75,{fill:'292A22',line:C.amber,color:C.white});
  node(s,'Track B FastAPI\n:5057 legal bridge',4.2,2.75,2.2,0.75,{fill:'292A22',line:C.amber,color:C.white});
  node(s,'Track C Execution\n:5056 runner bridge',4.2,4.0,2.2,0.75,{fill:'292A22',line:C.amber,color:C.white});
  node(s,'Pitch Coach API\n:5057 video bridge',4.2,5.25,2.2,0.75,{fill:'292A22',line:C.amber,color:C.white});
  node(s,'External Track2\nOrchestrator + KB',8.0,2.1,2.1,0.75,{fill:'351F22',line:C.coral,color:C.white});
  node(s,'ExecutionAgent\nLLM + MCP + Jira',8.0,3.5,2.1,0.75,{fill:'351F22',line:C.coral,color:C.white});
  node(s,'Pitch pipeline\nWhisper + LLM + reports',8.0,4.9,2.1,0.75,{fill:'351F22',line:C.coral,color:C.white});
  arrow(s,3.25,2.52,4.05,1.88,C.teal); arrow(s,3.25,2.72,4.05,3.13,C.teal); arrow(s,3.25,2.92,4.05,4.37,C.teal); arrow(s,3.25,3.12,4.05,5.62,C.teal);
  arrow(s,6.48,3.12,7.85,2.47,C.amber); arrow(s,6.48,4.37,7.85,3.87,C.amber); arrow(s,6.48,5.62,7.85,5.27,C.amber);
  txt(s,'Note technique : Track B et Pitch Coach déclarent tous deux le port 5057. À corriger avant démo simultanée.',0.78,6.42,9.5,0.25,{size:9.5,color:'FFE9B6'});
  footer(s,i,'dark');
});

addSlide((s,i)=>{
  addBg(s,'light'); title(s,'05 | Frontend','Une SPA modulaire orientée tracks','Le front privilégie des pages dédiées par track et des composants marketing réutilisables.', 'light');
  card(s,0.78,2.02,3.35,3.9,{fill:'FFFFFF'}); txt(s,'Structure UI',1.05,2.32,1.8,0.3,{size:18,bold:true,fontFace:fontHead,color:C.teal}); bulletList(s,['App.jsx route par hash', 'TopBar, Footer, Hero, Services', 'Track1Analyzer / Track2LegalAssistant / Track3Hub', 'Dark mode et micro-interactions'],1.05,2.9,2.65,1.72,{size:12.3});
  card(s,4.78,2.02,3.35,3.9,{fill:'FFFFFF'}); txt(s,'State & UX',5.05,2.32,1.8,0.3,{size:18,bold:true,fontFace:fontHead,color:C.amber}); bulletList(s,['useState pour formulaires', 'fetch vers APIs locales', 'rendu conditionnel des rapports', 'fallback local si Supabase absent'],5.05,2.9,2.65,1.72,{size:12.3});
  card(s,8.78,2.02,3.35,3.9,{fill:'FFFFFF'}); txt(s,'Data layer',9.05,2.32,1.8,0.3,{size:18,bold:true,fontFace:fontHead,color:C.coral}); bulletList(s,['@supabase/supabase-js', 'tables contact/newsletter/pricing/testimonials', 'RLS activée', 'localStorage demo DB'],9.05,2.9,2.65,1.72,{size:12.3});
  footer(s,i);
});

addSlide((s,i)=>{
  addBg(s,'light'); title(s,'06 | Track A','Analyse startup : idée, marché, MVP, opérations, finance, légal','La page Track1 collecte un profil startup puis affiche un rapport multi-onglets sans relancer la pipeline.', 'light');
  node(s,'Input startup\nidea + team + finance',0.82,2.55,1.85,0.82); node(s,'POST /track1/analyze\nport 5055',3.25,2.55,1.85,0.82); node(s,'AI pipeline\nmarket + MVP + risks',5.68,2.55,1.85,0.82); node(s,'Report tabs\nOverview → Legal',8.11,2.55,1.85,0.82); node(s,'Saved report\n/track1/report',10.54,2.55,1.85,0.82);
  [2.75,5.18,7.61,10.04].forEach(x=>arrow(s,x,2.96,x+0.42,2.96,C.teal));
  card(s,1.15,4.55,10.5,1.05,{fill:'F7FBF8',line:'CBE9E2'}); txt(s,'Ce que le jury doit retenir',1.45,4.78,2.4,0.28,{size:16,bold:true,fontFace:fontHead,color:C.teal}); txt(s,'Track A n’est pas un simple formulaire : il convertit des hypothèses fondateur en diagnostic structuré avec verdict, signaux d’incertitude et recommandations opérationnelles.',3.65,4.79,7.4,0.42,{size:13.5,color:C.ink});
  footer(s,i);
});

addSlide((s,i)=>{
  addBg(s,'dark'); title(s,'07 | Track B','Assistant légal : dossier, documents, conformité et recherche externe','Track B sert de bridge FastAPI vers un orchestrateur légal externe, avec upload documentaire et chatbot contextuel.', 'dark');
  const items=[['/track2/sample','charge un cas de démonstration'],['/track2/upload','stocke les documents uploadés'],['/track2/run','valide TrackBRequest et lance orchestrator.run'],['/track2/chat','répond avec KB + dernier résultat'],['/track2/research','exécute recherche publique structurée']];
  items.forEach((it,idx)=>{ const y=2.02+idx*0.68; txt(s,it[0],0.92,y,2.0,0.24,{size:12,bold:true,fontFace:fontHead,color:C.amber}); txt(s,it[1],3.0,y,5.6,0.24,{size:11.5,color:'D8E4E0'}); });
  card(s,8.75,1.95,3.45,3.45,{fill:'102B31',line:C.teal}); txt(s,'Moteurs internes',9.05,2.22,1.8,0.25,{size:16,bold:true,fontFace:fontHead,color:C.mint}); bulletList(s,['TrackBOrchestrator', 'TrackBChatbot', 'load_knowledge_base()', 'get_local_llm_client()', 'DuckDuckGo/Bing public HTML fallback'],9.05,2.78,2.75,1.65,{size:10.8,color:'D8E4E0'});
  txt(s,'Sorties : décision finale, score, blockers strict mode, roadmap juridique, recherche Google/LinkedIn/Facebook/events, recommandations.',0.92,6.02,10.5,0.35,{size:12.5,color:'FFE9B6'});
  footer(s,i,'dark');
});

addSlide((s,i)=>{
  addBg(s,'light'); title(s,'08 | Track C Execution','Agent d’exécution : de la roadmap à la file de tâches','Le bridge HTTP écrit l’input JSON, lance le runner Python, fusionne l’état startup et renvoie un plan exécutable.', 'light');
  node(s,'React Track3Execution\nformulaire MVP/team',0.75,2.22,2.05,0.78); node(s,'track3_api.py\nPOST /track3/execution/run',3.55,2.22,2.25,0.78); node(s,'track3_run_agent.py\nmerge_state()',6.35,2.22,2.05,0.78); node(s,'ExecutionOrchestrator\nLLM + KB + MCP',9.05,2.22,2.25,0.78);
  [2.88,5.9,8.5].forEach(x=>arrow(s,x,2.61,x+0.52,2.61,C.teal));
  card(s,0.8,4.13,3.1,1.38,{fill:'FFFFFF'}); txt(s,'Entrées',1.05,4.37,1.0,0.24,{size:14,bold:true,fontFace:fontHead,color:C.teal}); bulletList(s,['startup_profile', 'mvp_plan', 'team + availability', 'live_status'],1.05,4.72,2.2,0.58,{size:10});
  card(s,5.0,4.13,3.1,1.38,{fill:'FFFFFF'}); txt(s,'Traitements',5.25,4.37,1.25,0.24,{size:14,bold:true,fontFace:fontHead,color:C.amber}); bulletList(s,['normalisation skills/priorités', 'base state + constraints', 'LocalKnowledgeBase', 'MCPProjectOpsClient'],5.25,4.72,2.35,0.58,{size:10});
  card(s,9.2,4.13,3.1,1.38,{fill:'FFFFFF'}); txt(s,'Sorties',9.45,4.37,1.0,0.24,{size:14,bold:true,fontFace:fontHead,color:C.coral}); bulletList(s,['executive_summary', 'priority_queue', 'ready_queue', 'critic_report', 'jira summary'],9.45,4.72,2.35,0.58,{size:10});
  footer(s,i);
});

addSlide((s,i)=>{
  addBg(s,'dark'); title(s,'09 | Pitch Coach','Analyse vidéo agentique : delivery, contenu, narration, visuel','Le Pitch Coach transforme un pitch MP4/MOV/MKV en scorecard, rapport Markdown et PDF téléchargeable.', 'dark');
  const stages=['Upload vidéo','Audio + transcription','Analyse delivery','LLM contenu + narration','Visual/emotion optionnels','Reports JSON/MD/PDF'];
  stages.forEach((st,idx)=>{ const x=0.78+idx*1.95; node(s,st,x,2.55,1.42,0.78,{fill:idx%2?'292A22':'102B31',line:idx%2?C.amber:C.teal,color:C.white,size:8.2}); if(idx<stages.length-1) arrow(s,x+1.45,2.94,x+1.88,2.94,idx%2?C.amber:C.teal); });
  card(s,1.08,4.55,5.15,1.35,{fill:'102B31',line:C.teal}); txt(s,'Qualité de sortie',1.37,4.82,1.8,0.28,{size:16,bold:true,fontFace:fontHead,color:C.mint}); bulletList(s,['execution_id unique', 'hash fichier', 'scorecard visible', 'rapport complet collapsible', 'PDF via /pitch/download/{id}'],1.37,5.2,4.25,0.45,{size:9.8,color:'D8E4E0'});
  card(s,7.0,4.55,4.55,1.35,{fill:'351F22',line:C.coral}); txt(s,'Hygiène API',7.29,4.82,1.6,0.28,{size:16,bold:true,fontFace:fontHead,color:'FFD2CB'}); txt(s,'sanitize_response retire chemins internes, états agentiques et traces sensibles avant retour au navigateur.',7.29,5.22,3.8,0.42,{size:11,color:'D8E4E0'});
  footer(s,i,'dark');
});

addSlide((s,i)=>{
  addBg(s,'light'); title(s,'10 | Données & sécurité','Supabase-ready, fallback local et points de vigilance','Le projet a une bonne base de persistance front, mais les secrets et les ports doivent être durcis avant production.', 'light');
  card(s,0.85,2.0,3.4,3.55,{fill:'FFFFFF'}); txt(s,'Supabase schema',1.13,2.3,2.0,0.3,{size:17,bold:true,fontFace:fontHead,color:C.teal}); bulletList(s,['contact_submissions', 'newsletter_subscribers', 'pricing_selections', 'testimonials approved only', 'RLS activée + policies insert/select'],1.13,2.86,2.65,1.44,{size:11.2});
  card(s,4.95,2.0,3.4,3.55,{fill:'FFFFFF'}); txt(s,'Fallback démo',5.23,2.3,2.0,0.3,{size:17,bold:true,fontFace:fontHead,color:C.amber}); bulletList(s,['localStorage demo DB', 'pas de blocage sans .env', 'uploads locaux track2/pitch', 'rapports stockés par session'],5.23,2.86,2.65,1.44,{size:11.2});
  card(s,9.05,2.0,3.4,3.55,{fill:'FFFFFF'}); txt(s,'Vigilance',9.33,2.3,2.0,0.3,{size:17,bold:true,fontFace:fontHead,color:C.coral}); bulletList(s,['ne jamais versionner clés API', 'résoudre conflit de port 5057', 'valider taille/type uploads', 'isoler dossiers outputs', 'timeouts et logs structurés'],9.33,2.86,2.65,1.44,{size:11.2});
  footer(s,i);
});

addSlide((s,i)=>{
  addBg(s,'light'); title(s,'11 | Matrice API','Les services locaux qui alimentent la démo','Cette slide sert de pense-bête technique pendant la soutenance.', 'light');
  const rows=[['Frontend','5173','npm run dev','React + Vite SPA'],['Track A','5055','API externe attendue','/track1/analyze, /track1/report'],['Track B','5057','uvicorn track2_api:app','/track2/sample, upload, run, chat, research'],['Track C Execution','5056','python track3_api.py','/track3/execution/run'],['Pitch Coach','5057','python pitch_coach_api.py','/pitch/health, analyze, download']];
  const x=0.86,y=2.0,col=[2.1,1.05,3.4,5.0]; const heads=['Service','Port','Commande','Rôle']; let cx=x;
  heads.forEach((h,idx)=>{ txt(s,h,cx,y,col[idx],0.25,{size:10.5,bold:true,fontFace:fontHead,color:C.teal}); cx+=col[idx]; });
  rows.forEach((r,ri)=>{ const yy=y+0.5+ri*0.62; s.addShape(pptx.ShapeType.line,{x, y:yy-0.12, w:11.6, h:0, line:{color:'D8E1DE',width:0.8}}); cx=x; r.forEach((v,ci)=>{ txt(s,v,cx,yy,col[ci]-0.08,0.32,{size:ci===0?10.5:9.2,bold:ci===0,fontFace:ci===0?fontHead:fontBody,color:(ri>=2&&r[1]==='5057')?C.coral:C.ink}); cx+=col[ci]; }); });
  txt(s,'Action recommandée : déplacer Pitch Coach sur 5058 ou Track B sur 5057/5059 de manière explicite dans code + documentation.',0.9,6.18,10.8,0.28,{size:11,color:C.coral,bold:true});
  footer(s,i);
});

addSlide((s,i)=>{
  addBg(s,'dark'); title(s,'12 | Démo technique','Scénario de présentation recommandé','Une bonne démo montre le fil produit complet sans lancer tous les traitements longs en direct.', 'dark');
  const steps=[['1','Home','montrer proposition de valeur et tracks'],['2','Track A','remplir une idée puis montrer rapport onglets'],['3','Track B','charger sample, expliquer dossier + recherche'],['4','Track C','exécuter sample HealthFlow ou afficher résultat'],['5','Pitch Coach','montrer upload + rapport déjà généré']];
  steps.forEach((st,idx)=>{ const y=1.95+idx*0.8; txt(s,st[0],0.98,y,0.32,0.3,{size:16,bold:true,fontFace:fontHead,color:C.teal,align:'center'}); txt(s,st[1],1.55,y,1.25,0.28,{size:14,bold:true,fontFace:fontHead,color:C.white}); txt(s,st[2],3.0,y,6.1,0.28,{size:12,color:'D8E4E0'}); });
  card(s,9.25,2.05,2.75,2.7,{fill:'292A22',line:C.amber}); txt(s,'Astuce soutenance',9.55,2.35,1.8,0.28,{size:16,bold:true,fontFace:fontHead,color:'FFE9B6'}); txt(s,'Ne pas attendre Whisper/LLM en live si le temps est court : utiliser les rapports déjà présents dans pitch_coach_outputs.',9.55,2.9,2.12,0.85,{size:12,color:'D8E4E0'});
  footer(s,i,'dark');
});

addSlide((s,i)=>{
  addBg(s,'light'); title(s,'13 | Limites & roadmap','Ce qui est déjà solide, ce qui doit passer au niveau production','La présentation gagne en crédibilité quand les améliorations sont assumées et priorisées.', 'light');
  const lanes=[['Court terme',C.teal,['Résoudre conflit port 5057','Retirer secrets des fichiers locaux','Scripts start unifiés','Health checks visibles UI']],['Moyen terme',C.amber,['Queue jobs pour analyses longues','Auth obligatoire sur APIs','Stockage objet pour uploads','Observabilité logs + erreurs']],['Long terme',C.coral,['Déploiement cloud multi-services','RAG versionné par track','Workflow Jira bidirectionnel','Tests E2E et charges vidéo']]];
  lanes.forEach((ln,idx)=>{ const x=0.85+idx*4.05; card(s,x,2.05,3.3,3.75,{fill:'FFFFFF',line:ln[1]}); txt(s,ln[0],x+0.25,2.38,1.8,0.3,{size:18,bold:true,fontFace:fontHead,color:ln[1]}); bulletList(s,ln[2],x+0.28,3.05,2.55,1.65,{size:11.5}); });
  footer(s,i);
});

addSlide((s,i)=>{
  addBg(s,'dark'); title(s,'14 | Conclusion','Le travail livré est une plateforme, pas une collection de pages','La valeur technique vient de l’orchestration : une interface claire, des bridges spécialisés et des agents qui produisent des décisions actionnables.', 'dark');
  txt(s,'À défendre en une phrase',0.85,2.15,3.0,0.32,{size:16,bold:true,fontFace:fontHead,color:C.mint});
  txt(s,'Venture Path accompagne le fondateur depuis la validation de l’idée jusqu’à l’exécution, en combinant React, APIs Python, Supabase-ready storage et pipelines LLM/agents.',0.85,2.72,7.4,0.86,{size:21,bold:true,fontFace:fontHead,color:C.white});
  card(s,1.0,4.65,2.6,0.8,{fill:'102B31',line:C.teal}); txt(s,'Clarté produit',1.2,4.92,2.0,0.22,{size:14,bold:true,fontFace:fontHead,color:C.mint,align:'center'});
  card(s,4.05,4.65,2.6,0.8,{fill:'292A22',line:C.amber}); txt(s,'Architecture modulaire',4.25,4.92,2.0,0.22,{size:14,bold:true,fontFace:fontHead,color:'FFE9B6',align:'center'});
  card(s,7.1,4.65,2.6,0.8,{fill:'351F22',line:C.coral}); txt(s,'Agents spécialisés',7.3,4.92,2.0,0.22,{size:14,bold:true,fontFace:fontHead,color:'FFD2CB',align:'center'});
  txt(s,'Merci',10.65,6.15,1.4,0.42,{size:25,bold:true,fontFace:fontHead,color:C.teal,align:'right'});
  footer(s,i,'dark');
});

async function writePreview(i, dark=false) {
  const slide = i;
  const bg = dark ? '#0B1F26' : '#FBF7EE';
  const accent = i%3===0 ? '#EB6A5B' : i%3===1 ? '#13B8A6' : '#F2A541';
  const titleTexts = [
    'Plateforme multi-agents', 'Pourquoi cette plateforme existe', 'Un parcours fondateur en trois mouvements', 'Du formulaire au livrable',
    'Architecture globale', 'Frontend modulaire', 'Track A - Analyse startup', 'Track B - Assistant légal', 'Track C - Execution Agent',
    'Pitch Coach vidéo', 'Données & sécurité', 'Matrice API', 'Démo technique', 'Limites & roadmap', 'Conclusion'
  ];
  const svg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <rect width="1920" height="1080" fill="${bg}"/>
    <rect x="1460" y="-70" width="600" height="1220" transform="rotate(13 1460 -70)" fill="${dark?'#18353C':'#E7F4F0'}" opacity="0.9"/>
    <circle cx="-80" cy="980" r="250" fill="none" stroke="${accent}" stroke-width="5" opacity="0.28"/>
    <text x="110" y="115" font-family="Bahnschrift, Segoe UI, sans-serif" font-size="26" font-weight="700" fill="${accent}">VENTURE PATH | ${String(i+1).padStart(2,'0')}</text>
    <text x="110" y="205" font-family="Bahnschrift, Segoe UI, sans-serif" font-size="62" font-weight="700" fill="${dark?'#FFFFFF':'#0B1220'}">${titleTexts[i].replace(/&/g,'&amp;')}</text>
    <text x="110" y="300" font-family="Segoe UI, sans-serif" font-size="30" fill="${dark?'#C8D8D5':'#617080'}">Aperçu généré du support technique éditable PowerPoint.</text>
    <rect x="110" y="390" width="1280" height="360" rx="30" fill="${dark?'#102B31':'#FFFFFF'}" stroke="${accent}" stroke-width="3" opacity="0.98"/>
    <text x="160" y="475" font-family="Segoe UI, sans-serif" font-size="34" fill="${dark?'#D8E4E0':'#0B1220'}">Slide vérifiée pour rythme visuel, contraste et lisibilité générale.</text>
    <text x="160" y="550" font-family="Segoe UI, sans-serif" font-size="28" fill="${dark?'#D8E4E0':'#617080'}">Le fichier PPTX contient les textes, formes et diagrammes en objets éditables.</text>
    <text x="110" y="1025" font-family="Segoe UI, sans-serif" font-size="20" fill="${dark?'#88A09B':'#7C8A88'}">scratch/previews/slide-${String(i+1).padStart(2,'0')}.png</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(PREV, `slide-${String(i+1).padStart(2,'0')}.png`));
}

(async()=>{
  const pptxPath = path.join(OUT, 'venture_path_presentation_technique.pptx');
  await pptx.writeFile({ fileName: pptxPath });
  for (let i=0;i<slides.length;i++) await writePreview(i, [0,2,4,7,9,12,14].includes(i));
  fs.writeFileSync(path.join(OUT,'README.txt'), `Deck: ${pptxPath}\nPreviews: ${PREV}\nSlides: ${slides.length}\n`);
  console.log(JSON.stringify({pptxPath, previewDir:PREV, slides:slides.length}, null, 2));
})();
