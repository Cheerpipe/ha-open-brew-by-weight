// src/localize.ts
var e = {
	"card.preset.name": "Open Brew by Weight preset",
	"card.preset.description": "Shows how a preset decides when to stop a shot, like the controller's Web UI.",
	"state.loading": "Waiting for the controller…",
	"state.not_found": "Choose an Open Brew by Weight device in the card settings.",
	"state.no_rules": "Update the controller firmware to see its presets here.",
	"state.unavailable": "The controller isn't responding. This shows the last known preset.",
	"state.missing_preset": "This preset no longer exists on the controller.",
	"state.empty": "This preset can't be drawn.",
	"state.timer_only": "Brew by weight is off for this preset: shots stop by hand or at the time limit.",
	"header.active": "Active preset",
	"header.preset": "Preset",
	"header.target": "Target {0} g",
	"header.dose": "{0} g in",
	"header.select": "Active preset",
	"graph.target": "Target {0} g",
	"graph.max": "Max {0} s",
	"graph.no_cut": "No weight cut",
	"graph.scrub": "Time the shot is cut",
	"graph.readout": "{0} g at {1} s → {2} · stops at {3} g, {4} s",
	"graph.readout_target": "{0} g at {1} s → {2} · stops at {3} g",
	"graph.pill": "Cut {4} s · {3} g",
	"graph.summary": "No weight cut before {0} s. Cuts at {1} g until {2} s, at {3} g from {4} to {5} s, and at {6} g from {7} s. The shot ends by {8} s.",
	"verdict.fast": "Fast",
	"verdict.on_recipe": "On recipe",
	"verdict.slow": "Slow",
	"verdict.max_time": "Max time",
	"legend.cut": "Stop at",
	"legend.pace": "Typical pace",
	"legend.example": "Example shot (drag)",
	"legend.arrivals": "Recent shots",
	"legend.window": "On-recipe window",
	"legend.fast": "Extend (full / partial)",
	"legend.slow": "Shorten (full / partial)",
	"legend.no_cut": "No weight cut",
	"note.pace": "Typical pace is illustrative: shots are judged by when they reach the target.",
	"note.start_preset": "Reference pace starts at {0} s, when this preset's first drops usually fall.",
	"note.start_others": "Reference pace starts at {0} s, when first drops usually fall on your other presets, until this one records its own.",
	"note.start_none": "Reference pace starts at 0 s until a shot records its first drop.",
	"editor.device": "Device",
	"editor.preset": "Preset",
	"editor.preset_active": "The active preset",
	"editor.title": "Title (optional)",
	"editor.show_header": "Show the header",
	"editor.show_selector": "Let the card change the active preset",
	"editor.show_example": "Show the example shot",
	"editor.show_readout": "Show the example shot reading",
	"editor.show_arrivals": "Show recent shots",
	"editor.show_legend": "Show the legend",
	"editor.show_note": "Show the pace note"
}, t = {
	en: e,
	es: {
		"card.preset.name": "Preset de Open Brew by Weight",
		"card.preset.description": "Muestra cómo decide un preset cuándo cortar el shot, igual que la web del controlador.",
		"state.loading": "Esperando al controlador…",
		"state.not_found": "Elige un dispositivo Open Brew by Weight en la configuración de la card.",
		"state.no_rules": "Actualiza el firmware del controlador para ver sus presets aquí.",
		"state.unavailable": "El controlador no responde. Se muestra el último preset conocido.",
		"state.missing_preset": "Este preset ya no existe en el controlador.",
		"state.empty": "Este preset no se puede dibujar.",
		"state.timer_only": "Brew by weight está apagado en este preset: el shot se corta a mano o al llegar al tiempo máximo.",
		"header.active": "Preset activo",
		"header.preset": "Preset",
		"header.target": "Meta {0} g",
		"header.dose": "{0} g de café",
		"header.select": "Preset activo",
		"graph.target": "Meta {0} g",
		"graph.max": "Máx. {0} s",
		"graph.no_cut": "Sin corte por peso",
		"graph.scrub": "Momento en que se corta el shot",
		"graph.readout": "{0} g a los {1} s → {2} · corta en {3} g, {4} s",
		"graph.readout_target": "{0} g a los {1} s → {2} · corta en {3} g",
		"graph.pill": "Corte {4} s · {3} g",
		"graph.summary": "Sin corte por peso antes de {0} s. Corta en {1} g hasta {2} s, en {3} g de {4} a {5} s y en {6} g desde {7} s. El shot termina a más tardar a los {8} s.",
		"verdict.fast": "Rápido",
		"verdict.on_recipe": "En receta",
		"verdict.slow": "Lento",
		"verdict.max_time": "Tiempo máximo",
		"legend.cut": "Corta en",
		"legend.pace": "Ritmo típico",
		"legend.example": "Shot de ejemplo (arrastra)",
		"legend.arrivals": "Shots recientes",
		"legend.window": "Ventana en receta",
		"legend.fast": "Alargar (total / parcial)",
		"legend.slow": "Acortar (total / parcial)",
		"legend.no_cut": "Sin corte por peso",
		"note.pace": "El ritmo típico es ilustrativo: los shots se juzgan por cuándo llegan a la meta.",
		"note.start_preset": "El ritmo de referencia empieza a los {0} s, cuando suelen caer las primeras gotas de este preset.",
		"note.start_others": "El ritmo de referencia empieza a los {0} s, cuando suelen caer las primeras gotas en tus otros presets, hasta que este registre las suyas.",
		"note.start_none": "El ritmo de referencia empieza en 0 s hasta que un shot registre su primera gota.",
		"editor.device": "Dispositivo",
		"editor.preset": "Preset",
		"editor.preset_active": "El preset activo",
		"editor.title": "Título (opcional)",
		"editor.show_header": "Mostrar la cabecera",
		"editor.show_selector": "Permitir cambiar el preset activo desde la card",
		"editor.show_example": "Mostrar el shot de ejemplo",
		"editor.show_readout": "Mostrar la lectura del shot de ejemplo",
		"editor.show_arrivals": "Mostrar shots recientes",
		"editor.show_legend": "Mostrar la leyenda",
		"editor.show_note": "Mostrar la nota del ritmo"
	}
};
function n(n) {
	let r = t[(n ?? "en").split("-")[0]] ?? e;
	return (t, ...n) => (r[t] ?? e[t]).replace(/\{(\d+)\}/g, (e, t) => String(n[Number(t)]));
}
// node_modules/@lit/reactive-element/css-tag.js
var r = globalThis, i = r.ShadowRoot && (r.ShadyCSS === void 0 || r.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, a = Symbol(), o = /* @__PURE__ */ new WeakMap(), s = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== a) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (i && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = o.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && o.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, c = (e) => new s(typeof e == "string" ? e : e + "", void 0, a), l = (e, ...t) => new s(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, a), u = (e, t) => {
	if (i) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), i = r.litNonce;
		i !== void 0 && t.setAttribute("nonce", i), t.textContent = n.cssText, e.appendChild(t);
	}
}, d = i ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return c(t);
})(e) : e, { is: f, defineProperty: p, getOwnPropertyDescriptor: m, getOwnPropertyNames: h, getOwnPropertySymbols: g, getPrototypeOf: _ } = Object, v = globalThis, y = v.trustedTypes, b = y ? y.emptyScript : "", x = v.reactiveElementPolyfillSupport, S = (e, t) => e, C = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? b : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, w = (e, t) => !f(e, t), T = {
	attribute: !0,
	type: String,
	converter: C,
	reflect: !1,
	useDefault: !1,
	hasChanged: w
};
Symbol.metadata ??= Symbol("metadata"), v.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var E = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = T) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && p(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = m(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? T;
	}
	static _$Ei() {
		if (this.hasOwnProperty(S("elementProperties"))) return;
		let e = _(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(S("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
			let e = this.properties, t = [...h(e), ...g(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(d(e));
		} else e !== void 0 && t.push(d(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return u(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? C : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? C : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? w)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[S("elementProperties")] = /* @__PURE__ */ new Map(), E[S("finalized")] = /* @__PURE__ */ new Map(), x?.({ ReactiveElement: E }), (v.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var D = globalThis, O = (e) => e, k = D.trustedTypes, A = k ? k.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, j = "$lit$", M = `lit$${Math.random().toFixed(9).slice(2)}$`, N = "?" + M, ee = `<${N}>`, P = document, F = () => P.createComment(""), I = (e) => e === null || typeof e != "object" && typeof e != "function", L = Array.isArray, te = (e) => L(e) || typeof e?.[Symbol.iterator] == "function", R = "[ 	\n\f\r]", z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ne = /-->/g, re = />/g, B = RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ie = /'/g, ae = /"/g, oe = /^(?:script|style|textarea|title)$/i, se = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), V = se(1), H = se(2), U = Symbol.for("lit-noChange"), W = Symbol.for("lit-nothing"), ce = /* @__PURE__ */ new WeakMap(), G = P.createTreeWalker(P, 129);
function le(e, t) {
	if (!L(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return A === void 0 ? t : A.createHTML(t);
}
var ue = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = z;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === z ? c[1] === "!--" ? o = ne : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = B) : (oe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = B) : o = re : o === B ? c[0] === ">" ? (o = i ?? z, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? B : c[3] === "\"" ? ae : ie) : o === ae || o === ie ? o = B : o === ne || o === re ? o = z : (o = B, i = void 0);
		let d = o === B && e[t + 1].startsWith("/>") ? " " : "";
		a += o === z ? n + ee : l >= 0 ? (r.push(s), n.slice(0, l) + j + n.slice(l) + M + d) : n + M + (l === -2 ? t : d);
	}
	return [le(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, K = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ue(t, n);
		if (this.el = e.createElement(l, r), G.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = G.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(j)) {
					let t = u[o++], n = i.getAttribute(e).split(M), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? fe : r[1] === "?" ? pe : r[1] === "@" ? me : Y
					}), i.removeAttribute(e);
				} else e.startsWith(M) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (oe.test(i.tagName)) {
					let e = i.textContent.split(M), t = e.length - 1;
					if (t > 0) {
						i.textContent = k ? k.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], F()), G.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], F());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === N) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(M, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += M.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = P.createElement("template");
		return n.innerHTML = e, n;
	}
};
function q(e, t, n = e, r) {
	if (t === U) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = I(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = q(e, i._$AS(e, t.values), i, r)), t;
}
var de = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? P).importNode(t, !0);
		G.currentNode = r;
		let i = G.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new J(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new he(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = G.nextNode(), a++);
		}
		return G.currentNode = P, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, J = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = W, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = q(this, e, t), I(e) ? e === W || e == null || e === "" ? (this._$AH !== W && this._$AR(), this._$AH = W) : e !== this._$AH && e !== U && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? te(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== W && I(this._$AH) ? this._$AA.nextSibling.data = e : this.T(P.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = K.createElement(le(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new de(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ce.get(e.strings);
		return t === void 0 && ce.set(e.strings, t = new K(e)), t;
	}
	k(t) {
		L(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(F()), this.O(F()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = O(e).nextSibling;
			O(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Y = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = W, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = W;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = q(this, e, t, 0), a = !I(e) || e !== this._$AH && e !== U, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = q(this, r[n + o], t, o), s === U && (s = this._$AH[o]), a ||= !I(s) || s !== this._$AH[o], s === W ? e = W : e !== W && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === W ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, fe = class extends Y {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === W ? void 0 : e;
	}
}, pe = class extends Y {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== W);
	}
}, me = class extends Y {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = q(this, e, t, 0) ?? W) === U) return;
		let n = this._$AH, r = e === W && n !== W || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== W && (n === W || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, he = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		q(this, e);
	}
}, ge = D.litHtmlPolyfillSupport;
ge?.(K, J), (D.litHtmlVersions ??= []).push("3.3.3");
var _e = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new J(t.insertBefore(F(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, X = globalThis, Z = class extends E {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = _e(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return U;
	}
};
Z._$litElement$ = !0, Z.finalized = !0, X.litElementHydrateSupport?.({ LitElement: Z });
var ve = X.litElementPolyfillSupport;
ve?.({ LitElement: Z }), (X.litElementVersions ??= []).push("4.2.2");
// src/ha.ts
var ye = "open_brew_by_weight", be = (e, t) => Object.values(e.entities).find((e) => e.device_id === t && e.platform === "open_brew_by_weight" && e.entity_id.startsWith("select."))?.entity_id, xe = (e) => Object.values(e.entities).find((e) => e.platform === "open_brew_by_weight" && e.device_id)?.device_id ?? void 0, Se = 2e3;
function Ce(e, t, n) {
	let r = !1, i, a, o = () => {
		a = void 0, e.connection.subscribeMessage((e) => {
			"unloaded" in e ? (i?.(), i = void 0, n({ status: "loading" }), r || (a = setTimeout(o, Se))) : n({
				status: "ready",
				data: e
			});
		}, {
			type: `${ye}/subscribe`,
			device_id: t
		}).then((e) => {
			r ? e() : i = e;
		}, () => {
			n({ status: "not_found" }), r || (a = setTimeout(o, Se * 5));
		});
	};
	return o(), () => {
		r = !0, clearTimeout(a), i?.();
	};
}
// src/preset-chart.ts
var Q = .18;
function we(e, t) {
	let n = (e) => Number.isFinite(Number(e)) ? Number(e) : NaN, r = n(e.goalWeightG), i = n(e.fastBeforeS), a = n(e.slowAfterS), o = n(e.bbwProtectionMs) / 1e3, s = n(e.operationalWallMs) / 1e3, c = n(t), l = !!e.fastExtractionGuardEnabled, u = !!e.slowExtractionGuardEnabled, d = n(e.fastMarginG), f = n(e.slowMarginG), p = l ? r + d : r, m = u ? r - f : r, h = Math.max(0, Math.min(n(e.firstDropS) || 0, i - .5));
	return ![
		r,
		i,
		a,
		o,
		s,
		c,
		p,
		m
	].every(Number.isFinite) || !(o < i && i < a && a < s) ? null : {
		mode: e.brewByWeight === !1 ? "timerOnly" : "active",
		fast: l,
		slow: u,
		fastMargin: d,
		slowMargin: f,
		goal: r,
		ceil: p,
		floor: m,
		t1: i,
		t2: a,
		prot: o,
		wall: s,
		d: c,
		firstDrop: h,
		firstDropN: n(e.firstDropN) || 0,
		scrubMin: Math.max(o, h + .5)
	};
}
function Te(e, t) {
	let n = (e) => Math.round(e * 1e3), r = (e) => Math.round(e * 10), i = n(Math.max(t.prot, Math.min(t.wall, e))), a = r(t.goal), o = n(Math.max(t.prot, t.t1 - t.d)), s = n(t.t1), c = n(t.t2), l = n(Math.min(t.wall, t.t2 + t.d));
	if (i < s) {
		let e = t.fast ? r(t.fastMargin) : 0, n = Math.max(0, i - o), c = s - o;
		return (a + Math.floor(e * (c ** 3 - 3 * n * n * c + 2 * n ** 3) / c ** 3)) / 10;
	}
	if (i > c) {
		let e = t.slow ? r(t.slowMargin) : 0, n = Math.min(i, l) - c, o = l - c;
		return (a - Math.floor(e * (3 * n * n * o - 2 * n ** 3) / o ** 3)) / 10;
	}
	return a / 10;
}
function Ee(e, t, n, r = 0) {
	let i = Math.max(0, e - r) / (n - r);
	return t * (2 * Q * i + (1 - 2 * Q) * i * i);
}
function De(e, t) {
	let n = Te(e, t), r = Q, i = (Math.sqrt(4 * r * r + 4 * (1 - 2 * r) * n / t.goal) - 2 * r) / (2 * (1 - 2 * r)), a = t.firstDrop + (e - t.firstDrop) / i;
	return {
		stop: e,
		weight: n,
		arrival: a,
		verdict: e >= t.wall ? "max_time" : a < t.t1 - .5 ? "fast" : a > t.t2 + .5 ? "slow" : "on_recipe",
		atTarget: Math.abs(n - t.goal) < .05
	};
}
var Oe = (e) => Math.max(e.scrubMin, Math.round((e.t1 + e.t2) * 5) / 10);
function ke(e, t, n = {}) {
	let { arrivals: r = [], compact: i = !1 } = n, a = t, o = Math.round(i ? Math.min(180, Math.max(140, a * .48)) : Math.min(220, Math.max(180, a * .56))), s = a - 10, c = o - 18, l = Math.ceil(e.ceil + 2), u = l > 30 ? 10 : 5, d = e.wall, f = (e) => 34 + (s - 34) * e / d, p = (e) => c - (c - 14) * e / l, m = (e) => +(+e).toFixed(1), h = (e, t) => f(e).toFixed(2) + " " + p(t).toFixed(2), g = (e, t, n, r) => `C${h(e + (n - e) / 3, t)} ${h(e + 2 * (n - e) / 3, r)} ${h(n, r)}`, _ = Math.max(e.prot, e.t1 - e.d), v = Math.min(e.wall, e.t2 + e.d), y = `L${h(_, e.ceil)}` + g(_, e.ceil, e.t1, e.goal), b = `L${h(e.t2, e.goal)}`, x = g(e.t2, e.goal, v, e.floor) + `L${h(e.wall, e.floor)}`, S = e.firstDrop, C = (t) => {
		let n = Q, r = (l + 1) / e.goal;
		return Math.min(d, S + (t - S) * (Math.sqrt(4 * n * n + 4 * (1 - 2 * n) * r) - 2 * n) / (2 * (1 - 2 * n)));
	}, w = (t, n) => h(S + (n - S) / 2, e.goal * Q * (n - S) / (t - S)), T = (t, n = C(t)) => h(n, Ee(n, e.goal, t, S)), E = (e, t = C(e)) => `Q${w(e, t)} ${T(e, t)}`, D = (e, t = C(e)) => `Q${w(e, t)} ${h(S, 0)}`, O = `M${h(0, 0)}L${h(S, 0)}`, k = `M${h(S, 0)}`, A = `L${h(d, l + 1)}`, j = Math.max(S + .5, e.t1 - e.d), M = e.t2 + e.d, N = [], ee = [], P = [];
	for (let e = 0; e <= l; e += u) N.push(`M34 ${p(e).toFixed(1)}H${s}`), ee.push({
		x: 30,
		y: p(e) + 3,
		text: `${e} g`,
		anchor: "end"
	});
	let F = -99;
	return [
		0,
		e.prot,
		e.t1,
		e.t2,
		e.wall
	].forEach((e, t, n) => {
		let r = m(e) + " s", i = r.length * 6.5, o = f(e) + i / 2 > a - 1, s = o ? a - 1 - i : t ? f(e) - i / 2 : f(e);
		s < F + 4 && t < n.length - 1 || (F = s + i, P.push({
			x: o ? a - 1 : f(e),
			y: c + 13,
			text: r,
			anchor: o ? "end" : t ? "middle" : "start"
		}));
	}), {
		width: a,
		height: o,
		L: 34,
		R: s,
		T: 14,
		B: c,
		X: f,
		Y: p,
		tAt: (e) => (e - 34) * d / (s - 34),
		grid: N,
		yLabels: ee,
		xLabels: P,
		clip: `M${h(0, 0)}L${h(0, e.ceil)}L${h(e.prot, e.ceil)}${y}${b}${x}L${h(e.wall, 0)}Z`,
		bands: {
			fastFull: O + E(j) + `L${h(C(j), l + 1)}L${h(0, l + 1)}Z`,
			fastPart: O + E(e.t1) + A + `L${T(j)}` + D(j) + "Z",
			window: O + E(e.t1, e.t1) + `L${h(e.t2, e.goal)}` + D(e.t2, e.t2) + "Z",
			slowPart: O + E(e.t2) + A + `L${T(M)}` + D(M) + "Z",
			slowFull: O + E(M) + A + `L${h(d, 0)}Z`
		},
		paces: [
			j,
			e.t1,
			e.t2,
			M
		].map((e) => k + E(e)).join(""),
		cut: `M${h(e.prot, e.ceil)}${y}${b}${x}`,
		target: p(e.goal),
		maxX: f(e.wall),
		windowEdges: `M${f(e.t1).toFixed(1)} 14V${c}M${f(e.t2).toFixed(1)} 14V${c}`,
		hatch: i ? null : {
			x: 34,
			y: 14,
			width: f(e.prot) - 34,
			height: c - 14
		},
		arrivals: r.filter((e) => e <= d).map((t) => ({
			x: f(t),
			y: p(e.goal)
		})),
		pace: (e, t) => k + E(e, t),
		noCutLabel: !i && f(e.prot) - 34 >= 96,
		targetAbove: i || p(e.goal) - 4 - 14 >= 16
	};
}
// src/theme.ts
var Ae = l`
  /* Defaults live in private variables, so a theme, the card, or ha-card can
     set any --obbw-* variable and win. */
  :host {
    --_d-fast: #d7301f;
    --_d-slow: #2c7fb8;
    --_d-ok: #41ab5d;
    --_d-cut: #d1101f;
    --_d-band-full: 0.14;
    --_d-band-part: 0.07;
    --_d-band-win: 0.26;
  }
  :host([dark]) {
    --_d-fast: #ff6b4a;
    --_d-slow: #6cb6e6;
    --_d-ok: #74d68c;
    --_d-cut: #9e1c22;
    --_d-band-full: 0.22;
    --_d-band-part: 0.11;
    --_d-band-win: 0.32;
  }
  /* Resolved where UIX and card-mod styles (on ha-card) already apply. */
  :where(.body) {
    --_fg: var(--obbw-text-color, var(--primary-text-color, #242424));
    --_muted: var(--obbw-muted-color, var(--secondary-text-color, #636363));
    --_surface: var(--obbw-chart-background, var(--ha-card-background, var(--card-background-color, #fff)));
    --_fast: var(--obbw-fast-color, var(--_d-fast));
    --_slow: var(--obbw-slow-color, var(--_d-slow));
    --_ok: var(--obbw-on-recipe-color, var(--_d-ok));
    --_band-full: var(--obbw-band-full, var(--_d-band-full));
    --_band-part: var(--obbw-band-partial, var(--_d-band-part));
    --_band-win: var(--obbw-band-window, var(--_d-band-win));
    --_fast-full: var(--obbw-corridor-fast-full-color, var(--_fast));
    --_fast-part: var(--obbw-corridor-fast-partial-color, var(--_fast));
    --_window: var(--obbw-corridor-on-recipe-color, var(--_ok));
    --_slow-part: var(--obbw-corridor-slow-partial-color, var(--_slow));
    --_slow-full: var(--obbw-corridor-slow-full-color, var(--_slow));
    --_cut: var(--obbw-cut-line-color, var(--_d-cut));
    font-family: var(--obbw-font-family, inherit);
  }

  :where(.chart) {
    position: relative;
    touch-action: pan-y;
    background: var(--obbw-chart-background, transparent);
    border-radius: var(--obbw-chart-radius, 0);
  }
  :where(.chart svg) {
    display: block;
    overflow: visible;
  }
  :where(.grid-line) {
    stroke: var(--obbw-grid-color, var(--divider-color, #dadada));
    stroke-width: 0.8;
    opacity: 0.7;
  }
  :where(.axis-label) {
    fill: var(--obbw-axis-label-color, var(--_muted));
    font-size: var(--obbw-axis-font-size, 11px);
    font-weight: 600;
  }
  :where(.axis-label.strong) {
    fill: var(--obbw-target-label-color, var(--_fg));
  }
  :where(.halo) {
    paint-order: stroke;
    stroke: var(--_surface);
    stroke-width: 3px;
    stroke-linejoin: round;
  }
  :where(.band-off) {
    fill: none;
    stroke: var(--_muted);
    stroke-width: 1;
    stroke-dasharray: 3 3;
  }
  :where(.stop-fast-full) {
    stop-color: var(--_fast-full);
    stop-opacity: var(--obbw-corridor-fast-full-opacity, calc(var(--_band-full) * 2.2));
  }
  :where(.stop-fast-part) {
    stop-color: var(--_fast-part);
    stop-opacity: var(--obbw-corridor-fast-partial-opacity, calc(var(--_band-part) * 2.2));
  }
  :where(.stop-window) {
    stop-color: var(--_window);
    stop-opacity: var(--obbw-corridor-on-recipe-opacity, calc(var(--_band-win) * 2.2));
  }
  :where(.stop-slow-part) {
    stop-color: var(--_slow-part);
    stop-opacity: var(--obbw-corridor-slow-partial-opacity, calc(var(--_band-part) * 2.2));
  }
  :where(.stop-slow-full) {
    stop-color: var(--_slow-full);
    stop-opacity: var(--obbw-corridor-slow-full-opacity, calc(var(--_band-full) * 2.2));
  }
  :where(.stop-fade) {
    stop-opacity: var(--obbw-corridor-fade-opacity, 0.03);
  }
  :where(.pace-line) {
    fill: none;
    stroke: var(--obbw-pace-line-color, var(--_fg));
    stroke-opacity: var(--obbw-pace-line-opacity, 0.35);
    stroke-width: var(--obbw-pace-line-width, 0.8);
  }
  :where(.no-cut-hatch) {
    stroke: var(--obbw-no-cut-hatch-color, var(--_muted));
    stroke-opacity: 0.5;
    stroke-width: 1.1;
  }
  :where(.target-line) {
    stroke: var(--obbw-target-line-color, var(--_fg));
    stroke-opacity: 0.5;
    stroke-width: 1;
    stroke-dasharray: 5 3;
  }
  :where(.max-line) {
    stroke: var(--obbw-max-time-color, var(--_cut));
    stroke-width: 2.5;
    stroke-dasharray: 0 6;
    stroke-linecap: round;
  }
  :where(.window-edge) {
    fill: none;
    stroke: var(--obbw-window-edge-color, var(--_window));
    stroke-opacity: 0.8;
    stroke-width: 1.2;
    stroke-dasharray: 0 3.5;
    stroke-linecap: round;
  }
  :where(.cut-line) {
    fill: none;
    stroke: var(--_cut);
    stroke-width: var(--obbw-cut-line-width, 2.5);
    stroke-linejoin: round;
    stroke-linecap: round;
  }
  :where(.cut-line.off) {
    stroke: var(--_muted);
    stroke-width: 2;
    stroke-dasharray: 5 4;
  }
  :where(.recent-shot) {
    fill: var(--obbw-recent-shot-color, var(--_fg));
    fill-opacity: 0.75;
    stroke: var(--_surface);
    stroke-width: 1;
  }
  :where(.scrub) {
    cursor: ew-resize;
    outline: none;
  }
  :where(.scrub-guide) {
    stroke: var(--obbw-example-shot-color, var(--_fg));
    stroke-width: 1;
    stroke-dasharray: 2 2;
    opacity: 0.6;
  }
  :where(.example-shot) {
    fill: none;
    stroke: var(--obbw-example-shot-color, var(--_fg));
    stroke-width: var(--obbw-example-shot-width, 1.5);
  }
  :where(.scrub-handle) {
    fill: var(--_surface);
    stroke: var(--obbw-handle-color, var(--_cut));
    stroke-width: 2.5;
  }
  :where(.scrub:focus-visible .scrub-handle) {
    stroke: var(--_fg);
    stroke-width: 3.5;
  }
  :where(.pill rect) {
    fill: var(--_surface);
    stroke: var(--obbw-pill-border-color, var(--primary-color, #a83b21));
    stroke-width: 1.5;
  }
  :where(.pill text) {
    font-variant-numeric: tabular-nums;
  }

  :where(.readout) {
    margin: 2px 0 4px;
    text-align: center;
    font-size: var(--obbw-readout-font-size, 12px);
    font-weight: 700;
    line-height: 1.35;
    font-variant-numeric: tabular-nums;
    color: var(--obbw-readout-color, var(--_fg));
  }
  :where(.legend) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 14px;
    margin-top: 6px;
    font-size: var(--obbw-legend-font-size, 12px);
    color: var(--obbw-legend-color, var(--_muted));
  }
  :where(.legend span) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  :where(.legend i) {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
  :where(.legend .key-cut i) {
    height: 3px;
    border-radius: 2px;
    background: var(--_cut);
  }
  :where(.legend .key-pace i) {
    height: 0;
    border-top: 1px solid color-mix(in srgb, var(--_fg) 45%, var(--_surface));
    border-radius: 0;
  }
  :where(.legend .key-example i) {
    height: 0;
    border-top: 1.5px solid var(--obbw-example-shot-color, var(--_fg));
    border-radius: 0;
  }
  :where(.legend .key-arrivals i) {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--obbw-recent-shot-color, var(--_fg));
    opacity: 0.75;
  }
  :where(.legend .key-window i) {
    background: color-mix(in srgb, var(--_window) calc(var(--_band-win) * 100%), var(--_surface));
  }
  :where(.legend .key-fast i:first-child) {
    background: color-mix(in srgb, var(--_fast-full) calc(var(--_band-full) * 100%), var(--_surface));
  }
  :where(.legend .key-fast i + i) {
    background: color-mix(in srgb, var(--_fast-part) calc(var(--_band-part) * 100%), var(--_surface));
  }
  :where(.legend .key-slow i:first-child) {
    background: color-mix(in srgb, var(--_slow-full) calc(var(--_band-full) * 100%), var(--_surface));
  }
  :where(.legend .key-slow i + i) {
    background: color-mix(in srgb, var(--_slow-part) calc(var(--_band-part) * 100%), var(--_surface));
  }
  :where(.legend .key-no-cut i) {
    background: repeating-linear-gradient(45deg, var(--_muted) 0 1px, transparent 1px 4px);
  }
  :where(.note) {
    margin: 6px 0 0;
    text-align: center;
    font-size: var(--obbw-note-font-size, 12px);
    color: var(--obbw-note-color, var(--_muted));
  }
  :where(.message) {
    margin: 0;
    padding: 8px 0;
    color: var(--_muted);
  }
`, je = {
	preset: "active",
	show_header: !0,
	show_selector: !0,
	show_example: !0,
	show_readout: !0,
	show_arrivals: !0,
	show_legend: !0,
	show_note: !0
}, Me = 3, $ = (e) => +(+e).toFixed(1), Ne = 0, Pe = class extends Z {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 },
			_state: { state: !0 },
			_width: { state: !0 },
			_scrub: { state: !0 },
			_held: { state: !0 }
		};
	}
	constructor() {
		super(), this._id = `obbw${++Ne}`, this._following = null, this._down = (e) => {
			e.currentTarget.setPointerCapture(e.pointerId), this.renderRoot.querySelector(".scrub")?.focus({ preventScroll: !0 }), this._held = !0, this._at(e);
		}, this._move = (e) => {
			e.currentTarget.hasPointerCapture(e.pointerId) && this._at(e);
		}, this._key = (e) => {
			let t = {
				ArrowRight: .5,
				ArrowUp: .5,
				ArrowLeft: -.5,
				ArrowDown: -.5,
				PageUp: 5,
				PageDown: -5
			}[e.key];
			t && this._scrub != null && (e.preventDefault(), this._seek(this._scrub + t));
		}, this._state = { status: "loading" }, this._width = 0, this._held = !1;
	}
	static getConfigElement() {
		return document.createElement("open-brew-by-weight-preset-card-editor");
	}
	static getStubConfig(e) {
		return {
			device_id: xe(e),
			preset: "active"
		};
	}
	setConfig(e) {
		if (!e || typeof e != "object") throw Error("Invalid configuration");
		this._config = {
			...je,
			...e
		};
	}
	getCardSize() {
		return 6;
	}
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6
		};
	}
	connectedCallback() {
		super.connectedCallback(), this._following = null, this.requestUpdate();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._stop?.(), this._stop = void 0, this._resize?.disconnect(), this._resize = void 0;
	}
	updated(e) {
		e.has("hass") && this.toggleAttribute("dark", !!this.hass?.themes?.darkMode), this._follow();
		let t = this.renderRoot.querySelector(".body");
		t && !this._resize && (this._resize = new ResizeObserver(() => this._width = t.clientWidth), this._resize.observe(t), this._width = t.clientWidth);
	}
	_follow() {
		let e = this._config?.device_id ?? "";
		this.hass && this.isConnected && e !== this._following && (this._stop?.(), this._following = e, e ? (this._state = { status: "loading" }, this._stop = Ce(this.hass, e, (e) => this._state = e)) : this._state = { status: "not_found" });
	}
	render() {
		if (!this._config) return W;
		let e = n(this.hass?.locale?.language ?? this.hass?.language);
		return V`<ha-card>
      <div class="body" part="body">${this._content(e)}</div>
    </ha-card>`;
	}
	_content(e) {
		let t = this._state;
		if (t.status === "loading") return V`<p class="message">${e("state.loading")}</p>`;
		if (t.status === "not_found") return V`<p class="message">${e("state.not_found")}</p>`;
		let { data: n } = t, r = this._config, i = r.preset === "active" || r.preset == null, a = n.presets.find((e) => e.id === (i ? n.activePresetId : Number(r.preset)));
		if (!a) return V`<p class="message">${e("state.missing_preset")}</p>`;
		if (a.goalWeightG == null) return V`<p class="message">${e("state.no_rules")}</p>`;
		let o = we(a, n.cutRampS ?? Me);
		return V`
      ${r.show_header ? this._header(e, n, a, i) : W}
      ${n.available ? W : V`<p class="message" part="status">${e("state.unavailable")}</p>`}
      ${o ? this._chart(e, o, a) : V`<p class="message">${e("state.empty")}</p>`}
    `;
	}
	_header(e, t, n, r) {
		let i = this._config, a = r && i.show_selector && this.hass ? be(this.hass, i.device_id) : void 0, o = [
			e(r ? "header.active" : "header.preset"),
			e("header.target", $(n.goalWeightG)),
			...n.doseG ? [e("header.dose", $(n.doseG))] : []
		].join(" · ");
		return V`<div class="header" part="header">
      <div class="titles">
        <div class="title" part="title">${i.title || n.name}</div>
        <div class="subtitle" part="subtitle">${o}</div>
      </div>
      ${a ? V`<select
            class="selector"
            part="selector"
            aria-label=${e("header.select")}
            .value=${String(n.id)}
            ?disabled=${!t.available || t.shotState === "brewing"}
            @change=${(e) => this._select(a, t, e.target.value)}
          >
            ${t.presets.map((e) => V`<option value=${String(e.id)} ?selected=${e.id === n.id}>${e.name}</option>`)}
          </select>` : W}
    </div>`;
	}
	_select(e, t, n) {
		let r = t.presets.find((e) => String(e.id) === n)?.name;
		r && this.hass?.callService("select", "select_option", {
			entity_id: e,
			option: r
		});
	}
	_chart(e, t, n) {
		if (!this._width) return V`<div class="chart"></div>`;
		let r = this._config, i = ke(t, this._width, { arrivals: r.show_arrivals ? n.arrivalsS : [] }), a = `${n.id}:${t.t1}:${t.t2}:${t.wall}`, o = this._id;
		this._geometry = i, this._model = t, this._scrubKey === a && this._scrub >= t.scrubMin && this._scrub <= t.wall || (this._scrub = Oe(t), this._scrubKey = a);
		let s = De(this._scrub, t), c = [
			$(t.goal),
			s.arrival.toFixed(1),
			e(`verdict.${s.verdict}`),
			s.weight.toFixed(1),
			s.stop.toFixed(1)
		], l = e(s.atTarget ? "graph.readout_target" : "graph.readout", ...c), u = Math.max(t.prot, t.t1 - t.d), d = Math.min(t.wall, t.t2 + t.d), f = e("graph.summary", $(t.prot), $(t.ceil), $(u), $(t.goal), $(t.t1), $(t.t2), $(t.floor), $(d), $(t.wall)), p = (e, t, n) => H`<path class=${n ? `band ${e}` : "band-off"} part=${`band ${e}`} d=${t} fill=${`url(#${o}${e})`}/>`, m = (e, t) => H`<linearGradient id=${o + e} x1="0" y1="0" x2="0" y2="1"><stop class=${t}/><stop class=${`${t} stop-fade`} offset="1"/></linearGradient>`, h = (e, t, n, r = "", i = "middle") => H`<text class=${`axis-label ${r}`} x=${e.toFixed(1)} y=${t.toFixed(1)} text-anchor=${i}>${n}</text>`, g = i.X(s.stop), _ = i.Y(s.weight), v = e("graph.pill", ...c), y = v.length * 6.5 + 16;
		return V`
      <div
        class="chart ${this._held ? "held" : ""}"
        part="chart"
        @pointerdown=${r.show_example ? this._down : null}
        @pointermove=${r.show_example ? this._move : null}
        @lostpointercapture=${() => this._held = !1}
      >
        <svg viewBox="0 0 ${i.width} ${i.height}" width=${i.width} height=${i.height}>
          <defs>
            ${m("fast-full", "stop-fast-full")} ${m("fast-partial", "stop-fast-part")}
            ${m("on-recipe", "stop-window")} ${m("slow-partial", "stop-slow-part")}
            ${m("slow-full", "stop-slow-full")}
            <pattern id="${o}hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path class="no-cut-hatch" d="M0 0V6" />
            </pattern>
            <clipPath id="${o}under"><path d=${i.clip} /></clipPath>
          </defs>
          <g role="img" aria-label=${f}>
            ${i.grid.map((e) => H`<path class="grid-line" part="grid-line" d=${e}/>`)}
            <g clip-path="url(#${o}under)">
              ${p("fast-full", i.bands.fastFull, t.fast)} ${p("fast-partial", i.bands.fastPart, t.fast)}
              ${p("on-recipe", i.bands.window, !0)} ${p("slow-partial", i.bands.slowPart, t.slow)}
              ${p("slow-full", i.bands.slowFull, t.slow)}
              <path class="pace-line" part="pace-line" d=${i.paces}><title>${e("legend.pace")}</title></path>
            </g>
            ${[...i.yLabels, ...i.xLabels].map((e) => h(e.x, e.y, e.text, "", e.anchor))}
            ${i.hatch ? H`<rect class="no-cut" part="no-cut" x=${i.hatch.x} y=${i.hatch.y} width=${i.hatch.width.toFixed(1)} height=${i.hatch.height} fill=${`url(#${o}hatch)`}/>` : W}
            <path class="target-line" part="target-line" d="M${i.L} ${i.target.toFixed(1)}H${i.R}" />
            <path class="max-line" part="max-line" d="M${i.maxX.toFixed(1)} ${i.T}V${i.B}" />
            <path class="window-edge" part="window-edge" d=${i.windowEdges} />
            <path class="cut-line ${t.mode === "timerOnly" ? "off" : ""}" part="cut-line" d=${i.cut} />
            ${i.arrivals.map((e) => H`<circle class="recent-shot" part="recent-shot" cx=${e.x.toFixed(1)} cy=${e.y.toFixed(1)} r="3"/>`)}
            ${i.noCutLabel ? h((i.L + i.hatch.x + i.hatch.width) / 2, (i.T + i.B) / 2, e("graph.no_cut"), "halo") : W}
            ${h(i.R - 2, i.target + (i.targetAbove ? -4 : 13), e("graph.target", $(t.goal)), "halo strong", "end")}
            ${h(i.maxX, i.T - 4, e("graph.max", $(t.wall)), "", "end")}
          </g>
          ${r.show_example ? H`<g class="scrub" part="scrub" role="slider" tabindex="0" aria-label=${e("graph.scrub")}
                aria-valuemin=${t.scrubMin} aria-valuemax=${t.wall} aria-valuenow=${s.stop.toFixed(1)}
                aria-valuetext=${l} @keydown=${this._key}>
                <path class="scrub-guide" d=${`M${g.toFixed(1)} ${i.T}V${i.B}`}/>
                <path class="example-shot" part="example-shot" d=${i.pace(s.arrival, s.stop)}/>
                <circle class="scrub-handle" part="scrub-handle" cx=${g.toFixed(2)} cy=${_.toFixed(2)} r="5"/>
                ${this._held ? H`<g class="pill" transform=${`translate(${g - 11 - y < 1 ? g + 11 : g - 11 - y} ${_})`}>
                      <rect y="-9" rx="9" height="18" width=${y}/>
                      <text class="axis-label strong" x="8" y="4">${v}</text></g>` : W}
              </g>` : W}
        </svg>
      </div>
      ${r.show_example && r.show_readout ? V`<p class="readout" part="readout">${l}</p>` : W}
      ${r.show_legend ? this._legend(e, t, i) : W}
      ${r.show_note ? V`<p class="note" part="note">${this._note(e, t)}</p>` : W}
    `;
	}
	_legend(e, t, n) {
		let r = this._config, i = (e, t, n = 1) => V`<span class=${`key-${e}`}>${Array.from({ length: n }, () => V`<i></i>`)}${t}</span>`;
		return V`<div class="legend" part="legend">
      ${i("cut", e("legend.cut"))} ${i("pace", e("legend.pace"))}
      ${r.show_example ? i("example", e("legend.example")) : W}
      ${n.arrivals.length ? i("arrivals", e("legend.arrivals")) : W}
      ${i("window", e("legend.window"))} ${t.fast ? i("fast", e("legend.fast"), 2) : W}
      ${t.slow ? i("slow", e("legend.slow"), 2) : W} ${i("no-cut", e("legend.no_cut"))}
    </div>`;
	}
	_note(e, t) {
		let n = t.firstDropN > 0 ? "note.start_preset" : t.firstDrop > 0 ? "note.start_others" : "note.start_none";
		return [
			...t.mode === "timerOnly" ? [e("state.timer_only")] : [],
			e("note.pace"),
			e(n, t.firstDrop.toFixed(1))
		].join(" ");
	}
	_seek(e) {
		let t = this._model;
		t && (this._scrub = Math.max(t.scrubMin, Math.min(t.wall, Math.round(e * 10) / 10)));
	}
	_at(e) {
		let t = this.renderRoot.querySelector("svg");
		if (!t || !this._geometry) return;
		let n = t.getBoundingClientRect();
		this._seek(this._geometry.tAt((e.clientX - n.left) * this._geometry.width / n.width));
	}
	static {
		this.styles = [Ae, l`
      :where(ha-card) {
        height: 100%;
        box-sizing: border-box;
      }
      :where(.body) {
        padding: var(--obbw-card-padding, 16px);
      }
      :where(.header) {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }
      :where(.titles) {
        flex: 1;
        min-width: 0;
      }
      :where(.title) {
        font-size: var(--obbw-title-font-size, 16px);
        font-weight: 500;
        color: var(--obbw-title-color, var(--_fg));
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      :where(.subtitle) {
        font-size: 12px;
        color: var(--obbw-subtitle-color, var(--_muted));
      }
      :where(.selector) {
        max-width: 50%;
        padding: 4px 8px;
        border: 1px solid var(--obbw-selector-border-color, var(--divider-color, #dadada));
        border-radius: var(--obbw-selector-radius, 8px);
        background: var(--obbw-selector-background, var(--_surface));
        color: var(--_fg);
        font: inherit;
        font-size: 13px;
      }
    `];
	}
}, Fe = [
	"show_header",
	"show_selector",
	"show_example",
	"show_readout",
	"show_arrivals",
	"show_legend",
	"show_note"
], Ie = class extends Z {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 },
			_state: { state: !0 }
		};
	}
	setConfig(e) {
		this._config = e;
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._stop?.(), this._following = void 0;
	}
	updated(e) {
		let t = this._config?.device_id;
		this.hass && t !== this._following && (this._stop?.(), this._following = t, this._state = void 0, t && (this._stop = Ce(this.hass, t, (e) => this._state = e)));
	}
	render() {
		if (!this.hass || !this._config) return W;
		let e = n(this.hass.locale?.language ?? this.hass.language), t = this._state?.status === "ready" ? this._state.data.presets : [], r = [
			{
				name: "device_id",
				selector: { device: { integration: ye } }
			},
			{
				name: "preset",
				selector: { select: {
					mode: "dropdown",
					options: [{
						value: "active",
						label: e("editor.preset_active")
					}, ...t.map((e) => ({
						value: String(e.id),
						label: e.name
					}))]
				} }
			},
			{
				name: "title",
				selector: { text: {} }
			},
			{
				name: "",
				type: "grid",
				schema: Fe.map((e) => ({
					name: e,
					selector: { boolean: {} }
				}))
			}
		], i = {
			preset: "active",
			...Object.fromEntries(Fe.map((e) => [e, !0])),
			...this._config,
			...typeof this._config.preset == "number" ? { preset: String(this._config.preset) } : {}
		};
		return V`<ha-form
      .hass=${this.hass}
      .data=${i}
      .schema=${r}
      .computeLabel=${(t) => e(`editor.${t.name === "device_id" ? "device" : t.name}`)}
      @value-changed=${this._changed}
    ></ha-form>`;
	}
	_changed(e) {
		let t = { ...e.detail.value };
		t.preset != null && t.preset !== "active" && (t.preset = Number(t.preset)), t.title || delete t.title, this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: t },
			bubbles: !0,
			composed: !0
		}));
	}
}, Le = [["open-brew-by-weight-preset-card", Pe], ["open-brew-by-weight-preset-card-editor", Ie]];
for (let [e, t] of Le) customElements.get(e) || customElements.define(e, t);
var Re = n(navigator.language), ze = window.customCards ??= [];
ze.some((e) => e.type === "open-brew-by-weight-preset-card") || ze.push({
	type: "open-brew-by-weight-preset-card",
	name: Re("card.preset.name"),
	description: Re("card.preset.description"),
	preview: !0,
	documentationURL: "https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/docs/cards.md"
});
