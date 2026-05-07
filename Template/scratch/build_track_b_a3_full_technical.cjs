const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.resolve('presentation_output');
const PREV = path.resolve('scratch/previews_track_b_agents_a3_full');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREV, { recursive: true });

const pptx = new pptxgen();
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.author = 'Codex';
pptx.subject = 'Track B and Ecosystem Intelligence technical redesign';
pptx.title = 'Track B - Legal & Ecosystem Agents';
pptx.lang = 'fr-FR';
pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'fr-FR' };

const W = 13.333, H = 7.5;
const C = {
  navy:'0A0F55', deep:'233E68', blue:'3890BC', cyan:'7FD1E4', pale:'EEF1F5',
  white:'FFFFFF', gray:'E7E8EA', text:'111827', muted:'4B5563', line:'C7D2E1',
  green:'CDEBCF', yellow:'FFE5B3', pink:'E9C4EA', red:'F1C8BA', lavender:'C7CFF7'
};
const head = 'Aptos Display';
const body = 'Aptos';

function bg(s, tag='TRACK B Intelligence') {
  s.background = { color: C.pale };
  s.addShape(pptx.ShapeType.rect, { x:0, y:0, w:W, h:H, fill:{color:C.pale}, line:{color:C.pale, transparency:100} });
  s.addShape(pptx.ShapeType.rect, { x:6.4, y:-0.55, w:8.2, h:8.8, rotate:57, fill:{color:'F8F8F8'}, line:{color:'F8F8F8', transparency:100} });
  s.addShape(pptx.ShapeType.rtTriangle, { x:-0.02, y:6.05, w:1.45, h:1.45, fill:{color:C.deep}, line:{color:C.deep, transparency:100} });
  s.addShape(pptx.ShapeType.rtTriangle, { x:11.92, y:-0.02, w:1.45, h:1.45, rotate:180, fill:{color:C.deep}, line:{color:C.deep, transparency:100} });
  s.addShape(pptx.ShapeType.roundRect, { x:0.15, y:0.26, w:1.9, h:0.7, rectRadius:0.06, fill:{color:C.deep}, line:{color:C.deep, transparency:100} });
  txt(s, tag, 0.38, 0.44, 1.4, 0.18, { size:13, bold:true, italic:true, color:C.white, fontFace:head, align:'center' });
  dots(s,0.15,1.2,0.55,1.4);
  dots(s,12.55,4.95,0.55,1.35);
}
function dots(s,x,y,w,h) {
  for(let r=0;r<9;r++) for(let c=0;c<5;c++) s.addShape(pptx.ShapeType.ellipse,{x:x+c*w/5,y:y+r*h/9,w:0.035,h:0.035,fill:{color:C.deep},line:{color:C.deep,transparency:100}});
}
function txt(s,t,x,y,w,h,o={}) { s.addText(t,{x,y,w,h,fontFace:o.fontFace||body,fontSize:o.size||10,color:o.color||C.text,bold:!!o.bold,italic:!!o.italic,fit:o.fit||'shrink',margin:o.margin??0.035,align:o.align||'left',valign:o.valign||'top',breakLine:false,paraSpaceAfterPt:o.after??0}); }
function title(s,t,sub) { txt(s,t,2.1,0.75,9.1,0.42,{size:24,bold:true,color:C.navy,fontFace:head,align:'center'}); if(sub) txt(s,sub,2.2,1.18,8.9,0.22,{size:10.8,bold:true,color:C.blue,align:'center'}); }
function footer(s,i){ txt(s,`${i}`,12.42,6.68,0.3,0.16,{size:8.5,color:'000000',align:'center'}); }
function card(s,x,y,w,h,fill=C.white,line=C.line) { s.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:0.08,fill:{color:fill},line:{color:line,width:1.05}}); }
function snip(s,x,y,w,h,fill=C.white,line=C.line) { s.addShape(pptx.ShapeType.snip1Rect,{x,y,w,h,fill:{color:fill},line:{color:line,width:1.0}}); }
function bullet(s,items,x,y,w,h,o={}) { txt(s,items.map(v=>`• ${v}`).join('\n'),x,y,w,h,{size:o.size||9.2,color:o.color||C.text,fit:'shrink'}); }
function smallTitle(s,t,x,y,w,color=C.navy){ txt(s,t,x,y,w,0.2,{size:12,bold:true,color,fontFace:head}); }
function node(s,label,x,y,w,h,o={}) { card(s,x,y,w,h,o.fill||C.white,o.line||C.line); txt(s,label,x+0.06,y+0.055,w-0.12,h-0.08,{size:o.size||8.4,bold:o.bold??true,color:o.color||C.text,align:'center',valign:'mid'}); }
function arrow(s,x,y,w,h,color=C.deep){ s.addShape(pptx.ShapeType.rightArrow,{x,y,w,h,fill:{color},line:{color,transparency:100}}); }
function downArrow(s,x,y,w,h,color=C.blue){ s.addShape(pptx.ShapeType.downArrow,{x,y,w,h,fill:{color},line:{color,transparency:100}}); }
function badge(s,t,x,y,color=C.deep){ s.addShape(pptx.ShapeType.ellipse,{x,y,w:0.58,h:0.58,fill:{color},line:{color:C.white,width:1.3}}); txt(s,t,x+0.12,y+0.19,0.34,0.13,{size:8.8,bold:true,color:C.white,align:'center'}); }
function table(s, headers, rows, x,y, widths, rowH=0.34) {
  let cx=x; headers.forEach((h,i)=>{ card(s,cx,y,widths[i],rowH,C.deep,C.deep); txt(s,h,cx+0.05,y+0.075,widths[i]-0.1,0.13,{size:7.6,bold:true,color:C.white,align:i===0?'left':'center'}); cx+=widths[i]+0.01; });
  rows.forEach((r,ri)=>{ cx=x; const yy=y+rowH+ri*rowH; r.forEach((v,i)=>{ card(s,cx,yy,widths[i],rowH,ri%2?'F8FAFC':C.white,C.line); txt(s,String(v),cx+0.05,yy+0.07,widths[i]-0.1,0.14,{size:7.35,color:C.text,align:i===1?'center':'left'}); cx+=widths[i]+0.01; }); });
}

const names=[];
function add(tag, slideTitle, sub, build) { const s=pptx.addSlide(); bg(s,tag); title(s,slideTitle,sub); names.push(slideTitle); build(s,names.length); footer(s,names.length); }

add('TRACK B Intelligence','Track B — Legal & Ecosystem Agents Deep Technical View','B = implemented legal intelligence | A3 = Ecosystem Intelligence Agent',(s)=>{
  card(s,0.9,2.0,3.35,2.15,C.white,C.blue); smallTitle(s,'Track B — Legal Intelligence',1.22,2.3,2.3,C.navy); bullet(s,['Strategic legal advisor implemented','Intelligent document agent implemented','Knowledge base grounded on Tunisian legal data','A3 Ecosystem Intelligence Agent'],1.22,2.7,2.5,0.85,{size:8.8}); txt(s,'Status: implemented in code',1.22,3.78,2.2,0.18,{size:8.6,bold:true,color:C.blue});
  arrow(s,4.62,2.72,1.2,0.58,C.blue);
  card(s,6.0,2.0,3.35,2.15,C.white,C.deep); smallTitle(s,'Ecosystem Intelligence — Ecosystem Intelligence',6.32,2.3,2.4,C.navy); bullet(s,['Predictive investor/mentor matching','Strategic event ranking','Ecosystem graph reasoning','Relationship health + auto DB update'],6.32,2.7,2.5,0.85,{size:8.8}); txt(s,'Status: proposed extension / prototype design',6.32,3.78,2.6,0.18,{size:8.4,bold:true,color:C.deep});
  card(s,9.85,2.0,2.3,2.15,C.white,C.line); smallTitle(s,'Defense rule',10.12,2.3,1.4,C.navy); txt(s,'Do not present Ecosystem Intelligence as fully delivered unless you show its code. Present it as Ecosystem Intelligence, with clear data model and algorithms.',10.12,2.75,1.65,0.72,{size:8.6,color:C.text});
  card(s,1.45,5.15,9.95,0.62,'D9EEF7',C.blue); txt(s,'Narrative: Track B makes the startup legally ready. Ecosystem Intelligence uses that clean legal profile to connect the founder to the right investors, mentors and events.',1.75,5.36,9.35,0.16,{size:9.7,bold:true,color:C.navy,align:'center'});
});

add('TRACK B','Track B — Implemented Scope','Legal structuring, document intelligence, Startup Label readiness and ecosystem evidence',(s)=>{
  snip(s,1.0,2.0,3.25,1.0,C.white,C.blue); smallTitle(s,'A1 Strategic Legal Agent',1.35,2.25,2.2,C.navy); txt(s,'Recommends legal form, Startup Act score, required documents, administrative checklist.',1.35,2.62,2.25,0.28,{size:8.4,color:C.muted});
  snip(s,5.05,2.0,3.25,1.0,C.white,C.deep); smallTitle(s,'A2 Intelligent Document Agent',5.35,2.25,2.4,C.navy); txt(s,'Parses files, detects type, validates signatures/stamps, scores completeness and risk.',5.35,2.62,2.25,0.28,{size:8.4,color:C.muted});
  snip(s,9.1,2.0,3.25,1.0,C.white,C.blue); smallTitle(s,'A3 Ecosystem Intelligence Agent',9.42,2.25,2.2,C.navy); txt(s,'Google, LinkedIn, Facebook and events search for credibility and networking evidence.',9.42,2.62,2.25,0.28,{size:8.4,color:C.muted});
  table(s,['Agent','Inputs','Processing','Outputs'],[
    ['A1 Legal','startup profile, founders, funding need','legal form rules, Startup Act scoring, admin workflow reasoning','SARL/SUARL/SA recommendation, score, checklist'],
    ['A2 Documents','uploaded legal documents','OCR/parser extraction, type detection, signature/stamp checks, strict validation','completeness score, missing docs, risk level, remediation'],
    ['A3 Ecosystem','startup name, sector, networking goal','public search, identity filtering, credibility and opportunity ranking','Google/LinkedIn/Facebook/event evidence, outreach priorities'],
  ],1.0,3.75,[1.35,2.8,3.45,3.45],0.47);
  card(s,1.15,5.75,10.85,0.48,'D9EEF7',C.blue);
  txt(s,'The three agents work as one decision package: legal structure + document compliance + ecosystem evidence for advisor and investor readiness.',1.45,5.91,10.25,0.12,{size:8.4,bold:true,color:C.navy,align:'center'});
});

add('TRACK B\\nLLM','LLM Runtime Layer','Local model integration for reasoning, JSON extraction and fallback-safe agent decisions',(s)=>{
  card(s,0.9,1.7,3.2,2.2,C.white,C.blue); smallTitle(s,'Model runtime',1.18,1.98,1.5,C.navy); bullet(s,['Local LLM endpoint: Ollama-compatible API','Base URL: http://127.0.0.1:11434','Default model: deepseek-r1:7b','Timeout controlled by LLM_TIMEOUT_SECONDS','Cached singleton client for reuse'],1.18,2.35,2.3,0.9,{size:8.55});
  arrow(s,4.35,2.45,0.85,0.42,C.blue);
  card(s,5.35,1.7,3.05,2.2,C.white,C.deep); smallTitle(s,'Request contract',5.62,1.98,1.6,C.navy); txt(s,'{\\n  model: \"deepseek-r1:7b\",\\n  prompt: agent_prompt,\\n  system: role_instructions,\\n  stream: false\\n}',5.7,2.38,2.05,0.92,{size:8.3,color:C.navy,fontFace:'Consolas'});
  arrow(s,8.65,2.45,0.85,0.42,C.deep);
  card(s,9.65,1.7,2.7,2.2,C.white,C.blue); smallTitle(s,'Response handling',9.92,1.98,1.8,C.navy); bullet(s,['complete(): raw reasoning text','complete_json(): extracts JSON object','regex fallback for JSON inside text','safe fallback object if parsing/model fails','prevents pipeline crash'],9.92,2.35,1.85,0.9,{size:8.1});
  table(s,['Where LLM helps','Used for','Fallback behavior'],[
    ['A1 Strategic Legal','rationale, Startup Label/pitch reasoning','heuristics still return result'],
    ['A2 Documents','diagnostics, Q&A, remediation wording','rule checks still score files'],
    ['A3 Ecosystem','opportunity ranking and summary text','search results still displayed'],
  ],1.1,4.6,[2.45,4.2,4.0],0.36);
  card(s,1.3,6.1,10.4,0.42,'D9EEF7',C.blue); txt(s,'Technical defense: LLM is not the only decision engine. Legal rules, document checks and fallback JSON keep the system deterministic enough for a demo.',1.6,6.25,9.8,0.1,{size:8.0,bold:true,color:C.navy,align:'center'});
});

add('TRACK B\\nA2A','A2A Bus — Agent-to-Agent Communication','Lightweight message bus used by the orchestrator to call registered agents and pass context explicitly',(s)=>{
  node(s,'TrackBOrchestrator\\ncontrols workflow order',0.9,2.15,1.9,0.72,{fill:'DDF0FB',size:8.0});
  arrow(s,3.0,2.3,0.72,0.36,C.blue);
  node(s,'A2ABus\\nregister(agent, handler)\\nsend(message)',3.9,2.05,1.85,0.92,{fill:C.white,size:8.1});
  arrow(s,5.95,2.3,0.72,0.36,C.deep);
  node(s,'A1 StrategicLegalAgent\\naction: strategic_assessment',6.85,1.75,2.0,0.72,{fill:C.yellow,size:7.8});
  node(s,'A2 IntelligentDocumentAgent\\naction: document_intelligence',6.85,2.95,2.0,0.72,{fill:C.green,size:7.8});
  arrow(s,9.05,2.32,0.72,0.36,C.blue);
  node(s,'final_output\\nPASS/WARNING/FAIL\\nreports + MCP context',9.95,2.1,2.1,0.86,{fill:C.red,size:7.7});
  table(s,['A2A message field','Meaning','Example'],[
    ['sender','component sending request','orchestrator'],
    ['receiver','registered agent name','A1_StrategicLegalAgent'],
    ['action','semantic operation requested','strategic_assessment'],
    ['payload','domain object or documents','startup_profile / documents[]'],
    ['kwargs','extra context injected','kb, strict_mode, legal_context'],
  ],1.05,4.15,[2.0,3.35,4.95],0.34);
  txt(s,'Why it matters: A2A makes the pipeline modular. Agents can be replaced or extended without rewriting the whole API bridge.',1.2,6.18,10.4,0.16,{size:8.9,bold:true,color:C.deep,align:'center'});
});

add('TRACK B\\nMCP','MCP Context & Tool Layer','Structured shared context + local JSON-RPC style tools for external integration and repeatable agent calls',(s)=>{
  card(s,0.75,1.62,3.55,3.5,C.white,C.blue); smallTitle(s,'MCP Context Manager',1.05,1.9,2.0,C.navy); bullet(s,['startup_info and sector','recommended_legal_form','founders_structure and funding_needs','startup_act_score','uploaded_documents and OCR previews','document_validation_results','missing_documents and workflow_steps','final_report'],1.05,2.28,2.55,1.4,{size:8.15});
  card(s,4.85,1.62,3.55,3.5,C.white,C.deep); smallTitle(s,'MCP-like local server',5.15,1.9,2.0,C.navy); bullet(s,['stdio JSON line protocol','input: { tool, arguments }','output: { ok, result } or { ok:false, error }','keeps Track B callable outside UI','compatible with tool-style orchestration'],5.15,2.28,2.55,1.15,{size:8.15});
  card(s,8.95,1.62,3.4,3.5,C.white,C.blue); smallTitle(s,'Exposed tools',9.25,1.9,1.45,C.navy); bullet(s,['health','run_track_b','strategic_assessment','document_intelligence','classify_legal_structure alias','verify_documents alias','manage_documents alias'],9.25,2.28,2.35,1.15,{size:8.15});
  node(s,'A1 result\\nlegal form + score',1.05,5.55,1.65,0.52,{fill:C.yellow,size:7.7}); arrow(s,2.85,5.64,0.55,0.28,C.blue); node(s,'MCP context\\nshared memory object',3.55,5.45,2.0,0.72,{fill:'D9EEF7',size:7.8}); arrow(s,5.72,5.64,0.55,0.28,C.deep); node(s,'A2 result\\ndocument validation',6.42,5.55,1.75,0.52,{fill:C.green,size:7.7}); arrow(s,8.35,5.64,0.55,0.28,C.blue); node(s,'final report\\nexportable context',9.05,5.45,2.0,0.72,{fill:C.red,size:7.8});
  txt(s,'Defense sentence: MCP is used here as a structured context and tool interface, not as decoration; it serializes the shared state needed by agents and external callers.',1.05,6.48,10.9,0.14,{size:8.0,bold:true,color:C.deep,align:'center'});
});

add('TRACK B','Knowledge Base — Legal Grounding','Curated Tunisian legal knowledge used to reduce hallucination and structure decisions',(s)=>{
  card(s,0.9,1.75,5.55,3.65,C.white,C.blue); smallTitle(s,'kb_master.json structure',1.15,2.05,2.3,C.blue); txt(s,'{\n  "documents": [types, required fields, icons],\n  "rules": [legal forms, founders, capital],\n  "workflows": [7-step admin checklist],\n  "fees": [RNE, IF, bank, notaire],\n  "deadlines": [days/week per step],\n  "authorities": [DGI, RNE, ministeres],\n  "relations": [doc -> rule -> workflow]\n}',1.25,2.38,4.65,1.85,{size:8.8,color:C.navy,fontFace:'Consolas'});
  card(s,1.15,4.65,4.8,0.58,C.green,'8CCB95'); txt(s,'50 synthetic documents + realistic templates for evaluation and demo',1.35,4.87,4.25,0.13,{size:8.4,bold:true,color:C.navy,align:'center'});
  card(s,7.0,1.75,4.85,3.65,C.deep,C.deep); bullet(s,['Tunisian Code des Societes Commerciales and Startup Act references','Domain knowledge curated from RNE, DGI and ministry sources','Synthetic legal documents auto-generated with realistic templates','Cross references between rules, workflows and document types','Used by agents to ground recommendations and checklists'],7.35,2.15,3.85,1.8,{size:10.1,color:C.white});
  txt(s,'Good defense sentence: the KB is not a vector buzzword here; it is a structured rule base that maps legal forms, required files, authorities, fees and workflow steps.',1.05,6.0,10.9,0.2,{size:9.3,bold:true,color:C.deep,align:'center'});
});

add('TRACK B\nAGENT 1','A1 Architecture — Strategic Legal Advisor','From startup profile to legal form, Startup Act score and 7-step administrative plan',(s)=>{
  card(s,0.9,1.78,3.25,1.0,C.white,C.line); smallTitle(s,'Main functionalities',1.15,2.04,1.7,C.navy); bullet(s,['Legal form recommendation: SARL / SUARL / SA','Startup Act eligibility score: 0-100','Admin checklist: institutions, fees, deadlines','KB-grounded reasoning and rationale'],1.15,2.35,2.25,0.42,{size:8.3});
  node(s,'Startup profile\nsector, founders, funding, investors',0.85,3.55,1.72,0.75,{fill:'DDF0FB'}); arrow(s,2.72,3.72,0.55,0.35,C.blue);
  node(s,'StrategicLegalAgent\norchestrated by TrackBOrchestrator',3.42,3.55,1.8,0.75,{fill:'DDF0FB'});
  arrow(s,5.38,3.35,0.6,0.35,C.blue); arrow(s,5.38,4.08,0.6,0.35,C.blue);
  node(s,'Legal form\nrecommender',6.1,3.0,1.45,0.62,{fill:C.yellow}); node(s,'Startup Act\nscorer',6.1,4.05,1.45,0.62,{fill:C.green});
  arrow(s,7.72,3.55,0.65,0.35,C.blue);
  node(s,'Knowledge Base\nrules, workflow, fees, authorities',8.55,3.42,1.98,0.86,{fill:'E7D8F7'});
  arrow(s,10.72,3.62,0.55,0.35,C.blue);
  node(s,'Strategic recommendation\n+ admin checklist',11.25,3.42,1.45,0.86,{fill:C.red,size:7.9});
  card(s,3.1,5.65,7.2,0.55,'6FB0E8','6FB0E8'); txt(s,'Output example: SARL recommended | Startup Act score 78/100 | Estimated 21 days | Required documents listed',3.35,5.87,6.7,0.13,{size:8.2,bold:true,color:C.navy,align:'center'});
});

add('TRACK B\nAGENT 2','A2 Architecture — Intelligent Document Agent','Document upload, OCR/parser fallback, type detection, verification, scoring and remediation',(s)=>{
  card(s,0.9,2.25,2.35,1.75,C.white,C.line); smallTitle(s,'Main sub-tasks',1.15,2.5,1.5,C.navy); bullet(s,['OCR text extraction','PDF/DOCX/PPTX parsing','Document type detection','Signature/stamp checks','Cross-document validation','PASS / WARNING / FAIL'],1.15,2.88,1.55,0.72,{size:8.5});
  const xs=[4.0,5.65,7.25,8.9,10.55]; const labels=['Document\nupload','Text extraction\nOCR/parser','Type detection\n+ diagnostics','Visual / rule\nverification','Compliance\nscorer']; const fills=['DDF0FB',C.yellow,C.green,'E7D8F7',C.lavender];
  xs.forEach((x,i)=>{ node(s,labels[i],x,2.15,1.15,0.78,{fill:fills[i],size:7.8}); if(i<xs.length-1) arrow(s,x+1.22,2.35,0.45,0.28,C.blue); });
  downArrow(s,11.0,3.1,0.24,0.55,C.blue);
  card(s,4.0,4.45,7.85,1.0,'6BB7EA','6BB7EA'); smallTitle(s,'Compliance Report',6.6,4.7,1.4,C.deep); txt(s,'PASS / WARNING / FAIL + completeness score + missing documents + risk score + remediation actions',4.62,5.08,6.6,0.14,{size:8.2,color:C.navy,align:'center'});
  table(s,['Output field','Meaning'],[
    ['overall_completeness_score','global file readiness from 0 to 100'],
    ['missing_documents','required legal files not uploaded'],
    ['cross_document_validations','consistency checks across files'],
    ['strict_fail / strict_violations','blocking issues in strict mode'],
  ],1.0,5.65,[2.55,7.4],0.29);
});

add('Ecosystem Intelligence','A3 Ecosystem Intelligence Agent','From legal readiness to strategic networking, investors, mentors and events',(s)=>{
  txt(s,'From legal compliance -> ecosystem growth, investors, mentors and strategic events.',3.2,1.75,6.9,0.22,{size:9.3,italic:true,bold:true,color:C.muted,align:'center'});
  const items=[['D1','Predictive Matching','Mentor/investor matching with fit probability and explainable scoring.',C.cyan],['D2','Strategic Event Intelligence','Event ranking by ROI, startup stage, sector and target presence.','6FC4ED'],['E3','Ecosystem Graph','Network position analysis: centrality, bridges, shortest path, warm intros.',C.green],['E4','Relationship Health','Follow-up timing, decay risk, engagement quality and CRM auto-update.',C.pink]];
  items.forEach((it,idx)=>{ const x=idx%2?7.0:1.1; const y=idx<2?2.55:4.3; card(s,x,y,4.9,0.98,it[3],it[3]); badge(s,it[0],x+0.25,y+0.2,C.deep); smallTitle(s,it[1],x+1.35,y+0.28,2.7,C.deep); txt(s,it[2],x+1.35,y+0.62,3.0,0.16,{size:7.9,color:C.muted}); });
  card(s,2.1,6.08,8.9,0.5,C.white,C.blue); txt(s,'Position it honestly: A3 Ecosystem Intelligence is the networking and ecosystem agent that extends Track B research results into real ecosystem intelligence.',2.35,6.25,8.35,0.13,{size:8.9,bold:true,color:C.navy,align:'center'});
});

add('Ecosystem Intelligence\nE1/E2','E1 + E2 Architecture — Matching and Event Intelligence','Predict who can help the startup and which ecosystem events deserve attention',(s)=>{
  card(s,0.9,1.85,5.55,3.45,C.white,C.deep); card(s,0.9,1.85,5.55,0.62,C.cyan,C.cyan); smallTitle(s,'E1 — Predictive Matching',2.6,2.08,2.0,C.deep); txt(s,'Predict probability of successful collaboration',2.55,2.72,2.1,0.14,{size:8.1,italic:true,color:C.muted,align:'center'}); bullet(s,['Sector alignment analysis','Stage compatibility: seed / Series A / idea','Funding size vs investor ticket comparison','Skill complementarity scoring','Historical pattern weighting','ML probability prediction + explainability'],1.35,3.15,3.75,0.88,{size:8.2}); txt(s,'Output: Investor A -> 64% funding probability + reason codes',1.35,4.65,3.9,0.16,{size:8.3,bold:true,color:C.deep});
  card(s,6.9,1.85,5.55,3.45,C.white,C.deep); card(s,6.9,1.85,5.55,0.62,C.yellow,C.yellow); smallTitle(s,'E2 — Strategic Event Intelligence',8.38,2.08,2.55,C.deep); txt(s,'Select events with highest strategic ROI',8.65,2.72,2.0,0.14,{size:8.1,italic:true,color:C.muted,align:'center'}); bullet(s,['Filtering by sector and startup stage','Investor / mentor presence scoring','Networking exposure estimation','Deadline and location feasibility','Impact score generation','Relevance ranking with explanation'],7.35,3.15,3.75,0.88,{size:8.2}); txt(s,'Output: Event X -> high exposure to 8 target investors',7.35,4.65,3.9,0.16,{size:8.3,bold:true,color:C.deep});
  table(s,['Shared input','Feature engineering','Model / score','Returned object'],[
    ['startup profile','sector, stage, needs','weighted score / ML','ranked matches'],
    ['Track B readiness','legal status, blockers','eligibility filter','safe outreach list'],
    ['ecosystem sources','LinkedIn/events/web','presence score','event recommendation'],
  ],1.4,5.75,[2.0,3.1,2.2,2.7],0.28);
});

add('Ecosystem Intelligence\nE3','E3 Ecosystem Graph — Network Reasoning','Graph algorithms for centrality, warm introductions, bridge detection and opportunity discovery',(s)=>{
  const top=[['Centrality','PageRank, Betweenness',C.cyan],['Shortest Path','BFS / Dijkstra',C.green],['Bridge Detection','Community algorithms',C.pink]];
  top.forEach((it,i)=>{ card(s,1.15+i*4.0,1.85,3.25,0.72,it[2],it[2]); smallTitle(s,it[0],1.55+i*4.0,2.08,1.7,C.deep); txt(s,it[1],1.45+i*4.0,2.43,2.1,0.12,{size:7.8,italic:true,color:C.deep,align:'center'}); });
  const pts=[[2.0,4.9],[2.7,3.95],[3.4,4.7],[4.1,3.55],[5.0,4.35],[5.8,3.7],[6.6,4.35],[7.2,3.65],[8.1,4.55],[8.8,3.75],[9.5,4.45],[10.2,3.55]];
  const edges=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[3,6],[5,7],[1,4],[8,11]];
  edges.forEach(([a,b])=>{ const p=pts[a], q=pts[b]; s.addShape(pptx.ShapeType.line,{x:p[0],y:p[1],w:q[0]-p[0],h:q[1]-p[1],line:{color:C.blue,width:0.7,transparency:25}}); });
  pts.forEach((p,i)=>{ const high=[3,7].includes(i); s.addShape(pptx.ShapeType.ellipse,{x:p[0]-0.08,y:p[1]-0.08,w:0.16,h:0.16,fill:{color:high?C.deep:'BDE0F2'},line:{color:C.deep,width:0.8}}); if(high) txt(s,'*',p[0]-0.03,p[1]-0.03,0.06,0.06,{size:7,bold:true,color:C.white,align:'center'}); });
  txt(s,'Regular contact',2.35,5.48,1.05,0.12,{size:6.8,color:C.muted}); txt(s,'High-leverage bridge node',4.1,5.48,1.6,0.12,{size:6.8,color:C.muted});
  card(s,3.05,5.83,7.4,0.35,C.deep,C.deep); txt(s,'Example insight: Connecting with Mentor Y unlocks 12 investors within 2 hops',3.35,5.96,6.8,0.09,{size:7.8,bold:true,color:C.white,align:'center'});
  card(s,1.0,6.38,10.9,0.36,C.white,C.blue); txt(s,'Data model: nodes = founders, investors, mentors, events, accelerators. Edges = meetings, intros, co-attendance, sector relation, past funding.',1.25,6.5,10.3,0.1,{size:7.6,bold:true,color:C.navy,align:'center'});
});

add('Ecosystem Intelligence\nE4','E4 Relationship Health & Auto-DB','Relationship timing, decay risk, personalized follow-up and automatic ecosystem database refresh',(s)=>{
  card(s,0.85,1.78,5.55,3.45,C.white,C.deep); card(s,0.85,1.78,5.55,0.62,C.cyan,C.cyan); smallTitle(s,'E4 — Relationship Health & Timing',2.35,2.03,2.7,C.deep); txt(s,'Predict relationship strength + optimal follow-up timing',2.2,2.7,2.6,0.13,{size:7.9,italic:true,color:C.muted,align:'center'}); bullet(s,['Interaction frequency analysis','Response delay measurement','Engagement trend detection','Decay probability with exponential model','Optimal contact window prediction','Personalized message generation'],1.35,3.13,3.9,0.82,{size:8.35}); txt(s,'Output: high decay risk in 10 days -> contact this week',1.35,4.65,3.8,0.16,{size:8.3,bold:true,color:C.deep});
  card(s,6.75,1.78,5.55,3.45,C.white,C.deep); card(s,6.75,1.78,5.55,0.62,C.red,C.red); smallTitle(s,'Search Agent + Auto DB Update',8.35,2.03,2.4,C.deep); txt(s,'Web crawling -> entity resolution -> CRUD database',8.05,2.7,2.8,0.13,{size:7.9,italic:true,color:C.muted,align:'center'});
  node(s,'Trigger\nscheduled / on-demand',7.45,3.1,4.0,0.34,{fill:'BDE0F2',size:7.4}); downArrow(s,9.25,3.48,0.32,0.32,'9CC6E7');
  node(s,'Google',7.25,3.9,1.25,0.35,{fill:C.green,size:7}); node(s,'LinkedIn',8.95,3.9,1.25,0.35,{fill:C.cyan,size:7}); node(s,'Facebook',10.65,3.9,1.25,0.35,{fill:C.red,size:7});
  downArrow(s,9.25,4.3,0.32,0.32,'9CC6E7'); node(s,'Entity Resolver\ndeduplicate + normalize',8.35,4.68,2.15,0.42,{fill:'98C4F7',size:7}); downArrow(s,9.25,5.15,0.32,0.32,'9CC6E7'); node(s,'DB Manager\nCRUD + versioning',8.45,5.48,1.95,0.42,{fill:'BDE0F2',size:7});
  card(s,1.1,6.2,10.7,0.4,C.white,C.blue); txt(s,'Recommended tech stack: PostgreSQL + pgvector for entities, NetworkX for graph analytics, scikit-learn/XGBoost for scoring, Selenium/BeautifulSoup for controlled crawling.',1.35,6.33,10.2,0.1,{size:7.55,bold:true,color:C.navy,align:'center'});
});

add('TRACK B','Evaluation & Technologies','Scientific evaluation and technical stack across legal, document and ecosystem agents',(s)=>{
  card(s,0.85,1.55,5.2,2.05,C.white,C.line); smallTitle(s,'Evaluation protocol',1.15,1.85,2.0,C.navy); bullet(s,['Synthetic legal document set for controlled tests','Strict-mode execution on sample startup dossiers','Manual inspection of PASS / WARNING / FAIL decisions','Cross-check expected missing documents vs returned result','Professor demo: run sample, inspect JSON, verify dashboard'],1.15,2.22,3.75,0.85,{size:8.3});
  card(s,6.65,1.55,5.25,2.05,C.white,C.line); smallTitle(s,'Core evaluation metrics',6.95,1.85,2.1,C.navy); bullet(s,['Document completeness score: 0-100','Global risk score: 0-100','Startup Act eligibility score: 0-100','Strict violations count','Search evidence quality: direct, matched, relevant links'],6.95,2.22,3.7,0.85,{size:8.3});
  table(s,['Layer','Technology / model','Validation focus'],[
    ['LLM reasoning','Ollama-compatible API + deepseek-r1:7b','structured reasoning, JSON fallback, timeout behavior'],
    ['A2A orchestration','A2ABus + A2AMessage','agent registration, sender/receiver/action/payload flow'],
    ['MCP context','MCPContextManager + JSON-RPC tools','shared state serialization and tool-based calls'],
    ['Document parsing','pytesseract, pypdf, python-docx, python-pptx','text extraction and document type handling'],
    ['Computer vision','OpenCV HSV checks + visual heuristics','signature/stamp/quality signals'],
    ['Reporting','ReportLab + JSON export','client-ready proof artifacts'],
  ],0.9,4.05,[1.75,4.2,4.95],0.32);
  card(s,1.4,6.25,10.0,0.42,'D9EEF7',C.blue); txt(s,'Validation statement: the system is evaluated as an agentic legal pipeline, not only as a UI: models, A2A messages, MCP context, document scores and final reports are all inspectable.',1.7,6.39,9.45,0.1,{size:7.9,bold:true,color:C.navy,align:'center'});
});

async function writePreview(i) {
  const title = names[i].replace(/&/g,'&amp;');
  const svg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="#EEF1F5"/><polygon points="0,1080 1920,120 1920,1080" fill="#F8F8F8"/><polygon points="0,875 195,1080 0,1080" fill="#233E68"/><polygon points="1720,0 1920,0 1920,180" fill="#233E68"/>
  <rect x="34" y="38" width="285" height="84" rx="16" fill="#233E68"/><text x="177" y="91" text-anchor="middle" font-family="Aptos Display,Arial" font-size="34" font-style="italic" font-weight="700" fill="#FFFFFF">TRACK B Intelligence</text>
  <text x="960" y="150" text-anchor="middle" font-family="Aptos Display,Arial" font-size="45" font-weight="700" fill="#0A0F55">${title}</text>
  <text x="960" y="210" text-anchor="middle" font-family="Aptos,Arial" font-size="25" font-weight="700" fill="#3890BC">Redesigned technical slides for Track B and a stronger A3 Ecosystem Intelligence Agent.</text>
  <rect x="145" y="330" width="520" height="245" rx="8" fill="#FFFFFF" stroke="#3890BC" stroke-width="3"/><text x="190" y="405" font-family="Aptos,Arial" font-size="30" font-weight="700" fill="#111827">Slide ${String(i+1).padStart(2,'0')}</text><text x="190" y="460" font-family="Aptos,Arial" font-size="23" fill="#40444A">Content corrected and defendable.</text>
  <path d="M720 390 C835 300 1000 335 1030 510 L1030 720 L915 720 L915 555 C900 465 790 475 735 545 Z" fill="#3890BC"/><path d="M960 545 L1215 545 L1215 455 L1400 610 L1215 765 L1215 675 L960 675 Z" fill="#233E68"/>
  <rect x="1325" y="330" width="455" height="245" rx="8" fill="#FFFFFF"/><text x="1370" y="405" font-family="Aptos,Arial" font-size="27" font-weight="700" fill="#111827">PPTX editable</text><text x="1370" y="460" font-family="Aptos,Arial" font-size="22" fill="#40444A">Tables, pipelines, algorithms.</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(PREV, `slide-${String(i+1).padStart(2,'0')}.png`));
}

(async()=>{
  const pptxPath = path.join(OUT, 'track_b_agents_a3_full_technical.pptx');
  await pptx.writeFile({ fileName: pptxPath });
  for(let i=0;i<names.length;i++) await writePreview(i);
  const bufs = await Promise.all(names.map((_,i)=>sharp(path.join(PREV,`slide-${String(i+1).padStart(2,'0')}.png`)).resize(426,240).toBuffer()));
  await sharp({create:{width:426*5,height:240*2,channels:4,background:'#EEF1F5'}}).composite(bufs.map((input,i)=>({input,left:(i%5)*426,top:Math.floor(i/5)*240}))).png().toFile(path.join(PREV,'contact-sheet.png'));
  console.log(JSON.stringify({pptxPath, previewDir:PREV, slides:names.length}, null, 2));
})();
