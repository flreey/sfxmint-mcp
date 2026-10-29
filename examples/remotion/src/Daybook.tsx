import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const ink='#183d38', green='#c5efb0', paper='#f5f4ee', muted='#74817c';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=(f:number,start:number,len=20)=>interpolate(f,[start,start+len],[0,1],clamp);
const Mark=({size=60}:{size?:number})=><svg width={size} height={size} viewBox="0 0 60 60"><rect width="60" height="60" rx="19" fill={ink}/><path d="M18 18h12c16 0 18 24 0 24H18z" fill={green}/><path d="M25 24h5c8 0 8 12 0 12h-5z" fill={ink}/></svg>;
export const Daybook=()=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 const clicked=f>=60; const moved=f>=180; const done=f>=300; const logo=f>=420;
 const s=spring({fps,frame:Math.max(0,f-300),config:{damping:14}});
 const out=ease(f,414,6); const reveal=spring({fps,frame:Math.max(0,f-420),config:{damping:18}});
 const slide=ease(f,180,18);
 const phase=logo?3:done?2:moved?1:clicked?0:-1;
 const titles=['A small action.','A clearer picture.','A little progress.','Every day, in balance.'];
 return <AbsoluteFill style={{background:paper,fontFamily:'Arial, sans-serif',color:ink}}>
  <div style={{position:'absolute',left:64,top:40,display:'flex',alignItems:'center',gap:12}}><Mark size={34}/><span style={{fontWeight:700,fontSize:23,letterSpacing:-1}}>daybook</span></div>
  <div style={{position:'absolute',right:64,top:49,fontSize:12,letterSpacing:3,color:muted}}>SOUND STUDY / 01</div>
  <div style={{position:'absolute',left:84,top:173,width:420,opacity:1-out,transform:`translateY(${(1-ease(f,0,24))*16}px)`}}>
   <div style={{fontSize:12,letterSpacing:3,color:muted,marginBottom:25}}>LESS FRICTION. MORE FOCUS.</div>
   <div style={{fontSize:62,fontWeight:600,letterSpacing:-3,lineHeight:1.07}}>{done?<>Room to<br/>feel good.</>:moved?<>See the<br/>bigger picture.</>:<>Little things.<br/>In their place.</>}</div>
   <div style={{fontSize:20,lineHeight:1.6,color:muted,marginTop:24,width:330}}>A calmer way to keep track<br/>of your everyday spending.</div>
  </div>
  <div style={{position:'absolute',left:620,top:132,width:540,height:435,borderRadius:28,background:'white',boxShadow:'0 22px 65px #183d3812',overflow:'hidden',opacity:1-out,transform:`translateY(${(1-ease(f,0,24))*24}px)`}}>
   <div style={{position:'absolute',inset:0,padding:36,transform:`translateX(${-slide*560}px)`,opacity:1-slide}}>
    <div style={{display:'flex',justifyContent:'space-between',fontSize:16,color:muted}}><span>Today, at a glance</span><span>THU 29</span></div>
    <div style={{fontSize:18,marginTop:35}}>Your daily budget</div>
    <div style={{fontSize:64,letterSpacing:-3,fontWeight:600,marginTop:10}}>$48<span style={{fontSize:24,color:muted}}>.00</span></div>
    <div style={{height:8,background:paper,borderRadius:4,marginTop:22}}><div style={{width:clicked?'68%':'43%',height:8,background:green,borderRadius:4}}/></div>
    <div style={{display:'flex',justifyContent:'space-between',marginTop:18,color:muted,fontSize:16}}><span>Lunch with friends</span><span>$24.00</span></div>
    <div style={{marginTop:30,padding:'19px 24px',borderRadius:14,background:clicked?green:ink,color:clicked?ink:'white',textAlign:'center',fontWeight:600,fontSize:19,transform:`scale(${1-0.03*Math.sin(Math.min(1,Math.max(0,(f-60)/10))*Math.PI)})`}}>{clicked?'✓  Expense added':'Add expense'}</div>
    {!clicked&&<div style={{position:'absolute',right:85,top:interpolate(f,[32,59],[375,340],clamp),opacity:ease(f,30,10),fontSize:28}}>↖</div>}
   </div>
   <div style={{position:'absolute',inset:0,padding:36,transform:`translateX(${(1-slide)*560}px)`,opacity:slide}}>
    <div style={{fontSize:16,color:muted}}>Your week is taking shape</div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:18}}><span style={{fontSize:38,fontWeight:600,letterSpacing:-1}}>Looking balanced.</span><span style={{fontSize:22}}>↗</span></div>
    <div style={{display:'flex',gap:16,height:135,alignItems:'flex-end',marginTop:23}}>{[0.46,0.72,0.57,0.85,0.65,0.48,0.35].map((h,i)=><div key={i} style={{flex:1,height:Math.max(2,135*h*ease(f,190+i*3,22)),background:i===3?ink:green,borderRadius:'7px 7px 3px 3px'}}/>)}</div>
    <div style={{display:'flex',justifyContent:'space-around',fontSize:12,color:muted,marginTop:12}}>{['M','T','W','T','F','S','S'].map((d,i)=><span key={i}>{d}</span>)}</div>
    <div style={{marginTop:28,padding:18,borderRadius:14,background:done?green:paper,display:'flex',alignItems:'center',gap:12}}><div style={{width:27,height:27,borderRadius:20,background:done?ink:'#d9ded6',color:green,display:'flex',alignItems:'center',justifyContent:'center',transform:`scale(${done?s:1})`}}>{done?'✓':'·'}</div><span style={{fontSize:17,fontWeight:600}}>{done?'Weekly goal reached. Nicely done.':'You’re getting closer to your goal.'}</span></div>
   </div>
  </div>
  {logo&&<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:reveal,transform:`scale(${0.9+0.1*reveal})`}}><Mark size={108}/><div style={{fontSize:72,fontWeight:600,letterSpacing:-4,marginTop:20}}>daybook</div><div style={{fontSize:23,color:muted,marginTop:15}}>Every day, in balance.</div></div>}
  <div style={{position:'absolute',left:64,right:64,bottom:50,display:'flex',gap:22}}>{['CLICK','TRANSITION','SUCCESS','REVEAL'].map((name,i)=><div key={name} style={{flex:1}}><div style={{height:3,background:phase>=i?ink:'#dce1d7',marginBottom:14}}/><div style={{display:'flex',justifyContent:'space-between',fontSize:11,letterSpacing:2,color:phase===i?ink:muted}}><span>0{i+1} / {name}</span><span>{[2,6,10,14][i]}.0s</span></div></div>)}</div>
 </AbsoluteFill>;
};
