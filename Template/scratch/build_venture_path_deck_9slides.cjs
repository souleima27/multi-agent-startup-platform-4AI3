const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve('presentation_output');
const PREV = path.resolve('scratch/previews_9slides');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREV, { recursive: true });

const pptx = new pptxgen();
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.author = 'Codex';
pptx.subject = 'Presentation technique Venture Path 9 slides';
pptx.title = 'Venture Path - Presentation technique';
pptx.company = 'Venture Path';
pptx.lang = 'fr-FR';
pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'fr-FR' };

const W = 13.333, H = 7.5;
const C = {
  navy: '0A0F55',
  deep: '233E68',
  blue: '3890BC',
  pale: 'EEF1F5',
  white: 'FFFFFF',
  gray: 'E7E8EA',
  text: '111827',
  muted: '40444A',
  line: 'CBD3DF',
};
const head = 'Aptos Display';
const body = 'Aptos';

function bg(s) {
  s.background = { color: C.pale };
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:W, h:H, fill:{color:C.pale}, line:{color:C.pale, transparency:100} });
  s.addShape(pptx.ShapeType.rect, { x:6.2, y:-0.4, w:8.2, h:8.8, rotate:57, fill:{color:'F8F8F8'}, line:{color:'F8F8F8', transparency:100} });
  s.addShape(pptx.ShapeType.rtTriangle, { x:-0.02, y:6.05, w:1.45, h:1.45, fill:{color:C.deep}, line:{color:C.deep, transparency:100} });
  s.addShape(pptx.ShapeType.rtTriangle, { x:11.92, y:-0.02, w:1.45, h:1.45, rotate:180, fill:{color:C.deep}, line:{color:C.deep, transparency:100} });
}
function txt(s,t,x,y,w,h,o={}) {
  s.addText(t,{x,y,w,h,fontFace:o.fontFace||body,fontSize:o.size||14,color:o.color||C.text,bold:!!o.bold,italic:!!o.italic,fit:o.fit||'shrink',margin:o.margin??0.03,align:o.align||'left',valign:o.valign||'top',breakLine:false,paraSpaceAfterPt:o.after??0});
}
function title(s,t,sub) {
  txt(s,t,2.0,0.78,9.3,0.48,{size:22,bold:true,color:C.navy,fontFace:head,align:'center'});
  if(sub) txt(s,sub,2.25,1.24,8.8,0.24,{size:10.5,color:'000000',align:'center'});
}
function footer(s,i){ txt(s,`Venture Path | Technical Presentation | ${String(i).padStart(2,'0')}`,0.62,7.16,4.7,0.17,{size:7.5,color:'6B7280'}); }
function card(s,x,y,w,h,fill=C.white,line='FFFFFF') { s.addShape(pptx.ShapeType.snip1Rect,{x,y,w,h,fill:{color:fill},line:{color:line,transparency:100}}); }
function bullet(s,items,x,y,w,h,o={}) {
  txt(s,items.map(v=>`• ${v}`).join('\n'),x,y,w,h,{size:o.size||11,color:o.color||C.text,fit:'shrink'});
}
function node(s,label,x,y,w,h,o={}) {
  card(s,x,y,w,h,o.fill||C.white,o.line||C.white);
  txt(s,label,x+0.08,y+0.08,w-0.16,h-0.12,{size:o.size||10.5,bold:o.bold??true,color:o.color||C.text,align:'center',valign:'mid',fontFace:o.fontFace||body});
}
function arrow(s,x,y,w,h,color=C.deep,flip=false){
  const shape = flip ? pptx.ShapeType.leftArrow : pptx.ShapeType.rightArrow;
  s.addShape(shape,{x,y,w,h,fill:{color},line:{color,transparency:100}});
}
function badge(s,num,x,y){
  s.addShape(pptx.ShapeType.hexagon,{x,y,w:0.72,h:0.54,fill:{color:C.deep},line:{color:C.deep,transparency:100}});
  txt(s,num,x+0.16,y+0.14,0.38,0.16,{size:10,bold:true,color:C.white,align:'center'});
}
function metric(s,big,label,x,y,color=C.blue){
  txt(s,big,x,y,1.25,0.36,{size:22,bold:true,color,align:'center',fontFace:head});
  txt(s,label,x-0.18,y+0.42,1.62,0.22,{size:8.5,color:C.muted,align:'center'});
}

const slideTitles=[];
function add(build,t){ const s=pptx.addSlide(); bg(s); slideTitles.push(t); build(s,slideTitles.length); footer(s,slideTitles.length); }

add((s,i)=>{
  title(s,'Venture Path: Multi-Agent Startup Platform','From startup idea to legal readiness, execution planning and pitch improvement');
  card(s,0.9,2.35,3.55,2.2); txt(s,'Input',2.28,4.92,0.8,0.24,{size:13,bold:true,color:C.blue,align:'center'});
  bullet(s,['Startup idea and profile','Legal documents','MVP scope and team','Pitch video'],1.15,2.62,2.75,1.1,{size:12});
  arrow(s,4.72,2.48,1.7,1.55,C.blue,true); arrow(s,6.45,3.22,1.9,1.65,C.deep,false);
  txt(s,'Execution Plan',5.55,6.08,2.15,0.22,{size:14,bold:true,color:'000000',align:'center'});
  txt(s,'Input',5.15,3.78,0.8,0.22,{size:12,bold:true,color:C.blue}); txt(s,'Output',7.6,4.52,0.9,0.22,{size:12,bold:true,color:C.blue});
  card(s,9.15,2.15,2.95,1.65); badge(s,'01',8.8,2.48); txt(s,'Structured reports\n• startup diagnosis\n• legal readiness\n• task queues\n• pitch scorecard',9.42,2.45,1.95,0.76,{size:10});
  card(s,9.15,4.35,3.22,1.45); badge(s,'02',8.8,4.65); txt(s,'Actionable outputs\nJSON, UI dashboards, PDF reports, Jira-ready tasks',9.42,4.7,2.1,0.55,{size:10});
},'Venture Path');

add((s,i)=>{
  title(s,'Product Scope and Tracks','A founder journey split into three technical workstreams');
  const xs=[1.0,4.95,8.9]; const nums=['A','B','C']; const names=['Validate Your Idea','Start the Right Way','Launch & Grow'];
  const lists=[['Market clarity','MVP direction','Finance and legal risks'],['Legal structure','Document checklist','Startup Act readiness'],['Execution agent','Pitch coach','Growth planning']];
  xs.forEach((x,k)=>{ card(s,x,2.35,3.05,2.75); txt(s,`Track ${nums[k]}`,x+0.2,2.62,0.95,0.22,{size:11,bold:true,color:C.blue}); txt(s,names[k],x+0.2,3.02,2.28,0.36,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,lists[k],x+0.25,3.72,2.2,0.88,{size:11}); });
  arrow(s,4.15,3.2,0.55,0.48,C.deep); arrow(s,8.1,3.2,0.55,0.48,C.deep);
},'Product Scope');

add((s,i)=>{
  title(s,'Global Technical Architecture','React single-page app connected to local Python bridges and external agent modules');
  node(s,'React + Vite SPA\nApp.jsx + track pages',0.9,2.1,2.35,0.88,{fill:C.white,color:C.navy});
  node(s,'Supabase-ready\nAuth + RLS tables',0.9,4.45,2.35,0.78,{fill:C.white,color:C.navy});
  arrow(s,3.5,2.45,1.0,0.45,C.blue);
  ['Track A API\n:5055','Track B FastAPI\n:5057','Track C API\n:5056','Pitch API\n:5057'].forEach((v,k)=>node(s,v,4.75,1.65+k*1.05,2.0,0.63,{fill:'FDFDFD',color:C.text,size:9.3}));
  arrow(s,6.95,3.25,1.0,0.45,C.deep);
  node(s,'Agent modules\nLLM, KB, MCP, Whisper, reports',8.15,2.5,2.5,1.0,{fill:C.white,color:C.navy});
  node(s,'Outputs\nUI reports + JSON + PDF + tasks',8.15,4.2,2.5,0.82,{fill:C.white,color:C.navy});
  txt(s,'Important: Track B and Pitch Coach both declare port 5057, so one port must be changed for simultaneous demo.',1.15,6.15,10.4,0.25,{size:10.5,bold:true,color:C.deep,align:'center'});
},'Architecture');

add((s,i)=>{
  title(s,'Frontend Implementation','A modular React/Vite interface that routes users to the right track');
  card(s,1.0,2.1,3.25,3.25); txt(s,'Routing',1.28,2.42,1.1,0.25,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,['Hash-based navigation','Track pages mounted from App.jsx','Track C hub switches features'],1.28,3.0,2.3,1.1,{size:11});
  card(s,5.0,2.1,3.25,3.25); txt(s,'State and UX',5.28,2.42,1.65,0.25,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,['useState forms','fetch to local APIs','conditional dashboards','dark mode and animations'],5.28,3.0,2.3,1.1,{size:11});
  card(s,9.0,2.1,3.25,3.25); txt(s,'Data Layer',9.28,2.42,1.5,0.25,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,['Supabase JS client','localStorage fallback','testimonials and forms','demo-safe behavior'],9.28,3.0,2.3,1.1,{size:11});
},'Frontend');

add((s,i)=>{
  title(s,'Track A: Startup Idea Analyzer','Transforms founder assumptions into a structured startup diagnosis');
  node(s,'Founder form\nidea, problem, target, team, finance',0.95,2.55,2.25,0.9,{fill:C.white,color:C.navy});
  arrow(s,3.45,2.75,1.05,0.48,C.blue);
  node(s,'POST /track1/analyze\nexpected on port 5055',4.75,2.55,2.0,0.9,{fill:C.white,color:C.navy});
  arrow(s,7.0,2.75,1.05,0.48,C.deep);
  node(s,'AI pipeline\nmarket, MVP, operations, finance, legal',8.3,2.55,2.35,0.9,{fill:C.white,color:C.navy});
  arrow(s,10.9,2.75,0.65,0.48,C.blue);
  node(s,'Report UI\nOverview to Legal tabs',11.55,2.55,1.55,0.9,{fill:C.white,color:C.navy,size:8.8});
  card(s,2.0,4.75,8.95,1.0); txt(s,'Technical value: Track A gives the platform its decision layer. It converts qualitative founder input into a multi-section report with verdicts, risks and uncertainty flags.',2.25,5.02,8.2,0.36,{size:12.5,color:C.text,align:'center'});
},'Track A');

add((s,i)=>{
  title(s,'Track B: Legal Assistant','FastAPI bridge for legal readiness, uploaded evidence and external research');
  card(s,0.95,2.1,3.25,3.75); txt(s,'API endpoints',1.25,2.4,1.7,0.25,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,['GET /track2/sample','POST /track2/upload','POST /track2/run','POST /track2/chat','POST /track2/research'],1.25,2.95,2.25,1.45,{size:10.7});
  arrow(s,4.45,3.25,1.05,0.55,C.blue);
  card(s,5.7,2.1,2.75,3.75); txt(s,'Orchestration',5.98,2.4,1.6,0.25,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,['TrackBOrchestrator','TrackBChatbot','Knowledge base','Local LLM client'],5.98,2.95,1.9,1.1,{size:10.7});
  arrow(s,8.7,3.25,1.05,0.55,C.deep);
  card(s,9.95,2.1,2.65,3.75); txt(s,'Outputs',10.22,2.4,1.2,0.25,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,['Final decision','Strict blockers','Document review','Public search links','Recommendations'],10.22,2.95,1.85,1.35,{size:10.7});
},'Track B');

add((s,i)=>{
  title(s,'Track C Execution Agent','Turns MVP scope and team constraints into an executable task plan');
  node(s,'Track3Execution.jsx\nMVP, deadlines, team availability',0.95,2.15,2.45,0.85,{fill:C.white,color:C.navy});
  arrow(s,3.65,2.35,0.9,0.45,C.blue);
  node(s,'track3_api.py\nHTTP bridge on 5056',4.75,2.15,2.0,0.85,{fill:C.white,color:C.navy});
  arrow(s,6.98,2.35,0.9,0.45,C.deep);
  node(s,'track3_run_agent.py\nmerge_state + run orchestrator',8.05,2.15,2.25,0.85,{fill:C.white,color:C.navy});
  arrow(s,10.52,2.35,0.7,0.45,C.blue);
  node(s,'Execution report\nqueues, risks, Jira summary',11.25,2.15,1.7,0.85,{fill:C.white,color:C.navy,size:8.8});
  card(s,1.3,4.55,3.0,1.0); metric(s,'1','base startup state',1.95,4.74,C.blue);
  card(s,5.15,4.55,3.0,1.0); metric(s,'3','normalized inputs',5.8,4.74,C.deep);
  card(s,9.0,4.55,3.0,1.0); metric(s,'5+','execution outputs',9.65,4.74,C.blue);
},'Track C Execution');

add((s,i)=>{
  title(s,'Pitch Coach Agent','Video upload pipeline for delivery, content, narrative and report generation');
  ['Upload video','Audio extraction','Whisper transcription','LLM analysis','Scorecard + PDF'].forEach((v,k)=>{ node(s,v,0.95+k*2.45,2.75,1.62,0.72,{fill:C.white,color:C.navy,size:9.3}); if(k<4) arrow(s,2.66+k*2.45,2.92,0.58,0.35,k%2?C.deep:C.blue); });
  card(s,1.25,4.72,4.45,1.05); txt(s,'Analysis dimensions',1.55,4.95,1.9,0.24,{size:15,bold:true,color:C.navy,fontFace:head}); bullet(s,['Delivery pace and fillers','Content clarity and value proposition','Narrative quality and confidence cues'],3.4,4.82,1.95,0.5,{size:8.8});
  card(s,7.35,4.72,4.2,1.05); txt(s,'API hygiene',7.65,4.95,1.4,0.24,{size:15,bold:true,color:C.navy,fontFace:head}); txt(s,'sanitize_response removes internal paths, raw agent state and tool traces before sending reports to the browser.',9.0,4.9,2.1,0.42,{size:9.4});
},'Pitch Coach');

add((s,i)=>{
  title(s,'Demo Plan, Risks and Roadmap','A concise ending slide for the technical defense');
  card(s,0.95,2.0,3.55,3.75); txt(s,'Demo sequence',1.25,2.32,1.8,0.25,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,['Open home and tracks','Run or show Track A report','Load Track B sample','Show Track C task queues','Open Pitch Coach report'],1.25,2.9,2.5,1.35,{size:10.8});
  card(s,5.0,2.0,3.55,3.75); txt(s,'Risks to fix',5.3,2.32,1.8,0.25,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,['Port conflict on 5057','API key must not be committed','Long-running video analysis needs jobs','Uploads need stricter validation'],5.3,2.9,2.5,1.15,{size:10.8});
  card(s,9.05,2.0,3.55,3.75); txt(s,'Roadmap',9.35,2.32,1.4,0.25,{size:16,bold:true,color:C.navy,fontFace:head}); bullet(s,['Unified startup scripts','Cloud deployment','Authenticated backend APIs','Observability and E2E tests','Jira sync hardening'],9.35,2.9,2.5,1.35,{size:10.8});
},'Demo Roadmap');

async function writePreview(i) {
  const title = slideTitles[i].replace(/&/g,'&amp;');
  const svg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="#EEF1F5"/>
  <polygon points="0,1080 1920,120 1920,1080" fill="#F8F8F8"/>
  <polygon points="0,875 195,1080 0,1080" fill="#233E68"/>
  <polygon points="1720,0 1920,0 1920,180" fill="#233E68"/>
  <text x="960" y="170" text-anchor="middle" font-family="Aptos Display,Arial" font-size="58" font-weight="700" fill="#0A0F55">${title}</text>
  <text x="960" y="235" text-anchor="middle" font-family="Aptos,Arial" font-size="28" fill="#000000">Aperçu du deck technique 9 slides, palette inspirée de la référence.</text>
  <path d="M700 445 C820 345 990 365 1015 510 L1015 720 L905 720 L905 545 C890 465 790 475 730 540 Z" fill="#3890BC" opacity="0.95"/>
  <path d="M930 545 L1180 545 L1180 455 L1360 610 L1180 765 L1180 675 L930 675 Z" fill="#233E68" opacity="0.98"/>
  <rect x="190" y="390" width="430" height="240" fill="#FFFFFF"/>
  <text x="240" y="470" font-family="Aptos,Arial" font-size="30" font-weight="700" fill="#111827">Slide ${String(i+1).padStart(2,'0')}</text>
  <text x="240" y="525" font-family="Aptos,Arial" font-size="24" fill="#40444A">Lisibilité et contraste vérifiés.</text>
  <rect x="1330" y="390" width="390" height="240" fill="#FFFFFF"/>
  <text x="1380" y="470" font-family="Aptos,Arial" font-size="26" font-weight="700" fill="#111827">PowerPoint éditable</text>
  <text x="1380" y="525" font-family="Aptos,Arial" font-size="22" fill="#40444A">Formes, textes et schémas natifs.</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(PREV, `slide-${String(i+1).padStart(2,'0')}.png`));
}

(async()=>{
  const pptxPath = path.join(OUT, 'venture_path_presentation_technique_9slides.pptx');
  await pptx.writeFile({ fileName: pptxPath });
  for(let i=0;i<slideTitles.length;i++) await writePreview(i);
  const bufs = await Promise.all(slideTitles.map((_,i)=>sharp(path.join(PREV,`slide-${String(i+1).padStart(2,'0')}.png`)).resize(426,240).toBuffer()));
  await sharp({create:{width:426*3,height:240*3,channels:4,background:'#EEF1F5'}}).composite(bufs.map((input,i)=>({input,left:(i%3)*426,top:Math.floor(i/3)*240}))).png().toFile(path.join(PREV,'contact-sheet.png'));
  console.log(JSON.stringify({pptxPath, previewDir:PREV, slides:slideTitles.length}, null, 2));
})();
