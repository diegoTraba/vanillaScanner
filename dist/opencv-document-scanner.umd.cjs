(function(f,h){typeof exports=="object"&&typeof module<"u"?h(exports):typeof define=="function"&&define.amd?define(["exports"],h):(f=typeof globalThis<"u"?globalThis:f||self,h(f["opencv-document-scanner"]={}))})(this,function(f){"use strict";var g=Object.defineProperty;var _=(f,h,w)=>h in f?g(f,h,{enumerable:!0,configurable:!0,writable:!0,value:w}):f[h]=w;var A=(f,h,w)=>(_(f,typeof h!="symbol"?h+"":h,w),w);class h{constructor(){A(this,"cv");if("cv"in window)this.cv=window.cv;else throw new Error("OpenCV not found")}detect(u){let t=this.cv;const c=t.imread(u),r=new t.Mat;t.cvtColor(c,r,t.COLOR_RGBA2GRAY);const e=new t.Mat;t.GaussianBlur(r,e,new t.Size(5,5),0,0,t.BORDER_DEFAULT);const d=new t.Mat;t.threshold(e,d,0,255,t.THRESH_BINARY+t.THRESH_OTSU);let a=new t.MatVector,m=new t.Mat;t.findContours(d,a,m,t.RETR_CCOMP,t.CHAIN_APPROX_SIMPLE);let x=0,s=-1;for(let y=0;y<a.size();++y){let o=t.contourArea(a.get(y));o>x&&(x=o,s=y)}const l=a.get(s),i=this.getCornerPoints(l);return c.delete(),r.delete(),e.delete(),d.delete(),a.delete(),m.delete(),i}crop(u,t,c,r){const e=this.cv,d=document.createElement("canvas"),a=e.imread(u);t||(t=this.detect(u));let m=new e.Mat;c||(c=Math.max(this.distance(t[0],t[1]),this.distance(t[2],t[3]))),r||(r=Math.max(this.distance(t[0],t[3]),this.distance(t[1],t[2])));let x=new e.Size(c,r),s=e.matFromArray(4,1,e.CV_32FC2,[t[0].x,t[0].y,t[1].x,t[1].y,t[3].x,t[3].y,t[2].x,t[2].y]),l=e.matFromArray(4,1,e.CV_32FC2,[0,0,c,0,0,r,c,r]),i=e.getPerspectiveTransform(s,l);return e.warpPerspective(a,m,i,x,e.INTER_LINEAR,e.BORDER_CONSTANT,new e.Scalar),e.imshow(d,m),a.delete(),m.delete(),d}distance(u,t){return Math.hypot(u.x-t.x,u.y-t.y)}getCornerPoints(u){let t=this.cv,c=[];const e=t.minAreaRect(u).center;let d,a=0,m,x=0,s,l=0,i,y=0;for(let o=0;o<u.data32S.length;o+=2){const n={x:u.data32S[o],y:u.data32S[o+1]},D=this.distance(n,e);n.x<e.x&&n.y<e.y?D>a&&(d=n,a=D):n.x>e.x&&n.y<e.y?D>x&&(m=n,x=D):n.x<e.x&&n.y>e.y?D>l&&(s=n,l=D):n.x>e.x&&n.y>e.y&&D>y&&(i=n,y=D)}return c.push(d),c.push(m),c.push(i),c.push(s),c}}let w;function T(v){w=v}const C=document.createElement("canvas");if(window.Dynamsoft&&(w=window.Dynamsoft.DDV),!w){class v{}w={DocumentDetect:v}}class E extends w.DocumentDetect{constructor(t){super();A(this,"documentScanner");this.documentScanner=t}async detect(t,c){const r=[];try{let s=t.width,l=t.height,i=1,y;const o=720;l>o?(i=l/o,l=o,s=Math.floor(s/i),y=this.compress(t.data,t.width,t.height,s,l)):y=t.data.slice(0),C.width=s,C.height=l;const n=C.getContext("2d");if(n){const D=n.createImageData(s,l);var e=D.data,d=y,a=new Uint8Array(d);e.set(a),n.putImageData(D,0,0),this.documentScanner.detect(C).forEach(R=>{r.push([R.x*i,R.y*i])})}}catch(s){console.log(s),r.push([0,0]),r.push([0,0]),r.push([0,0]),r.push([0,0])}const m={location:r,width:t.width,height:t.height,config:c},x=this.processDetectResult(m);return Promise.resolve(x)}compress(t,c,r,e,d){let a=null;try{a=new Uint8ClampedArray(t)}catch{a=new Uint8Array(t)}const m=e/c,x=d/r,s=e*d*4,l=new ArrayBuffer(s);let i=null;try{i=new Uint8ClampedArray(l,0,s)}catch{i=new Uint8Array(l,0,s)}const y=(o,n)=>{const D=Math.min(c-1,o/m),M=Math.min(r-1,n/x),R=Math.floor(D),O=Math.floor(M);let S=n*e+o,P=O*c+R;S*=4,P*=4;for(let p=0;p<=3;p+=1)i[S+p]=a[P+p]};for(let o=0;o<e;o+=1)for(let n=0;n<d;n+=1)y(o,n);return i}}f.DocumentScanner=h,f.OpenCVDocumentDetectHandler=E,f.setDDV=T,Object.defineProperty(f,Symbol.toStringTag,{value:"Module"})});
