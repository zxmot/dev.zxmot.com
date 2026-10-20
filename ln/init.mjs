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

// ../load/opt/ztxt/@/conf/ayu.tsx
var nop2 = () => {
};
var ayu2 = globalThis._zyu_ || {
  // @ts-ignore
  _load: (target) => import(target),
  _open: nop2,
  opens: nop2,
  builder: globalThis["-builder-"],
  env: {},
  tries: (call) => {
    try {
      return call();
    } catch (ex) {
    }
  },
  v: { is_init: /* @__PURE__ */ new Date() },
  // cached: {},
  // 用于组件间通信，根据组件的生命周期来；
  weak: /* @__PURE__ */ new WeakMap()
};
globalThis["_zyu_"] = ayu2;
ayu2._port = (mod) => {
  const _id = document.currentScript?.src;
  if (ayu2._id) {
    ayu2.v[ayu2._id] = mod;
  }
};
ayu2.awc = (props) => {
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
  return ayu2.loads(props);
};

// ../load/opt/ztxt/@/libs/jsx.tsx
var add = (parent, child) => {
  parent.appendChild(child?.nodeType ? child : document.createTextNode(child));
};
var appendChild = (parent, child) => {
  if (!child) {
    return;
  }
  if (Array.isArray(child)) {
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
  } else {
    add(parent, child);
  }
};
var my_jsx = (tag, props, ...childs) => {
  const children = childs || props?.children;
  if (typeof tag === "function") {
    return tag(props || {}, children);
  }
  if (!tag) {
    debugger;
    tag = "div";
  }
  const element = document.createElement(tag);
  Object.entries(props || {}).forEach(([name, value]) => {
    if (typeof value === "undefined") {
      return;
    }
    if (name.startsWith("on") && name.toLowerCase() in window) {
      element.addEventListener(
        name.toLowerCase().substring(2),
        value
      );
    } else {
      if (name === "clk") {
        element.addEventListener("click", value);
        return;
      }
      element.setAttribute(
        remap[name] || name,
        value
      );
    }
  });
  appendChild(element, children);
  return element;
};
my_jsx.mount = appendChild;
var remap = {
  css: "style",
  // style: 'data-style',
  cls: "class",
  // className: 'class',
  // clx: 'class',
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
  data: "data-hash"
  // hash or raw or v or ext
};
var setup = () => {
  window["jsx"] = my_jsx;
  window["xjs"] = my_jsx;
  return my_jsx;
};

// ../load/opt/ztxt/@/libs/svg.tsx
var card = ({ ctn, css }, child) => {
  return /* @__PURE__ */ jsx("div", { cls: "box", css: ctn }, /* @__PURE__ */ jsx("div", { cls: "crd bgf", css }, child));
};
var icon = ({ d, c = "#fff", styles = {} }) => {
  const svg = _svg("svg", {
    fill: c,
    display: "inline-block",
    width: "24px",
    height: "24px",
    lineHeight: "0",
    userSelect: "none",
    ...styles
  }, ["viewBox", "0 0 24 24"]);
  svg.appendChild(
    // <path d={path}/>
    _svg("path", ["d", d])
  );
  return svg;
};
var _svg = (tag = "svg", ...mores) => {
  const dom = document.createElementNS(
    "http://www.w3.org/2000/svg",
    tag
  );
  if (!mores?.length) {
    return dom;
  }
  mores.map((it) => {
    if (Array.isArray(it)) {
      dom.setAttribute(it[0], it[1]);
    } else {
      Object.assign(dom.style, it);
    }
  });
  return dom;
};

// ../load/opt/ztxt/@/libs/init.ts
var _jsx = setup();
var mount = (html) => {
  document.body.append(html);
};
var init = {
  mount
};
Object.assign(ayu2, {
  _json: (path) => fetch(path).then((v) => v.json()),
  _post: (path, body) => fetch(path, {
    method: "POST",
    body: JSON.stringify(body)
  }).then((v) => v.json()),
  _edit: (path, body) => fetch(path, {
    method: "PATCH",
    // _body({ PATCH }, body),
    body: JSON.stringify(body)
  }).then((v) => v.json()),
  card,
  icon,
  _open: (href) => {
    window.open(href, "_blank");
  }
});
ayu2.link = ({ meta, href = meta.purl }) => (
  // <link rel="stylesheet" type="text/css" href={href}/>
  _jsx("link", { rel: "stylesheet", type: "text/css", href })
);
ayu2.html = (props, children) => {
  const div = _jsx("div", props);
  const root = div.attachShadow({ mode: "open" });
  window.appendChild(root, children);
  return div;
};
ayu2.loads = ({
  // {raw, load = raw.load + '?' + new Date().getMinutes(), opt = {raw}},
  ssr,
  raw,
  load = (ssr?.load || raw.load) + "?",
  // new Date().getMinutes(),
  loaded = (v, props) => v.vino(props),
  ...opt
}) => {
  opt.raw = raw;
  if (ssr) {
    opt.ssr = ssr;
  }
  const div = document.createElement("div");
  div.innerText = "Loading...";
  if (!load) {
    return div;
  }
  ayu2._load(load).then((m) => {
    raw.head = "loaded";
    const next = m.page ? (
      // 这里缓存了结果：狸猫换太子、偷天换日；
      // 从定义的数据变成了自带 vino 的组件；
      loaded(Object.assign(raw, m.page), opt)
    ) : (
      // m.demo ? m.demo(opt) : m.view(opt)
      m.view(opt)
    );
    div.replaceWith(next);
  });
  return div;
};

// ../load/opt/ztxt/@/init/load.tsx
Object.assign(document.body.style, {
  backgroundImage: 'url("/ln/xbgs/dirty.png")',
  backgroundColor: "#ddd",
  backgroundSize: "auto"
});
window["mount_app"] = (ssr = window["zby"] || {}) => {
  const raw = ssr.root || {};
  const load = ssr.load || raw.load;
  load && ayu._load(load).then((m) => {
    if (raw.data?.load) {
      ayu._load(raw.data.load).then((x) => {
        Object.assign(raw, x.manu);
        init.mount(/* @__PURE__ */ jsx(m.page.vino, { ssr, raw }));
      });
    } else {
      init.mount(/* @__PURE__ */ jsx(m.page.vino, { ssr, raw }));
    }
  });
};
