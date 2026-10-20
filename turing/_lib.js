// ©2026 10-18 19:08

const state = {};

const queue = [];

let draining = false;
let timer = setTimeout(() => {});

const conf = {
	ii: 0,
	waits: 50, // 对于长期运行的系统，调大
	timer: 200, // 系统对传感器的灵敏度
};

async function drain() {
	if (draining) return;
	draining = true;
	try {
		while (queue.length) {
			await new Promise(r => setTimeout(r, conf.waits * queue.length));

			let {key, value} = queue.shift();

			const prev = state[key];

			if (typeof value === 'function') {
				value = value(prev);
			}
			state[key] = value;

			conf.ii++; // 通知状态变更的总次数
			notifyHook(lib.root, key, value, prev);
		}
	} finally {
		draining = false;
	}
}

const lib = {
	state, // 允许直接修改状态

	// 通知状态的变更
	dispatch: (key, value) => {
		// window.dispatchEvent(new CustomEvent('state', {detail: {key, value}}));
		queue.push({key, value});
		if (draining) {return;}
		clearTimeout(timer);
		timer = setTimeout(drain, conf.timer); // drain();
	},

	// 入口节点
	root: {},

	conf,
	logs: (label, value) => {
		console.log(label, value);
	},
};
window['_lib'] = lib; // 所有架构的代码均可访问此模块

function notifyHook(hook, key, value, prev) {
	if (!hook) return;

	hook.on?.[key]?.(value, prev);

	// 截胡 hooks 避免无限下钻，可用于调试
	if (hook.hook?.(key, value, prev)) {return;}

	const hooks = hook.hooks || [];
	for (let i = 0; i < hooks.length; i++) {
		notifyHook(hooks[i], key, value, prev);
	}
}
