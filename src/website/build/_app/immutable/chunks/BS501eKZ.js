import{S as x,a3 as k,a4 as K,k as c,a5 as L,K as o,N as R,U as u,E as w,_ as F,a6 as M,a7 as U,a8 as Y,b as q,h as T,d as B,a9 as C,aa as H,ab as Z,ac as z,ad as A,u as O,j as S,v as D,x as G}from"./Ch4HhSdZ.js";function b(s,g=null,E){if(typeof s!="object"||s===null||x in s)return s;const v=U(s);if(v!==k&&v!==K)return s;var r=new Map,l=Y(s),_=c(0);l&&r.set("length",c(s.length));var y;return new Proxy(s,{defineProperty(f,e,t){(!("value"in t)||t.configurable===!1||t.enumerable===!1||t.writable===!1)&&L();var n=r.get(e);return n===void 0?(n=c(t.value),r.set(e,n)):o(n,b(t.value,y)),!0},deleteProperty(f,e){var t=r.get(e);if(t===void 0)e in f&&r.set(e,c(u));else{if(l&&typeof e=="string"){var n=r.get("length"),a=Number(e);Number.isInteger(a)&&a<n.v&&o(n,a)}o(t,u),j(_)}return!0},get(f,e,t){var d;if(e===x)return s;var n=r.get(e),a=e in f;if(n===void 0&&(!a||(d=R(f,e))!=null&&d.writable)&&(n=c(b(a?f[e]:u,y)),r.set(e,n)),n!==void 0){var i=w(n);return i===u?void 0:i}return Reflect.get(f,e,t)},getOwnPropertyDescriptor(f,e){var t=Reflect.getOwnPropertyDescriptor(f,e);if(t&&"value"in t){var n=r.get(e);n&&(t.value=w(n))}else if(t===void 0){var a=r.get(e),i=a==null?void 0:a.v;if(a!==void 0&&i!==u)return{enumerable:!0,configurable:!0,value:i,writable:!0}}return t},has(f,e){var i;if(e===x)return!0;var t=r.get(e),n=t!==void 0&&t.v!==u||Reflect.has(f,e);if(t!==void 0||F!==null&&(!n||(i=R(f,e))!=null&&i.writable)){t===void 0&&(t=c(n?b(f[e],y):u),r.set(e,t));var a=w(t);if(a===u)return!1}return n},set(f,e,t,n){var I;var a=r.get(e),i=e in f;if(l&&e==="length")for(var d=t;d<a.v;d+=1){var h=r.get(d+"");h!==void 0?o(h,u):d in f&&(h=c(u),r.set(d+"",h))}a===void 0?(!i||(I=R(f,e))!=null&&I.writable)&&(a=c(void 0),o(a,b(t,y)),r.set(e,a)):(i=a.v!==u,o(a,b(t,y)));var m=Reflect.getOwnPropertyDescriptor(f,e);if(m!=null&&m.set&&m.set.call(n,t),!i){if(l&&typeof e=="string"){var P=r.get("length"),N=Number(e);Number.isInteger(N)&&N>=P.v&&o(P,N+1)}j(_)}return!0},ownKeys(f){w(_);var e=Reflect.ownKeys(f).filter(a=>{var i=r.get(a);return i===void 0||i.v!==u});for(var[t,n]of r)n.v!==u&&!(t in f)&&e.push(t);return e},setPrototypeOf(){M()}})}function j(s,g=1){o(s,s.v+g)}function Q(s,g,E=!1){T&&B();var v=s,r=null,l=null,_=u,y=E?C:0,f=!1;const e=(n,a=!0)=>{f=!0,t(a,n)},t=(n,a)=>{if(_===(_=n))return;let i=!1;if(T){const d=v.data===H;!!_===d&&(v=Z(),z(v),A(!1),i=!0)}_?(r?O(r):a&&(r=S(()=>a(v))),l&&D(l,()=>{l=null})):(l?O(l):a&&(l=S(()=>a(v))),r&&D(r,()=>{r=null})),i&&A(!0)};q(()=>{f=!1,g(e),f||t(null,null)},y),T&&(v=G)}export{Q as i,b as p};
