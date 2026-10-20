// ../@/conf/ayu.ts
var nop = () => {
};
var ayu = globalThis._zyu_ || {
  // @ts-ignore
  _load: (target) => import(target),
  _open: nop,
  opens: nop,
  builder: globalThis["-builder-"],
  env: {},
  tries: (call) => {
    try {
      return call();
    } catch (ex) {
    }
  },
  v: {},
  // cached: {},
  // 用于组件间通信，根据组件的生命周期来；
  weak: /* @__PURE__ */ new WeakMap()
};
globalThis["_zyu_"] = ayu;
ayu._port = (mod) => {
  const _id = document.currentScript?.src;
  if (ayu._id) {
    ayu.v[ayu._id] = mod;
  }
};
ayu.awc = (props) => {
  const View = props.raw.vino;
  if (View) {
    if (props.vuv) {
      const view = props.raw[props.vuv] || View;
      return view(props);
    }
    return View(props);
  }
  if (props.vuv) {
    props.loaded = (v) => {
      const preferred = v[props.vuv] || v.vino;
      return preferred(props);
    };
  }
  return ayu.loads(props);
};

// ../load/opt/ramd/rid/eturing/src/viewers/network.tsx
var vino = () => {
  return /* @__PURE__ */ jsx(ayu.html, { css: "padding: 4px" }, /* @__PURE__ */ jsx("style", null, styling), /* @__PURE__ */ jsx(ViewNetwork, null));
};
var page = {
  vino
};
var ViewNetwork = () => {
  const lib = window._lib;
  const root = lib.root || {};
  const W = 880, H = 560;
  const nodes = [];
  const edges = [];
  const walk = (node, parent, depth) => {
    const id = nodes.length;
    nodes.push({
      id,
      name: node.name || "(未命名节点)",
      note: node.note || "",
      type: node.type || "",
      depth,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      drag: false,
      el: null
    });
    if (parent >= 0) edges.push({ a: parent, b: id, el: null });
    for (const child of node.children || []) walk(child, id, depth + 1);
  };
  walk(root, -1, 0);
  const RX = [0, 170, 300, 400, 440];
  const RY = [0, 120, 210, 250, 270];
  const leaves = nodes.map(() => 0);
  const countLeaves = (id) => {
    let kids = 0, sum = 0;
    for (const e of edges) {
      if (e.a !== id) continue;
      kids++;
      sum += countLeaves(e.b);
    }
    leaves[id] = kids ? sum : 1;
    return leaves[id];
  };
  countLeaves(0);
  const placeRadial = (id, a0, a1) => {
    const n = nodes[id];
    const d = Math.min(n.depth, RX.length - 1);
    const mid = (a0 + a1) / 2;
    n.x = W / 2 + RX[d] * Math.cos(mid);
    n.y = H / 2 + RY[d] * Math.sin(mid);
    let acc = a0;
    for (const e of edges) {
      if (e.a !== id) continue;
      const span = (a1 - a0) * (leaves[e.b] / leaves[id]);
      placeRadial(e.b, acc, acc + span);
      acc += span;
    }
  };
  const clampX = (x) => Math.min(Math.max(x, 70), W - 70);
  const clampY = (y) => Math.min(Math.max(y, 40), H - 40);
  const drawNode = (n) => {
    n.el.style.left = n.x + "px";
    n.el.style.top = n.y + "px";
  };
  const drawEdge = (e) => {
    const a = nodes[e.a], b = nodes[e.b];
    const dx = b.x - a.x, dy = b.y - a.y;
    e.el.style.left = a.x + "px";
    e.el.style.top = a.y + "px";
    e.el.style.width = Math.hypot(dx, dy) + "px";
    e.el.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
  };
  const drawAll = () => {
    for (const e of edges) drawEdge(e);
    for (const n of nodes) drawNode(n);
  };
  let running = false, ticks = 0;
  const step = (draw) => {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) {
          dx = Math.random() - 0.5;
          dy = Math.random() - 0.5;
          d2 = 1;
        }
        const d = Math.sqrt(d2);
        const f = 9e3 / d2;
        const fx = dx / d * f, fy = dy / d * f;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }
    for (const e of edges) {
      const a = nodes[e.a], b = nodes[e.b];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.max(Math.hypot(dx, dy), 1);
      const f = (d - 150) * 0.02;
      const fx = dx / d * f, fy = dy / d * f;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }
    for (const n of nodes) {
      n.vx += (W / 2 - n.x) * 0.02;
      n.vy += (H / 2 - n.y) * 0.02;
    }
    let energy = 0;
    for (const n of nodes) {
      if (n.drag) {
        n.vx = 0;
        n.vy = 0;
        continue;
      }
      n.vx *= 0.8;
      n.vy *= 0.8;
      const v = Math.hypot(n.vx, n.vy);
      if (v > 10) {
        n.vx *= 10 / v;
        n.vy *= 10 / v;
      }
      n.x = clampX(n.x + n.vx);
      n.y = clampY(n.y + n.vy);
      energy += n.vx * n.vx + n.vy * n.vy;
    }
    if (draw) drawAll();
    return energy;
  };
  const tick = () => {
    const e = step(true);
    if (e > 0.5 && ticks++ < 600) requestAnimationFrame(tick);
    else running = false;
  };
  const kick = () => {
    if (!running) {
      running = true;
      ticks = 0;
      requestAnimationFrame(tick);
    }
  };
  const canvas = /* @__PURE__ */ jsx("div", { cls: "net-canvas" });
  for (const e of edges) {
    e.el = /* @__PURE__ */ jsx("i", { cls: "net-edge" });
    canvas.append(e.el);
  }
  for (const n of nodes) {
    const el = /* @__PURE__ */ jsx("div", { cls: n.depth === 0 ? "net-node root" : "net-node", title: n.note || n.name }, /* @__PURE__ */ jsx("span", { cls: "net-name" }, n.name));
    if (n.type) el.append(/* @__PURE__ */ jsx("span", { cls: "net-type" }, n.type));
    el.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const ox = ev.clientX - rect.left - n.x;
      const oy = ev.clientY - rect.top - n.y;
      el.setPointerCapture(ev.pointerId);
      el.classList.add("drag");
      n.drag = true;
      const move = (e) => {
        n.x = clampX(e.clientX - rect.left - ox);
        n.y = clampY(e.clientY - rect.top - oy);
        drawAll();
        kick();
      };
      const up = () => {
        n.drag = false;
        el.classList.remove("drag");
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
    n.el = el;
    canvas.append(el);
  }
  placeRadial(0, -Math.PI / 2, Math.PI * 1.5);
  for (let i = 0; i < 160; i++) step(false);
  drawAll();
  const reset = () => {
    placeRadial(0, -Math.PI / 2, Math.PI * 1.5);
    for (const n of nodes) {
      n.vx = 0;
      n.vy = 0;
    }
    for (let i = 0; i < 160; i++) step(false);
    drawAll();
    kick();
  };
  const head = /* @__PURE__ */ jsx("header", { cls: "net-head" }, /* @__PURE__ */ jsx("h2", null, "网络视图 Network"), /* @__PURE__ */ jsx("span", { cls: "hint" }, "_lib.root.children 节点树 · 忽略 hooks · 拖拽节点整理布局"), /* @__PURE__ */ jsx("button", { cls: "net-btn", clk: reset }, "重置布局"));
  const wrap = /* @__PURE__ */ jsx("section", { cls: "net-view" }, head, /* @__PURE__ */ jsx("div", { cls: "net-scroll" }, canvas), /* @__PURE__ */ jsx("div", { cls: "net-cap" }, "节点 = children 树节点（根节点作中心锚点）· 连线 = 父子关系 · 悬停节点可查看 note"));
  return wrap;
};
var styling = `
:host {
	display: block;
	--line: #dbe2ec;
	--muted: #8492a6;
	--soft: #f6f8fb;
	--blue: #2563eb;
	--purple: #7c3aed;
	--ink: #2a3646;
	--mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.net-view { max-width: 920px; }
.net-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px; }
h2 { margin: 0; font-size: 20px; color: #36f; letter-spacing: .02em; }
.net-head .hint { font-size: 12px; color: var(--muted); }
.net-btn { margin-left: auto; flex: none; padding: 2px 12px; font-size: 12px; font-family: inherit; color: var(--blue); background: #fff; border: 1px solid #cfdcf9; border-radius: 6px; cursor: pointer; }
.net-btn:hover { color: #fff; background: var(--blue); }
.net-scroll { overflow-x: auto; }
.net-canvas { position: relative; width: 880px; height: 560px; border: 1px solid var(--line); border-radius: 12px; background-color: var(--soft); background-image: radial-gradient(circle, #e2e9f3 1px, transparent 1px); background-size: 24px 24px; overflow: hidden; user-select: none; }
.net-edge { position: absolute; left: 0; top: 0; height: 2px; margin-top: -1px; background: #c5d1e2; transform-origin: 0 50%; border-radius: 1px; pointer-events: none; }
.net-node { position: absolute; z-index: 2; display: flex; align-items: center; gap: 6px; padding: 4px 12px; background: #fff; border: 1px solid var(--line); border-radius: 999px; box-shadow: 0 1px 4px rgba(31, 51, 82, .08); font-size: 13px; font-weight: 600; color: var(--ink); white-space: nowrap; cursor: grab; touch-action: none; transform: translate(-50%, -50%); }
.net-node:hover { border-color: var(--blue); box-shadow: 0 2px 10px rgba(37, 99, 235, .18); }
.net-node.drag { cursor: grabbing; border-color: var(--blue); box-shadow: 0 4px 14px rgba(37, 99, 235, .28); }
.net-node.root { background: var(--blue); border-color: var(--blue); color: #fff; font-size: 14px; }
.net-type { font-family: var(--mono); font-size: 10px; line-height: 16px; padding: 0 6px; border-radius: 4px; color: var(--purple); background: #f3ecfe; }
.net-node.root .net-type { color: #e2ecff; background: rgba(255, 255, 255, .18); }
.net-cap { margin-top: 8px; font-size: 11px; color: var(--muted); }
`;
export {
  page
};
