import{a as P,t as J}from"../chunks/Ce9dqvW3.js";import{p as B,f as F,t as G,a as H,E as y,I as U,s,c as o,J as E,r as l,K as v}from"../chunks/Ch4HhSdZ.js";import{d as N}from"../chunks/BmlV4D2q.js";import{i as O,p as Q}from"../chunks/BS501eKZ.js";import{r as K,t as R,U as S,s as V,f as W}from"../chunks/dahw8YVr.js";import{b as C}from"../chunks/EBAiWnVy.js";import{b as D}from"../chunks/MfDRg49V.js";import{o as X}from"../chunks/Cd1vMRAD.js";import{g as x}from"../chunks/CFQZ2VUz.js";import{P as Y}from"../chunks/BpTi1Je2.js";var Z=(n,e)=>{n.key==="Enter"&&e()},$=()=>x("/signup"),aa=(n,e)=>e(),ea=()=>x("/signup"),ta=(n,e)=>e(),sa=J('<main class="responsive fixed center middle"><h5>Login</h5> <div class="field label large fill round"><input type="text"> <label>Username</label></div> <div class="field label large fill round"><input type="password"> <label>API-Key</label></div> <nav class="center-align responsive m l"><button class="round fill extra"><i>add_circle</i> <span>Create Account</span></button> <button class="round extra primary"><i>login</i> <span>Login</span></button></nav> <nav class="center-align responsive s vertical"><button class="round fill extra responsive"><i>add_circle</i> <span>Create Account</span></button> <button class="round extra primary responsive"><i>login</i> <span>Login</span></button></nav></main>'),ra=J("<!> <div>Username or API-Key wrong!</div>",1);function ma(n,e){B(e,!0);let c=U(!1),i=new S,_=U(!1),d,m;X(()=>{d.focus()});async function f(){v(c,!0),await i.validateLogin()?x("/account"):(v(_,!0),setTimeout(()=>{v(_,!1)},5e3))}var w=ra(),h=F(w);{var M=t=>{var r=sa(),b=s(o(r),2),p=o(b);K(p),p.__keydown=a=>{a.key==="Enter"&&m.focus()},D(p,a=>d=a,()=>d),E(2),l(b);var g=s(b,2),u=o(g);K(u),u.__keydown=[Z,f],D(u,a=>m=a,()=>m),E(2),l(g);var k=s(g,2),I=o(k);I.__click=[$];var q=s(I,2);q.__click=[aa,f],l(k);var A=s(k,2),L=o(A);L.__click=[ea];var z=s(L,2);z.__click=[ta,f],l(A),l(r),C(p,()=>i.username,a=>i.username=a),C(u,()=>i.apikey,a=>i.apikey=a),R(3,r,()=>W,()=>({delay:100})),P(t,r)},T=t=>{Y(t,{get state(){return y(c)},set state(r){v(c,Q(r))}})};O(h,t=>{y(c)?t(T,!1):t(M)})}var j=s(h,2);G(()=>V(j,`snackbar error absolute center bottom ${(y(_)?"active":"")??""}`)),P(n,w),H()}N(["keydown","click"]);export{ma as component};
