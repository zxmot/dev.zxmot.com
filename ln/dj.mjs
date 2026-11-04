// ©2026 11-03 19:39

/**
 * 将子界面 child 挂载到 parent 上
 *
 * @param {HTMLElement} parent
 * @param {HTMLElement | string } child
 */
const append = (parent, child) => {
	parent.appendChild(child?.nodeType ? child : document.createTextNode(String(child)));
};

/**
 * 将生成的子界面 child 渲染到目标 parent 上
 *
 * @param {HTMLElement} parent
 * @param {HTMLElement | HTMLElement[] | null | undefined} child
 * @returns {HTMLElement}
 */
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

// 1. ADD = any tag + children 纯子节点，空属性
// => ADD('span', 'hello') => <span>hello</span>
const ADD = (tag, ...z) => mount(_(tag), z);
/**
 * 创建一个任意标签，且带类名的节点
 *
 * A_C = any tag + cls + children 样式 + 子节点
 *
 * 用法 => A_C('span', 'red', 'hello') => <span class="red">hello</span>
 *
 * @param {string} tag 标签 = document.createElement(tag)
 * @param {string} cls 类名 = class
 * @param {any} z 子元素
 * @returns {HTMLElement} 标签为 tag 的DOM节点
 */
const A_C = (tag, cls, ...z) => view({cls}, z, tag);
// 2. BTN = button 专用的快捷键方式
const BTN = (props, ...z) => view(props, z, 'button');
// 3. DIV = div + props + children
const DIV = (props, ...z) => view(props, z);
/**
 * 创建一个带类名的 DIV 节点
 *
 * D_C = div + cls + children
 *
 * 用法 => D_C('red', 'hello') => <div class="red">hello</div>
 *
 * @param {string} cls 类名 = class
 * @param {any} z 子元素
 * @returns {HTMLElement} DIV 节点
 */
const D_C = (cls, ...z) => view({cls}, z);
// 4. FRAG = div + children 纯子节点，空属性
const FRAG = (...z) => mount(iv(), z);

// 最普遍的使用方法，其他皆为语法糖！为了节省代码量
// 经典的 h 真实DOM渲染函数，适配 esbuild --jsx-factory=jsx --jsx-fragment=jsx
// 但，只支持字符串标签，例如 jsx('div', {css: 'color: red'}, 'hello')
const JSX = (tag, props, ...children) => view(props, children, tag);

const TEXT = (text, props, tag) => view(props, text, tag);

// 最核心的渲染功能
const view = (props, children, tag = 'div') => {
	const d = _(tag);
	props && Object.entries(props).forEach(([name, value]) => {
		if (name === 'clk') {
			d.onclick = value;
			return;
		}
		if (typeof value === 'undefined' || value === false) {return;}
		if (value === true) {value = '';}
		d.setAttribute(remap[name] || name, value);
	});
	return mount(d, children);
};

const remap = {
	css: 'style', cls: 'class', // className: 'class',
};

const $ = v => document.querySelector(v);

/**
 * window['dj'] => dj = dom + jsx
 *
 * 一个极轻量级的运行时库，用于生成真实的 DOM 不同于 React 的语法
 *
 * 也可以手写生成
 *
 * 命名 cls=class / css = style / clk = onClick
 *
 * 约定不使用 class/className/style/onClick 属性
 */
export {
	// 首先暴露出最核心的三个功能
	_, $, JSX,
	// 以下为 JSX 的语法糖封装！
	// 优先选用以下合适的语法糖！
	// 可节省代码量，使代码看起来更加清爽！
	ADD, A_C,
	DIV, D_C,
	BTN,
	FRAG, TEXT,
};

// 待定的内部功能，暴露出去也行！
// export {
// 	view, mount, remap,
// };
