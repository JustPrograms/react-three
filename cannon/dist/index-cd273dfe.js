import e,{useContext as n,useState as t,useRef as r,useEffect as o,useLayoutEffect as i,useMemo as s,createContext as a,Suspense as u,lazy as c}from"react";import{Object3D as l,MathUtils as p,InstancedMesh as d,DynamicDrawUsage as f,Geometry as m,Vector3 as g,Face3 as y}from"three";import{useFrame as b}from"react-three-fiber";function v(){return(v=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}const M=new l;function x(e,n,t){return n.args=t(n.args),e.position.set(...n.position||[0,0,0]),e.rotation.set(...n.rotation||[0,0,0]),n}function h(e,n,t){void 0!==n&&(e.position.fromArray(t.positions,3*n),e.quaternion.fromArray(t.quaternions,4*n))}let C=0;function w(e,t,o,a){const u=r(null),c=a||u,{worker:p,bodies:m,buffers:g,refs:y,events:w,subscriptions:F}=n(_);i(()=>{c.current||(c.current=new l);const n=c.current,r=p;let i,s=[n.uuid];return n instanceof d?(n.instanceMatrix.setUsage(f),s=new Array(n.count).fill(0).map((e,t)=>n.uuid+"/"+t),i=s.map((e,r)=>{const i=x(M,t(r),o);return M.updateMatrix(),n.setMatrixAt(r,M.matrix),n.instanceMatrix.needsUpdate=!0,i})):i=[x(n,t(0),o)],i.forEach((e,t)=>{y[s[t]]=n,e.onCollide&&(w[s[t]]=e.onCollide,e.onCollide=!0)}),r.postMessage({op:"addBodies",type:e,uuid:s,props:i}),()=>{i.forEach((e,n)=>{delete y[s[n]],e.onCollide&&delete w[s[n]]}),r.postMessage({op:"removeBodies",uuid:s})}},[]),b(()=>{if(c.current&&g.positions.length&&g.quaternions.length)if(c.current instanceof d)for(let e=0;e<c.current.count;e++){const n=m.current[c.current.uuid+"/"+e];void 0!==n&&(h(M,n,g),M.updateMatrix(),c.current.setMatrixAt(e,M.matrix)),c.current.instanceMatrix.needsUpdate=!0}else h(c.current,m.current[c.current.uuid],g)});const U=s(()=>{const e=e=>void 0!==e?c.current.uuid+"/"+e:c.current.uuid,n=(n,t,r)=>c.current&&p.postMessage({op:n,uuid:e(t),props:r}),t=(e,t)=>r=>{const o=C++;return F[o]=r,n("subscribe",t,{id:o,type:e}),()=>{delete F[o],n("unsubscribe",t,o)}},r=(e,n)=>e+n.charAt(0).toUpperCase()+n.slice(1),o=(e,o)=>({set:(t,i,s)=>n(r("set",e),o,[t,i,s]),copy:({x:t,y:i,z:s})=>n(r("set",e),o,[t,i,s]),subscribe:t(e,o)}),i=(e,o)=>({set:t=>n(r("set",e),o,t),subscribe:t(e,o)});function s(e){return{position:o("position",e),rotation:o("quaternion",e),velocity:o("velocity",e),angularVelocity:o("angularVelocity",e),linearFactor:o("linearFactor",e),angularFactor:o("angularFactor",e),mass:i("mass",e),linearDamping:i("linearDamping",e),angularDamping:i("angularDamping",e),allowSleep:i("allowSleep",e),sleepSpeedLimit:i("sleepSpeedLimit",e),sleepTimeLimit:i("sleepTimeLimit",e),collisionFilterGroup:i("collisionFilterGroup",e),collisionFilterMask:i("collisionFilterMask",e),fixedRotation:i("fixedRotation",e),applyForce(t,r){n("applyForce",e,[t,r])},applyImpulse(t,r){n("applyImpulse",e,[t,r])},applyLocalForce(t,r){n("applyLocalForce",e,[t,r])},applyLocalImpulse(t,r){n("applyLocalImpulse",e,[t,r])}}}const a={};return v({},s(void 0),{at:e=>a[e]||(a[e]=s(e))})},[]);return[c,U]}function F(e,n){return w("Plane",e,()=>[],n)}function U(e,n){return w("Box",e,e=>e||[1,1,1],n)}function k(e,n){return w("Cylinder",e,e=>e,n)}function L(e,n){return w("Heightfield",e,e=>e,n)}function A(e,n){return w("Particle",e,()=>[],n)}function D(e,n){return w("Sphere",e,e=>[null!=e?e:1],n)}function P(e,n){return w("Trimesh",e,e=>{const n=e instanceof m?e.vertices:e[0],t=e instanceof m?e.faces:e[1];return[n.map(e=>e instanceof g?[e.x,e.y,e.z]:e),t.map(e=>e instanceof y?[e.a,e.b,e.c]:e)]},n)}function I(e,n){return w("ConvexPolyhedron",e,e=>{const n=e instanceof m?e.vertices:e[0],t=e instanceof m?e.faces:e[1],r=e instanceof m?e.faces.map(e=>e.normal):e[2];return[n.map(e=>e instanceof g?[e.x,e.y,e.z]:e),t.map(e=>e instanceof y?[e.a,e.b,e.c]:e),r&&r.map(e=>e instanceof g?[e.x,e.y,e.z]:e)]},n)}function S(e,n){return w("Compound",e,e=>e||[],n)}function q(e,t,i,a={},u=[]){const{worker:c}=n(_),l=p.generateUUID(),d=r(null),f=r(null);t=null==t?d:t,i=null==i?f:i,o(()=>{if(t.current&&i.current)return c.postMessage({op:"addConstraint",uuid:l,type:e,props:[t.current.uuid,i.current.uuid,a]}),()=>c.postMessage({op:"removeConstraint",uuid:l})},u);const m=s(()=>({enable:()=>c.postMessage({op:"enableConstraint",uuid:l}),disable:()=>c.postMessage({op:"disableConstraint",uuid:l})}),u);return[t,i,m]}function T(e,n,t,r=[]){return q("PointToPoint",e,n,t,r)}function j(e,n,t,r=[]){return q("ConeTwist",e,n,t,r)}function z(e,n,t,r=[]){return q("Distance",e,n,t,r)}function E(e,n,t,r=[]){return q("Hinge",e,n,t,r)}function R(e,n,t,r=[]){return q("Lock",e,n,t,r)}function B(e,i,s,a=[]){const{worker:u,events:c}=n(_),[l]=t(()=>p.generateUUID()),d=r(null),f=r(null);return e=null==e?d:e,i=null==i?f:i,o(()=>{if(e.current&&i.current)return u.postMessage({op:"addSpring",uuid:l,props:[e.current.uuid,i.current.uuid,s]}),c[l]=()=>{},()=>{u.postMessage({op:"removeSpring",uuid:l}),delete c[l]}},a),[e,i]}function O(e,r,i,s=[]){const{worker:a,events:u}=n(_),[c]=t(()=>p.generateUUID());o(()=>(u[c]=i,a.postMessage({op:"addRay",uuid:c,props:v({mode:e},r)}),()=>{a.postMessage({op:"removeRay",uuid:c}),delete u[c]}),s)}function G(e,n,t=[]){O("Closest",e,n,t)}function H(e,n,t=[]){O("Any",e,n,t)}function V(e,n,t=[]){O("All",e,n,t)}const _=a({}),J="undefined"==typeof window?()=>null:c(()=>import("./Provider-ddec59f7.js"));function K(n){return e.createElement(u,{fallback:null},e.createElement(J,n))}export{K as P,v as _,U as a,k as b,_ as c,L as d,A as e,D as f,P as g,I as h,S as i,T as j,j as k,z as l,E as m,R as n,B as o,G as p,H as q,V as r,F as u};
