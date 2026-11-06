// One presentation-state controller. Every HP/rank/reward below is an authored
// design fixture. There is no combat, Director, wallet transaction, save or SDK.
(async()=>{'use strict';
 const query=new URLSearchParams(location.search),reviewMode=query.get('review')==='1'||query.get('hold')==='1';
 const [data,operationData]=await Promise.all([fetch('../product/ui-data.json').then(r=>r.json()),fetch('operation-fixtures.json').then(r=>r.json())]);
 const layer=document.querySelector('#screen-layer'),world=new DesignWorld(document.querySelector('#world'));
 const copy=v=>JSON.parse(JSON.stringify(v));
 const fresh=()=>({screen:'camp',scenario:'tutorial',selected:null,tab:'skills',stageId:'ST01',routeId:'R02',returnTo:'camp',modal:null,muted:true,reduced:false,battle:{hp:100,maxHp:100,level:1,xp:0,xpNext:10,clock:'00:00',wave:'1 / 10',skills:['SK01','SK08'],ranks:{SK01:1,SK08:1},awakening:[]},fixture:{wallet:{coins:0,ingots:0,gems:0,essence:0,fruits:0},growthLevels:{UP01:0,UP02:0,UP05:0},companionLevels:{CO01:0,CO02:0},companionXp:{CO01:0,CO02:0},companionXpRequired:{CO01:null,CO02:null},companionsOwned:[],equippedCompanionIds:[],offline:{earnedAllowanceTotal:0,pendingEssence:0,claimableEssence:0,releasedAllowanceTotal:0,claimedReceiptIds:[]},unlockedStageIds:['ST01'],clearedStageIds:[],gearOwned:[],gearEquipped:{},achievements:[],noCurrentRun:true,insufficient:true,freeReviveUsed:false,readOnly:false},notice:''});
 // These complete before/after profiles are NOT computed from a live account.
 const results={
  firstVictory:{outcome:'victory',firstClear:true,defeated:286,time:'07:34',base:{coins:120,ingots:10,gems:1,essence:120,fruits:2},firstExtra:{coins:60,ingots:10,gems:1,essence:60,fruits:2},achievementExtra:{coins:80,ingots:4,gems:0,essence:90,fruits:2},total:{coins:260,ingots:24,gems:2,essence:270,fruits:6},postWallet:{coins:260,ingots:24,gems:2,essence:270,fruits:6},postAchievements:['AC01','AC02','AC04','AC08'],postCleared:['ST01'],postUnlocked:['ST01','ST02'],label:'新手首通固定情景；功绩为初试锋芒、百敌退散、一卷告成、初次觉醒；当前替换样本不假授六器成阵'},
  repeatVictory:{outcome:'victory',firstClear:false,defeated:286,time:'07:34',base:{coins:120,ingots:10,gems:1,essence:120,fruits:2},firstExtra:{coins:0,ingots:0,gems:0,essence:0,fruits:0},achievementExtra:{coins:0,ingots:0,gems:0,essence:0,fruits:0},total:{coins:120,ingots:10,gems:1,essence:120,fruits:2},postWallet:{coins:380,ingots:34,gems:3,essence:390,fruits:8},postAchievements:['AC01','AC02','AC04','AC08'],postCleared:['ST01'],postUnlocked:['ST01','ST02'],label:'已有首通档的重复胜利固定情景；不再发首通或已得功绩'},
  firstDefeat:{outcome:'defeat',firstClear:false,defeated:64,time:'04:02',base:{coins:12,ingots:1,gems:0,essence:12,fruits:0},firstExtra:{coins:0,ingots:0,gems:0,essence:0,fruits:0},achievementExtra:{coins:30,ingots:0,gems:0,essence:10,fruits:0},total:{coins:42,ingots:1,gems:0,essence:22,fruits:0},postWallet:{coins:42,ingots:1,gems:0,essence:22,fruits:0},postAchievements:['AC01'],postCleared:[],postUnlocked:['ST01'],label:'新手有效失败固定情景：K64/T242/B1/Q0/quota500；基础12钱1元宝12息，另列首次有效挑战功绩'},
  returningDefeat:{outcome:'defeat',firstClear:false,defeated:64,time:'04:02',base:{coins:12,ingots:1,gems:0,essence:12,fruits:0},firstExtra:{coins:0,ingots:0,gems:0,essence:0,fruits:0},achievementExtra:{coins:0,ingots:0,gems:0,essence:0,fruits:0},total:{coins:12,ingots:1,gems:0,essence:12,fruits:0},postWallet:{coins:272,ingots:25,gems:2,essence:282,fruits:6},postAchievements:['AC01','AC02','AC04','AC08'],postCleared:['ST01'],postUnlocked:['ST01','ST02'],label:'已有首通档的有效失败固定情景：K64/T242/B1/Q0；无首通、无重复功绩'}
 };
 const screenNames={camp:'营地',stages:'选卷',prepare:'出战准备',battle:'山道演出',choice:'三选一',gearReward:'装备遗箱',awakening:'突破觉醒',pause:'暂停',settings:'设置',down:'倒地与复起',result:'胜败结算',growth:'局外修行',gear:'器物',companions:'伙伴',codex:'图鉴',achievements:'功绩',help:'须知'};
 let beatJob=null,playbackEpoch=0;
 let s=fresh(),beat=0,history=[],pausedContext=null,revived=false,rootSeq=0,sceneEpoch=0,pickup=null,pendingCamp=null,runProfile='new';
 const events=[];
 const note=(type,detail={})=>events.push({seq:++rootSeq,type,...detail,scope:'design-fixture-not-gameplay'});
 const route=()=>data.routes.find(r=>r.id===s.routeId)||data.routes[1];
 const skill=id=>data.skills.find(v=>v.id===id);
 const awFor=id=>data.awakenings.find(v=>v.skillId===id);
 const context=()=>copy({screen:s.screen,scenario:s.scenario,selected:s.selected,tab:s.tab,modal:s.modal,notice:s.notice,detailId:s.detailId,returnTo:s.returnTo});
 function toast(text){const el=document.querySelector('#live-note');el.textContent=text;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.textContent='',3200);}
 function suspendPickup(reason){if(!pickup||pickup.timer===null)return;clearTimeout(pickup.timer);pickup.remaining=Math.max(0,pickup.remaining-(performance.now()-pickup.started));pickup.timer=null;note('pickup-presentation-suspended',{reason,remainingMs:pickup.remaining});}
 function cancelPickup(reason){if(pickup){clearTimeout(pickup.timer);note('pickup-presentation-cancelled',{reason});}pickup=null;sceneEpoch++;}
 function syncPickup(){
  if(!pickup)return;
  if(s.screen!=='battle'||s.modal||pausedContext){suspendPickup('covered-or-paused');return;}
  if(pickup.timer!==null)return;
  const job=pickup;job.started=performance.now();
  job.timer=setTimeout(()=>{job.timer=null;if(pickup!==job||job.epoch!==sceneEpoch)return;if(s.screen!=='battle'||s.modal||pausedContext){job.remaining=0;return;}pickup=null;world.cue('xp-pickup');note('authored-pickup-presentation-finished');showLevelChoice();},job.remaining);
 }
 // A shortened presentation sequence, not a wave director or game timer.
 // Its only result is moving between authored drawings and UI fixtures.
 function stopPlayback(reason){if(beatJob?.timer)clearTimeout(beatJob.timer);beatJob=null;playbackEpoch++;}
 function suspendPlayback(){if(!beatJob||beatJob.timer===null)return;clearTimeout(beatJob.timer);beatJob.remaining=Math.max(0,beatJob.remaining-(performance.now()-beatJob.started));beatJob.timer=null;}
 function syncPlayback(){
  if(reviewMode)return;
  const durations={tutorial:6500,encounter:4200,loot:1800,ranged:6000,special:6000,boss:6000},duration=durations[s.scenario];
  if(s.screen!=='battle'||s.modal||pausedContext||!world.ready){suspendPlayback();return;}
  if(!duration){stopPlayback('non-scripted-state');return;}
  const key=beat+':'+s.scenario;
  if(beatJob&&beatJob.key!==key)stopPlayback('new-authored-beat');
  if(!beatJob)beatJob={key,mode:s.scenario,epoch:playbackEpoch,remaining:duration,timer:null,started:0};
  if(beatJob.timer!==null)return;
  const job=beatJob;job.started=performance.now();job.timer=setTimeout(()=>{
   job.timer=null;if(beatJob!==job||job.epoch!==playbackEpoch)return;
   if(s.screen!=='battle'||s.modal||pausedContext){job.remaining=0;return;}
   beatJob=null;note('authored-presentation-cut',{from:s.scenario,scope:'fixed-shortened-design-sequence-no-gameplay'});next();
  },job.remaining);
 }
 function draw(){
  const hints={tutorial:'按住拖动走位，松手停步向近敌横扫。',encounter:'短步横移，留意翼蝠从哪一侧靠近。',loot:'经验光点已落地，收起之后再择一项强化。',ranged:'先横切赤线，再侧身靠近骨刺来源。',special:'三瞳聚光后横移，趁螯口恢复时靠近。',boss:'向羽刃扇面的空侧斜移，别顺中心后退。'};
  const fixtureView={...s.fixture,operationCatalog:operationData.operations,worldReady:world.ready,worldError:world.error||null};
  if(fixtureView.offers)fixtureView.offers=fixtureView.offers.map(o=>({...o,description:(o.description||'').replace('普通升级固定样本：','普通强化：').replace('固定前后样本','回复').replace('独立设计样本','强化选择')}));
  if(s.screen==='choice')fixtureView.choiceIntro=s.fixture.choiceKind==='finalChest'?'终战将至。再巩固一项招式，或先调息恢复气血。':s.fixture.choiceKind==='fullSlots'?'六个招式位已满。强化已有招式，或选一项通用收益。':'境界已进。三项之中取其一，选择时山道暂停。';
  layer.innerHTML=DesignScreens.render({...s,notice:hints[s.scenario]||'',battle:{...s.battle,wave:s.battle.wave.replace(' · 已完成情景','')},fixture:fixtureView},data);
  const description=document.querySelector('#scenario-description');
  if(description)description.textContent=s.screen==='result'?[s.fixture.result?.label,s.fixture.result?.scopeTransition].filter(Boolean).join('；'):[s.notice,s.fixture.choiceIntro,s.fixture.upgradePreview?.label].filter(Boolean).join('；')||'营地起始固定档案：零资源、无伙伴、仅青溪开启。可亲手出战，也可切换代表情景。';
  const battleLike=['battle','choice','gearReward','awakening','pause','down'].includes(s.screen)||s.screen==='settings'&&!!pausedContext;
  document.querySelector('#world').style.display=battleLike?'block':'none';
  world.setState({active:battleLike,paused:s.screen!=='battle'||!!s.modal,mode:s.screen==='down'?'defeat':s.scenario,selectionView:s.screen==='choice'||!!pausedContext&&pausedContext.screen==='choice',displaySkills:s.battle.skills,reduced:s.reduced,muted:s.muted});
  document.querySelector('#next-beat').textContent=s.screen==='battle'?(s.scenario==='loot'?'拾取经验':'下一幕'):s.screen==='result'?'回营':'演示旅程';
  document.querySelector('#scene-picker').value=s.screen;
  note('screen-presented',{screen:s.screen,scenario:s.scenario,modal:s.modal,selected:s.selected});syncPickup();syncPlayback();
 }
 const operationReceipts=new Set();
 const getPath=(o,path)=>path.split('.').reduce((v,k)=>v?.[k],o);
 const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 function currentContext(){return {...s.fixture,battle:s.battle};}
 function putPath(path,value){const keys=path.split('.');let target=keys[0]==='battle'?s:s.fixture;for(const key of keys.slice(0,-1)){if(target[key]==null)target[key]={};target=target[key];}target[keys.at(-1)]=copy(value);}
 function applyLiteral(after,keys){for(const key of keys){const value=getPath(after,key);if(value!==undefined)putPath(key,value);}}
 function matchesLiteral(op,sample){
  const current=currentContext();return (op.matchKeys||[]).every(key=>equal(getPath(current,key),getPath(sample.current,key)));
 }
 function operationVariants(op,subject){
  let base=op;const target=subject||op.subjectId;if(op.targetVariants?.[target])base={...op,...op.targetVariants[target]};else if(subject&&subject!==op.subjectId)return [];
  return [base,...Object.values(base.contextVariants||{}).filter(x=>!subject||!x.subjectId||x.subjectId===subject).map(x=>({...base,...x}))];
 }
 function operationEligible(op){const id=op.subjectId;if(!id?.startsWith('CO'))return true;if(op.id.endsWith('UNLOCK'))return !s.fixture.companionsOwned.includes(id);return s.fixture.companionsOwned.includes(id)&&(!op.id.includes('FEED')||s.fixture.companionLevels[id]<20);}
 function receiptKey(op,sample){return op.id+':'+op.subjectId+':'+sample.id;}
 function isFreePartyPreview(op){return ['OP-COMPANION-EQUIP','OP-COMPANION-UNEQUIP'].includes(op.id);}
 function previewOperation(id,subject=null,variant=null){
  delete s.fixture.operationPreview;const original=operationData.operations.find(x=>x.id===id);if(!original)return;
  if(id==='OP-GEAR-OPPORTUNITY'&&variant==='declineBoth'){previewGearDecline();return;}
  const variants=operationVariants(original,subject);if(!variants.length){toast('此目标尚无相应的独立前后样例。');return;}
  let chosen=null;
  for(const op of variants){for(const name of ['positive','negative']){const sample=op[name];if(sample&&matchesLiteral(op,sample)&&(name==='negative'||operationEligible(op))){chosen={operation:op,sample:copy(sample)};break;}}if(chosen)break;}
  if(!chosen){const op=variants[0],before=copy(currentContext());chosen={operation:op,sample:{id:'CURRENT-NOT-IN-LITERAL',submitAllowed:false,current:before,after:copy(before),copy:'当前行囊或目标不属于此项已编写的前后样例。原状态保留；其他固定档可在设计审阅情景中明确载入。',reason:'unlisted-literal'}};}
  if(!isFreePartyPreview(chosen.operation)&&operationReceipts.has(receiptKey(chosen.operation,chosen.sample))){chosen.sample.submitAllowed=false;chosen.sample.copy='此固定档已处理过本项，回执保留，不重复提交。';}
  s.fixture.operationPreview=chosen;s.modal='upgradeConfirm';draw();
 }
 function confirmOperation(id){
  const preview=s.fixture.operationPreview;if(!preview||preview.operation.id!==id||!preview.sample.submitAllowed||s.fixture.readOnly)return;
  const {operation:op,sample}=preview;if(op.subjectId?.startsWith('CO')&&s.selected!==op.subjectId)return;
  if(!matchesLiteral(op,sample)||!operationEligible(op)||!isFreePartyPreview(op)&&operationReceipts.has(receiptKey(op,sample))){toast('前提已改变，原行囊保留。');return;}
  const hp=s.battle.hp;applyLiteral(sample.after,op.affectedKeys||[]);if(!isFreePartyPreview(op))operationReceipts.add(receiptKey(op,sample));s.fixture.operationReceipt=copy(preview);delete s.fixture.operationPreview;s.modal=null;
  note('authored-operation-after',{operationId:id,subjectId:op.subjectId,sampleId:sample.id,scope:'copy-specified-literal-leaves-no-runtime-economy'});
  if(id==='OP-GEAR-OPPORTUNITY'){gearReceipt('已舍下两件',sample.copy,hp,'declineBoth');return;}draw();
 }
 function previewGearDecline(){
  const op=gearOperation(),offer=s.fixture.gearOffer;if(!offer||s.fixture.gearOpportunity?.consumed)return;
  const pair=op.declineBoth.literalHealthCases.find(x=>x.before.hp===s.battle.hp&&x.before.maxHp===s.battle.maxHp),current=copy(currentContext());
  const after=copy(current);if(pair){after.battle=copy(pair.after);after.gearOpportunity={...after.gearOpportunity,consumed:true,selectedCandidateId:'declineBoth'};after.resultProfileId='RESULT-FIRST-FIVE-GEAR';}
  const resolved={...op,subjectId:s.fixture.gearOpportunity.id,title:'舍下本次两件器物',confirmLabel:'确认舍下两件',cost:{},reward:{},matchKeys:['battle.hp','battle.maxHp','gearOpportunity.id','gearOpportunity.consumed'],affectedKeys:['battle.hp','gearOpportunity','resultProfileId']};
  s.fixture.operationPreview={operation:resolved,sample:{id:'DECLINE-'+s.fixture.gearOpportunity.id+'-'+(pair?.id||'UNLISTED'),submitAllowed:!!pair,current,after,copy:pair?'舍下后不收入器物，气血 '+pair.before.hp+' → '+pair.after.hp+' / '+pair.after.maxHp+'；本次机会结束。':'此固定档尚未列出该气血数对；原机会保留，可返回比较。'}};s.modal='upgradeConfirm';draw();
 }
 function gearReceipt(title,text,beforeHp,branch){
  if(s.fixture.gearOpportunity.number===5)s.fixture.fifthGearBranch=branch;
  if(s.fixture.resultProfileId==='RESULT-FIRST-SIX-GEAR'&&s.fixture.achievements.includes('AC11'))s.fixture.resultProfileId='RESULT-FIRST-SIX-GEAR-AC11-ALREADY';
  s.fixture.gearReceipt={title,copy:text,beforeHp,afterHp:s.battle.hp,maxHp:s.battle.maxHp,parts:s.fixture.gearOwned.length};s.fixture.gearOffer.submitAllowed=false;s.selected=null;s.modal=null;draw();
 }
 const reviewSamples=[];
 for(const op of operationData.operations.filter(x=>x.category!=='gearReward')){
  const variants=[op,...Object.values(op.targetVariants||{}).map(x=>({...op,...x}))];
  for(const variant of variants){for(const resolved of [variant,...Object.values(variant.contextVariants||{}).map(x=>({...variant,...x}))])for(const key of ['positive','negative'])if(resolved[key])reviewSamples.push({operation:resolved,sample:resolved[key]});}
 }
 const operationPicker=document.querySelector('#operation-picker');
 reviewSamples.forEach(({operation:o,sample:v},i)=>operationPicker.add(new Option(o.title+' · '+v.profileId+' · '+(v.submitAllowed?'可确认':'受阻'),String(i))));
 document.querySelector('#load-operation-sample').addEventListener('click',()=>{
  const {operation:o,sample:v}=reviewSamples[Number(operationPicker.value)];stopPlayback('explicit-named-operation-profile');cancelPickup('explicit-operation-profile');pausedContext=null;pendingCamp=null;history=[];world.clear();s=fresh();
  Object.assign(s.fixture,copy(v.current));if(v.current.battle)s.battle=copy(v.current.battle);delete s.fixture.battle;s.fixture.noCurrentRun=true;s.fixture.insufficient=false;operationReceipts.clear();
  s.screen=o.subjectId?.startsWith('CO')?'companions':'growth';s.selected=o.subjectId?.startsWith('CO')||o.subjectId?.startsWith('UP')?o.subjectId:'UP01';s.tab=o.category==='growth'?'training':'resources';s.notice='明确载入独立设计档：'+v.profileId+'。不是沿用上一钱包或真实时间。';document.querySelector('#review-tools').open=false;draw();
 });
 function modal(id){suspendPickup('modal');s.modal=id;draw();}
 function closeModal(){s.modal=null;delete s.fixture.detail;delete s.fixture.operationPreview;draw();}
 function go(screen,tab=null){delete s.fixture.operationPreview;cancelPickup('page-navigation');world.clear();if(screen!==s.screen)history.push(context());s.screen=screen;s.modal=screen==='prepare'&&world.error?'loadError':null;s.selected=null;if(tab)s.tab=tab;draw();}
 function resetDesign(){stopPlayback('reset');cancelPickup('review-reset');world.reset();s=fresh();beat=0;revived=false;pausedContext=null;pendingCamp=null;history=[];runProfile='new';operationReceipts.clear();draw();}
 function start(){
  if(world.error){modal('loadError');return;}
  stopPlayback('new-journey');
  if(s.fixture.readOnly){toast('当前只读查看，请先返回营地或重置设计情景。');return;}
  const other=s.stageId!=='ST01';cancelPickup('new-journey');world.reset();beat=0;revived=false;pausedContext=null;pendingCamp=null;history=[];
  runProfile=s.fixture.clearedStageIds?.includes('ST01')?'returning':'new';s.stageId='ST01';s.screen='battle';s.scenario='tutorial';s.modal=null;s.selected=null;
  s.battle=copy(fresh().battle);s.battle.skills=route().starter.slice();s.battle.ranks=Object.fromEntries(s.battle.skills.map(id=>[id,1]));
  Object.assign(s.fixture,{noCurrentRun:false,freeReviveUsed:false,offers:null,choiceKind:null,choiceTitle:null,choiceIntro:null,refreshRemaining:2,gearEquipped:{},gearOwned:[],firstClear:false});
  delete s.fixture.awakeningEligibility;delete s.fixture.pendingAwakeningSkill;delete s.fixture.detail;delete s.fixture.gearOffer;delete s.fixture.gearReceipt;delete s.fixture.fifthGearBranch;delete s.fixture.resultProfileId;delete s.fixture.operationPreview;
  s.notice='第一波仅翼蝠妖：按住拖动，松手停步。演出时刻会跳转，不代表自然成长速度。';
  draw();if(other)toast('其他卷可看设计图谱；完整交互旅程当前明确返回青溪试刃代表情景。');
 }
 function earlyOffers(){const ids=route().starter;return ids.map(id=>({id,name:skill(id).name,kind:'upgrade',before:1,after:2,beforeLabel:'一重',afterLabel:'二重',primaryChange:'1重 → 2重',secondaryChange:'伤害点 0 → 1',description:'普通升级固定样本：一重到二重，改造点0→1；不增加槽位。'})).concat({id:'UT-FOCUS',name:'凝神',kind:'utility',beforeLabel:'通用伤害加算 0%',afterLabel:'+4%',primaryChange:'伤害加算 0% → 4%',secondaryChange:'不占招式槽',description:'通用加算强化；不增加招式重数或槽位。'});}
 function showLevelChoice(){s.screen='choice';s.scenario='choice';s.selected=null;Object.assign(s.battle,{level:2,xp:1,xpNext:14});Object.assign(s.fixture,{offers:earlyOffers(),refreshRemaining:2,offerDisplayId:'ordinary-first-choice',choiceKind:'level',choiceTitle:'境界提升',choiceIntro:'经验到身后的固定样本：境界二、余1经验。普通强化或凝神，选一项。'});draw();}
 function collect(){if(s.screen!=='battle'||s.scenario!=='loot'||s.modal||pickup)return;world.pickup();pickup={epoch:sceneEpoch,remaining:440,started:0,timer:null};note('authored-pickup-presentation-started',{durationMs:440});draw();}
 function matureSnapshot(){
  const c=operationData.presentationCorrections.mature,r=c.routes[s.routeId];
  // Skill/level time cut only. The player's fifth gear choice and HP carry on.
  Object.assign(s.battle,{level:c.level,xp:c.xp,xpNext:c.xpNext,clock:'06:36',wave:'9 / 10 · 已完成情景',skills:copy(r.skills),ranks:copy(r.ranks),awakening:copy(r.awakening)});
  Object.assign(s.fixture,{preparation:{boxOpportunity:4,gearOpportunity:6,earned:true,scope:'authored-completed-preconditions-not-a-Director'},pendingAwakeningSkill:null});
 }
 function finalChest(){
  matureSnapshot();const r=operationData.presentationCorrections.mature.routes[s.routeId];s.screen='choice';s.scenario='finalPrepare';s.selected=null;
  const offers=r.fourthChestOffers.map(x=>({...copy(x),name:skill(x.id)?.name||'调息'}));
  const heal=operationData.presentationCorrections.fourthChestHealLiterals?.find(x=>x.before.hp===s.battle.hp&&x.before.maxHp===s.battle.maxHp);
  if(heal){const o=offers.find(x=>x.id==='UT-HEAL');Object.assign(o,{beforeLabel:'气血 '+heal.before.hp+' / '+heal.before.maxHp,afterLabel:'气血 '+heal.after.hp+' / '+heal.after.maxHp,literalAfter:copy(heal.after)});}
  else if(s.battle.hp!==42||s.battle.maxHp!==100){const o=offers.find(x=>x.id==='UT-HEAL');Object.assign(o,{beforeLabel:'气血 '+s.battle.hp+' / '+s.battle.maxHp,afterLabel:'本独立档未列回复前后',unavailable:true,description:'该固定档未编写调息数对；原气血保留，可选两项招式。'});}
  Object.assign(s.fixture,{choiceKind:'finalChest',refreshRemaining:0,offerDisplayId:'prefinal-fourth-chest',choiceTitle:'终前整备 · 第四箱',choiceIntro:'仅将技能切到十九境的独立成熟快照；保留刚才器物、气血与取舍。先处理第四箱与第六器物，再明确进入终战。',offers});
  s.notice='成熟招式有18次普通投入与前三箱各+2的静态可行次序；不是本短片的自然成长证明。';draw();
 }
 function gearOperation(){return operationData.operations.find(x=>x.id==='OP-GEAR-OPPORTUNITY');}
 function openGear(number){
  const op=gearOperation();let resolved;
  if(number===5){resolved=op.opportunityVariants.GEAR05;if(s.battle.maxHp===112)resolved={...resolved,...resolved.contextVariants.MAX112};}
  else{const path=op.fifthToSixthMap[s.fixture.fifthGearBranch]||'GEAR06.FIFTH_A';resolved=op.opportunityVariants.GEAR06[path.split('.')[1]];}
  const offer=copy(resolved.positive);
  if(number===5||!s.fixture.fifthGearBranch){s.fixture.gearEquipped=copy(offer.current.gearEquipped);s.fixture.gearOwned=copy(offer.current.gearOwned);}
  s.fixture.gearOpportunity=copy(offer.current.gearOpportunity);s.fixture.gearOffer=offer;s.fixture.gearStep='pick';delete s.fixture.gearReceipt;
  s.screen='gearReward';s.scenario=number===5?'gear':'finalPrepare';s.selected=null;
  s.notice=number===5?'第五次器物机会：原四部位固定前提，所选会保留到第六次。':'第六次器物机会：承接第五的实际选择，先选一件，再看新旧比较。';draw();
 }
 function finalGear(){openGear(6);}
 function loadIndependentFinalPreparation(){const before=gearOperation().opportunityVariants.GEAR06.FIFTH_A.positive.current;s.fixture.gearEquipped=copy(before.gearEquipped);s.fixture.gearOwned=copy(before.gearOwned);s.fixture.fifthGearBranch='CAND-GEAR05-A';s.battle.hp=42;s.battle.maxHp=100;delete s.fixture.gearReceipt;s.notice='审阅工具明确载入独立终前42/100、第五A已选档；不沿用上一段。';}
 function showAwakening(id){const a=awFor(id);s.screen='awakening';s.scenario='finalPrepare';s.selected=null;s.fixture.awakeningSkill=id;s.fixture.awakeningEligibility={rank:12,chestResolved:true,relicCollected:true,slotsUsed:1,slotsMax:2,relicForAwakeningId:a.id,relicName:a.relicName,scope:'authored-relic-already-arrived-snapshot'};s.notice='匹配金物已到身的固定情景：十二重、本箱资格与第2觉醒位均已满足；仍需选择并确认。';draw();}
 function enterBeat(n){
  cancelPickup('journey-beat');beat=n;s.selected=null;s.modal=null;s.screen='battle';
  switch(n){
   case 0:s.scenario='tutorial';break;
   case 1:s.scenario='encounter';Object.assign(s.battle,{hp:86,clock:'00:18',wave:'1 / 10'});s.notice='第一波翼蝠机制片段：短弧转向，松手观察近敌方向。未引入骨刺。';break;
   case 2:s.scenario='loot';Object.assign(s.battle,{xp:8,clock:'00:30',wave:'1 / 10'});s.notice='靠近经验光点看拾取演出，再点“拾取经验”；数字为固定前后样本。';break;
   case 3:s.scenario='ranged';Object.assign(s.battle,{hp:72,level:8,xp:16,xpNext:40,clock:'03:38',wave:'6 / 10'});s.notice='跳到第六波骨刺片段：横切赤线，侧面接近。中间波次已省略，不代表自然成型时长。';break;
   case 4:s.scenario='special';Object.assign(s.battle,{hp:64,clock:'05:20',wave:'8 / 10',specialId:'EL02'});s.notice='第八波三瞳蛛猎的特殊遭遇设计片段：锁线后横移，等待恢复。';break;
   case 5:openGear(5);return;
   case 6:finalChest();return;
   case 7:finalGear();return;
   case 8:if(s.fixture.pendingAwakeningSkill){showAwakening(s.fixture.pendingAwakeningSkill);return;}enterBeat(9);return;
   case 9:s.scenario='boss';Object.assign(s.battle,{bossId:'BO04',bossName:'玄羽鸦皇',bossHp:65,clock:'07:12',wave:'10 / 10'});s.notice='玄羽鸦皇扇翼先给预告，向扇面空侧斜移。终前装备/箱已处理，末Boss后不再弹构筑。';break;
   case 10:if(!revived){s.screen='down';s.scenario='defeat';s.battle.hp=0;s.fixture.freeReviveUsed=false;s.fixture.fatalSource='玄羽鸦皇 · 羽刺（倒地设计情景）';}else{finish('victory');return;}break;
   default:finish('victory');return;
  }draw();
 }
 function next(){if(s.modal){toast('请先处理当前提示或返回原处。');return;}if(s.screen==='result'){returnCamp();return;}if(s.screen!=='battle'){if(['choice','gearReward','awakening','down','pause','settings'].includes(s.screen)){toast('请先完成当前选择或明确返回。');return;}start();return;}if(pickup)return;if(beat===2){collect();return;}enterBeat(beat+1);}
 function confirmChoice(){
  if(s.fixture.readOnly){toast('当前只读，保留选择但不提交。');return;}if(s.screen==='gearReward'&&s.fixture.gearReceipt){delete s.fixture.gearReceipt;enterBeat(beat===7?8:6);return;}if(!s.selected){toast('先选择一项。');return;}
  if(s.screen==='awakening'){
   const a=awFor(s.fixture.awakeningSkill),g=s.fixture.awakeningEligibility;
   if(!a||s.selected!==a.id||!g?.relicCollected||!g.chestResolved||g.rank!==12||s.battle.awakening.length>=2){toast('此情景的觉醒资格或名额尚不完整。');return;}
   s.battle.awakening=[...s.battle.awakening,a.id];s.fixture.pendingAwakeningSkill=null;note('authored-awakening-after-fixture',{id:a.id,name:a.name});enterBeat(9);return;
  }
  if(s.screen==='gearReward'){
   if(s.fixture.gearReceipt){delete s.fixture.gearReceipt;enterBeat(beat===7?8:6);return;}
   const offer=s.fixture.gearOffer,candidate=offer?.candidates.find(x=>x.candidateId===s.selected);if(!candidate||offer.submitAllowed===false)return;
   if(s.fixture.gearStep!=='compare'){s.fixture.gearStep='compare';draw();return;}
   const comparison=offer.comparisons[candidate.candidateId],op=gearOperation();
   if(!matchesLiteral({...op,...comparison},offer)){toast('原机会与比较前提已改变，请返回原两件。');return;}
   const hp=s.battle.hp;applyLiteral(comparison.after,comparison.affectedKeys||op.affectedKeys);
   gearReceipt(candidate.name+'已收下',comparison.shortCopy,hp,candidate.candidateId);return;
  }
  if(s.screen!=='choice')return;const card=(s.fixture.offers||[]).find(x=>x.id===s.selected);if(!card||card.unavailable)return;
  if(card.kind==='new'&&!s.battle.skills.includes(card.id)){if(s.battle.skills.length>=6){modal('fullSlots');return;}s.battle.skills=[...s.battle.skills,card.id];}
  if(card.kind!=='utility')s.battle.ranks={...s.battle.ranks,[card.id]:card.after};
  if(card.id==='UT-FOCUS')s.fixture.condensedPreview=true;
  if(card.id==='UT-HEAL'){if(card.literalAfter)Object.assign(s.battle,copy(card.literalAfter));else if(s.battle.hp===42&&s.battle.maxHp===100)s.battle.hp=77;else return;}
  if(card.id==='UT-VIGOR'){s.battle.maxHp=112;s.battle.hp=98;}
  const isBox=s.fixture.choiceKind==='finalChest';if(isBox&&card.id===route().core[1])s.fixture.pendingAwakeningSkill=card.id;
  note('authored-choice-after-fixture',{id:card.id,kind:s.fixture.choiceKind,scope:'fixed-display-no-skill-or-HP-simulation'});s.fixture.offers=null;
  if(s.fixture.choiceKind==='fullSlots'){s.screen='battle';s.scenario='ranged';s.selected=null;beat=3;s.notice='保留六槽的独立强化后情景；不新增第七招。';draw();return;}enterBeat(isBox?7:3);
 }
 function finish(outcome,forced=null){
  stopPlayback('result');
  cancelPickup('result');world.clear();pausedContext=null;s.stageId='ST01';s.screen='result';s.scenario=outcome;s.modal=null;s.selected=null;
  const key=forced||(outcome==='defeat'?(runProfile==='returning'?'returningDefeat':'firstDefeat'):(runProfile==='returning'?'repeatVictory':'firstVictory'));
  const row=copy(outcome==='victory'&&!forced&&runProfile==='new'&&s.fixture.resultProfileId?operationData.resultProfiles[s.fixture.resultProfileId]:results[key]);if(outcome==='defeat'){const c=operationData.presentationCorrections.defeat,r=c.routes[s.routeId];Object.assign(s.battle,{level:c.level,xp:c.xp,xpNext:c.xpNext,skills:copy(r.skills),ranks:copy(r.ranks),awakening:[]});row.scopeTransition='独立切换到K64/T242/B1/Q0的失败档案样本，不使用终战成熟片段推算奖励';}pendingCamp=row;s.fixture.result=row;s.fixture.outcome=outcome;s.fixture.firstClear=row.firstClear;s.fixture.rewards=copy(row.total);s.fixture.baseSettled=true;s.fixture.resultSample=key;s.fixture.adBonusState='not-requested';s.battle.bossHp=null;
  s.notice='结算是独立完整固定样本，含其声明的参与/首通/功绩身份，不据演出时长推算收益。';note('authored-result-fixture',{sample:key});draw();
 }
 function returnCamp(){
  stopPlayback('return-camp');
  cancelPickup('camp');world.clear();if(pendingCamp){s.fixture.lastGearEquipped=copy(s.fixture.gearEquipped||{});Object.assign(s.fixture,{wallet:copy(pendingCamp.postWallet),achievements:pendingCamp.postAchievements.slice(),clearedStageIds:pendingCamp.postCleared.slice(),unlockedStageIds:pendingCamp.postUnlocked.slice(),afterJourney:true,insufficient:false,baseSettled:true});s.fixture.shortageProfile=pendingCamp.outcome==='defeat'&&!pendingCamp.postCleared.length?'new-defeat':null;pendingCamp=null;runProfile=s.fixture.clearedStageIds.includes('ST01')?'returning':'new';}
  if(s.fixture.result?.firstClear&&!s.fixture.offline.earnedAllowanceTotal)s.fixture.offline={earnedAllowanceTotal:30,pendingEssence:30,claimableEssence:0,releasedAllowanceTotal:0,claimedReceiptIds:[]};s.fixture.noCurrentRun=true;s.fixture.gearEquipped={};s.fixture.gearOwned=[];s.screen='camp';s.selected=null;s.modal=null;s.notice='';history=[];pausedContext=null;draw();if(reviewMode)toast('已切换到固定归营情景；本页未执行真实到账或存档。');
 }
 function pause(reason){
  if(['pause','settings'].includes(s.screen)&&pausedContext)return;if(!['battle','choice','gearReward','awakening'].includes(s.screen))return;
  suspendPickup(reason);pausedContext=context();s.returnTo=pausedContext.screen;s.screen='pause';s.modal=null;world.clear();world.stopAudio();note('pause',{reason,from:pausedContext.screen,selected:pausedContext.selected});draw();
 }
 function resume(){if(!pausedContext){returnCamp();return;}Object.assign(s,pausedContext);pausedContext=null;world.clear();note('explicit-resume',{to:s.screen,selected:s.selected});draw();}
 function cancelReadOnly(){s.fixture.readOnly=true;s.fixture.conflictState='cancelled-to-read-only';s.modal=null;draw();toast('已返回只读情景：可看详情，不执行投入或选择提交。');}
 function back(){
  if(s.modal){if(s.modal==='saveConflict'){cancelReadOnly();return;}if(s.modal==='saveError'){toast('原候选仍保留，请使用重试记录。');return;}closeModal();return;}
  if(s.screen==='settings'&&pausedContext){s.screen='pause';s.returnTo=pausedContext.screen;draw();return;}
  if(['choice','gearReward','awakening'].includes(s.screen)){toast('本次机会保留；请确认，或先暂停。');return;}
  if(s.screen==='pause'){resume();return;}const previous=history.pop();if(previous){Object.assign(s,previous);draw();}else returnCamp();
 }
 function openHelp(){suspendPickup('help');history.push(context());s.screen='help';s.modal=null;s.selected=null;draw();}
 function previewUpgrade(id){
  delete s.fixture.operationPreview;if(id)s.selected=id;if(['UP02','UP05'].includes(s.selected)){previewOperation(s.selected==='UP02'?'OP-GROWTH-BODY':'OP-GROWTH-SKILL',s.selected);return;}if(s.fixture.readOnly){toast('当前只读，可看详情，不能投入。');return;}
  const companion=data.companions.find(x=>x.id===s.selected);
  if(companion){s.detailId=companion.id;modal('detail');return;}
  if(s.fixture.maxLevel){modal('maxLevel');return;}
  if(s.fixture.shortageProfile==='new-defeat'){const target=data.growth.find(x=>x.id===s.selected);if(target?.id==='UP01'){s.fixture.resourceShort={name:'元宝',need:6,owned:1,lack:5};modal('resourceShort');return;}if(target?.skillId){s.fixture.resourceShort={name:'灵息',need:90,owned:22,lack:68};modal('resourceShort');return;}}
  if(s.fixture.insufficient){const target=data.growth.find(x=>x.id===s.selected)||data.growth[0],currency=data.currencies.find(x=>x.id===target.currencyId),displayPrice=target.nextPrice[0];s.fixture.resourceShort={name:currency.name,need:displayPrice,owned:0,lack:displayPrice};modal('resourceShort');return;}
  modal('upgradeConfirm');
 }
 function action(a,id,tab=null,subject=null,variant=null){
  note('action',{action:a,id,tab,from:s.screen});
  switch(a){
   case'depart':modal('confirmDepart');break;
   case'stages':go('stages');break;
   case'chooseStage':s.stageId=id;s.selected=id;if(!s.fixture.unlockedStageIds.includes(id))modal('locked');else draw();break;
   case'prepare':case'confirmDepart':go('prepare');break;
   case'chooseRoute':s.routeId=id;s.selected=id;s.battle.skills=route().starter.slice();s.battle.ranks=Object.fromEntries(s.battle.skills.map(k=>[k,1]));draw();break;
   case'start':start();break;
   case'nextBeat':next();break;
   case'collect':collect();break;
   case'select':if(id==='back-to-candidates'){s.fixture.gearStep='pick';}else s.selected=id;draw();break;
   case'confirmChoice':confirmChoice();break;
   case'refreshChoice':{
    if(s.screen!=='choice'||s.fixture.readOnly||!s.fixture.refreshRemaining){toast('此行换组机会已用完。');break;}
    // Two authored alternative displays, not a random pool or offer generator.
    const previous=s.fixture.refreshRemaining,base=earlyOffers();
    s.fixture.refreshRemaining=previous===2?1:0;s.selected=null;
    const vigor={id:'UT-VIGOR',name:'固本',kind:'utility',primaryChange:'气血上限 100 → 112',secondaryChange:'保留已损气血',beforeLabel:'气血 86 / 100',afterLabel:'气血 98 / 112',description:'上限增加12，当前气血同步补12；仍保留14点气血损失，不占招式槽。'};
    s.fixture.offers=previous===2?[base[1],vigor,base[0]]:[base[0],base[1],base[2]];
    note('authored-reroll-display',{before:previous,after:s.fixture.refreshRemaining,offerDisplayId:s.fixture.offerDisplayId,scope:'two-fixed-legal-alternatives-no-randomization'});draw();break;
   }
   case'detail':s.detailId=id||s.selected;if(s.detailId?.startsWith('UT-')){const v=s.fixture.offers?.find(x=>x.id===s.detailId);s.fixture.detail={title:v?.name||'通用强化',body:v?.description||'不增加槽位的通用设计样本。'};}else delete s.fixture.detail;modal('detail');break;
   case'close':if(s.modal==='saveConflict')cancelReadOnly();else if(s.modal==='saveError')toast('原候选仍保留，请使用重试记录。');else closeModal();break;
   case'back':back();break;
   case'pause':pause('manual');break;
   case'resume':resume();break;
   case'settings':if(['battle','choice','gearReward','awakening'].includes(s.screen))pause('settings');history.push(context());s.returnTo=pausedContext?.screen||'camp';s.screen='settings';s.modal=null;draw();break;
   case'toggleMute':s.muted=!s.muted;world.stopAudio();draw();break;
   case'toggleReduced':s.reduced=!s.reduced;draw();break;
   case'restart':modal('restartConfirm');break;
   case'confirmRestart':s.fixture.readOnly=false;start();break;
   case'revive':if(revived||s.fixture.freeReviveUsed){toast('本局免费复起已用，可正常结算；不提供广告复起。');draw();break;}revived=true;s.fixture.freeReviveUsed=true;s.battle.hp=s.battle.maxHp===112?67.2:60;s.screen='battle';s.scenario='boss';s.battle.bossId='BO04';s.battle.bossName='玄羽鸦皇';s.notice='复起后固定'+s.battle.hp+'/'+s.battle.maxHp+'气血：保留原危险；显式继续后有2秒保护提示（仅表现，不计算无敌）。';pause('free-revive-fixture');break;
   case'declineRevive':finish('defeat');break;
   case'settle':if(s.screen==='result')returnCamp();else finish('defeat');break;
   case'returnCamp':returnCamp();break;
   case'growth':if(s.screen==='growth'){s.tab=tab||'training';delete s.fixture.operationPreview;}else go('growth',tab||'training');if(!s.selected?.startsWith('UP'))s.selected='UP01';draw();break;
   case'chooseGrowth':s.selected=id;delete s.fixture.detail;delete s.fixture.operationPreview;draw();break;
   case'previewUpgrade':previewUpgrade(id);break;
   case'previewOperation':previewOperation(id,subject,variant);break;
   case'confirmOperation':confirmOperation(id);break;
   case'toggleCompanion':previewOperation(s.fixture.equippedCompanionIds.includes(id)?'OP-COMPANION-UNEQUIP':'OP-COMPANION-EQUIP',id);break;
   case'confirmPreview':{
    if(s.fixture.readOnly){toast('当前只读，原等级保留。');break;}
    if(s.selected==='UP01'&&s.fixture.resultSample==='firstVictory'&&s.fixture.wallet.ingots===24&&!s.fixture.growthLevels.UP01){
     // A complete literal before/after UI example, not a price/transaction engine.
     s.fixture.growthLevels={...s.fixture.growthLevels,UP01:1};s.fixture.wallet={...s.fixture.wallet,ingots:18};
     s.fixture.upgradePreview={id:'UP01',beforeLevel:0,afterLevel:1,currencyId:'CU02',beforeBalance:24,afterBalance:18,label:'首胜后武器首级固定前后样本；无真实交易或保存'};
     note('authored-growth-after-fixture',{id:'UP01',beforeLevel:0,afterLevel:1,beforeBalance:24,afterBalance:18});
    }else s.fixture.upgradePreview={id:s.selected,label:'独立修行效果预览；本版不实现16条经济交易'};
    s.modal=null;draw();break;
   }
   case'gear':{const t=tab||(['current','last','codex'].includes(id)?id:null);if(s.screen==='gear'){s.tab=t||s.tab;draw();}else go('gear',t||(s.fixture.noCurrentRun?'codex':'current'));break;}
   case'chooseGear':s.selected=id;draw();break;
   case'equipPreview':if(s.fixture.readOnly){toast('当前只读，不替换器物。');break;}s.fixture.equippedGearPreview=s.selected;s.modal=null;draw();toast('已切换器物对比样本，不写入档案。');break;
   case'companions':go('companions');s.selected='CO01';draw();break;
   case'chooseCompanion':s.selected=id;draw();break;
   case'codex':if(s.screen==='codex'){s.tab=tab||'skills';s.selected=null;draw();}else go('codex',tab||'skills');break;
   case'chooseEntry':s.selected=id;draw();break;
   case'achievements':go('achievements');break;
   case'claimPreview':if(id==='ad'){if(s.screen!=='result'||!s.fixture.baseSettled){toast('可选加领仅在基础结算之后展示。');break;}s.fixture.adBonusState='cancelled-fixed-scenario';modal('adCancelled');}else{s.fixture.claimPreview=id;s.fixture.detail={title:'功绩自动入账回执',body:'首次满足条件时自动记录一次；这里预览回执，不是再次领取。'};modal('detail');}break;
   case'help':openHelp();break;
   case'retry':case'retryLoad':s.modal=null;s.fixture.loadPreview='retry-returned-to-original-design-scene';if(world.error){world.reload();draw();toast('正在重新载入山道与人物。');}else{draw();toast('已回到原载入设计情景。');}break;
   case'retrySave':s.modal=null;s.fixture.savePreview='original-candidate-retained-after-retry';draw();toast('已回到原候选；这是恢复设计样本，不执行真实保存。');break;
   case'cancel':if(s.modal==='saveConflict')cancelReadOnly();else closeModal();break;
   default:note('unconnected-action',{action:a});toast('此控件尚未接入设计流程，请保留问题记录。');
  }
 }
 function reviewScreen(screen){
  stopPlayback('review-scene');
  cancelPickup('review-scene-switch');world.clear();pausedContext=null;history=[];s.modal=null;s.selected=null;
  if(screen==='result'){finish('victory');return;}
  if(screen==='choice'){s.battle={...copy(fresh().battle),hp:86,skills:route().starter.slice(),ranks:Object.fromEntries(route().starter.map(id=>[id,1]))};showLevelChoice();return;}
  if(screen==='gearReward'){loadIndependentFinalPreparation();matureSnapshot();beat=7;finalGear();return;}
  if(screen==='awakening'){matureSnapshot();const id=route().core[1];s.battle.ranks[id]=12;s.fixture.pendingAwakeningSkill=id;beat=8;showAwakening(id);return;}
  if(screen==='down'){matureSnapshot();beat=10;s.battle.hp=0;s.screen='down';s.scenario='defeat';s.fixture.freeReviveUsed=revived;s.fixture.fatalSource='玄羽鸦皇 · 羽刺（独立倒地样本）';draw();return;}
  if(screen==='pause'){s.battle=copy(fresh().battle);s.screen='battle';s.scenario='encounter';pause('review-pause');return;}
  s.screen=screen;if(screen==='battle'){beat=1;s.scenario='encounter';s.stageId='ST01';s.battle=copy(fresh().battle);s.notice='第一波翼蝠的独立动作情景，不是当前档案的真实战斗。';}if(screen==='gear')s.tab='codex';if(screen==='codex')s.tab='skills';if(screen==='growth'){s.selected='UP01';s.tab='training';}if(screen==='companions')s.selected='CO01';draw();
 }
 document.querySelector('#phone').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)action(b.dataset.action,b.dataset.id||null,b.dataset.tab||null,b.dataset.subject||null,b.dataset.variant||null);});
 document.querySelector('#next-beat').addEventListener('click',next);
 const picker=document.querySelector('#scene-picker');for(const [id,label]of Object.entries(screenNames))picker.add(new Option(label,id));picker.addEventListener('change',()=>reviewScreen(picker.value));
 for(const b of document.querySelectorAll('[data-review]'))b.addEventListener('click',()=>{const k=b.dataset.review;cancelPickup('review-branch');if(k==='reset'){resetDesign();return;}if(k==='victory'){finish('victory');return;}if(k==='defeat'){finish('defeat');return;}if(k==='repeatVictory'){finish('victory','repeatVictory');return;}if(k==='finalPrepare'){pausedContext=null;history=[];s.modal=null;world.clear();loadIndependentFinalPreparation();beat=6;finalChest();return;}if(k==='empty'){pausedContext=null;history=[];s.fixture.readOnly=false;s.fixture.growthLevels={};delete s.fixture.upgradePreview;s.fixture.insufficient=true;s.screen='growth';s.selected='UP01';s.fixture.wallet={coins:0,ingots:0,gems:0,essence:0,fruits:0};s.fixture.resourceShort={name:'元宝',need:6,owned:0,lack:6};modal('resourceShort');return;}if(k==='full'){pausedContext=null;history=[];world.clear();s.battle={...copy(fresh().battle),hp:86};s.fixture.readOnly=false;showLevelChoice();s.battle.skills=data.skills.slice(0,6).map(x=>x.id);s.battle.ranks=Object.fromEntries(s.battle.skills.map(id=>[id,1]));Object.assign(s.battle,{level:12,xp:20,xpNext:58});s.fixture.choiceKind='fullSlots';s.fixture.refreshRemaining=0;s.fixture.choiceIntro='六槽满的独立设计样本：只给已有招式和通用项，不出现第七招。';s.fixture.offers=s.battle.skills.slice(0,2).map(id=>({id,name:skill(id).name,kind:'upgrade',before:1,after:2,description:'强化已学招式1→2，不增加槽位。'})).concat({id:'UT-FOCUS',name:'凝神',kind:'utility',beforeLabel:'通用伤害加算0%',afterLabel:'+4%',description:'不增加招式槽位。'});modal('fullSlots');return;}if(k==='max'){pausedContext=null;s.screen='growth';s.fixture.growthLevels={...s.fixture.growthLevels,UP01:20};s.fixture.maxLevel=true;s.selected='UP01';modal('maxLevel');return;}if(k==='saveConflict'){s.fixture.readOnly=true;s.fixture.conflictState='blocked';}if(k==='adCancelled'||k==='adError'){if(s.screen!=='result')finish('victory');s.fixture.adBonusState=k==='adError'?'unavailable-fixed-scenario':'cancelled-fixed-scenario';}modal(k);});
 window.addEventListener('blur',()=>pause('public-blur'));document.addEventListener('visibilitychange',()=>{if(document.hidden)pause('page-hidden');});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();if(['battle','choice','gearReward','awakening'].includes(s.screen)&&!s.modal)pause('escape');else back();}});
 window.DESIGN_REVIEW_OBSERVER=()=>copy({version:'final-design.20261106-review.2',scope:'presentation-and-UI-only',state:s,beat,revived,pausedContext,pickupPresentation:pickup?{epoch:pickup.epoch,remainingMs:pickup.remaining,timerArmed:pickup.timer!==null}:null,world:world.snapshot(),events,forbiddenSystemsImplemented:[]});
 window.addEventListener('design-world-ready',()=>draw());window.addEventListener('design-world-error',()=>{if(s.screen!=='camp')modal('loadError');else draw();});
 const requested=query.get('screen');if(requested&&screenNames[requested])reviewScreen(requested);else draw();
})();
