var E = Object.defineProperty;
var P = (m, n, t) => n in m ? E(m, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : m[n] = t;
var C = (m, n, t) => (P(m, typeof n != "symbol" ? n + "" : n, t), t);
class _ {
  constructor() {
    C(this, "cv");
    if ("cv" in window)
      this.cv = window.cv;
    else
      throw new Error("OpenCV not found");
  }
  detect(n) {
    let t = this.cv;
    const c = t.imread(n), o = new t.Mat();
    t.cvtColor(c, o, t.COLOR_RGBA2GRAY);
    const e = new t.Mat();
    t.GaussianBlur(o, e, new t.Size(5, 5), 0, 0, t.BORDER_DEFAULT);
    const d = new t.Mat();
    t.threshold(e, d, 0, 255, t.THRESH_BINARY + t.THRESH_OTSU);
    let l = new t.MatVector(), f = new t.Mat();
    t.findContours(
      d,
      l,
      f,
      t.RETR_CCOMP,
      t.CHAIN_APPROX_SIMPLE
    );
    let D = 0, a = -1;
    for (let u = 0; u < l.size(); ++u) {
      let s = t.contourArea(l.get(u));
      s > D && (D = s, a = u);
    }
    const i = l.get(a), h = this.getCornerPoints(i);
    return c.delete(), o.delete(), e.delete(), d.delete(), l.delete(), f.delete(), h;
  }
  crop(n, t, c, o) {
    const e = this.cv, d = document.createElement("canvas"), l = e.imread(n);
    t || (t = this.detect(n));
    let f = new e.Mat();
    c || (c = Math.max(this.distance(t[0], t[1]), this.distance(t[2], t[3]))), o || (o = Math.max(this.distance(t[0], t[3]), this.distance(t[1], t[2])));
    let D = new e.Size(c, o), a = e.matFromArray(4, 1, e.CV_32FC2, [
      t[0].x,
      t[0].y,
      t[1].x,
      t[1].y,
      t[3].x,
      t[3].y,
      t[2].x,
      t[2].y
    ]), i = e.matFromArray(4, 1, e.CV_32FC2, [
      0,
      0,
      c,
      0,
      0,
      o,
      c,
      o
    ]), h = e.getPerspectiveTransform(a, i);
    return e.warpPerspective(
      l,
      f,
      h,
      D,
      e.INTER_LINEAR,
      e.BORDER_CONSTANT,
      new e.Scalar()
    ), e.imshow(d, f), l.delete(), f.delete(), d;
  }
  distance(n, t) {
    return Math.hypot(n.x - t.x, n.y - t.y);
  }
  getCornerPoints(n) {
    let t = this.cv, c = [];
    const e = t.minAreaRect(n).center;
    let d, l = 0, f, D = 0, a, i = 0, h, u = 0;
    for (let s = 0; s < n.data32S.length; s += 2) {
      const r = { x: n.data32S[s], y: n.data32S[s + 1] }, y = this.distance(r, e);
      r.x < e.x && r.y < e.y ? y > l && (d = r, l = y) : r.x > e.x && r.y < e.y ? y > D && (f = r, D = y) : r.x < e.x && r.y > e.y ? y > i && (a = r, i = y) : r.x > e.x && r.y > e.y && y > u && (h = r, u = y);
    }
    return c.push(d), c.push(f), c.push(h), c.push(a), c;
  }
}
let w;
function I(m) {
  w = m;
}
const v = document.createElement("canvas");
window.Dynamsoft && (w = window.Dynamsoft.DDV);
if (!w) {
  class m {
  }
  w = { DocumentDetect: m };
}
class O extends w.DocumentDetect {
  constructor(t) {
    super();
    C(this, "documentScanner");
    this.documentScanner = t;
  }
  // Rewrite the detect method
  async detect(t, c) {
    const o = [];
    try {
      let a = t.width, i = t.height, h = 1, u;
      const s = 720;
      i > s ? (h = i / s, i = s, a = Math.floor(a / h), u = this.compress(t.data, t.width, t.height, a, i)) : u = t.data.slice(0), v.width = a, v.height = i;
      const r = v.getContext("2d");
      if (r) {
        const y = r.createImageData(a, i);
        var e = y.data, d = u, l = new Uint8Array(d);
        e.set(l), r.putImageData(y, 0, 0), this.documentScanner.detect(v).forEach((x) => {
          o.push([x.x * h, x.y * h]);
        });
      }
    } catch (a) {
      console.log(a), o.push([0, 0]), o.push([0, 0]), o.push([0, 0]), o.push([0, 0]);
    }
    const f = {
      location: o,
      width: t.width,
      height: t.height,
      config: c
    }, D = this.processDetectResult(f);
    return Promise.resolve(D);
  }
  compress(t, c, o, e, d) {
    let l = null;
    try {
      l = new Uint8ClampedArray(t);
    } catch {
      l = new Uint8Array(t);
    }
    const f = e / c, D = d / o, a = e * d * 4, i = new ArrayBuffer(a);
    let h = null;
    try {
      h = new Uint8ClampedArray(i, 0, a);
    } catch {
      h = new Uint8Array(i, 0, a);
    }
    const u = (s, r) => {
      const y = Math.min(c - 1, s / f), A = Math.min(o - 1, r / D), x = Math.floor(y), p = Math.floor(A);
      let M = r * e + s, S = p * c + x;
      M *= 4, S *= 4;
      for (let R = 0; R <= 3; R += 1)
        h[M + R] = l[S + R];
    };
    for (let s = 0; s < e; s += 1)
      for (let r = 0; r < d; r += 1)
        u(s, r);
    return h;
  }
}
export {
  _ as DocumentScanner,
  O as OpenCVDocumentDetectHandler,
  I as setDDV
};
