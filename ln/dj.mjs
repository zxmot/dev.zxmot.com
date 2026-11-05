// ©2026 11-05 10:56

const append = (parent, child) =>
	parent.appendChild(child?.nodeType ? child : document.createTextNode(String(child)));
const mount = (parent, child) => {
	if (!child) {
		if (child === undefined) {return parent;}
		if (child === null) {return parent;}
	}
	if (typeof child === 'boolean') {return parent;}
	if (Array.isArray(child)) {
		child.forEach(d => mount(parent, d));
	} else {
		append(parent, child);
	}
	return parent;
};

const _ = tag => document.createElement(tag);
const iv = () => _('div');

const plain = Object.prototype; // ({}).__proto__;

const DIV = (opt, ...z) => ADD('div', opt, ...z);

const BOX = (...z) => mount(iv(), z);
const BTN = (text, opt) => {
	if (typeof opt === 'function') {opt = {clk: opt};}
	return ADD('button', opt, text);
};

const FRAG = (...z) => mount(document.createDocumentFragment(), z);
// TEXT 其实是一个 DIV，也可以设置为 tag = 'p'
const TEXT = (text, props, tag = 'div') => ADD(tag, props, text);

const _att = (d, props) => {
	Object.entries(props).forEach(([name, value]) => {
		if (name === 'clk') {
			d.onclick = value;
			return;
		}
		if (typeof value === 'undefined' || value === false) {return;}
		if (value === true) {value = '';}
		d.setAttribute(remap[name] || name, value);
	});
	return d;
};

const ADD = (tag, opt, ...z) => {
	const d = _(tag);
	if (z.length === 0) { // 判断是设置属性还是添加子内容
		return opt ? ( // obj.__proto__ === plain
			Object.getPrototypeOf(opt) === plain ? _att(d, opt) : mount(d, opt)
		) : ( // 防止 ADD('span', 0) 的情况
			opt === 0 ? mount(d, '0') : d
		);
	}
	// 如果 opt 是字符串，则表示为样式类名
	if (typeof opt === 'string') {
		d.className = opt;
	} else {
		opt && _att(d, opt);
	}
	return mount(d, z);
};

const remap = {
	css: 'style', cls: 'class', // className: 'class',
};

const $ = v => document.querySelector(v);

/**
 * window['dj'] => dj = dom + jsx
 *
 * 一个极轻量级的运行时库，用于生成真实的 DOM
 *
 * 不同于 React 的语法：
 *
 * 命名 cls=class / css = style / clk = onClick
 *
 * 约定不使用 class/className/style/onClick 属性
 */
export {
	_,
	// 首先暴露出最核心的三个功能
	$, ADD,
	// 以下为 ADD 的语法糖封装！
	// 优先选用以下合适的语法糖！
	BOX, DIV,
	// 可节省代码量，使代码看起来更加清爽！
	BTN,
	FRAG, TEXT,
};

// 最普遍的使用方法，其他皆为语法糖！为了节省代码量
// 经典的 h 真实DOM渲染函数，适配 esbuild --jsx-factory=jsx --jsx-fragment=jsx
// 例如 jsx('div', {css: 'color: red'}, 'hello', 'world)
// 没有 className/style/onClick 用更加简短的 cls/css/clk 代替
const JSX = (tag, props, ...children) =>
	(typeof tag === 'function') ? tag(props, children) : ADD(tag, props, ...children);

globalThis['jsx'] = JSX;
export {JSX};
