// Presentation only: dragging changes a drawing's position; clocks select
// drawings. There are no colliders, HP, enemy AI, rewards, or combat outcomes.
window.DesignWorld = class {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images=new Map();this.hero={x:1460,y:1800};this.move={x:0,y:0};this.face=1;this.time=0;this.active=false;this.paused=false;this.mode='tutorial';this.modeOrigin={x:1460,y:1800};this.last=performance.now();this.keys=new Set();this.pointer=null;this.base=new URL('rework/battle-sample-20261106/',window.DESIGN_SHARED_BASE||new URL('/',location.href)).href;this.ready=false;this.muted=true;this.audio={};this.boundary={minX:750,maxX:2200,minY:850,maxY:3250};
  this.viewAnchor=.5;this.targetAnchor=.5;this.bind();this.reload();requestAnimationFrame(t=>this.frame(t));
 }
 reload(){this.ready=false;this.error=null;this.load().then(()=>{this.ready=true;window.dispatchEvent(new Event('design-world-ready'));}).catch(e=>{this.error=String(e);window.dispatchEvent(new Event('design-world-error'));});}
 async load(){
  this.manifest=await fetch(this.base+'manifest.json').then(r=>{if(!r.ok)throw new Error('设计数据未载入');return r.json();});
  const shared=window.DESIGN_SHARED_BASE||new URL('/',location.href);
  const pose=(file,anchor,referenceActorHeightPx)=>({file:new URL('assets-design/runtime/frames/'+file,shared).href,anchor,referenceActorHeightPx});
  this.actorArt={
   EN01:pose('EN01-move-01.png',[68,93.30946291560103],128.28644501278774),
   EL02:pose('EL02-ready.png',[81.28591160220995,122.8391167192429],160.02523659305993),
   BO04:pose('BO04-ready.png',[148.73029045643153,142.77112676056336],256.2746478873239)
  };
  const files=new Set([this.manifest.world.file,...Object.values(this.actorArt).map(x=>x.file)]);
  for(const k of ['hero-run','hero-idle','hero-sweep','hero-fall'])for(const f of this.manifest.clips[k].frames)files.add(f.file);
  for(const k of ['EN03-move-01','EN05-ready','PICK-XP01','SK01-world-body','SK08-world-body'])if(this.manifest.legacy[k])files.add(this.manifest.legacy[k].file);
  await Promise.all(Array.from(files).map(f=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>{this.images.set(f,i);ok();};i.onerror=()=>no(new Error('设计图暂未载入: '+f));i.src=f.startsWith('http')?f:this.base+f;})));
 }
 bind(){let c=this.canvas;c.addEventListener('pointerdown',e=>{if(!this.active||this.paused)return;if(this.pointer!==null){this.clear();return;}this.pointer=e.pointerId;this.anchor={x:e.clientX,y:e.clientY};c.setPointerCapture(e.pointerId);});c.addEventListener('pointermove',e=>{if(e.pointerId!==this.pointer||!this.anchor)return;let dx=e.clientX-this.anchor.x,dy=e.clientY-this.anchor.y,n=Math.hypot(dx,dy);this.move=n>5?{x:dx/Math.max(45,n),y:dy/Math.max(45,n)}:{x:0,y:0};});for(let k of ['pointerup','pointercancel','lostpointercapture'])c.addEventListener(k,()=>this.clear());window.addEventListener('keydown',e=>{if(this.active&&!this.paused&&['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){this.keys.add(e.key);e.preventDefault();}});window.addEventListener('keyup',e=>this.keys.delete(e.key));window.addEventListener('blur',()=>this.clear());}
 clear(){this.pointer=null;this.anchor=null;this.move={x:0,y:0};this.keys.clear();}
 reset(){this.clear();this.time=0;this.hero={x:1460,y:1800};this.modeOrigin={...this.hero};this.sweepAge=0;this.pickupAt=undefined;this.dropOrigin=null;this.lastSweep=null;}
 setState(v){if(v.mode&&v.mode!==this.mode){if(['tutorial','ranged','special','boss'].includes(v.mode)&&this.mode!=='defeat'){this.modeOrigin={...this.hero};this.modeStartedAt=this.time;}this.mode=v.mode;if(v.mode==='loot')this.dropOrigin={x:Math.max(805,Math.min(2145,this.hero.x+70)),y:Math.min(3150,this.hero.y+60)};if(v.mode==='defeat')this.fallAge=0;}this.targetAnchor=v.selectionView?.22:.5;this.displaySkills=v.displaySkills||[];this.active=!!v.active;this.paused=!!v.paused;this.reduced=!!v.reduced;this.muted=!!v.muted;if(!this.active||this.paused)this.clear();}
 pickup(){this.pickupAt=this.time;}
 cue(id){if(this.muted||this.paused)return;let spec=this.manifest?.audio[id];if(!spec)return;let a=this.audio[id]||(this.audio[id]=new Audio(this.base+spec.file));a.volume=.16;a.currentTime=0;a.play().catch(()=>{});}
 stopAudio(){for(let a of Object.values(this.audio))a.pause();}
 frame(now){let dt=Math.min(.04,(now-this.last)/1000);this.last=now;this.viewAnchor=this.reduced?this.targetAnchor:this.viewAnchor+(this.targetAnchor-this.viewAnchor)*Math.min(1,dt*14);if(!this.active){requestAnimationFrame(t=>this.frame(t));return;}if(this.active&&this.mode==='defeat')this.fallAge=Math.min(.86,(this.fallAge||0)+dt);if(this.active&&!this.paused&&this.ready){this.time+=dt;let v=this.move;if(this.keys.size){let x=(this.keys.has('d')||this.keys.has('ArrowRight')?1:0)-(this.keys.has('a')||this.keys.has('ArrowLeft')?1:0),y=(this.keys.has('s')||this.keys.has('ArrowDown')?1:0)-(this.keys.has('w')||this.keys.has('ArrowUp')?1:0),n=Math.hypot(x,y);v=n?{x:x/n,y:y/n}:{x:0,y:0};}this.moving=Math.hypot(v.x,v.y)>.02;this.hero.x=Math.max(750,Math.min(2200,this.hero.x+v.x*210*dt));this.hero.y=Math.max(850,Math.min(3250,this.hero.y+v.y*210*dt));if(this.moving){this.lastSweep=null;if(Math.abs(v.x)>.01)this.face=v.x<0?-1:1;this.sweepAge=0;}else{let near=this.actors().sort((a,b)=>Math.hypot(a.x-this.hero.x,a.y-this.hero.y)-Math.hypot(b.x-this.hero.x,b.y-this.hero.y))[0];this.nearest=near?.id;this.face=near&&Math.abs(near.x-this.hero.x)>2?(near.x<this.hero.x?-1:1):this.face;this.sweepAge=(this.sweepAge||0)+dt;let slot=Math.floor(this.sweepAge/1.6);if(this.sweepAge%1.6>=.4&&this.lastSweep!==slot){this.lastSweep=slot;this.cue('knife-cast');}}}else this.stopAudio();this.draw();requestAnimationFrame(t=>this.frame(t));}
 actors(){
  // Each authored encounter is placed once at its entry, then remains in world space.
  // This keeps the next design beat visible after free dragging; it is not chasing AI.
  const origin=this.modeOrigin||{x:1460,y:1800},at=(id,dx,dy,kind,height)=>({id,x:Math.max(805,Math.min(2145,origin.x+dx)),y:Math.max(920,Math.min(3150,origin.y+dy)),kind,height});
  if(['boss','defeat','victory'].includes(this.mode))return [at('BO04-presentation',180,-60,'BO04',270)];
  if(['special','gear','finalPrepare'].includes(this.mode))return [at('EL02-presentation',180,0,'EL02',160)];
  if(this.mode==='ranged')return [at('EN03-presentation',170,0,'EN03',116),at('EN05-presentation',-240,80,'EN05',122)];
  return [at('EN01-A-presentation',170,0,'EN01',108),at('EN01-B-presentation',-240,80,'EN01',108)];
 }
 clip(id,t,loop=true){let k=this.manifest.clips[id],list=k.frames,total=list.reduce((n,f)=>n+(f.durationMs||100),0),at=loop?t*1000%total:Math.min(total-.01,t*1000);for(let f of list){at-=f.durationMs||100;if(at<0)return {...k,...f};}return {...k,...list[list.length-1]};}
 sprite(f,x,y,height,face=1){let img=this.images.get(f.file);if(!img)return;let a=f.anchor||[img.width/2,img.height],scale=height/(f.referenceActorHeightPx||img.height),g=this.ctx;g.save();g.translate(x,y);g.scale(face*scale,scale);g.drawImage(img,-a[0],-a[1]);g.restore();}
 draw(){let c=this.canvas,g=this.ctx,w=c.clientWidth||390,h=c.clientHeight||844,dpr=Math.min(2,devicePixelRatio||1);if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);}g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle='#839482';g.fillRect(0,0,w,h);if(!this.ready)return;let scale=w/750,H=h/scale,cam={x:Math.max(375,Math.min(2225,this.hero.x)),y:Math.max(H/2,Math.min(3600-H/2,this.hero.y+H*(.5-this.viewAnchor)))};this.camera=cam;g.scale(scale,scale);g.translate(375-cam.x,H/2-cam.y);let map=this.images.get(this.manifest.world.file),ms=Math.max(2600/map.width,3600/map.height);g.drawImage(map,1300-map.width*ms/2,1800-map.height*ms/2,map.width*ms,map.height*ms);
  const actors=this.actors();for(const e of actors){g.fillStyle='#243e3440';g.beginPath();g.ellipse(e.x,e.y,28,7,0,0,Math.PI*2);g.fill();const f=this.actorArt[e.kind]||(e.kind==='EN03'?this.manifest.legacy['EN03-move-01']:this.manifest.legacy['EN05-ready']);this.sprite(f,e.x,e.y,e.height,e.x>this.hero.x?-1:1);}
  // Repeated representative VFX drawings only: no projectile entities or hit tests.
  // Displayed only while standing, so these attached illustrative paths never drag behind the hero.
  if(!this.moving&&this.mode!=='defeat')for(const [id,period,speed,life,height]of [['SK01',1.05,480,.95,86],['SK08',3.5,420,1.35,92]]){
   const phase=this.time%period;if(this.displaySkills.includes(id)&&phase<life){g.save();g.globalAlpha=Math.min(1,(life-phase)*5);this.sprite(this.manifest.legacy[id+'-world-body'],this.hero.x+this.face*(25+speed*phase),this.hero.y-43,height,this.face);g.restore();}
  }
  // Authored fixed warning geometry only. No target tracking, collisions or hits.
  const warn=(x,y,count,spread,range,angle)=>{g.strokeStyle='#a43f2ecc';g.lineWidth=4;for(let n=0;n<count;n++){const q=angle+(count===1?0:(n/(count-1)*2-1)*spread)*Math.PI/180;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(q)*range,y+Math.sin(q)*range);g.stroke();}};
  if(this.mode==='ranged'&&(this.time-(this.modeStartedAt||0))%4<.9)warn(actors[1].x,actors[1].y,1,0,700,0);
  if(this.mode==='special'&&(this.time-(this.modeStartedAt||0))%4.8<1.2)warn(actors[0].x,actors[0].y,3,16,650,2.9);
  if(this.mode==='boss'&&(this.time-(this.modeStartedAt||0))%5.4<1)warn(actors[0].x,actors[0].y,5,24,650,2.8);
  let t=(this.sweepAge||0)%1.6,clip=this.mode==='defeat'?'hero-fall':this.moving?'hero-run':t<1.1?'hero-sweep':'hero-idle';this.currentClip=clip;this.sprite(this.clip(clip,clip==='hero-fall'?this.fallAge:this.reduced?0:clip==='hero-run'?this.time:t,clip==='hero-run'),this.hero.x,this.hero.y,96,this.face);
  if(!this.reduced&&!this.moving&&t>.4&&t<.567&&clip==='hero-sweep'){let theta=(-70+140*(t-.4)/.167)*Math.PI/180;g.strokeStyle='#e7d5a3c0';g.lineWidth=5;g.beginPath();for(let i=0;i<5;i++){let q=theta-.06+i*.03,x=this.hero.x+Math.cos(q)*155*this.face,y=this.hero.y+Math.sin(q)*155;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
  let drop=this.manifest.legacy['PICK-XP01'];if(this.mode==='loot'||this.pickupAt!==undefined){let u=this.pickupAt===undefined?0:Math.min(1,(this.time-this.pickupAt)/.44);if(u<1){const d=this.dropOrigin||{x:this.hero.x+70,y:this.hero.y+60};this.sprite(drop,d.x+(this.hero.x-d.x)*u*u,d.y+(this.hero.y-d.y)*u*u,38);}}
 }
 snapshot(){return {scope:'presentation-only-no-gameplay',ready:this.ready,error:this.error,active:this.active,paused:this.paused,mode:this.mode,time:this.time,hero:{...this.hero},camera:this.camera,selectionViewAnchor:this.viewAnchor,moving:!!this.moving,face:this.face,nearest:this.nearest,clip:this.currentClip,actors:this.actors().map(x=>({...x})),sourceVersion:this.manifest?.approvedHeroVersion,noHPOrCollisionOrEconomy:true};}
};
