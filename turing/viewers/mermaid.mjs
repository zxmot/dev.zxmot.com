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

// ../load/opt/ramd/rid/eturing/src/viewers/mermaid.tsx
var vino = () => {
  return /* @__PURE__ */ jsx(ayu.html, { css: "padding: 4px" }, /* @__PURE__ */ jsx("style", null, styling), /* @__PURE__ */ jsx("div", { cls: "body" }, /* @__PURE__ */ jsx(ViewDiagram, null)));
};
var page = {
  vino
};
var ViewDiagram = () => {
  const root = /* @__PURE__ */ jsx("div", { cls: "app" }, /* @__PURE__ */ jsx("header", null, /* @__PURE__ */ jsx("h1", null, "数据结构 → Mermaid"), /* @__PURE__ */ jsx("div", { cls: "tools" }, /* @__PURE__ */ jsx("button", { id: "btnRefresh" }, "刷新"), /* @__PURE__ */ jsx("button", { id: "btnSvg" }, "下载 SVG"), /* @__PURE__ */ jsx("button", { id: "btnCopy" }, "复制源码"), /* @__PURE__ */ jsx("div", { cls: "zoom" }, /* @__PURE__ */ jsx("button", { id: "btnZoomOut", title: "缩小" }, "−"), /* @__PURE__ */ jsx("span", { id: "zoomVal" }, "100%"), /* @__PURE__ */ jsx("button", { id: "btnZoomIn", title: "放大" }, "+"))), /* @__PURE__ */ jsx("div", { cls: "legend" }, /* @__PURE__ */ jsx("span", null, /* @__PURE__ */ jsx("i", null), "children"), /* @__PURE__ */ jsx("span", null, /* @__PURE__ */ jsx("i", { cls: "dash" }), "hooks"))), /* @__PURE__ */ jsx("div", { id: "meta" }, "等待数据…"), /* @__PURE__ */ jsx("main", { id: "stage" }));
  if (window.mermaid) {
    setTimeout(() => {
      setup(root);
    });
  } else {
    const script = (
      // or https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js
      /* @__PURE__ */ jsx("script", { src: "https://unpkg.com/mermaid@11.17.2/dist/mermaid.min.js" })
    );
    script.onload = () => {
      setup(root);
    };
    document.head.appendChild(script);
  }
  return root;
};
var setup = (root) => {
  var $ = function(s) {
    return root.querySelector(s);
  };
  var stage = $("#stage");
  var metaEl = $("#meta");
  var zoomVal = $("#zoomVal");
  var state = { code: "", scale: 1, rendering: false, seq: 0, lastRoot: void 0 };
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  if (!window.mermaid) {
    stage.innerHTML = '<div class="err">Mermaid CDN 加载失败，请检查网络后刷新页面。</div>';
    return;
  }
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    themeVariables: {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", "PingFang SC", sans-serif',
      fontSize: "13px",
      lineColor: "#94a3b8"
    },
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      useMaxWidth: false,
      nodeSpacing: 36,
      rankSpacing: 64,
      padding: 14
    }
  });
  function buildMermaid(inputRoot) {
    var root2 = inputRoot;
    if (Array.isArray(root2)) root2 = { name: "root", children: root2 };
    var idMap = /* @__PURE__ */ new WeakMap();
    var defined = /* @__PURE__ */ new WeakSet();
    var expanded = /* @__PURE__ */ new WeakSet();
    var edgeSet = /* @__PURE__ */ new Set();
    var nodes = [];
    var edges = [];
    var nodeCount = 0;
    var edgeCount = 0;
    var seq = 0;
    var isObj = function(v) {
      return v !== null && typeof v === "object";
    };
    var isFn = function(v) {
      return typeof v === "function";
    };
    var isRef = function(v) {
      return isObj(v) || isFn(v);
    };
    var asArr = function(v) {
      return v == null ? [] : Array.isArray(v) ? v : [v];
    };
    var esc = function(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "#quot;").replace(/\r?\n/g, " ");
    };
    function idOf(x) {
      if (!isRef(x)) return "lit" + seq++;
      var id = idMap.get(x);
      if (!id) {
        id = "n" + seq++;
        idMap.set(x, id);
      }
      return id;
    }
    function labelOf(x) {
      var lines = [];
      if (isFn(x)) {
        lines.push("<b>ƒ " + esc(x.name || "anonymous") + "</b>");
        return lines.join("<br/>");
      }
      if (!isObj(x)) return esc(String(x));
      var name = x.name != null && x.name !== "" ? String(x.name) : "(未命名)";
      lines.push("<b>" + esc(name) + "</b>");
      var meta = [];
      if (x.type != null) meta.push("[" + esc(x.type) + "]");
      var hk = asArr(x.hooks).length;
      var ck = asArr(x.children).length;
      if (hk) meta.push("hooks " + hk);
      if (ck) meta.push("children " + ck);
      if (meta.length) lines.push(esc(meta.join(" · ")));
      if (x.note != null) {
        var note = String(x.note).replace(/\s+/g, " ").trim();
        if (note.length > 60) note = note.slice(0, 60) + "…";
        lines.push("<i>" + esc(note) + "</i>");
      }
      if (x.on && typeof x.on === "object") {
        var onKeys = Object.keys(x.on);
        if (onKeys.length) {
          var shown = onKeys.slice(0, 5);
          if (onKeys.length > 5) shown.push("…");
          lines.push("on: " + esc(shown.join(", ")));
        }
      }
      if (isFn(x.hook)) lines.push("hook: " + esc(x.hook.name || "ƒ"));
      var fns = Object.keys(x).filter(function(k) {
        return isFn(x[k]) && k !== "hook";
      });
      if (fns.length) {
        var fs = fns.slice(0, 5);
        if (fns.length > 5) fs.push("…");
        lines.push("ƒ " + esc(fs.join(", ")));
      }
      return lines.join("<br/>");
    }
    function classOf(x) {
      if (!isObj(x)) return "anon";
      if (x.name == null || x.name === "") return "anon";
      if (x.type === "button") return "action";
      return "node";
    }
    function ensureNode(x) {
      var id = idOf(x);
      if (isRef(x)) {
        if (defined.has(x)) return id;
        defined.add(x);
      }
      nodeCount++;
      nodes.push("  " + id + '("' + labelOf(x) + '"):::' + classOf(x));
      return id;
    }
    function addEdge(from, to, kind) {
      var key = from + "|" + kind + "|" + to;
      if (edgeSet.has(key)) return;
      edgeSet.add(key);
      edgeCount++;
      edges.push(kind === "hook" ? "  " + from + " -.-> " + to : "  " + from + " --> " + to);
    }
    function walk(x) {
      var id = ensureNode(x);
      if (!isRef(x) || expanded.has(x)) return;
      expanded.add(x);
      asArr(x.hooks).forEach(function(h) {
        if (h == null) return;
        var hid = ensureNode(h);
        addEdge(id, hid, "hook");
        walk(h);
      });
      asArr(x.children).forEach(function(c) {
        if (c == null) return;
        var cid = ensureNode(c);
        addEdge(id, cid, "children");
        walk(c);
      });
    }
    walk(root2);
    var code = [
      "flowchart TD",
      "  classDef node   fill:#eef6ff,stroke:#3b82f6,stroke-width:1.5px,color:#0f172a;",
      "  classDef action fill:#fff7ed,stroke:#f97316,stroke-width:1.5px,color:#7c2d12;",
      "  classDef anon   fill:#f8fafc,stroke:#94a3b8,stroke-width:1px,stroke-dasharray:4 3,color:#475569;"
    ].concat(nodes, edges).join("\n");
    return { code, nodeCount, edgeCount };
  }
  function applyScale() {
    var svg = stage.querySelector("svg");
    if (!svg) return;
    if (!svg.dataset.baseW) {
      svg.dataset.baseW = String(svg.getBoundingClientRect().width || 900);
    }
    svg.style.width = Number(svg.dataset.baseW) * state.scale + "px";
    svg.style.height = "auto";
    svg.style.maxWidth = "none";
    zoomVal.textContent = Math.round(state.scale * 100) + "%";
  }
  async function render() {
    if (state.rendering) return;
    var root2 = window._lib && window._lib.root;
    if (!root2) {
      stage.innerHTML = '<div class="empty">未检测到 <code>window._lib.root</code><br/>填充数据后点击「刷新」，或点击「加载示例」。</div>';
      metaEl.textContent = "等待数据…";
      state.lastRoot = root2;
      return;
    }
    state.rendering = true;
    var built = buildMermaid(root2);
    state.code = built.code;
    try {
      var id = "mmd" + ++state.seq;
      var result = await mermaid.render(id, built.code);
      stage.innerHTML = result.svg;
      var svg = stage.querySelector("svg");
      if (svg) {
        svg.removeAttribute("height");
        svg.style.maxWidth = "none";
        svg.style.height = "auto";
        svg.dataset.baseW = String(svg.getBoundingClientRect().width || 900);
        applyScale();
      }
      metaEl.textContent = "节点 " + built.nodeCount + " 个 · 边 " + built.edgeCount + " 条 · 源: window._lib.root";
    } catch (err) {
      stage.innerHTML = '<div class="err">Mermaid 渲染失败：' + escapeHtml(String(err && err.message || err)) + "\n\n--- 生成的源码 ---\n" + escapeHtml(built.code) + "</div>";
      metaEl.textContent = "渲染失败";
    } finally {
      state.rendering = false;
      state.lastRoot = root2;
    }
  }
  $("#btnRefresh").addEventListener("click", render);
  $("#btnZoomIn").addEventListener("click", function() {
    state.scale = Math.min(3, Math.round((state.scale + 0.1) * 10) / 10);
    applyScale();
  });
  $("#btnZoomOut").addEventListener("click", function() {
    state.scale = Math.max(0.25, Math.round((state.scale - 0.1) * 10) / 10);
    applyScale();
  });
  $("#btnCopy").addEventListener("click", async function() {
    if (!state.code) return;
    try {
      await navigator.clipboard.writeText(state.code);
      metaEl.textContent = "已复制 Mermaid 源码到剪贴板";
    } catch (e) {
      metaEl.textContent = "复制失败：" + e.message;
    }
  });
  $("#btnSvg").addEventListener("click", function() {
    var svg = stage.querySelector("svg");
    if (!svg) return;
    var clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.style.width = "";
    clone.style.height = "";
    var data = new XMLSerializer().serializeToString(clone);
    var blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = /* @__PURE__ */ jsx("a", { href: url, download: "structure-graph.svg" });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 1e3);
  });
  render();
};
var styling = `
* { box-sizing: border-box; }
.body {
	margin: 0; height: 100vh; overflow: hidden;
	font: 14px/1.5 system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
	background: #f1f5f9; color: #0f172a;
}
.app { display: flex; flex-direction: column; height: 100vh; }
header {
	display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
	padding: 10px 16px; background: #fff; border-bottom: 1px solid #e2e8f0;
}
header h1 { font-size: 15px; margin: 0 8px 0 0; font-weight: 600; white-space: nowrap; }
.tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
button {
	font: inherit; padding: 5px 12px; border: 1px solid #cbd5e1; border-radius: 8px;
	background: #fff; cursor: pointer; color: #0f172a; line-height: 1.4;
}
button:hover { background: #f8fafc; border-color: #94a3b8; }
button:active { transform: translateY(1px); }
label.chk { display: inline-flex; align-items: center; gap: 4px; color: #475569; cursor: pointer; user-select: none; }
.zoom { display: inline-flex; align-items: center; gap: 4px; color: #475569; }
.zoom span { min-width: 46px; text-align: center; font-variant-numeric: tabular-nums; }
.legend { display: inline-flex; gap: 16px; align-items: center; margin-left: auto; color: #64748b; font-size: 12px; }
.legend i { display: inline-block; width: 26px; height: 0; border-top: 2px solid #94a3b8; vertical-align: middle; margin-right: 4px; }
.legend .dash { border-top-style: dashed; }
#meta {
	padding: 6px 16px; font-size: 12px; color: #64748b;
	background: #fff; border-bottom: 1px solid #e2e8f0;
	font-variant-numeric: tabular-nums;
}
#stage { flex: 1; overflow: auto; padding: 24px; }
#stage svg { max-width: none !important; }
.empty { color: #94a3b8; text-align: center; margin-top: 80px; font-size: 15px; }
.empty code { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #475569; }
.err { color: #b91c1c; background: #fef2f2; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-family: ui-monospace, monospace; font-size: 12px; }
`;
export {
  page
};
