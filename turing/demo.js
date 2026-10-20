const testing = {
	reset_logs: () => logger.replaceChildren(),
	conf_fast: () => _lib.conf.waits = 100,
	conf_slow: () => _lib.conf.waits += 50,
};

// 运行一个计时器，每60秒设置系统时间，触发状态更新
const minute_timer = () => {
	_lib.dispatch('time', new Date().toLocaleTimeString('sv'));

	setTimeout(() => {
		requestAnimationFrame(minute_timer);
	}, 60_000);
};
setTimeout(minute_timer, 60_000 - new Date().getSeconds() * 1000);

const div = document.createElement('div');
[{
	name: '基础信息',
	load: 'src/viewers/dev-tree.tsx',
}, {
	name: '网络图',
	load: 'src/viewers/network.tsx',
}].map(it => {
	const btn = document.createElement('button');
	btn.textContent = it.name;
	btn.onclick = () => _load_page('/use/opt/ramd/rid/eturing/' + it.load);
	div.appendChild(btn);
});
document.body.appendChild(div);

// 把任意值转成可读字符串
function stringify(value) {
	if (value === null) return 'null';
	if (value === undefined) return 'undefined';
	if (typeof value === 'object') {
		try {
			return JSON.stringify(value);
		} catch {
			return String(value); // 循环引用等情况
		}
	}
	return String(value);
}

// 渲染函数：只负责把 state 变成 DOM，不碰页面
function render_state(state, kinds = {}) {
	const frag = document.createDocumentFragment();

	for (const [key, value] of Object.entries(state)) {
		const row = document.createElement('div');
		row.className = 'state-row';
		row.dataset.key = key;

		const k = document.createElement('span');
		k.className = 'state-key';
		k.textContent = key;

		const v = document.createElement('span');
		v.className = 'state-value';
		v.textContent = stringify(value); // 用 textContent，天然防 XSS


		row.append(k, ' = ', v);

		const kind = kinds[key];
		if (kind) {
			const note = document.createElement('span');
			note.className = 'state-kind';
			note.textContent = kind;

			row.append( ' - ', note);
		}

		frag.append(row);
	}

	return frag;
}
