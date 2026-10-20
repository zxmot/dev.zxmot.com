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

// ../load/opt/ramd/rid/eturing/src/viewers/ls-tree.tsx
var vino = () => {
  return /* @__PURE__ */ jsx(ayu.html, { css: "padding: 4px" }, /* @__PURE__ */ jsx("style", null, styling), /* @__PURE__ */ jsx(ViewNodesTree, null));
};
var page = {
  vino
};
var fmt = (v) => {
  if (typeof v === "function") return "fn";
  if (v === null) return "null";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch (e) {
      return String(v);
    }
  }
  return String(v);
};
var ViewNodesTree = () => {
  const lib = window._lib;
  const root = lib.root || {};
  const head = /* @__PURE__ */ jsx("header", { cls: "head" }, /* @__PURE__ */ jsx("h2", null, root.name || "(未命名根节点)"), /* @__PURE__ */ jsx("p", { cls: "sub" }, "功能节点树 Nodes Tree × 状态树 Hooks Tree —— 组件只渲染一次，视图更新全部由直接 DOM 操作完成"));
  const chipsBox = /* @__PURE__ */ jsx("div", { cls: "chips" });
  const stateKeys = Object.keys(lib.state || {});
  for (const key of stateKeys) {
    chipsBox.append(
      /* @__PURE__ */ jsx("span", { cls: "chip" }, /* @__PURE__ */ jsx("b", null, key), /* @__PURE__ */ jsx("i", { cls: "val" }, fmt(lib.state[key])))
    );
  }
  if (!stateKeys.length) chipsBox.append(/* @__PURE__ */ jsx("span", { cls: "empty" }, "暂无状态 · 组件初始化时 _lib.state 为空"));
  const panel = /* @__PURE__ */ jsx("div", { cls: "panel" }, /* @__PURE__ */ jsx("div", { cls: "panel-head" }, /* @__PURE__ */ jsx("span", null, "状态面板 _lib.state"), /* @__PURE__ */ jsx("span", { cls: "hint" }, "组件初始化时快照")), chipsBox);
  const KNOWN = ["name", "note", "type", "value", "on", "hook", "hooks", "children"];
  const branch = (label, mod, items) => /* @__PURE__ */ jsx("div", { cls: `branch ${mod}` }, /* @__PURE__ */ jsx("div", { cls: "branch-label" }, label), items.map((it) => renderNode(it, mod === "kids" ? "child" : "hook")));
  const renderNode = (node, kind) => {
    const row = [];
    if (kind === "root") row.push(/* @__PURE__ */ jsx("span", { cls: "badge root-badge" }, "root 入口"));
    row.push(/* @__PURE__ */ jsx("span", { cls: "name" }, node.name || "(未命名节点)"));
    if (node.type) row.push(/* @__PURE__ */ jsx("span", { cls: "badge type" }, String(node.type)));
    if ("value" in node) {
      row.push(/* @__PURE__ */ jsx("span", { cls: "badge value" }, `value: ${fmt(node.value)}`));
    }
    for (const key of Object.keys(node.on || {})) {
      row.push(/* @__PURE__ */ jsx("span", { cls: "badge on", title: String(node.on[key]) }, `on:${key}`));
    }
    if (node.hook) {
      row.push(/* @__PURE__ */ jsx("span", { cls: "badge hook", title: String(node.hook) }, "hook 截胡"));
    }
    const nodeHooks = node.hooks || [];
    const nodeKids = node.children || [];
    if (nodeHooks.length) row.push(/* @__PURE__ */ jsx("span", { cls: "badge hooks" }, `hooks ×${nodeHooks.length}`));
    if (nodeKids.length) row.push(/* @__PURE__ */ jsx("span", { cls: "badge children" }, `children ×${nodeKids.length}`));
    for (const key of Object.keys(node)) {
      if (KNOWN.includes(key)) continue;
      const v = node[key];
      const isFn = typeof v === "function";
      row.push(
        /* @__PURE__ */ jsx("span", { cls: "badge other", ...isFn ? { title: String(v) } : {} }, `${key}: ${isFn ? "fn" : fmt(v)}`)
      );
    }
    const card = /* @__PURE__ */ jsx("div", { cls: kind === "root" ? "node root" : "node" }, /* @__PURE__ */ jsx("div", { cls: "node-head" }, row));
    if (node.note) card.append(/* @__PURE__ */ jsx("p", { cls: "note" }, String(node.note)));
    if (typeof node.click === "function") {
      card.append(/* @__PURE__ */ jsx("button", { cls: "node-btn", clk: node.click }, node.name || "button"));
    }
    if (nodeKids.length) card.append(branch("children · 节点分支", "kids", nodeKids));
    if (nodeHooks.length) card.append(branch("hooks · 状态挂钩", "hooks", nodeHooks));
    return card;
  };
  const wrap = /* @__PURE__ */ jsx("section", { cls: "dev-tree" }, head, panel, renderNode(root, "root"), /* @__PURE__ */ jsx("div", { cls: "legend" }, "图例：on:key 状态绑定 · value 节点当前值 · hook 截胡（通知停止下钻）· hooks / children ×n 下挂数量 · 鼠标悬停函数徽标可查看源码"));
  return wrap;
};
var styling = `
:host { display: block; }
.dev-tree {
	--line: #dbe2ec;
	--muted: #8492a6;
	--soft: #f6f8fb;
	--blue: #2563eb;
	--purple: #7c3aed;
	--green: #0a9b6c;
	--amber: #b45309;
	--cyan: #0e7490;
	--ink: #2a3646;
	--mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	max-width: 880px;
	font: 13px/1.65 ui-sans-serif, system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif;
	color: var(--ink);
}
.hooks .node-head{
	color: #f19;
}
.kids .node-head{
	color: #36f;
}
h2 { margin: 4px 0 2px; font-size: 20px; color: #36f; letter-spacing: .02em; }
.head .sub { margin: 0 0 14px; font-size: 12px; color: var(--muted); }

.panel { margin-bottom: 16px; padding: 10px 12px; background: var(--soft); border: 1px solid var(--line); border-radius: 10px; }
.panel-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; font-size: 12px; font-weight: 600; }
.panel-head .hint { font-weight: 400; color: var(--muted); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; min-height: 24px; align-items: center; }
.chips .empty { font-size: 12px; color: var(--muted); }
.chip { display: inline-flex; align-items: baseline; gap: 6px; padding: 2px 10px; background: #fff; border: 1px solid var(--line); border-radius: 999px; font-family: var(--mono); font-size: 12px; }
.chip b { color: var(--blue); }
.chip .val { max-width: 240px; overflow: hidden; font-style: normal; white-space: nowrap; text-overflow: ellipsis; }

.node { position: relative; margin: 8px 0 12px; }
.node.root { padding: 10px 12px; background: var(--soft); border: 1px solid var(--line); border-radius: 10px; }
.node-head { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.name { font-size: 14px; font-weight: 600; }
.node.root .name { font-size: 15px }
.note { margin: 2px 0 0; font-size: 12px; color: var(--muted); }

.branch { margin: 10px 0 2px 12px; padding-left: 18px; border-left: 1px dashed var(--line); }
.branch.kids { border-left-style: solid; }
.branch-label { margin-bottom: 2px; font-size: 11px; letter-spacing: .05em; color: var(--muted); }
.branch > .node::before { content: ''; position: absolute; top: 13px; left: -18px; width: 13px; border-top: 1px dashed var(--line); }
.branch.kids > .node::before { border-top-style: solid; }

.badge { flex: none; padding: 0 7px; border: 1px solid transparent; border-radius: 5px; font-family: var(--mono); font-size: 11px; line-height: 18px; white-space: nowrap; }
.badge.root-badge { color: #36f; background: #e9efff; border-color: #c6d6ff; }
.badge.type { color: var(--purple); background: #f3ecfe; border-color: #e3d4fb; }
.badge.value { color: var(--green); background: #e6f6f0; border-color: #c9ecdf; }
.badge.on { color: var(--blue); background: #e8effd; border-color: #cfdcf9; }
.badge.hook { color: var(--amber); background: #fdf3e3; border-color: #f5e2bf; }
.badge.hooks { color: var(--cyan); background: #e4f5f9; border-color: #c8e9f1; }
.badge.children { color: #55657a; background: #eef2f7; border-color: #dde4ec; }
.badge.other { max-width: 220px; overflow: hidden; color: #6b7280; background: #f3f4f6; border-color: #e5e7eb; text-overflow: ellipsis; }

.node-btn { margin-top: 6px; padding: 2px 10px; font-size: 12px; font-family: inherit; color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 6px; cursor: pointer; }
.node-btn:hover { color: var(--blue); border-color: var(--blue); }
.node-btn:active { transform: translateY(1px); }

.legend { margin-top: 16px; padding-top: 10px; border-top: 1px dashed var(--line); font-size: 11px; color: var(--muted); }
`;
export {
  page
};
