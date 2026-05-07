const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve('presentation_output');
const PREV = path.resolve('scratch/previews_9slides_detailed');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREV, { recursive: true });

const pptx = new pptxgen();
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.author = 'Codex';
pptx.subject = 'Presentation technique detaillee Venture Path';
pptx.title = 'Venture Path - Presentation technique detaillee';
pptx.company = 'Venture Path';
pptx.lang = 'fr-FR';
pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'fr-FR' };

const W = 13.333, H = 7.5;
const C = { navy:'0A0F55', deep:'233E68', blue:'3890BC', pale:'EEF1F5', white:'FFFFFF', gray:'E7E8EA', text:'111827', muted:'40444A', line:'CBD3DF', black:'000000' };
const head = 'Aptos Display';
const body = 'Aptos';

function bg(s) {
  s.background = { color: C.pale };
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:W, h:H, fill:{color:C.pale}, line:{color:C.pale, transparency:100} });
  s.addShape(pptx.ShapeType.rect, { x:6.2, y:-0.4, w:8.2, h:8.8, rotate:57, fill:{color:'F8F8F8'}, line:{color:'F8F8F8', transparency:100} });
  s.addShape(pptx.ShapeType.rtTriangle, { x:-0.02, y:6.05, w:1.45, h:1.45, fill:{color:C.deep}, line:{color:C.deep, transparency:100} });
  s.addShape(pptx.ShapeType.rtTriangle, { x:11.92, y:-0.02, w:1.45, h:1.45, rotate:180, fill:{color:C.deep}, line:{color:C.deep, transparency:100} });
}
function txt(s,t,x,y,w,h,o={}) { s.addText(t,{x,y,w,h,fontFace:o.fontFace||body,fontSize:o.size||10.5,color:o.color||C.text,bold:!!o.bold,italic:!!o.italic,fit:o.fit||'shrink',margin:o.margin??0.035,align:o.align||'left',valign:o.valign||'top',breakLine:false,paraSpaceAfterPt:o.after??0}); }
function title(s,t,sub) { txt(s,t,1.45,0.58,10.45,0.46,{size:22,bold:true,color:C.navy,fontFace:head,align:'center'}); if(sub) txt(s,sub,1.7,1.04,9.95,0.26,{size:10.2,color:C.black,align:'center'}); }
function footer(s,i){ txt(s,`Venture Path | Technical deep dive | ${String(i).padStart(2,'0')}`,0.62,7.16,4.7,0.17,{size:7.4,color:'6B7280'}); }
function card(s,x,y,w,h,fill=C.white,line='FFFFFF') { s.addShape(pptx.ShapeType.snip1Rect,{x,y,w,h,fill:{color:fill},line:{color:line,transparency:100}}); }
function box(s,x,y,w,h,fill=C.white,line=C.line) { s.addShape(pptx.ShapeType.rect,{x,y,w,h,fill:{color:fill},line:{color:line,width:0.8}}); }
function bullet(s,items,x,y,w,h,o={}) { txt(s,items.map(v=>`• ${v}`).join('\n'),x,y,w,h,{size:o.size||9.2,color:o.color||C.text,fit:'shrink'}); }
function smallTitle(s,t,x,y,w,color=C.navy){ txt(s,t,x,y,w,0.22,{size:12.3,bold:true,color,fontFace:head}); }
function node(s,label,x,y,w,h,o={}) { card(s,x,y,w,h,o.fill||C.white,o.line||C.white); txt(s,label,x+0.06,y+0.06,w-0.12,h-0.1,{size:o.size||8.8,bold:o.bold??true,color:o.color||C.text,align:'center',valign:'mid',fontFace:o.fontFace||body}); }
function arrow(s,x,y,w,h,color=C.deep,flip=false){ s.addShape(flip?pptx.ShapeType.leftArrow:pptx.ShapeType.rightArrow,{x,y,w,h,fill:{color},line:{color,transparency:100}}); }
function badge(s,num,x,y){ s.addShape(pptx.ShapeType.hexagon,{x,y,w:0.58,h:0.44,fill:{color:C.deep},line:{color:C.deep,transparency:100}}); txt(s,num,x+0.1,y+0.105,0.36,0.14,{size:8.5,bold:true,color:C.white,align:'center'}); }
function table(s, headers, rows, x,y, widths, rowH=0.35) {
  let cx=x; headers.forEach((h,i)=>{ box(s,cx,y,widths[i],rowH,'233E68','233E68'); txt(s,h,cx+0.05,y+0.08,widths[i]-0.1,0.13,{size:7.8,bold:true,color:C.white,align:i===0?'left':'center'}); cx+=widths[i]; });
  rows.forEach((r,ri)=>{ cx=x; const yy=y+rowH+ri*rowH; r.forEach((v,i)=>{ box(s,cx,yy,widths[i],rowH,ri%2?'F8FAFC':'FFFFFF',C.line); txt(s,String(v),cx+0.05,yy+0.07,widths[i]-0.1,0.14,{size:7.5,color:C.text,align:i===1?'center':'left'}); cx+=widths[i]; }); });
}

const slideTitles=[];
function add(build,t){ const s=pptx.addSlide(); bg(s); slideTitles.push(t); build(s,slideTitles.length); footer(s,slideTitles.length); }

add((s)=>{
  title(s,'Venture Path: Multi-Agent Startup Platform','Technical deep dive: React/Vite frontend, Python API bridges, Supabase-ready storage and agentic pipelines');
  card(s,0.75,1.78,3.48,2.35); smallTitle(s,'Input Data',1.0,2.02,1.25,C.navy); bullet(s,['Startup profile: idea, problem, target users, sector','Team: roles, skills, availability','Legal evidence: statuts, RC, IF, CIN, bank proof','Pitch video: MP4/MOV/MKV + coaching mode'],1.0,2.42,2.75,1.2,{size:9.1}); txt(s,'Browser forms + file upload',1.1,3.67,2.3,0.2,{size:8.3,bold:true,color:C.blue,align:'center'});
  arrow(s,4.62,2.05,1.55,1.45,C.blue,true); arrow(s,6.03,3.0,1.75,1.55,C.deep,false); txt(s,'Normalize',4.98,3.75,0.8,0.18,{size:8.5,bold:true,color:C.blue}); txt(s,'Orchestrate',6.72,4.42,1.0,0.18,{size:8.5,bold:true,color:C.blue}); txt(s,'Execution Plan',5.38,5.72,2.0,0.22,{size:13.2,bold:true,color:C.black,align:'center'});
  card(s,8.38,1.62,3.8,1.55); badge(s,'01',8.05,1.95); smallTitle(s,'Structured Outputs',8.72,1.86,1.8,C.navy); bullet(s,['Track A report: market, MVP, ops, finance, legal','Track B decision: blockers, checklist, research','Track C task queues: priority, ready, Jira summary'],8.72,2.22,2.82,0.62,{size:8.1});
  card(s,8.38,3.55,3.8,1.55); badge(s,'02',8.05,3.88); smallTitle(s,'Generated Artifacts',8.72,3.79,1.8,C.navy); bullet(s,['JSON responses for dashboards','Markdown and PDF pitch reports','Saved outputs under track2_reports and pitch_coach_outputs','Demo fallback via localStorage when Supabase is absent'],8.72,4.14,2.82,0.72,{size:8.1});
  card(s,0.95,5.38,10.85,0.72); txt(s,'Core technical idea: the frontend stays lightweight while each specialized Python bridge owns a heavy workflow: validation, legal reasoning, execution planning or video/pitch analysis.',1.25,5.6,10.15,0.2,{size:10.3,bold:true,color:C.navy,align:'center'});
},'Venture Path Deep Dive');

add((s)=>{
  title(s,'Product Scope and Functional Coverage','The platform is organized around three founder decisions: validate, comply and execute');
  table(s,['Track','Main user question','Frontend page','Backend/API','Main output'],[
    ['A','Is this idea worth building?','Track1Analyzer.jsx','/track1/analyze :5055','startup report + verdict'],
    ['B','Can I start legally in Tunisia?','Track2LegalAssistant.jsx','track2_api.py FastAPI','legal decision + checklist'],
    ['C1','What should the team execute next?','Track3Execution.jsx','track3_api.py :5056','tasks, queues, feasibility'],
    ['C2','Is my pitch investor-ready?','Track3PitchCoach.jsx','pitch_coach_api.py','scorecard + MD/PDF report'],
  ],0.75,1.8,[0.72,2.45,2.18,2.15,2.55],0.43);
  card(s,0.9,4.38,3.55,1.35); smallTitle(s,'Shared UX pattern',1.15,4.64,1.7,C.navy); bullet(s,['guided forms','local API fetch','loading/error states','report cards and raw JSON preview'],1.15,4.98,2.55,0.48,{size:8.7});
  card(s,4.95,4.38,3.55,1.35); smallTitle(s,'Shared backend pattern',5.2,4.64,1.9,C.navy); bullet(s,['payload normalization','path resolution','subprocess/agent call','JSON-safe response'],5.2,4.98,2.55,0.48,{size:8.7});
  card(s,9.0,4.38,3.55,1.35); smallTitle(s,'Shared value pattern',9.25,4.64,1.8,C.navy); bullet(s,['decision support','actionable next steps','exportable evidence','demo-safe fallback'],9.25,4.98,2.55,0.48,{size:8.7});
},'Product Scope');

add((s)=>{
  title(s,'Global Technical Architecture','Single-page React application connected to local API bridges and external agent modules');
  node(s,'React + Vite SPA\nApp.jsx routes by hash\nTopBar / Track pages / dashboards',0.72,1.68,2.28,0.92,{color:C.navy});
  node(s,'Supabase-ready layer\nsupabaseClient.js\nsupabaseService.js\nRLS schema.sql',0.72,3.0,2.28,0.86,{color:C.navy});
  node(s,'Demo fallback\nlocalStorage\nventure-path-site-demo-db',0.72,4.23,2.28,0.72,{color:C.navy});
  arrow(s,3.18,2.82,0.82,0.42,C.blue);
  table(s,['Service','Port','Runtime','Role'],[
    ['Track A','5055','FastAPI expected','startup analysis'],
    ['Track B','5057','FastAPI + uvicorn','legal bridge'],
    ['Track C','5056','ThreadingHTTPServer','execution bridge'],
    ['Pitch','5057','ThreadingHTTPServer','video bridge'],
  ],4.25,1.65,[1.05,0.65,1.75,1.65],0.39);
  arrow(s,9.55,2.82,0.82,0.42,C.deep);
  node(s,'External agent modules\nTrack2/app services\nTrack3/ExecutionAgent\nTrack3/pitch pipeline',10.55,1.9,2.0,1.05,{color:C.navy});
  node(s,'Generated outputs\nJSON dashboards\nReports PDF/MD\nJira-ready tasks',10.55,3.45,2.0,0.96,{color:C.navy});
  card(s,3.8,5.55,7.6,0.64); txt(s,'Architecture risk to mention: Track B and Pitch Coach both use port 5057. For a clean live demo, move Pitch Coach to 5058 or Track B to 5059 and update frontend constants/docs.',4.05,5.75,7.05,0.18,{size:8.9,bold:true,color:C.deep,align:'center'});
},'Architecture');

add((s)=>{
  title(s,'Frontend Implementation Details','React components separate marketing pages, track workflows and result dashboards');
  table(s,['File/module','Technical role','Details to defend'],[
    ['src/App.jsx','routing shell','hash routes, active track selection, auth modal, dark mode'],
    ['src/data/siteContent.js','content model','tracks, services, FAQ, testimonials, portfolio copy'],
    ['src/pages/Track1Analyzer.jsx','Track A UI','form payload, tabs, metric cards, report rendering'],
    ['src/pages/Track2LegalAssistant.jsx','Track B UI','API detection, upload FormData, legal report sections'],
    ['src/pages/Track3Hub.jsx','Track C router','feature hub: execution, pitch coach, future marketing'],
    ['src/lib/supabaseService.js','data abstraction','insertOrFallback, approved testimonial fetch'],
  ],0.72,1.55,[2.55,1.65,7.05],0.38);
  card(s,0.9,4.7,3.45,1.25); smallTitle(s,'State management',1.15,4.96,1.6,C.navy); bullet(s,['local component state via useState','loading/error/report states','form arrays for team/features/documents'],1.15,5.28,2.55,0.45,{size:8.35});
  card(s,4.85,4.7,3.45,1.25); smallTitle(s,'Network layer',5.1,4.96,1.5,C.navy); bullet(s,['fetch JSON APIs','FormData for documents/videos','friendly backend connection errors'],5.1,5.28,2.55,0.45,{size:8.35});
  card(s,8.8,4.7,3.45,1.25); smallTitle(s,'UI reporting',9.05,4.96,1.5,C.navy); bullet(s,['tabbed sections','score badges and metrics','raw JSON preview for technical transparency'],9.05,5.28,2.55,0.45,{size:8.35});
},'Frontend Details');

add((s)=>{
  title(s,'Track A: Startup Idea Analyzer','Structured startup diagnosis from founder input to multi-section report');
  node(s,'Form payload\nstartup_idea, problem, target_customer, industry, product_type, business_model, team, finance_assumptions',0.78,1.72,2.95,1.0,{color:C.navy,size:7.7});
  arrow(s,3.98,1.98,0.75,0.4,C.blue);
  node(s,'API call\nPOST http://127.0.0.1:5055/track1/analyze\nJSON body + async loading state',4.92,1.72,2.4,1.0,{color:C.navy,size:7.8});
  arrow(s,7.55,1.98,0.75,0.4,C.deep);
  node(s,'Report model\nstartup_summary, market_existence, mvp, operations, finance, legal_and_compliance, final_verdict',8.55,1.72,3.25,1.0,{color:C.navy,size:7.7});
  table(s,['Report section','Technical render','What it proves'],[
    ['Overview','MetricCard + TextCard','overall feasibility and final verdict'],
    ['Market','ExistingSolutionCard','competition and originality'],
    ['MVP','SimpleList + Timeline','first build path and priorities'],
    ['Operations','RoleCard','team and process requirements'],
    ['Finance','RangeBar + EmployeeCard','salary ranges and cost assumptions'],
    ['Legal','riskTone / compliance cards','readiness and obligations'],
  ],1.05,3.3,[1.6,2.4,5.75],0.34);
  txt(s,'Defense angle: Track A is the diagnostic layer. It creates the first structured startup state that later tracks can reuse conceptually.',1.08,5.95,10.35,0.22,{size:9.5,bold:true,color:C.deep,align:'center'});
},'Track A Details');

add((s)=>{
  title(s,'Track B: Legal Assistant Backend','FastAPI bridge around TrackBOrchestrator, chatbot, document upload and public research');
  table(s,['Endpoint','Method','Implementation detail','Output'],[
    ['/health','GET','simple service status','ok + app name'],
    ['/track2/sample','GET','returns SAMPLE_REQUEST with resolved paths','demo legal case'],
    ['/track2/upload','POST','UploadFile list saved under track2_uploads','documents[] paths'],
    ['/track2/run','POST','TrackBRequest validation + orchestrator.run','legal result + research'],
    ['/track2/chat','POST','TrackBChatbot answers using latest_result','contextual answer'],
    ['/track2/research','POST','DuckDuckGo/Bing HTML/RSS search','public evidence links'],
  ],0.68,1.52,[1.45,0.62,4.7,3.2],0.34);
  card(s,0.9,4.25,3.55,1.35); smallTitle(s,'Internal services',1.15,4.52,1.6,C.navy); bullet(s,['TrackBOrchestrator','TrackBChatbot','load_knowledge_base()','get_local_llm_client()'],1.15,4.84,2.45,0.52,{size:8.6});
  card(s,4.9,4.25,3.55,1.35); smallTitle(s,'Research logic',5.15,4.52,1.5,C.navy); bullet(s,['identity term filtering','result scoring by title/domain','fallback queries by platform','events search not strict identity'],5.15,4.84,2.55,0.52,{size:8.6});
  card(s,8.9,4.25,3.55,1.35); smallTitle(s,'Legal outputs',9.15,4.52,1.5,C.navy); bullet(s,['final decision PASS/FAIL','strict-mode blockers','document diagnostics','roadmap and recommendations'],9.15,4.84,2.55,0.52,{size:8.6});
},'Track B Details');

add((s)=>{
  title(s,'Track C Execution Agent','Bridge, state merge and orchestration for executable startup planning');
  node(s,'UI payload\nstartup_profile\nmvp_plan.features\nadmin_workflow\ndeadlines\nteam availability\nlive_status',0.8,1.62,2.05,1.4,{color:C.navy,size:8});
  arrow(s,3.05,2.05,0.78,0.42,C.blue);
  node(s,'track3_api.py\nThreadingHTTPServer\nCORS for localhost\nwrites bridge input\nsubprocess.run runner',4.0,1.62,2.05,1.4,{color:C.navy,size:8});
  arrow(s,6.25,2.05,0.78,0.42,C.deep);
  node(s,'track3_run_agent.py\nload_base_state\nnormalize_items\nnormalize_team\nmerge_state\nasync run_agent()',7.18,1.62,2.05,1.4,{color:C.navy,size:8});
  arrow(s,9.45,2.05,0.78,0.42,C.blue);
  node(s,'ExecutionAgent\nLocalKnowledgeBase\nLLMClient\nMCPProjectOpsClient\nExecutionOrchestrator',10.35,1.62,2.05,1.4,{color:C.navy,size:8});
  table(s,['Response field','Meaning in demo','Technical source'],[
    ['executive_summary','high-level status and main risk','orchestrator result'],
    ['founder_decisions','decisions founder must take','planner/critic'],
    ['priority_queue','ranked tasks','task generation'],
    ['ready_queue','immediately executable tasks','dependency logic'],
    ['feasibility','scope/timeline status','constraints + team capacity'],
    ['jira','sync summary if configured','Jira env config'],
  ],1.05,4.05,[2.0,4.1,3.25],0.31);
  txt(s,'Configuration keys include JIRA_* and LLM_* values loaded from track3.local.json when present.',1.2,6.05,9.9,0.2,{size:8.7,bold:true,color:C.deep,align:'center'});
},'Track C Details');

add((s)=>{
  title(s,'Pitch Coach Agent Pipeline','Video analysis service with execution IDs, audio transcription, LLM feedback and downloadable reports');
  ['Upload\nMP4/MOV/MKV','Session\nexecution_id + hash','Subprocess\nagentic_pitch_coach.py','Analysis\ndelivery/content/narrative','Reports\nJSON + MD + PDF'].forEach((v,k)=>{ node(s,v,0.72+k*2.5,1.62,1.62,0.72,{color:C.navy,size:8.3}); if(k<4) arrow(s,2.42+k*2.5,1.78,0.62,0.36,k%2?C.deep:C.blue); });
  table(s,['Component','Technical detail','Why it matters'],[
    ['pitch_coach_api.py','ThreadingHTTPServer on 127.0.0.1:5057','simple local bridge for React'],
    ['parse_multipart_form','manual multipart parsing with binary file support','accepts real video upload'],
    ['resolve_python','env python, default Windows path, sys.executable fallback','portable execution'],
    ['MediaPipe check','auto skip visual if unavailable','demo resilience'],
    ['sanitize_response','removes paths, raw state and tool traces','safer browser response'],
    ['download endpoint','/pitch/download/{execution_id}','PDF or Markdown fallback'],
  ],0.8,3.08,[2.1,4.3,3.9],0.32);
  card(s,1.1,5.55,10.55,0.58); txt(s,'Analysis dimensions: pace, filler words, clarity, value proposition, market articulation, narrative structure, founder credibility, optional visual cues and voice emotion.',1.35,5.74,10.0,0.16,{size:8.7,bold:true,color:C.deep,align:'center'});
},'Pitch Coach Details');

add((s)=>{
  title(s,'Demo Strategy, Technical Risks and Production Roadmap','A stronger defense ends by showing what works now and what must be hardened next');
  table(s,['Demo step','What to show','Technical proof'],[
    ['1. Home','tracks and value proposition','React SPA and reusable content model'],
    ['2. Track A','filled startup form + report tabs','payload building and report rendering'],
    ['3. Track B','sample + upload + legal sections','FastAPI bridge and orchestrator output'],
    ['4. Track C','sample HealthFlow execution','state merge and task queues'],
    ['5. Pitch Coach','existing generated report','video pipeline outputs without waiting live'],
  ],0.78,1.45,[1.55,4.0,4.65],0.34);
  card(s,0.9,4.25,3.55,1.42); smallTitle(s,'Risks now',1.15,4.52,1.2,C.navy); bullet(s,['Port conflict: Track B and Pitch both 5057','API key appears in local config and must be rotated/removed','long jobs block request lifecycle','uploads need size and MIME validation'],1.15,4.84,2.55,0.58,{size:8.1});
  card(s,4.9,4.25,3.55,1.42); smallTitle(s,'Near-term fixes',5.15,4.52,1.45,C.navy); bullet(s,['dedicated ports and .env variables','start-all scripts for demo','background queue for pitch analysis','structured logs and health dashboard'],5.15,4.84,2.55,0.58,{size:8.1});
  card(s,8.9,4.25,3.55,1.42); smallTitle(s,'Production path',9.15,4.52,1.45,C.navy); bullet(s,['cloud deployment per service','authenticated API gateway','object storage for uploads/reports','E2E tests and observability','Jira sync hardening'],9.15,4.84,2.55,0.58,{size:8.1});
  txt(s,'Closing claim: Venture Path is technically defensible because it separates UX, API bridges and agent pipelines while keeping outputs visible, structured and actionable.',1.0,6.18,11.2,0.2,{size:9.4,bold:true,color:C.navy,align:'center'});
},'Demo Roadmap Details');

async function writePreview(i) {
  const title = slideTitles[i].replace(/&/g,'&amp;');
  const svg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="#EEF1F5"/><polygon points="0,1080 1920,120 1920,1080" fill="#F8F8F8"/><polygon points="0,875 195,1080 0,1080" fill="#233E68"/><polygon points="1720,0 1920,0 1920,180" fill="#233E68"/>
  <text x="960" y="140" text-anchor="middle" font-family="Aptos Display,Arial" font-size="48" font-weight="700" fill="#0A0F55">${title}</text>
  <text x="960" y="202" text-anchor="middle" font-family="Aptos,Arial" font-size="25" fill="#000000">Version detaillee: plus de flux, endpoints, modules et risques techniques.</text>
  <rect x="120" y="285" width="520" height="250" fill="#FFFFFF"/><text x="165" y="355" font-family="Aptos,Arial" font-size="30" font-weight="700" fill="#111827">Slide ${String(i+1).padStart(2,'0')}</text><text x="165" y="410" font-family="Aptos,Arial" font-size="23" fill="#40444A">Contenu plus charge et technique.</text>
  <path d="M705 415 C840 310 1020 350 1040 525 L1040 720 L925 720 L925 555 C910 470 805 480 735 545 Z" fill="#3890BC"/><path d="M960 545 L1215 545 L1215 455 L1400 610 L1215 765 L1215 675 L960 675 Z" fill="#233E68"/>
  <rect x="1325" y="285" width="455" height="250" fill="#FFFFFF"/><text x="1370" y="355" font-family="Aptos,Arial" font-size="27" font-weight="700" fill="#111827">PPTX editable</text><text x="1370" y="410" font-family="Aptos,Arial" font-size="22" fill="#40444A">Tables, textes, formes et schemas natifs.</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(PREV, `slide-${String(i+1).padStart(2,'0')}.png`));
}
(async()=>{
  const pptxPath = path.join(OUT, 'venture_path_presentation_technique_9slides_detailed.pptx');
  await pptx.writeFile({ fileName: pptxPath });
  for(let i=0;i<slideTitles.length;i++) await writePreview(i);
  const bufs = await Promise.all(slideTitles.map((_,i)=>sharp(path.join(PREV,`slide-${String(i+1).padStart(2,'0')}.png`)).resize(426,240).toBuffer()));
  await sharp({create:{width:426*3,height:240*3,channels:4,background:'#EEF1F5'}}).composite(bufs.map((input,i)=>({input,left:(i%3)*426,top:Math.floor(i/3)*240}))).png().toFile(path.join(PREV,'contact-sheet.png'));
  console.log(JSON.stringify({pptxPath, previewDir:PREV, slides:slideTitles.length}, null, 2));
})();
