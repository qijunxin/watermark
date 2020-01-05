'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 });
const cache = new Map(),
  removeDigits = t => 0 | t,
  normalize = t => {
    const {
      marginTop: e = 48,
      marginLeft: o = 60,
      fontSize: n = 14,
      fontFamily: i = 'PingFang SC,Microsoft YaHei,sans-serif',
      color: a = 'rgba(191, 195, 199, 0.3)',
      content: s = '',
      rotate: l = -30,
      type: r = 'canvas',
      mountEl: c = document.body,
      styles: d = {},
    } = t;
    return {
      marginTop: e,
      marginLeft: o,
      fontSize: n,
      fontFamily: i,
      color: a,
      content: s,
      rotate: l,
      mountEl: c,
      type: 'svg' === r ? r : 'canvas',
      styles: d,
    };
  },
  getWatermark = t => {
    const {
      marginTop: e,
      marginLeft: o,
      fontSize: n,
      fontFamily: i,
      color: a,
      content: s,
      rotate: l,
      type: r,
    } = normalize(t);
    if (cache.has(s) && cache.get(s).backgroundImage) return cache.get(s);
    const [c, d] = getTextRect(s, n, i),
      p = (Math.PI / 180) * l,
      m = Math.abs(Math.cos(p)),
      g = Math.abs(Math.sin(p)),
      h = removeDigits(c * m + d * g + o),
      y = removeDigits(d * m + c * g + e),
      x =
        'svg' === r
          ? (() => {
              const t = `\n    <svg xmlns="http://www.w3.org/2000/svg" width="${h}" height="${y}">\n      <text xml:space="preserve"\n        x="${(h -
                c) /
                2}"\n        y="${y /
                2}"\n        fill="${a}"\n        stroke="none"\n        transform="rotate(${l}, ${h / 2} ${y /
                2})"\n        style="font-size: ${n}px; font-family: ${i};font-weight: 300;">\n        ${s}\n      </text>\n    </svg>`;
              return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(t)))}`;
            })()
          : (() => {
              const t = document.createElement('canvas'),
                e = t.getContext('2d'),
                o = getPixelRatio(e);
              t.setAttribute('width', h * o + 'px'), t.setAttribute('height', y * o + 'px'), e.scale(o, o);
              const l = `200 ${n}px "${i}"`;
              return (
                (e.font = l),
                (e.fillStyle = a),
                (e.textBaseline = 'top'),
                e.translate(h / 2, y / 2),
                e.rotate(p),
                e.fillText(s, -c / 2, -d / 2),
                t.toDataURL()
              );
            })();
    return { backgroundImage: `url(${x})`, backgroundSize: `${h}px ${y}px`, dataUrl: x };
  },
  setWatermark = t => {
    const {
        marginTop: e,
        marginLeft: o,
        fontSize: n,
        fontFamily: i,
        color: a,
        content: s,
        rotate: l,
        mountEl: r,
        styles: c,
      } = normalize(t),
      d = r.clientWidth,
      p = r.clientHeight,
      m = Math.sqrt(d * d + p * p),
      [g, h] = getTextRect(s, n, i),
      y = (Math.PI / 180) * l,
      x = Math.abs(Math.cos(y)),
      f = Math.abs(Math.sin(y));
    let u, w;
    l % 90 == 0 ? ((u = g + o), (w = h + e)) : ((u = (h * f + o) / x + g), (w = (h * x + e) / f + h));
    const $ = document.createElement('div'),
      b = {
        pointerEvents: 'none',
        position: 'absolute',
        left: '0',
        top: '0',
        width: `${d}px`,
        height: `${p}px`,
        margin: '0px',
        padding: '0px',
        overflow: 'hidden',
        fontSize: `${n}px`,
        fontFamily: i,
        boxSizing: 'border-box',
        zIndex: '-1',
        color: a,
        ...c,
      };
    Object.assign($.style, b);
    const v = document.createElement('div');
    (v.style.position = 'absolute'),
      (v.style.left = `${(d - m) / 2}px`),
      (v.style.top = `${(p - m) / 2}px`),
      (v.style.transform = `rotate3d(0,0,1,${l}deg)`),
      (v.style.width = `${m}px`),
      (v.style.height = `${m}px`),
      (v.style.overflow = 'hidden');
    let S = 0,
      k = 0;
    const M = Math.ceil(m / u),
      z = Math.ceil(m / w);
    for (let t = 0; t < M; t++) {
      S = u * t;
      for (let t = 0; t < z; t++) {
        k = w * t;
        const e = createTile({ content: s, left: S, top: k, width: u, height: w, rotate: l });
        v.appendChild(e);
      }
    }
    $.appendChild(v);
    const { position: C } = getComputedStyle(r);
    return (C && 'static' !== C) || (r.style.position = 'relative'), r.appendChild($), $;
  };
function createTile({ content: t, left: e, top: o, width: n, height: i }) {
  const a = document.createElement('div');
  return (
    a.appendChild(document.createTextNode(t)),
    (a.style.position = 'absolute'),
    (a.style.width = `${n}px`),
    (a.style.height = `${i}px`),
    (a.style.left = `${e}px`),
    (a.style.top = `${o}px`),
    (a.style.display = 'flex'),
    (a.style.justifyContent = 'center'),
    (a.style.alignItems = 'center'),
    (a.style.alignItems = 'center'),
    a
  );
}
const getTextRect = (t, e, o) => {
  const n = document.createElement('span');
  (n.style.fontSize = `${e}px`),
    (n.style.visibility = 'hidden'),
    (n.style.position = 'fixed'),
    (n.style.left = '0'),
    (n.style.top = '0'),
    (n.style.zIndex = '-1'),
    (n.style.padding = '0px'),
    (n.style.margin = '0px'),
    (n.style.fontFamily = o),
    (n.style.whiteSpace = 'pre');
  const i = document.createTextNode(t);
  n.appendChild(i);
  let a = window;
  try {
    window.top !== a && (a = window.top), a.document.body.appendChild(n);
  } catch (t) {
    (a = window), window.document.body.appendChild(n);
  }
  const { top: s, bottom: l, left: r, right: c } = n.getBoundingClientRect();
  return n.remove ? n.remove() : a.document.body.removeChild(n), [c - r, l - s];
};
function getPixelRatio(t) {
  const e =
    t.backingStorePixelRatio ||
    t.webkitBackingStorePixelRatio ||
    t.mozBackingStorePixelRatio ||
    t.msBackingStorePixelRatio ||
    t.oBackingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / e;
}
(exports.getWatermark = getWatermark), (exports.setWatermark = setWatermark);