// src/localize.ts
var e = {
	"card.details.name": "Open Brew by Weight shot details",
	"card.details.description": "Every number of your last shot, like a shot card in the controller's Web UI.",
	"shot.auto": "Automatic",
	"ended.scale_loss": "Scale-loss backup",
	"ended.cup": "Cup removed",
	"ended.web": "Web stop",
	"ended.heartbeat": "Web connection lost",
	"ended.hard_limit": "Hard limit",
	"ended.relay": "Relay safety",
	"ended.anomaly": "Weight anomaly",
	"ended.touch": "Sustained weight",
	"field.yield_estimated": "~{0} g est.",
	"field.recorded": " (recorded)",
	"field.none": "None",
	"field.unrated": "Unrated",
	"field.duration": "Duration",
	"field.yield": "Yield",
	"field.goal": "Goal",
	"field.error": "Error",
	"field.drip": "Drip",
	"field.avg_flow": "Avg flow",
	"field.max_flow": "Max flow",
	"field.first_drop": "First drop",
	"field.dose": "Dose",
	"field.ratio": "Ratio",
	"field.target_temp": "Target temp",
	"field.cut_at": "Cut at",
	"field.drip_delay": "Drip delay",
	"field.late_cup": "Late cup",
	"field.ended": "Ended",
	"field.shot_type": "Shot",
	"field.preset": "Preset",
	"field.scale": "Scale",
	"field.rating": "Rating",
	"editor.hero": "Large numbers",
	"editor.fields": "Fields",
	"editor.columns": "Columns (empty fits the width)",
	"editor.show_empty": "Show fields without a value",
	"card.shot.name": "Open Brew by Weight last shot",
	"card.shot.description": "Charts your last shot: over its preset, weight and flow together, or one at a time.",
	"shot.title": "Last shot",
	"shot.none": "No shot yet. Pull one and it shows up here.",
	"shot.no_curve": "This shot has no curve to draw.",
	"shot.cursor": "{0} s · {1} g · cut line {2}",
	"shot.flow_cursor": "{0} s · {1} g · {2} g/s",
	"shot.cursor_label": "Time on this shot's curve",
	"shot.manual": "Manual",
	"shot.timer_only": "Timer only",
	"view.label": "Chart",
	"view.preset_weight": "Preset + weight",
	"view.weight_flow": "Weight + flow",
	"view.weight": "Weight",
	"view.flow": "Flow",
	"legend.last": "Last shot",
	"legend.stopped": "Shot stopped",
	"legend.final": "Final weight, after drips",
	"legend.held": "Touch ignored",
	"legend.drip": "Drip after the stop",
	"legend.weight": "Weight (g)",
	"legend.flow": "Flow rate (g/s)",
	"legend.incomplete": "Incomplete curve",
	"editor.chart": "Chart",
	"editor.mode_switch": "Let viewers switch the chart",
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
	"graph.up_to": "Up to {0} g",
	"graph.down_to": "Down to {0} g",
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
	"editor.show_note": "Show the pace note",
	"card.time.name": "Open Brew by Weight shot time",
	"card.time.description": "When your shots reach their target: fast, on recipe or slow, like the controller's Stats page.",
	"card.consistency.name": "Open Brew by Weight shot consistency",
	"card.consistency.description": "How evenly your shots reach their target, shot by shot, like the controller's Stats page.",
	"card.cut.name": "Open Brew by Weight cut accuracy",
	"card.cut.description": "How close each automatic stop settled to its target, like the controller's Stats page.",
	"stats.title_time": "Shot time",
	"stats.title_consistency": "Shot consistency",
	"stats.title_cut": "Cut accuracy",
	"stats.all_presets": "All",
	"stats.last_n": "Last {0}",
	"stats.window": "Shots included in the stats",
	"stats.preset": "Preset the charts follow",
	"stats.no_timed": "No shot in this view has a time to target yet.",
	"stats.unsupported": "Update the controller firmware to see these charts here.",
	"stats.unavailable": "The controller isn't responding. These are the last known stats.",
	"stats.s": "s",
	"stats.g": "g",
	"stats.window_start": "Window start",
	"stats.window_end": "Window end",
	"stats.legend_fast": "Fast: before {0}",
	"stats.legend_fast_window": "Fast: before the window",
	"stats.legend_on": "On recipe: {0}–{1}",
	"stats.legend_on_window": "On recipe: inside the window",
	"stats.legend_slow": "Slow: after {0}",
	"stats.legend_slow_window": "Slow: after the window",
	"stats.time_pill": "{0} · {1}% of shots",
	"stats.time_window": "{0} into the window",
	"stats.time_cursor": "Time on the shot time chart",
	"stats.legend_within": "Within ±{0}",
	"stats.legend_off_range": "Off by {0}–{1}",
	"stats.legend_off_more": "Off by > {0}",
	"stats.legend_spread": "Recent average and reach",
	"stats.legend_range": "Spread of last {0}",
	"stats.legend_guard_fast": "Fast guard",
	"stats.legend_guard_slow": "Slow guard",
	"stats.consistency_good": "Very consistent",
	"stats.consistency_fair": "Fairly consistent",
	"stats.consistency_poor": "Varies a lot",
	"stats.consistency_few": "Not enough shots yet",
	"stats.consistency_spread": "Spread",
	"stats.consistency_shots": "Shots",
	"stats.consistency_avg": "avg",
	"stats.consistency_oldest": "Oldest",
	"stats.consistency_latest": "Latest",
	"stats.consistency_pill": "Shot {0}{1} · {2} · {3}",
	"stats.consistency_cursor": "Shot on the consistency chart",
	"stats.cut_of": "{0} of {1}",
	"stats.cut_bullseyes": "Bullseyes",
	"stats.cut_bullseye": "Bullseye",
	"stats.cut_within": "Within ±{0}",
	"stats.cut_avg_miss": "Avg miss",
	"stats.cut_centred": "Centred",
	"stats.cut_leans_over": "Leans over",
	"stats.cut_leans_under": "Leans under",
	"stats.cut_target": "Target",
	"stats.cut_pill": "Shot {0}{1} · {2} · {3}",
	"stats.cut_cursor": "Shot on the cut accuracy chart",
	"stats.cut_none": "No shot in this view has been stopped by weight yet.",
	"editor.preset_all": "All presets",
	"editor.shots": "Shots",
	"editor.show_preset_selector": "Let viewers pick the preset",
	"editor.show_shots_selector": "Let viewers pick how many shots",
	"editor.show_figures": "Show the figures",
	"editor.band": "Band",
	"band.range": "Moving range",
	"band.ewma": "Weighted trend"
}, t = {
	en: e,
	es: {
		"card.details.name": "Detalles del shot de Open Brew by Weight",
		"card.details.description": "Todos los números de tu último shot, como una tarjeta de shot en la web del controlador.",
		"shot.auto": "Automático",
		"ended.scale_loss": "Respaldo por pérdida de báscula",
		"ended.cup": "Taza retirada",
		"ended.web": "Detenido desde la web",
		"ended.heartbeat": "Conexión web perdida",
		"ended.hard_limit": "Límite absoluto",
		"ended.relay": "Seguridad del relé",
		"ended.anomaly": "Anomalía de peso",
		"ended.touch": "Respaldo por toque",
		"field.yield_estimated": "~{0} g est.",
		"field.recorded": " (registrado)",
		"field.none": "Ninguno",
		"field.unrated": "Sin valorar",
		"field.duration": "Duración",
		"field.yield": "Rendimiento",
		"field.goal": "Meta",
		"field.error": "Error",
		"field.drip": "Goteo",
		"field.avg_flow": "Flujo medio",
		"field.max_flow": "Flujo máx.",
		"field.first_drop": "Primera gota",
		"field.dose": "Dosis",
		"field.ratio": "Ratio",
		"field.target_temp": "Temp. objetivo",
		"field.cut_at": "Corte en",
		"field.drip_delay": "Retardo de goteo",
		"field.late_cup": "Taza tardía",
		"field.ended": "Terminó",
		"field.shot_type": "Shot",
		"field.preset": "Preset",
		"field.scale": "Báscula",
		"field.rating": "Valoración",
		"editor.hero": "Números grandes",
		"editor.fields": "Campos",
		"editor.columns": "Columnas (vacío se ajusta al ancho)",
		"editor.show_empty": "Mostrar campos sin valor",
		"card.shot.name": "Último shot de Open Brew by Weight",
		"card.shot.description": "Grafica tu último shot: sobre su preset, peso y flujo juntos, o cada uno por separado.",
		"shot.title": "Último shot",
		"shot.none": "Aún no hay shots. Prepara uno y aparecerá aquí.",
		"shot.no_curve": "Este shot no tiene una curva que dibujar.",
		"shot.cursor": "{0} s · {1} g · línea de corte {2}",
		"shot.flow_cursor": "{0} s · {1} g · {2} g/s",
		"shot.cursor_label": "Momento en la curva de este shot",
		"shot.manual": "Manual",
		"shot.timer_only": "Solo tiempo",
		"view.label": "Gráfico",
		"view.preset_weight": "Preset + peso",
		"view.weight_flow": "Peso + flujo",
		"view.weight": "Peso",
		"view.flow": "Flujo",
		"legend.last": "Último shot",
		"legend.stopped": "Shot detenido",
		"legend.final": "Peso final, tras el goteo",
		"legend.held": "Toque ignorado",
		"legend.drip": "Goteo tras el corte",
		"legend.weight": "Peso (g)",
		"legend.flow": "Flujo (g/s)",
		"legend.incomplete": "Curva incompleta",
		"editor.chart": "Gráfico",
		"editor.mode_switch": "Permitir cambiar el gráfico desde la card",
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
		"graph.up_to": "Sube hasta {0} g",
		"graph.down_to": "Baja hasta {0} g",
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
		"editor.show_note": "Mostrar la nota del ritmo",
		"card.time.name": "Tiempo de shot de Open Brew by Weight",
		"card.time.description": "Cuándo llegan tus shots a la meta: rápidos, en receta o lentos, como en la página Stats del controlador.",
		"card.consistency.name": "Consistencia de shots de Open Brew by Weight",
		"card.consistency.description": "Qué tan parejo llegan tus shots a la meta, shot a shot, como en la página Stats del controlador.",
		"card.cut.name": "Precisión de corte de Open Brew by Weight",
		"card.cut.description": "Qué tan cerca de la meta quedó cada corte automático, como en la página Stats del controlador.",
		"stats.title_time": "Tiempo de shot",
		"stats.title_consistency": "Consistencia de shots",
		"stats.title_cut": "Precisión de corte",
		"stats.all_presets": "Todos",
		"stats.last_n": "Últimos {0}",
		"stats.window": "Shots incluidos en las estadísticas",
		"stats.preset": "Preset que siguen los gráficos",
		"stats.no_timed": "Ningún shot de esta vista tiene tiempo hasta la meta todavía.",
		"stats.unsupported": "Actualiza el firmware del controlador para ver estos gráficos aquí.",
		"stats.unavailable": "El controlador no responde. Se muestran las últimas estadísticas conocidas.",
		"stats.s": "s",
		"stats.g": "g",
		"stats.window_start": "Inicio de la ventana",
		"stats.window_end": "Fin de la ventana",
		"stats.legend_fast": "Rápido: antes de {0}",
		"stats.legend_fast_window": "Rápido: antes de la ventana",
		"stats.legend_on": "En receta: {0}–{1}",
		"stats.legend_on_window": "En receta: dentro de la ventana",
		"stats.legend_slow": "Lento: después de {0}",
		"stats.legend_slow_window": "Lento: después de la ventana",
		"stats.time_pill": "{0} · {1}% de los shots",
		"stats.time_window": "{0} dentro de la ventana",
		"stats.time_cursor": "Momento en el gráfico de tiempo de shot",
		"stats.legend_within": "Dentro de ±{0}",
		"stats.legend_off_range": "Desvío de {0}–{1}",
		"stats.legend_off_more": "Desvío > {0}",
		"stats.legend_spread": "Promedio y alcance recientes",
		"stats.legend_range": "Dispersión de los últimos {0}",
		"stats.legend_guard_fast": "Guarda de rápidos",
		"stats.legend_guard_slow": "Guarda de lentos",
		"stats.consistency_good": "Muy consistente",
		"stats.consistency_fair": "Bastante consistente",
		"stats.consistency_poor": "Varía mucho",
		"stats.consistency_few": "Aún faltan shots",
		"stats.consistency_spread": "Dispersión",
		"stats.consistency_shots": "Shots",
		"stats.consistency_avg": "prom.",
		"stats.consistency_oldest": "Más antiguo",
		"stats.consistency_latest": "Último",
		"stats.consistency_pill": "Shot {0}{1} · {2} · {3}",
		"stats.consistency_cursor": "Shot en el gráfico de consistencia",
		"stats.cut_of": "{0} de {1}",
		"stats.cut_bullseyes": "Al blanco",
		"stats.cut_bullseye": "Al blanco",
		"stats.cut_within": "Dentro de ±{0}",
		"stats.cut_avg_miss": "Desvío medio",
		"stats.cut_centred": "Centrado",
		"stats.cut_leans_over": "Tiende a pasarse",
		"stats.cut_leans_under": "Tiende a quedarse corto",
		"stats.cut_target": "Meta",
		"stats.cut_pill": "Shot {0}{1} · {2} · {3}",
		"stats.cut_cursor": "Shot en el gráfico de precisión de corte",
		"stats.cut_none": "Ningún shot de esta vista se ha cortado por peso todavía.",
		"editor.preset_all": "Todos los presets",
		"editor.shots": "Shots",
		"editor.show_preset_selector": "Permitir elegir el preset desde la card",
		"editor.show_shots_selector": "Permitir elegir cuántos shots desde la card",
		"editor.show_figures": "Mostrar las cifras",
		"editor.band": "Banda",
		"band.range": "Rango móvil",
		"band.ewma": "Tendencia ponderada"
	}
};
function n(n) {
	let r = t[(n ?? "en").split("-")[0]] ?? e;
	return (t, ...n) => (r[t] ?? e[t] ?? String(t)).replace(/\{(\d+)\}/g, (e, t) => String(n[Number(t)]));
}
// src/registry.ts
var r = [
	["open-brew-by-weight-preset-card", "preset"],
	["open-brew-by-weight-shot-chart-card", "shot"],
	["open-brew-by-weight-shot-card", "details"],
	["open-brew-by-weight-shot-time-card", "time"],
	["open-brew-by-weight-shot-consistency-card", "consistency"],
	["open-brew-by-weight-cut-accuracy-card", "cut"]
], i = "https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/docs/cards.md", a;
function o(e) {
	if (!e || e === a) return;
	a = e;
	let t = n(e), o = window.customCards ??= [];
	for (let [e, n] of r) {
		let r = o.find((t) => t.type === e) ?? o[o.push({ type: e }) - 1];
		Object.assign(r, {
			name: t(`card.${n}.name`),
			description: t(`card.${n}.description`),
			preview: !0,
			documentationURL: i
		});
	}
}
// node_modules/@lit/reactive-element/css-tag.js
var s = globalThis, c = s.ShadowRoot && (s.ShadyCSS === void 0 || s.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, l = Symbol(), u = /* @__PURE__ */ new WeakMap(), d = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== l) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (c && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = u.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && u.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, f = (e) => new d(typeof e == "string" ? e : e + "", void 0, l), p = (e, ...t) => new d(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, l), m = (e, t) => {
	if (c) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = s.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, h = c ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return f(t);
})(e) : e, { is: g, defineProperty: _, getOwnPropertyDescriptor: v, getOwnPropertyNames: y, getOwnPropertySymbols: b, getPrototypeOf: x } = Object, S = globalThis, C = S.trustedTypes, w = C ? C.emptyScript : "", T = S.reactiveElementPolyfillSupport, E = (e, t) => e, D = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? w : null;
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
}, O = (e, t) => !g(e, t), k = {
	attribute: !0,
	type: String,
	converter: D,
	reflect: !1,
	useDefault: !1,
	hasChanged: O
};
Symbol.metadata ??= Symbol("metadata"), S.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var A = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = k) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && _(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = v(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? k;
	}
	static _$Ei() {
		if (this.hasOwnProperty(E("elementProperties"))) return;
		let e = x(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(E("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
			let e = this.properties, t = [...y(e), ...b(e)];
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
			for (let e of n) t.unshift(h(e));
		} else e !== void 0 && t.push(h(e));
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
		return m(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? D : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? D : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? O)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[E("elementProperties")] = /* @__PURE__ */ new Map(), A[E("finalized")] = /* @__PURE__ */ new Map(), T?.({ ReactiveElement: A }), (S.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var j = globalThis, M = (e) => e, N = j.trustedTypes, P = N ? N.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, F = "$lit$", I = `lit$${Math.random().toFixed(9).slice(2)}$`, ee = "?" + I, te = `<${ee}>`, L = document, R = () => L.createComment(""), z = (e) => e === null || typeof e != "object" && typeof e != "function", ne = Array.isArray, re = (e) => ne(e) || typeof e?.[Symbol.iterator] == "function", ie = "[ 	\n\f\r]", ae = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, oe = /-->/g, se = />/g, B = RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ce = /'/g, le = /"/g, ue = /^(?:script|style|textarea|title)$/i, de = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), V = de(1), H = de(2), U = Symbol.for("lit-noChange"), W = Symbol.for("lit-nothing"), fe = /* @__PURE__ */ new WeakMap(), G = L.createTreeWalker(L, 129);
function pe(e, t) {
	if (!ne(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return P === void 0 ? t : P.createHTML(t);
}
var me = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = ae;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === ae ? c[1] === "!--" ? o = oe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = B) : (ue.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = B) : o = se : o === B ? c[0] === ">" ? (o = i ?? ae, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? B : c[3] === "\"" ? le : ce) : o === le || o === ce ? o = B : o === oe || o === se ? o = ae : (o = B, i = void 0);
		let d = o === B && e[t + 1].startsWith("/>") ? " " : "";
		a += o === ae ? n + te : l >= 0 ? (r.push(s), n.slice(0, l) + F + n.slice(l) + I + d) : n + I + (l === -2 ? t : d);
	}
	return [pe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, he = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = me(t, n);
		if (this.el = e.createElement(l, r), G.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = G.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(F)) {
					let t = u[o++], n = i.getAttribute(e).split(I), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ye : r[1] === "?" ? be : r[1] === "@" ? xe : ve
					}), i.removeAttribute(e);
				} else e.startsWith(I) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ue.test(i.tagName)) {
					let e = i.textContent.split(I), t = e.length - 1;
					if (t > 0) {
						i.textContent = N ? N.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], R()), G.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], R());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ee) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(I, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += I.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = L.createElement("template");
		return n.innerHTML = e, n;
	}
};
function K(e, t, n = e, r) {
	if (t === U) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = z(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = K(e, i._$AS(e, t.values), i, r)), t;
}
var ge = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? L).importNode(t, !0);
		G.currentNode = r;
		let i = G.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new _e(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Se(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = G.nextNode(), a++);
		}
		return G.currentNode = L, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, _e = class e {
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
		e = K(this, e, t), z(e) ? e === W || e == null || e === "" ? (this._$AH !== W && this._$AR(), this._$AH = W) : e !== this._$AH && e !== U && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? re(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== W && z(this._$AH) ? this._$AA.nextSibling.data = e : this.T(L.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = he.createElement(pe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ge(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = fe.get(e.strings);
		return t === void 0 && fe.set(e.strings, t = new he(e)), t;
	}
	k(t) {
		ne(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(R()), this.O(R()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = M(e).nextSibling;
			M(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, ve = class {
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
		if (i === void 0) e = K(this, e, t, 0), a = !z(e) || e !== this._$AH && e !== U, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = K(this, r[n + o], t, o), s === U && (s = this._$AH[o]), a ||= !z(s) || s !== this._$AH[o], s === W ? e = W : e !== W && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === W ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ye = class extends ve {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === W ? void 0 : e;
	}
}, be = class extends ve {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== W);
	}
}, xe = class extends ve {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = K(this, e, t, 0) ?? W) === U) return;
		let n = this._$AH, r = e === W && n !== W || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== W && (n === W || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Se = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		K(this, e);
	}
}, Ce = j.litHtmlPolyfillSupport;
Ce?.(he, _e), (j.litHtmlVersions ??= []).push("3.3.3");
var we = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new _e(t.insertBefore(R(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Te = globalThis, q = class extends A {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = we(t, this.renderRoot, this.renderOptions);
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
q._$litElement$ = !0, q.finalized = !0, Te.litElementHydrateSupport?.({ LitElement: q });
var Ee = Te.litElementPolyfillSupport;
Ee?.({ LitElement: q }), (Te.litElementVersions ??= []).push("4.2.2");
// src/ha.ts
var J = "open_brew_by_weight", De = (e, t) => Object.values(e.entities).find((e) => e.device_id === t && e.platform === "open_brew_by_weight" && e.entity_id.startsWith("select."))?.entity_id, Oe = (e) => Object.values(e.entities).find((e) => e.platform === "open_brew_by_weight" && e.device_id)?.device_id ?? void 0, ke = 2e3, Ae = (e, t, n) => Me(e, {
	type: `${J}/subscribe`,
	device_id: t
}, n), je = (e, t, n, r, i) => Me(e, {
	type: `${J}/stats/subscribe`,
	device_id: t,
	window: n,
	preset: r
}, i);
function Me(e, t, n) {
	let r = !1, i, a, o = () => {
		a = void 0, e.connection.subscribeMessage((e) => {
			typeof e == "object" && e && "unloaded" in e ? (i?.(), i = void 0, n({ status: "loading" }), r || (a = setTimeout(o, ke))) : n({
				status: "ready",
				data: e
			});
		}, t).then((e) => {
			r ? e() : i = e;
		}, () => {
			n({ status: "not_found" }), r || (a = setTimeout(o, ke * 5));
		});
	};
	return o(), () => {
		r = !0, clearTimeout(a), i?.();
	};
}
// src/base-card.ts
var Y;
function Ne(e, t) {
	if (Y === void 0) try {
		Y = document.createElement("canvas").getContext("2d");
	} catch {
		Y = null;
	}
	return Y ? (Y.font = t, Y.measureText(e).width) : e.length * 6.5;
}
function Pe(e, t, n, r, i, a) {
	let o = e.split(" · "), s = (e) => !r || e + 28 <= Math.max(t, r - t), c = [e], l = a(e), u = 9;
	if (!s(l) && o.length > 1) {
		let e = Math.max(1, o.length - 2);
		c = [o.slice(0, e).join(" · "), o.slice(e).join(" · ")], l = Math.max(...c.map(a)), u = 17;
	}
	let d = l + 16, [f, p] = s(l) ? [t - 11 - d < 1 ? t + 11 : t - 11 - d, n] : [Math.max(1, Math.min(t - d / 2, r - d - 1)), n < i / 2 ? n + u + 12 : n - u - 12];
	return {
		lines: c,
		pw: d,
		h: u,
		px: f,
		py: p
	};
}
var X = class extends q {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 },
			_state: { state: !0 },
			_width: { state: !0 }
		};
	}
	constructor() {
		super(), this._following = null, this._state = { status: "loading" }, this._width = 0;
	}
	setConfig(e) {
		if (!e || typeof e != "object") throw Error("Invalid configuration");
		this._config = {
			...this.defaults,
			...e
		};
	}
	connectedCallback() {
		super.connectedCallback(), this._following = null, this.requestUpdate();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._stop?.(), this._stop = void 0, this._resize?.disconnect(), this._resize = void 0;
	}
	_measure(e, t, n = 400) {
		return Ne(e, `${n} ${t}px ${getComputedStyle(this).fontFamily || "sans-serif"}`);
	}
	_pillAt(e, t, n, r, i) {
		let a = Pe(e, t, n, r, i, (e) => this._measure(e, 11, 600));
		return H`<g class="pill" transform=${`translate(${a.px} ${a.py})`}>
      <rect y=${-a.h} rx="9" height=${2 * a.h} width=${a.pw}/>
      <text class="axis-label strong" x="8" y="4">${a.lines.length === 1 ? a.lines[0] : a.lines.map((e, t) => H`<tspan x="8" dy=${t ? 16 : -9}>${e}</tspan>`)}</text></g>`;
	}
	get t() {
		return n(this.hass?.locale?.language ?? this.hass?.language);
	}
	updated(e) {
		e.has("hass") && (this.toggleAttribute("dark", !!this.hass?.themes?.darkMode), o(this.hass?.locale?.language ?? this.hass?.language)), this._follow();
		let t = this.renderRoot.querySelector(".body");
		t && !this._resize && (this._resize = new ResizeObserver(([e]) => this._width = Math.floor(e.contentRect.width)), this._resize.observe(t));
	}
	_follow() {
		let e = this._config?.device_id ?? "";
		this.hass && this.isConnected && e !== this._following && (this._stop?.(), this._following = e, e ? (this._state = { status: "loading" }, this._stop = Ae(this.hass, e, (e) => this._state = e)) : this._state = { status: "not_found" });
	}
}, Fe = .18;
function Ie(e) {
	let t = (e) => Number.isFinite(Number(e)) ? Number(e) : NaN, n = t(e.goalWeightG), r = t(e.fastBeforeS), i = t(e.slowAfterS), a = t(e.bbwProtectionMs) / 1e3, o = t(e.operationalWallMs) / 1e3, s = t(e.fastRampS), c = t(e.slowRampS), l = Le(e.fastCurve, e.fastCurveHardness), u = Le(e.slowCurve, e.slowCurveHardness), d = !!e.fastExtractionGuardEnabled, f = !!e.slowExtractionGuardEnabled, p = t(e.fastMarginG), m = t(e.slowMarginG), h = d ? n + p : n, g = f ? n - m : n, _ = Math.max(0, Math.min(t(e.firstDropS) || 0, r - .5));
	return ![
		n,
		r,
		i,
		a,
		o,
		s,
		c,
		l,
		u,
		h,
		g
	].every(Number.isFinite) || !(a < r && r < i && i < o) ? null : {
		mode: e.brewByWeight === !1 ? "timerOnly" : "active",
		fast: d,
		slow: f,
		fastMargin: p,
		slowMargin: m,
		goal: n,
		ceil: h,
		floor: g,
		t1: r,
		t2: i,
		prot: a,
		wall: o,
		dFast: s,
		dSlow: c,
		curveFast: l,
		curveSlow: u,
		firstDrop: _,
		firstDropN: t(e.firstDropN) || 0,
		scrubMin: Math.max(a, _ + .5)
	};
}
function Le(e, t) {
	let n = [
		"even",
		"early",
		"late"
	].indexOf(e ?? "");
	if (n < 0) return NaN;
	let r = Number(t);
	if (Number.isFinite(r)) return n * 3 + Math.min(2, Math.max(0, r / 50));
	let i = [
		"soft",
		"medium",
		"hard"
	].indexOf(String(t));
	return i < 0 ? NaN : n * 3 + i;
}
var Re = [
	[2, 2],
	[3, 3],
	[4, 4],
	[2, 3],
	[2, 4],
	[2, 6],
	[3, 2],
	[4, 2],
	[6, 2]
];
function ze(e, t) {
	let n = Math.floor(e), r = e - n;
	if (r > 0) {
		let e = ze(n, t);
		return e + (ze(n + 1, t) - e) * r;
	}
	let [i, a] = Re[e], o = i + a - 1, s = 0, c = 1;
	for (let e = 0; e <= o; e++) e >= i && (s += c * t ** e * (1 - t) ** (o - e)), c = c * (o - e) / (e + 1);
	return s;
}
function Be(e, t, n, r, i) {
	let a = Math.floor(r), o = Math.round((r - a) * 100);
	if (o > 0) {
		let r = Be(e, t, n, a, i), s = Be(e, t, n, a + 1, i);
		return Math.floor((r * (100 - o) + s * o + 50) / 100);
	}
	let [s, c] = Re[r], l = s + c - 1, u = BigInt(0), d = BigInt(1);
	for (let e = 0; e <= l; e++) e >= s === i && (u += d * BigInt(t) ** BigInt(e) * BigInt(n - t) ** BigInt(l - e)), d = d * BigInt(l - e) / BigInt(e + 1);
	return Number(BigInt(e) * u / BigInt(n) ** BigInt(l));
}
function Ve(e, t) {
	let n = (e) => Math.round(e * 1e3), r = (e) => Math.round(e * 10), i = n(Math.max(t.prot, Math.min(t.wall, e))), a = r(t.goal), o = n(Math.max(t.prot, t.t1 - t.dFast)), s = n(t.t1), c = n(t.t2), l = n(Math.min(t.wall, t.t2 + t.dSlow));
	if (i < s) {
		let e = t.fast ? r(t.fastMargin) : 0;
		return (a + (i < o ? e : Be(e, i - o, s - o, t.curveFast, !1))) / 10;
	}
	if (i > c || i === c && l === c) {
		let e = t.slow ? r(t.slowMargin) : 0;
		return (a - (i >= l ? e : Be(e, i - c, l - c, t.curveSlow, !0))) / 10;
	}
	return a / 10;
}
function He(e, t, n, r = 0) {
	let i = Math.max(0, e - r) / (n - r);
	return t * (2 * Fe * i + (1 - 2 * Fe) * i * i);
}
function Ue(e, t) {
	let n = Ve(e, t), r = Fe, i = (Math.sqrt(4 * r * r + 4 * (1 - 2 * r) * n / t.goal) - 2 * r) / (2 * (1 - 2 * r)), a = t.firstDrop + (e - t.firstDrop) / i;
	return {
		stop: e,
		weight: n,
		arrival: a,
		verdict: e >= t.wall ? "max_time" : a < t.t1 - .5 ? "fast" : a > t.t2 + .5 ? "slow" : "on_recipe",
		atTarget: Math.abs(n - t.goal) < .05
	};
}
var We = (e) => Math.max(e.scrubMin, Math.round((e.t1 + e.t2) * 5) / 10);
function Ge(e, t, n = {}) {
	let { arrivals: r = [], compact: i = !1, tens: a = !1, maxG: o = 0, maxT: s = 0 } = n, c = t, l = Math.round(i ? Math.min(180, Math.max(140, c * .48)) : Math.min(220, Math.max(180, c * .56))), u = c - 10, d = l - 18, f = Math.ceil(Math.max(e.ceil, o) + 2), p = f > 30 ? 10 : 5, m = Math.max(e.wall, s), h = (e) => 34 + (u - 34) * e / m, g = (e) => d - (d - 14) * e / f, _ = (e) => +(+e).toFixed(1), v = (e, t) => h(e).toFixed(2) + " " + g(t).toFixed(2), y = (e, t, n, r, i) => {
		if (!i) return `C${v(e + (n - e) / 3, t)} ${v(e + 2 * (n - e) / 3, r)} ${v(n, r)}`;
		let a = "";
		for (let o = 1; o <= 48; o++) a += `L${v(e + (n - e) * o / 48, t + (r - t) * ze(i, o / 48))}`;
		return a;
	}, b = Math.max(e.prot, e.t1 - e.dFast), x = Math.min(e.wall, e.t2 + e.dSlow), S = `L${v(b, e.ceil)}` + y(b, e.ceil, e.t1, e.goal, e.curveFast), C = `L${v(e.t2, e.goal)}`, w = y(e.t2, e.goal, x, e.floor, e.curveSlow) + `L${v(e.wall, e.floor)}`, T = e.firstDrop, E = (t) => {
		let n = Fe, r = (f + 1) / e.goal;
		return Math.min(m, T + (t - T) * (Math.sqrt(4 * n * n + 4 * (1 - 2 * n) * r) - 2 * n) / (2 * (1 - 2 * n)));
	}, D = (t, n) => v(T + (n - T) / 2, e.goal * Fe * (n - T) / (t - T)), O = (t, n = E(t)) => v(n, He(n, e.goal, t, T)), k = (e, t = E(e)) => `Q${D(e, t)} ${O(e, t)}`, A = (e, t = E(e)) => `Q${D(e, t)} ${v(T, 0)}`, j = `M${v(0, 0)}L${v(T, 0)}`, M = `M${v(T, 0)}`, N = `L${v(m, f + 1)}`, P = Math.max(T + .5, e.t1 - e.dFast), F = e.t2 + e.dSlow, I = [], ee = [], te = [];
	for (let e = 0; e <= f; e += p) I.push(`M34 ${g(e).toFixed(1)}H${u}`), ee.push({
		x: 30,
		y: g(e) + 3,
		text: `${e} g`,
		anchor: "end"
	});
	let L = -99;
	return (a ? Array.from({ length: Math.floor(m / 10) + 1 }, (e, t) => t * 10) : [
		0,
		e.prot,
		e.t1,
		e.t2,
		e.wall
	]).forEach((e, t, n) => {
		let r = _(e) + " s", i = r.length * 6.5, o = h(e) + i / 2 > c - 1, s = o ? c - 1 - i : t ? h(e) - i / 2 : h(e);
		s < L + 4 && t < n.length - 1 || (L = s + i, a && I.push(`M${h(e).toFixed(1)} 14V${d}`), te.push({
			x: o ? c - 1 : h(e),
			y: d + 13,
			text: r,
			anchor: o ? "end" : t ? "middle" : "start"
		}));
	}), {
		width: c,
		height: l,
		L: 34,
		R: u,
		T: 14,
		B: d,
		X: h,
		Y: g,
		tAt: (e) => (e - 34) * m / (u - 34),
		grid: I,
		yLabels: ee,
		xLabels: te,
		clip: `M${v(0, 0)}L${v(0, e.ceil)}L${v(e.prot, e.ceil)}${S}${C}${w}L${v(e.wall, 0)}Z`,
		bands: {
			fastFull: j + k(P) + `L${v(E(P), f + 1)}L${v(0, f + 1)}Z`,
			fastPart: j + k(e.t1) + N + `L${O(P)}` + A(P) + "Z",
			window: j + k(e.t1, e.t1) + `L${v(e.t2, e.goal)}` + A(e.t2, e.t2) + "Z",
			slowPart: j + k(e.t2) + N + `L${O(F)}` + A(F) + "Z",
			slowFull: j + k(F) + N + `L${v(m, 0)}Z`
		},
		paces: [
			P,
			e.t1,
			e.t2,
			F
		].map((e) => M + k(e)).join(""),
		cut: `M${v(e.prot, e.ceil)}${S}${C}${w}`,
		target: g(e.goal),
		maxX: h(e.wall),
		windowEdges: `M${h(e.t1).toFixed(1)} 14V${d}M${h(e.t2).toFixed(1)} 14V${d}`,
		hatch: i ? null : {
			x: 34,
			y: 14,
			width: h(e.prot) - 34,
			height: d - 14
		},
		arrivals: r.filter((e) => e <= m).map((t) => ({
			x: h(t),
			y: g(Ve(t, e))
		})),
		pace: (e, t) => M + k(e, t),
		noCutLabel: !i && h(e.prot) - 34 >= 96,
		targetAbove: i || g(e.goal) - 4 - 14 >= 16,
		holds: {
			up: e.mode === "active" && e.ceil > e.goal ? {
				x: h(e.prot) + 6,
				y: g(e.ceil) - 6,
				anchor: "start"
			} : null,
			down: e.mode === "active" && e.floor < e.goal ? {
				x: h(e.wall) - 4,
				y: g(e.floor) + 15,
				anchor: "end"
			} : null
		}
	};
}
// src/theme.ts
var Ke = p`
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
    --_d-shot: #0e7490;
    --_d-flow: #7a7a7a;
    --_d-mid: #e8a317;
    --_d-fair: #7b4a09;
    --_d-poor: #a83b21;
  }
  :host([dark]) {
    --_d-fast: #ff6b4a;
    --_d-slow: #6cb6e6;
    --_d-ok: #74d68c;
    --_d-cut: #9e1c22;
    --_d-band-full: 0.22;
    --_d-band-part: 0.11;
    --_d-band-win: 0.32;
    --_d-shot: #38bdf8;
    --_d-flow: #b8b8b8;
    --_d-mid: #f2c14e;
    --_d-fair: #edc17d;
    --_d-poor: #c45c38;
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
    --_shot: var(--obbw-shot-line-color, var(--_d-shot));
    --_flow: var(--obbw-flow-color, var(--_d-flow));
    --_weight: var(--obbw-weight-color, var(--_ok));
    --_mid: var(--obbw-mid-color, var(--_d-mid));
    --_fair: var(--obbw-fair-color, var(--_d-fair));
    --_poor: var(--obbw-poor-color, var(--_d-poor));
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
  :where(.axis-label.hold) {
    fill: var(--obbw-hold-label-color, var(--_fg));
    fill-opacity: 0.8;
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
    stroke: var(--obbw-pill-border-color, var(--_cut));
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
`, qe = p`
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
  /* A native select with the chevron drawn clear of the rounded border. */
  :where(.selector) {
    max-width: 50%;
    padding: 4px 30px 4px 10px;
    border: 1px solid var(--obbw-selector-border-color, var(--divider-color, #dadada));
    border-radius: var(--obbw-selector-radius, 8px);
    appearance: none;
    background:
      linear-gradient(45deg, transparent 50%, var(--_muted) 50%) right 16px center / 5px 5px no-repeat,
      linear-gradient(135deg, var(--_muted) 50%, transparent 50%) right 11px center / 5px 5px no-repeat,
      var(--obbw-selector-background, var(--_surface));
    color: var(--_fg);
    font: inherit;
    font-size: 13px;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  /* The verdict pill of the Web UI's shot cards: a tinted capsule with a dot. */
  :where(.chip) {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.2rem 0.65rem;
    border-radius: 2rem;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    --_c: var(--_ok);
    color: color-mix(in srgb, var(--_c) 80%, var(--_fg));
    background: color-mix(in srgb, var(--_c) 13%, var(--_surface));
  }
  :where(.chip)::before {
    content: "";
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--_c);
  }
  :where(.chip.fast) {
    --_c: var(--_fast);
  }
  :where(.chip.slow) {
    --_c: var(--_slow);
  }
  :where(.chip.manual) {
    --_c: var(--_muted);
  }
`, Je = {
	preset: "active",
	show_header: !0,
	show_selector: !0,
	show_example: !0,
	show_readout: !0,
	show_arrivals: !0,
	show_legend: !0,
	show_note: !0
}, Z = (e) => +(+e).toFixed(1), Ye = 0, Xe = class extends X {
	static {
		this.properties = {
			...X.properties,
			_scrub: { state: !0 },
			_held: { state: !0 }
		};
	}
	constructor() {
		super(), this.defaults = Je, this._id = `obbw${++Ye}`, this._down = (e) => {
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
		}, this._held = !1;
	}
	static getConfigElement() {
		return document.createElement("open-brew-by-weight-preset-card-editor");
	}
	static getStubConfig(e) {
		return {
			device_id: Oe(e),
			preset: "active"
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
	render() {
		if (!this._config) return W;
		let e = this.t;
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
		let o = Ie(a);
		return V`
      ${r.show_header ? this._header(e, n, a, i) : W}
      ${n.available ? W : V`<p class="message" part="status">${e("state.unavailable")}</p>`}
      ${o ? this._chart(e, o, a) : V`<p class="message">${e("state.empty")}</p>`}
    `;
	}
	_header(e, t, n, r) {
		let i = this._config, a = r && i.show_selector && this.hass ? De(this.hass, i.device_id) : void 0, o = [
			e(r ? "header.active" : "header.preset"),
			e("header.target", Z(n.goalWeightG)),
			...n.doseG ? [e("header.dose", Z(n.doseG))] : []
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
		let r = this._config, i = Ge(t, this._width, { arrivals: r.show_arrivals ? n.arrivalsS : [] }), a = `${n.id}:${t.t1}:${t.t2}:${t.wall}`, o = this._id;
		this._geometry = i, this._model = t, this._scrubKey === a && this._scrub >= t.scrubMin && this._scrub <= t.wall || (this._scrub = We(t), this._scrubKey = a);
		let s = Ue(this._scrub, t), c = [
			Z(t.goal),
			s.arrival.toFixed(1),
			e(`verdict.${s.verdict}`),
			s.weight.toFixed(1),
			s.stop.toFixed(1)
		], l = e(s.atTarget ? "graph.readout_target" : "graph.readout", ...c), u = Math.max(t.prot, t.t1 - t.dFast), d = Math.min(t.wall, t.t2 + t.dSlow), f = e("graph.summary", Z(t.prot), Z(t.ceil), Z(u), Z(t.goal), Z(t.t1), Z(t.t2), Z(t.floor), Z(d), Z(t.wall)), p = (e, t, n) => H`<path class=${n ? `band ${e}` : "band-off"} part=${`band ${e}`} d=${t} fill=${`url(#${o}${e})`}/>`, m = (e, t) => H`<linearGradient id=${o + e} x1="0" y1="0" x2="0" y2="1"><stop class=${t}/><stop class=${`${t} stop-fade`} offset="1"/></linearGradient>`, h = (e, t, n, r = "", i = "middle") => H`<text class=${`axis-label ${r}`} x=${e.toFixed(1)} y=${t.toFixed(1)} text-anchor=${i}>${n}</text>`, g = i.X(s.stop), _ = i.Y(s.weight), v = e("graph.pill", ...c);
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
            ${h(i.R - 2, i.target + (i.targetAbove ? -4 : 13), e("graph.target", Z(t.goal)), "halo strong", "end")}
            ${i.holds.up ? h(i.holds.up.x, i.holds.up.y, e("graph.up_to", Z(t.ceil)), "halo hold", "start") : W}
            ${i.holds.down ? h(i.holds.down.x, i.holds.down.y, e("graph.down_to", Z(t.floor)), "halo hold", "end") : W}
            ${h(i.maxX, i.T - 4, e("graph.max", Z(t.wall)), "", "end")}
          </g>
          ${r.show_example ? H`<g class="scrub" part="scrub" role="slider" tabindex="0" aria-label=${e("graph.scrub")}
                aria-valuemin=${t.scrubMin} aria-valuemax=${t.wall} aria-valuenow=${s.stop.toFixed(1)}
                aria-valuetext=${l} @keydown=${this._key}>
                <path class="scrub-guide" d=${`M${g.toFixed(1)} ${i.T}V${i.B}`}/>
                <path class="example-shot" part="example-shot" d=${i.pace(s.arrival, s.stop)}/>
                <circle class="scrub-handle" part="scrub-handle" cx=${g.toFixed(2)} cy=${_.toFixed(2)} r="5"/>
                ${this._held ? this._pillAt(v, g, _, i.width, i.height) : W}
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
		this.styles = [Ke, qe];
	}
}, Ze;
function Qe() {
	return customElements.get("ha-form") ? Promise.resolve() : (Ze ??= (async () => {
		await (await (await window.loadCardHelpers?.())?.createCardElement({
			type: "entities",
			entities: []
		}))?.constructor.getConfigElement?.();
	})().catch(() => {
		Ze = void 0;
	}), Ze);
}
// src/preset-card-editor.ts
var $e = [
	"show_header",
	"show_selector",
	"show_example",
	"show_readout",
	"show_arrivals",
	"show_legend",
	"show_note"
], et = class extends q {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 },
			_state: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), Qe().then(() => this.requestUpdate());
	}
	setConfig(e) {
		this._config = e;
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._stop?.(), this._following = void 0;
	}
	updated(e) {
		let t = this._config?.device_id;
		this.hass && t !== this._following && (this._stop?.(), this._following = t, this._state = void 0, t && (this._stop = Ae(this.hass, t, (e) => this._state = e)));
	}
	render() {
		if (!this.hass || !this._config) return W;
		let e = n(this.hass.locale?.language ?? this.hass.language), t = this._state?.status === "ready" ? this._state.data.presets : [], r = [
			{
				name: "device_id",
				selector: { device: { integration: J } }
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
				schema: $e.map((e) => ({
					name: e,
					selector: { boolean: {} }
				}))
			}
		], i = {
			preset: "active",
			...Object.fromEntries($e.map((e) => [e, !0])),
			...this._config,
			...typeof this._config.preset == "number" ? { preset: String(this._config.preset) } : {}
		};
		return V`<ha-form
      .hass=${this.hass}
      .data=${i}
      .schema=${r}
      .computeLabel=${(t) => t.name ? e(`editor.${t.name === "device_id" ? "device" : t.name}`) : ""}
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
}, tt = [
	"duration",
	"yield",
	"goal",
	"error",
	"drip",
	"avg_flow",
	"max_flow",
	"first_drop",
	"dose",
	"ratio",
	"target_temp",
	"cut_at",
	"drip_delay",
	"late_cup",
	"ended",
	"shot_type",
	"preset",
	"scale",
	"rating"
], Q = (e) => typeof e == "number" && Number.isFinite(e) ? e : null;
function nt(e, t) {
	if (typeof e == "number" && e !== 0) return e;
	if (Array.isArray(t)) {
		for (let e = t.length - 1; e >= 0; e--) if (typeof t[e] == "number" && t[e] !== 0) return t[e] / 100;
	}
	return typeof e == "number" ? e : null;
}
function rt(e) {
	let t = Q(e.avgFlowGS);
	if (t !== null) return t;
	let n = nt(e.actualG, e.wCg), r = Q(e.durationS), i = Q(e.firstDropS) ?? Q(e.dropS);
	return n == null || r == null || i == null || !(r - i > .5) || !(n > 0) ? null : n / (r - i);
}
function it(e, t, n) {
	let r = t?.pts.reduce((e, t) => t.t > e.t ? t : e), i = t && e.endS != null && (t.dripSegs[0]?.pts[0] ?? r), a = i ? i.cg / 100 : null;
	return i ? {
		s: Number(e.endS),
		g: a,
		drip: n !== null && e.actualWeightSource === "post_drip" ? n - a : null
	} : {
		s: null,
		g: null,
		drip: null
	};
}
function at(e, t, n) {
	let r = String(t || "").toLowerCase().replace(/_(failure|timeout)$/, ""), i = (t) => e(t === "fast" ? "verdict.fast" : t === "slow" ? "verdict.slow" : "verdict.on_recipe");
	return /^(ext|fast_|slow_)/.test(r) ? i(r[0] === "s" ? "slow" : "fast") : {
		paddle: () => e("shot.manual"),
		activator: () => e("shot.manual"),
		physical_override: () => e("shot.manual"),
		normal_target: () => i(n),
		scale_threshold: () => i(n),
		auto_to_manual: () => e("ended.scale_loss"),
		cup_removed: () => e("ended.cup"),
		web_stop: () => e("ended.web"),
		web_heartbeat: () => e("ended.heartbeat"),
		hard_limit: () => e("ended.hard_limit"),
		global_limit: () => e("ended.hard_limit"),
		wall_limit: () => e("verdict.max_time"),
		configured_wall_limit: () => e("verdict.max_time"),
		relay_safety: () => e("ended.relay"),
		weight_anomaly: () => e("ended.anomaly"),
		touch_weight_fallback: () => e("ended.touch")
	}[r]?.() ?? "—";
}
function ot(e, t, n) {
	let r = t.actualG == null && t.estimatedG != null, i = r ? null : nt(t.actualG, t.wCg), a = Q(t.goalG), o = Q(t.cutLineG) > 0 ? Q(t.cutLineG) : a, s = i === null || !o ? null : (i - o) / o * 100, c = rt(t), l = it(t, n, i), u = Q(t.targetTempDeciC) > 0 ? Q(t.targetTempDeciC) / 10 : null, d = (e, t, n) => e === null ? "—" : e.toFixed(t) + n, f = String(t.shotType ?? ""), p = Math.max(0, Math.min(5, Q(t.rating) ?? 0)), m = {
		duration: { value: d(Q(t.durationS), 1, " s") },
		yield: { value: r ? e("field.yield_estimated", Math.round(Number(t.estimatedG))) : d(i, 1, " g") },
		goal: { value: d(a, 1, " g") },
		error: {
			value: s === null ? "—" : s.toFixed(1) + "%",
			tone: s > 0 ? "high" : s < 0 ? "low" : void 0
		},
		drip: { value: l.drip === null ? "—" : (l.drip < 0 ? "" : "+") + l.drip.toFixed(1) + " g" },
		avg_flow: { value: d(c, 2, " g/s") },
		max_flow: { value: n?.maxFlow == null ? "—" : n.maxFlow.toFixed(2) + " g/s" + (t.wTruncated ? e("field.recorded") : "") },
		first_drop: { value: d(Q(t.firstDropS), 1, " s") },
		dose: { value: Q(t.doseG) > 0 ? Number(t.doseG).toFixed(1) + " g" : "—" },
		ratio: { value: Q(t.ratio) > 0 ? "1:" + Number(t.ratio).toFixed(1) : "—" },
		cut_at: { value: l.g == null ? "—" : l.g.toFixed(1) + " g · " + l.s.toFixed(1) + " s" },
		drip_delay: { value: d(Q(t.dripDelayS), 1, " s") },
		late_cup: { value: Q(t.tareS) == null ? e("field.none") : Number(t.tareS).toFixed(1) + " s" },
		ended: { value: at(e, t.stopDetail, t.verdict) },
		shot_type: { value: e(f === "manual" ? "shot.manual" : f === "timer_only" ? "shot.timer_only" : "shot.auto") },
		preset: { value: String(t.presetName || "—") },
		scale: { value: String(t.scaleName || e("field.none")) },
		rating: {
			value: p ? `${p}/5` : e("field.unrated"),
			stars: p
		}
	};
	return u !== null && (m.target_temp = { value: u.toFixed(1) + " °C" }), m;
}
// src/shot-header.ts
function st(e, t, n, r) {
	let i = String(t?.shotType ?? ""), a = ["fast", "slow"].includes(String(t?.verdict)) ? String(t.verdict) : "on_recipe", o = t ? i === "manual" ? {
		cls: "manual",
		text: e("shot.manual")
	} : i === "timer_only" ? {
		cls: "manual",
		text: e("shot.timer_only")
	} : {
		cls: a,
		text: e(`verdict.${a}`)
	} : null, s = [t && t.hasWallTime && typeof t.endedAtUnixSec == "number" ? new Intl.DateTimeFormat(r, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(/* @__PURE__ */ new Date(t.endedAtUnixSec * 1e3)) : null, t?.presetName].filter(Boolean).join(" · ");
	return V`<div class="header" part="header">
    <div class="titles">
      <div class="title" part="title">${n || e("shot.title")}</div>
      ${s ? V`<div class="subtitle" part="subtitle">${s}</div>` : W}
    </div>
    ${o ? V`<span class="chip ${o.cls}" part="chip">${o.text}</span>` : W}
  </div>`;
}
// src/shot-model.ts
function ct(e, t) {
	let n;
	try {
		n = atob(String(e));
	} catch {
		return null;
	}
	let r = [], i = [], a = (e) => e + 2 > n.length ? NaN : n.charCodeAt(e) | n.charCodeAt(e + 1) << 8, [o, s] = t || [0, 0];
	for (let e = 0, t; e < n.length;) {
		if (t = n.charCodeAt(e++), o = t === 255 ? a((e += 2) - 2) : o + t, t = n.charCodeAt(e++), s = t === 128 ? a((e += 2) - 2) << 16 >> 16 : s + (t << 24 >> 24), !(o >= 0) || e > n.length || Number.isNaN(t)) return null;
		r.push(o), i.push(s);
	}
	return typeof e == "string" ? {
		wAtMs: r,
		wCg: i
	} : null;
}
function lt(e) {
	let { wD: t, wRef: n, ...r } = e.curve ?? {}, i = ct(t, n);
	return i ? {
		...e,
		...r,
		...i
	} : null;
}
function ut(e) {
	if (!e) return null;
	let t = Array.isArray(e.wCg) ? e.wCg : [], n = e.wAtMs, r = e.wBreakBefore ?? [], i = e.wHeld ?? [], a = (e) => !Array.isArray(e) || e.some((n, r) => !Number.isInteger(n) || n < 0 || n >= t.length || r && n <= e[r - 1]);
	if (!Array.isArray(n) || n.length !== t.length || t.length > 1201 || a(r) || a(i) || n.some((e, t) => !Number.isInteger(e) || e < 0 || e > 6e4 || t && e < n[t - 1])) return null;
	let o = new Set(r), s = new Set(i), c = (e) => e == null || !Number.isFinite(+e) ? null : +e, l = c(e.endS), u = c(e.durationS), d = c(e.dropS) ?? c(e.firstDropS), f = c(e.tareS), p = c(e.extendedS), m = c(e.atmS), h = c(e.atmClearedS), g = Math.round((l ?? u ?? Infinity) * 1e3), _ = e.extractionExtended ? "fast" : e.slowExtractionExtended ? "slow" : {
		fast: "fast",
		slow: "slow"
	}[e.verdict] || "bbw", v = (e) => m != null && e >= m && (h == null || e < h) ? "atm" : p != null && e >= p ? _ : "bbw", y = [
		p,
		m,
		h
	].filter((e) => e != null).sort((e, t) => e - t), b = [], x = [], S = [], C = [], w = [], T = Array(t.length).fill(null), E = [], D = [], O = [], k = null, A = 0, j = 0, M = null, N = (e, t, n) => {
		let r = (t) => {
			let r = v(t.t), i = e.at(-1);
			!i || !n || i.kind !== r ? e.push({
				kind: r,
				pts: [t]
			}) : i.pts.push(t), n = t;
		};
		if (n) for (let i of y) {
			let a = n;
			if (i > a.t && i <= t.t && v(i) !== v(a.t)) {
				let o = {
					t: i,
					cg: a.cg + (t.cg - a.cg) * (i - a.t) / (t.t - a.t)
				};
				e.at(-1).pts.push(o), n = o, r(o);
			}
		}
		r(t);
	};
	for (let e = 0; e < t.length; e++) {
		o.has(e) && j++;
		let r = n[e] > g;
		if (r && l == null) continue;
		if (!Number.isFinite(t[e])) {
			j++, M = null;
			continue;
		}
		let i = {
			t: n[e] / 1e3,
			cg: t[e]
		};
		if (s.has(e)) {
			o.has(e) && (M = null), O.at(-1)?.[1] >= n[e] - 500 ? O.at(-1)[1] = n[e] : O.push([n[e] - 500, n[e]]), D.push(i);
			continue;
		}
		o.has(e) && (M = null), r && !x.length && M && N(x, M, null), N(r ? x : b, i, M), M = i, S.push(i);
		let a = E.at(-1);
		if (m != null && i.t >= m && (h == null || i.t < h)) {
			j++;
			continue;
		}
		a && m != null && a.t < Math.round(m * 1e3) && n[e] >= Math.round(m * 1e3) && j++, a && h != null && a.t < Math.round(h * 1e3) && n[e] >= Math.round(h * 1e3) && j++;
		let c = {
			t: n[e],
			cg: t[e],
			index: e,
			segment: j
		};
		a && a.segment === j && a.t === n[e] ? E[E.length - 1] = c : E.push(c);
	}
	let P = 0, F = null, I = null, ee = E.findLast((e) => e.t <= Math.round(d * 1e3))?.segment;
	for (let e = 0; e < E.length; e++) {
		let t = E[e], n = E[e - 1];
		if (!n || t.segment !== n.segment) {
			P = e, F = null;
			continue;
		}
		let r = Math.max(1e3, t.t - n.t), i = t.t - r;
		for (; P + 1 < e && E[P + 1].t <= i;) P++;
		let a = E[P], o = E[P + 1];
		if (a.segment !== t.segment || a.t > i || d != null && a.t < Math.round(d * 1e3) || O.some(([e, n]) => i <= n && t.t >= e)) {
			F = null;
			continue;
		}
		let s = a.t === i ? a.cg : a.cg + (o.cg - a.cg) * (i - a.t) / (o.t - a.t), c = Math.max(0, (t.cg - s) * 10 / r), l = {
			t: (t.t - r / 2) / 1e3,
			cg: c * 100
		}, u = t.t > g, f = g / 1e3;
		if (T[t.index] = c, A = Math.max(A, c), u || (k = Math.max(k ?? 0, c)), !u && !C.length && d > 0 && t.segment === ee && (I = l), u && l.t < f) F = l;
		else {
			if (u && !w.length && F) {
				let e = {
					t: f,
					cg: F.cg + (l.cg - F.cg) * (f - F.t) / (l.t - F.t)
				};
				C.length && N(C, e, F), N(w, e, null), F = e;
			}
			N(u ? w : C, l, F), F = l;
		}
	}
	for (let [t, n] of [
		[d, c(e.dropCg)],
		[p, c(e.extCg)],
		[m, c(e.atmCg)]
	]) {
		if (t == null || t < 0 || Math.round(t * 1e3) > g || n == null) continue;
		let e = {
			t,
			cg: n
		};
		S.push(e), b.push({
			kind: v(t),
			pts: [e]
		});
	}
	let te = Math.max(u || 0, l || 0, ...S.map((e) => e.t), 0);
	if (!S.length || te <= 0) return null;
	let L = Math.max(e.goalG || 0, ...S.map((e) => e.cg / 100), 0), R = x.at(-1)?.pts.at(-1), z = !e.wTruncated && R?.cg === c(e.endCg) ? R : null;
	return {
		truncated: !!e.wTruncated,
		dur: te,
		timeMax: Math.max(10, Math.ceil(te / 10) * 10),
		firstDropS: d > 0 ? d : null,
		tareS: f > 0 ? f : null,
		segs: b,
		dripSegs: x,
		finalPoint: z,
		pts: S,
		held: D,
		rawMaxW: L,
		maxW: Math.max(10, Math.ceil(L / 10) * 10),
		flowSegs: C,
		dripFlowSegs: w,
		flowStart: I,
		flowCurve: T,
		maxFlow: k,
		flowMax: Math.max(.5, Math.ceil(A / .5) * .5)
	};
}
function dt(e) {
	let t = String(e.shotType || "").toLowerCase() === "timer_only";
	return Ie({
		id: 0,
		name: "",
		goalWeightG: e.goalG,
		fastBeforeS: e.fastBeforeS,
		slowAfterS: e.slowAfterS,
		bbwProtectionMs: e.delayS * 1e3,
		operationalWallMs: e.wallS * 1e3,
		fastExtractionGuardEnabled: !t && e.extractionGuardEnabled,
		slowExtractionGuardEnabled: !t && e.slowExtractionGuardEnabled,
		fastMarginG: e.fastMarginG,
		slowMarginG: e.slowMarginG,
		firstDropS: e.firstDropS,
		brewByWeight: !t,
		fastRampS: e.fastRampS,
		slowRampS: e.slowRampS,
		fastCurve: e.fastCurve,
		slowCurve: e.slowCurve,
		fastCurveHardness: e.fastCurveHardness,
		slowCurveHardness: e.slowCurveHardness
	});
}
function ft(e, t) {
	let n = 0;
	for (; n < e.length - 2 && e[n + 1].t < t;) n++;
	let r = e[n], i = e[n + 1] ?? r, a = i.t > r.t ? Math.min(1, Math.max(0, (t - r.t) / (i.t - r.t))) : 0;
	return (r.cg + (i.cg - r.cg) * a) / 100;
}
// src/shot-card.ts
var pt = ["duration", "yield"], mt = tt.filter((e) => !pt.includes(e)), ht = {
	show_header: !0,
	hero: pt,
	fields: mt,
	show_empty: !0
}, gt = class extends X {
	constructor(...e) {
		super(...e), this.defaults = ht;
	}
	static getConfigElement() {
		return document.createElement("open-brew-by-weight-shot-card-editor");
	}
	static getStubConfig(e) {
		return { device_id: Oe(e) };
	}
	setConfig(e) {
		for (let t of ["hero", "fields"]) {
			let n = e?.[t];
			if (n !== void 0 && (!Array.isArray(n) || n.some((e) => !tt.includes(e)))) throw Error(`${t} must list fields from: ${tt.join(", ")}`);
		}
		super.setConfig(e);
	}
	getCardSize() {
		return 4;
	}
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6
		};
	}
	render() {
		return this._config ? V`<ha-card><div class="body" part="body">${this._content(this.t)}</div></ha-card>` : W;
	}
	_content(e) {
		let t = this._state;
		if (t.status === "loading") return V`<p class="message">${e("state.loading")}</p>`;
		if (t.status === "not_found") return V`<p class="message">${e("state.not_found")}</p>`;
		let n = this._config, r = t.data.lastShot, i = (t) => n.show_header ? st(e, t, n.title, this.hass?.locale?.language ?? this.hass?.language) : W;
		if (!r) return V`${i(null)}<p class="message">${e("shot.none")}</p>`;
		if (r !== this._shotKey) {
			this._shotKey = r;
			let e = lt(r);
			this._shot = {
				row: e ?? r,
				model: e && ut(e)
			};
		}
		let { row: a, model: o } = this._shot, s = ot(e, a, o), c = (e = []) => e.filter((e) => s[e] && (n.show_empty || s[e].value !== "—"));
		return V`
      ${i(a)}
      ${t.data.available ? W : V`<p class="message" part="status">${e("state.unavailable")}</p>`}
      ${c(n.hero).length ? V`<div class="hero" part="hero">
            ${c(n.hero).map((t) => this._field(e, t, s[t], "hero-field"))}
          </div>` : W}
      <div
        class="fields"
        part="fields"
        style=${n.columns ? `--_columns: repeat(${n.columns}, minmax(0, 1fr))` : ""}
      >
        ${c(n.fields).map((t) => this._field(e, t, s[t], "field"))}
      </div>
    `;
	}
	_field(e, t, n, r) {
		return V`<div class=${r} part=${r} data-field=${t}>
      <div class="label" part="label">${e(`field.${t}`)}</div>
      ${n.stars === void 0 ? V`<div class=${`value ${n.tone ?? ""}`} part="value">${n.value}</div>` : V`<div class="value stars" part="value" role="img" aria-label=${n.value}>
            ${Array.from({ length: 5 }, (e, t) => V`<span class=${t < n.stars ? "on" : "off"}>★</span>`)}
          </div>`}
    </div>`;
	}
	static {
		this.styles = [
			Ke,
			qe,
			p`
      :where(.hero) {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
        gap: var(--obbw-field-gap, 10px);
        margin: 4px 0 14px;
      }
      :where(.hero-field) {
        padding: 10px 12px;
        border-radius: var(--obbw-tile-radius, 10px);
        background: var(--obbw-tile-background, color-mix(in srgb, var(--_fg) 5%, var(--_surface)));
      }
      :where(.hero-field .value) {
        font-size: var(--obbw-hero-font-size, 28px);
        font-weight: 500;
        line-height: 1.2;
      }
      :where(.fields) {
        display: grid;
        /* The columns option sets --_columns; a style rule still wins over it. */
        grid-template-columns: var(--_columns, repeat(auto-fill, minmax(var(--obbw-field-min-width, 104px), 1fr)));
        gap: var(--obbw-field-gap, 10px) 12px;
      }
      :where(.label) {
        font-size: var(--obbw-label-font-size, 11px);
        color: var(--obbw-label-color, var(--_muted));
      }
      :where(.value) {
        font-size: var(--obbw-value-font-size, 14px);
        color: var(--obbw-value-color, var(--_fg));
        font-variant-numeric: tabular-nums;
        overflow-wrap: anywhere;
      }
      :where(.value.high) {
        color: var(--obbw-error-high-color, var(--primary-color, #a83b21));
      }
      :where(.value.low) {
        color: var(--obbw-error-low-color, var(--_ok));
      }
      :where(.stars) {
        white-space: nowrap;
      }
      :where(.stars .on) {
        color: var(--obbw-star-color, #e8a317);
      }
      :where(.stars .off) {
        color: var(--obbw-star-off-color, color-mix(in srgb, var(--_fg) 25%, var(--_surface)));
      }
    `
		];
	}
}, _t = class extends q {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), Qe().then(() => this.requestUpdate());
	}
	setConfig(e) {
		this._config = e;
	}
	render() {
		if (!this.hass || !this._config) return W;
		let e = n(this.hass.locale?.language ?? this.hass.language), t = { select: {
			multiple: !0,
			reorder: !0,
			mode: "list",
			options: tt.map((t) => ({
				value: t,
				label: e(`field.${t}`)
			}))
		} }, r = [
			{
				name: "device_id",
				selector: { device: { integration: J } }
			},
			{
				name: "title",
				selector: { text: {} }
			},
			{
				name: "hero",
				selector: t
			},
			{
				name: "fields",
				selector: t
			},
			{
				name: "",
				type: "grid",
				schema: [
					{
						name: "columns",
						selector: { number: {
							min: 1,
							max: 6,
							mode: "box"
						} }
					},
					{
						name: "show_header",
						selector: { boolean: {} }
					},
					{
						name: "show_empty",
						selector: { boolean: {} }
					}
				]
			}
		], i = {
			show_header: !0,
			show_empty: !0,
			hero: pt,
			fields: mt,
			...this._config
		}, a = (t) => t ? e(t === "device_id" ? "editor.device" : t === "show_empty" ? "editor.show_empty" : `editor.${t}`) : "";
		return V`<ha-form
      .hass=${this.hass}
      .data=${i}
      .schema=${r}
      .computeLabel=${(e) => a(e.name)}
      @value-changed=${(e) => {
			let t = { ...e.detail.value };
			t.title || delete t.title, t.columns || delete t.columns, this.dispatchEvent(new CustomEvent("config-changed", {
				detail: { config: t },
				bubbles: !0,
				composed: !0
			}));
		}}
    ></ha-form>`;
	}
};
// src/shot-chart.ts
function vt(e, t, n, r) {
	return e.filter((e) => e.t <= r).map((e, r) => (r ? "L" : "M") + t(e.t).toFixed(2) + " " + n(e.cg / 100).toFixed(2)).join("");
}
function yt(e, t, n, r = e.timeMax) {
	let i = n !== "flow", a = n !== "weight", o = e.maxW / 10, s = [
		.25,
		.5,
		1,
		2,
		5
	].find((t) => t * o >= e.flowMax) ?? Math.ceil(e.flowMax / o), c = t, l = Math.round(Math.min(220, Math.max(160, c * .42))), u = a && !i ? 48 : 38, d = c - (i && a ? 52 : 10), f = l - 18, p = (e) => u + (d - u) * Math.min(1, e / r), m = (e) => Math.max(0, Math.min(1, e)), h = (t) => f - (f - 14) * m(t / e.maxW), g = (e) => f - (f - 14) * m(e / (s * o)), _ = (e) => e.toFixed(2), v = (e, t) => e.map((e, n) => (n ? "L" : "M") + _(p(e.t)) + " " + _(t(e.cg / 100))).join("") + (e.length === 1 ? "h0" : ""), y = (t, n, r, i) => {
		let a = [], o = (e, t, n) => {
			let i = v(e, r);
			a.push({
				kind: t,
				d: i,
				drip: n,
				area: !n && e.length > 1 && e.some((e) => e.cg > 0) ? `${i}V${f}H${_(p(e[0].t))}Z` : null
			});
		};
		e.firstDropS && o([
			{
				t: 0,
				cg: 0
			},
			{
				t: e.firstDropS,
				cg: 0
			},
			...i
		], "bbw", !1);
		for (let e of t) o(e.pts, e.kind, !1);
		for (let e of n) o(e.pts, e.kind, !0);
		return a;
	}, b = [], x = [], S = [], C = [];
	for (let e = 0; e <= o; e++) {
		let t = f - (f - 14) * e / o;
		b.push(`M${u} ${t.toFixed(1)}H${d}`), i && S.push({
			x: u - 4,
			y: t + 3,
			text: `${e * 10} g`,
			anchor: "end"
		}), a && C.push({
			x: i ? d + 4 : u - 4,
			y: t + 3,
			text: `${+(e * s).toFixed(2)} g/s`,
			anchor: i ? "start" : "end"
		});
	}
	for (let e = 0; e <= r; e += 10) b.push(`M${p(e).toFixed(1)} 14V${f}`), x.push({
		x: p(e),
		y: f + 13,
		text: `${e} s`,
		anchor: e === 0 ? "start" : e + 10 > r ? "end" : "middle"
	});
	return {
		width: c,
		height: l,
		L: u,
		R: d,
		T: 14,
		B: f,
		timeMax: r,
		X: p,
		Yw: h,
		Yf: g,
		grid: b,
		xLabels: x,
		weightLabels: S,
		flowLabels: C,
		weight: i ? y(e.segs, e.dripSegs, h, []) : [],
		flow: a ? y(e.flowSegs, e.dripFlowSegs, g, e.flowStart ? [e.flowStart] : []) : [],
		held: i ? e.held.map((e) => ({
			x: p(e.t),
			y: h(e.cg / 100)
		})) : [],
		finalPoint: i && e.finalPoint ? {
			x: p(e.finalPoint.t),
			y: h(e.finalPoint.cg / 100)
		} : null,
		tAt: (e) => (e - u) * r / (d - u)
	};
}
// src/shot-chart-card.ts
var bt = [
	"preset_weight",
	"weight_flow",
	"weight",
	"flow"
], xt = {
	chart: "preset_weight",
	mode_switch: !0,
	show_header: !0,
	show_readout: !0,
	show_legend: !0
}, St = (e) => `obbw-shot-view:${e.device_id}:${e.chart}`, Ct = 0, wt = class extends X {
	constructor(...e) {
		super(...e), this.defaults = xt, this._id = `obbws${++Ct}`;
	}
	static {
		this.properties = {
			...X.properties,
			_view: { state: !0 },
			_cursor: { state: !0 }
		};
	}
	static getConfigElement() {
		return document.createElement("open-brew-by-weight-shot-chart-card-editor");
	}
	static getStubConfig(e) {
		return {
			device_id: Oe(e),
			chart: "preset_weight"
		};
	}
	setConfig(e) {
		if (e?.chart && !bt.includes(e.chart)) throw Error(`Unknown chart: ${e.chart}`);
		super.setConfig(e);
		let t = null;
		try {
			t = this._config.mode_switch ? localStorage.getItem(St(this._config)) : null;
		} catch {}
		this._view = bt.includes(t) ? t : this._config.chart;
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
	render() {
		return this._config ? V`<ha-card><div class="body" part="body">${this._content(this.t)}</div></ha-card>` : W;
	}
	_prepare(e) {
		if (e === this._shotKey) return this._prepared;
		this._shotKey = e, this._cursor = void 0;
		let t = lt(e), n = t && ut(t);
		return this._prepared = n ? {
			row: t,
			model: n,
			rule: dt(t),
			weight: n.pts.slice().sort((e, t) => e.t - t.t),
			flow: n.flowSegs.concat(n.dripFlowSegs).flatMap((e) => e.pts).sort((e, t) => e.t - t.t)
		} : null, this._prepared;
	}
	_content(e) {
		let t = this._state;
		if (t.status === "loading") return V`<p class="message">${e("state.loading")}</p>`;
		if (t.status === "not_found") return V`<p class="message">${e("state.not_found")}</p>`;
		let n = this._config, r = t.data.lastShot;
		if (!r) return V`${n.show_header ? this._header(e, null) : W}<p class="message">${e("shot.none")}</p>`;
		let i = this._prepare(r);
		if (!i) return V`${n.show_header ? this._header(e, r) : W}<p class="message">${e("shot.no_curve")}</p>`;
		let a = this._view === "preset_weight" && !i.rule ? "weight_flow" : this._view;
		return this._cursor ??= Number.isFinite(Number(i.row.endS)) ? Math.min(Number(i.row.endS), i.weight.at(-1).t) : i.weight.at(-1).t, V`
      ${n.show_header ? this._header(e, i.row) : W}
      ${t.data.available ? W : V`<p class="message" part="status">${e("state.unavailable")}</p>`}
      ${n.mode_switch ? this._switch(e, a, !!i.rule) : W}
      ${a === "preset_weight" ? this._presetView(e, i) : this._sparkView(e, i, a)}
    `;
	}
	_header(e, t) {
		return st(e, t, this._config.title, this.hass?.locale?.language ?? this.hass?.language);
	}
	_switch(e, t, n) {
		return V`<div class="views" part="views" role="group" aria-label=${e("view.label")}>
      ${bt.filter((e) => n || e !== "preset_weight").map((n) => V`<button
          type="button"
          class="view"
          part="view"
          aria-pressed=${String(n === t)}
          @click=${() => this._pick(n)}
        >
          ${e(`view.${n}`)}
        </button>`)}
    </div>`;
	}
	_pick(e) {
		this._view = e;
		try {
			localStorage.setItem(St(this._config), e);
		} catch {}
	}
	_label(e, t = "") {
		return H`<text class=${`axis-label ${t}`} x=${e.x.toFixed(1)} y=${e.y.toFixed(1)} text-anchor=${e.anchor}>${e.text}</text>`;
	}
	_presetView(e, t) {
		if (!this._width) return V`<div class="chart"></div>`;
		let { model: n, rule: r, row: i } = t, a = r, o = Math.max(a.wall, n.dur), s = Ge(a, this._width, {
			compact: !0,
			tens: !0,
			maxG: n.rawMaxW,
			maxT: o
		}), c = this._id, l = String(i.shotType).toLowerCase() === "timer_only" ? "none" : ["fast", "slow"].includes(String(i.verdict)) ? String(i.verdict) : "on_recipe", u = (e, t, n, r) => n ? r ? H`<path class=${`band ${e}`} part=${`band ${e}`} d=${t} fill=${`url(#${c}${e})`}/>` : W : H`<path class="band-off" d=${t}/>`, d = (e, t) => H`<linearGradient id=${c + e} x1="0" y1="0" x2="0" y2="1"><stop class=${t}/><stop class=${`${t} stop-fade`} offset="1"/></linearGradient>`, f = n.dripSegs.length && Number.isFinite(Number(i.endS)) ? Number(i.endS) : null, p = this._cursor, m = ft(t.weight, p), h = a.mode === "active" ? `${Ve(p, a).toFixed(1)} g` : "—", g = e("shot.cursor", p.toFixed(1), m.toFixed(1), h);
		return this._tAt = s.tAt, V`
      ${this._chart(s.width, s.height, H`
          <defs>
            ${d("fast-full", "stop-fast-full")} ${d("fast-partial", "stop-fast-part")}
            ${d("on-recipe", "stop-window")} ${d("slow-partial", "stop-slow-part")}
            ${d("slow-full", "stop-slow-full")}
            <clipPath id=${`${c}under`}><path d=${s.clip}/></clipPath>
          </defs>
          ${s.grid.map((e) => H`<path class="grid-line" part="grid-line" d=${e}/>`)}
          <g clip-path=${`url(#${c}under)`}>
            ${u("fast-full", s.bands.fastFull, a.fast, l === "fast")}
            ${u("fast-partial", s.bands.fastPart, a.fast, l === "fast")}
            ${u("on-recipe", s.bands.window, !0, l === "on_recipe")}
            ${u("slow-partial", s.bands.slowPart, a.slow, l === "slow")}
            ${u("slow-full", s.bands.slowFull, a.slow, l === "slow")}
            <path class="pace-line" part="pace-line" d=${s.paces}/>
          </g>
          ${[...s.yLabels, ...s.xLabels].map((e) => this._label(e))}
          <path class="target-line" part="target-line" d=${`M${s.L} ${s.target.toFixed(1)}H${s.R}`}/>
          <path class="max-line" part="max-line" d=${`M${s.maxX.toFixed(1)} ${s.T}V${s.B}`}/>
          <path class="window-edge" part="window-edge" d=${s.windowEdges}/>
          <path class=${`cut-line ${a.mode === "timerOnly" ? "off" : ""}`} part="cut-line" d=${s.cut}/>
          ${n.segs.map((e) => H`<path class="shot-line" part="shot-line" d=${vt(e.pts, s.X, s.Y, o)}/>`)}
          ${n.dripSegs.map((e) => H`<path class="shot-line drip" part="shot-line drip" d=${vt(e.pts, s.X, s.Y, o)}/>`)}
          ${n.held.map((e) => H`<circle class="held" part="held" cx=${s.X(e.t).toFixed(1)} cy=${s.Y(e.cg / 100).toFixed(1)} r="2"/>`)}
          ${this._label({
			x: s.R - 2,
			y: s.target + (s.targetAbove ? -4 : 13),
			text: e("graph.target", +a.goal.toFixed(1)),
			anchor: "end"
		}, "halo strong")}
          ${s.holds.up ? this._label({
			...s.holds.up,
			text: e("graph.up_to", +a.ceil.toFixed(1))
		}, "halo hold") : W}
          ${s.holds.down ? this._label({
			...s.holds.down,
			text: e("graph.down_to", +a.floor.toFixed(1))
		}, "halo hold") : W}
          ${f == null ? W : H`<circle class="stop-point" part="stop-point" r="3" cx=${s.X(f).toFixed(2)} cy=${s.Y(ft(t.weight, f)).toFixed(2)}/>`}
          ${n.finalPoint ? H`<circle class="final-point shot" part="final-point" r="3" cx=${s.X(n.finalPoint.t).toFixed(1)} cy=${s.Y(n.finalPoint.cg / 100).toFixed(1)}/>` : W}
          <g class="cursor" part="cursor">
            <path class="cursor-guide" d=${`M${s.X(p).toFixed(1)} ${s.T}V${s.B}`}/>
            <circle class="cursor-dot" r="5" cx=${s.X(p).toFixed(2)} cy=${s.Y(m).toFixed(2)}/>
          </g>
        `, g, t)}
      ${this._config.show_readout ? V`<p class="readout" part="readout">${g}</p>` : W}
      ${this._config.show_legend ? V`<div class="legend" part="legend">
            ${this._key("cut", e("legend.cut"))}
            ${l === "fast" ? this._key("fast", e("legend.fast"), 2) : l === "slow" ? this._key("slow", e("legend.slow"), 2) : l === "on_recipe" ? this._key("window", e("legend.window")) : W}
            ${this._key("last", e("legend.last"))}
            ${n.dripSegs.length ? this._key("last-drip", e("legend.drip")) : W}
            ${f == null ? W : this._key("stopped", e("legend.stopped"))}
            ${n.finalPoint ? this._key("final", e("legend.final")) : W}
            ${n.held.length ? this._key("held", e("legend.held")) : W}
          </div>` : W}
    `;
	}
	_sparkView(e, t, n) {
		if (!this._width) return V`<div class="chart"></div>`;
		let { model: r, rule: i } = t, a = yt(r, this._width, n, i ? Math.max(i.wall, r.dur) : r.timeMax), o = this._id, s = this._cursor, c = ft(t.weight, s), l = t.flow.length && s >= t.flow[0].t && s <= t.flow.at(-1).t ? ft(t.flow, s) : null, u = n === "weight" ? `${s.toFixed(1)} s · ${c.toFixed(1)} g` : n === "flow" ? `${s.toFixed(1)} s · ${l?.toFixed(1) ?? "—"} g/s` : e("shot.flow_cursor", s.toFixed(1), c.toFixed(1), l?.toFixed(1) ?? "—"), d = [...new Set(r.segs.map((e) => e.kind))], f = (e, t) => {
			let n = (e) => t ? "flow" : `weight ${e.kind}`;
			return H`${e.map((e, r) => e.area ? H`<linearGradient id=${`${o}${t ? "f" : "w"}${r}`} x1="0" y1="0" x2="0" y2="1">
                <stop class=${`fill-top ${n(e)}`}/><stop class=${`fill-base ${n(e)}`} offset="1"/></linearGradient>
                <path class="series-fill" d=${e.area} fill=${`url(#${o}${t ? "f" : "w"}${r})`}/>` : W)}${e.map((e) => H`<path class=${`series ${n(e)} ${e.drip ? "drip" : ""}`} part=${t ? "flow-line" : "weight-line"} d=${e.d}/>`)}`;
		}, p = r.dripSegs.length || r.dripFlowSegs.length;
		return this._tAt = a.tAt, V`
      ${this._chart(a.width, a.height, H`
          ${a.grid.map((e) => H`<path class="grid-line" part="grid-line" d=${e}/>`)}
          ${[
			...a.weightLabels,
			...a.flowLabels,
			...a.xLabels
		].map((e) => this._label(e, a.flowLabels.includes(e) && n === "weight_flow" ? "flow-label" : ""))}
          ${f(a.flow, !0)} ${f(a.weight, !1)}
          ${a.held.map((e) => H`<circle class="held" part="held" cx=${e.x.toFixed(1)} cy=${e.y.toFixed(1)} r="2"/>`)}
          ${a.finalPoint ? H`<circle class="final-point" part="final-point" r="3" cx=${a.finalPoint.x.toFixed(1)} cy=${a.finalPoint.y.toFixed(1)}/>` : W}
          <g class="cursor" part="cursor">
            <path class="cursor-guide" d=${`M${a.X(s).toFixed(1)} ${a.T}V${a.B}`}/>
            ${n === "flow" ? W : H`<circle class="cursor-dot weight" r="4" cx=${a.X(s).toFixed(2)} cy=${a.Yw(c).toFixed(2)}/>`}
            ${n === "weight" || l == null ? W : H`<circle class="cursor-dot flow" r="4" cx=${a.X(s).toFixed(2)} cy=${a.Yf(l).toFixed(2)}/>`}
          </g>
        `, u, t)}
      ${this._config.show_readout ? V`<p class="readout" part="readout">${u}</p>` : W}
      ${this._config.show_legend ? V`<div class="legend" part="legend">
            ${n === "flow" ? W : V`<span class="key-weight">${d.map((e) => V`<i class=${e}></i>`)}${e("legend.weight")}</span>`}
            ${n === "weight" ? W : this._key("flow", e("legend.flow"))}
            ${p ? this._key("drip", e("legend.drip")) : W}
            ${r.held.length && n !== "flow" ? this._key("held", e("legend.held")) : W}
            ${r.truncated ? V`<span>${e("legend.incomplete")}</span>` : W}
          </div>` : W}
    `;
	}
	_key(e, t, n = 1) {
		return V`<span class=${`key-${e}`}>${Array.from({ length: n }, () => V`<i></i>`)}${t}</span>`;
	}
	_chart(e, t, n, r, i) {
		let a = i.weight[0].t, o = i.weight.at(-1).t;
		return V`<div
      class="chart"
      part="chart"
      tabindex="0"
      role="slider"
      aria-label=${this.t("shot.cursor_label")}
      aria-valuemin=${a.toFixed(1)}
      aria-valuemax=${o.toFixed(1)}
      aria-valuenow=${this._cursor.toFixed(1)}
      aria-valuetext=${r}
      @pointerdown=${(e) => {
			e.currentTarget.setPointerCapture(e.pointerId), this._seekAt(e, i);
		}}
      @pointermove=${(e) => {
			(e.pointerType === "mouse" || e.currentTarget.hasPointerCapture(e.pointerId)) && this._seekAt(e, i);
		}}
      @keydown=${(e) => {
			let t = {
				ArrowRight: .5,
				ArrowUp: .5,
				ArrowLeft: -.5,
				ArrowDown: -.5,
				PageUp: 5,
				PageDown: -5
			}[e.key];
			t && (e.preventDefault(), this._seek(this._cursor + t, i));
		}}
    >
      <svg viewBox="0 0 ${e} ${t}" width=${e} height=${t}>${n}</svg>
    </div>`;
	}
	_seekAt(e, t) {
		let n = e.currentTarget.querySelector("svg");
		if (!n || !this._tAt) return;
		let r = n.getBoundingClientRect();
		this._seek(this._tAt((e.clientX - r.left) * this._width / (r.width || this._width)), t);
	}
	_seek(e, t) {
		this._cursor = Math.round(Math.max(t.weight[0].t, Math.min(t.weight.at(-1).t, e)) * 10) / 10;
	}
	static {
		this.styles = [
			Ke,
			qe,
			p`
      :where(.views) {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 2px;
        padding: 3px;
        margin: 0 0 8px;
        border-radius: 999px;
        background: var(--obbw-switch-background, color-mix(in srgb, var(--_fg) 6%, var(--_surface)));
      }
      :where(.view) {
        border: none;
        border-radius: 999px;
        padding: 4px 12px;
        background: transparent;
        color: var(--_muted);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      :where(.view[aria-pressed="true"]) {
        background: var(--obbw-switch-active-background, var(--_surface));
        color: var(--_fg);
        box-shadow: 0 0 0 1px var(--obbw-grid-color, var(--divider-color, #dadada));
      }
      :where(.chart) {
        cursor: crosshair;
        outline: none;
      }
      :where(.chart:focus-visible) {
        box-shadow: 0 0 0 2px var(--primary-color, #03a9f4);
        border-radius: 4px;
      }
      :where(.shot-line) {
        fill: none;
        stroke: var(--_shot);
        stroke-width: var(--obbw-shot-line-width, 1.8);
        stroke-linejoin: round;
      }
      :where(.drip) {
        stroke-dasharray: 3 3;
      }
      :where(.held) {
        fill: var(--_muted);
        opacity: 0.6;
      }
      :where(.stop-point) {
        fill: var(--_shot);
        stroke: var(--_surface);
        stroke-width: 1.5;
      }
      :where(.series) {
        fill: none;
        stroke-width: var(--obbw-series-line-width, 1.6);
        stroke-linejoin: round;
        stroke-linecap: round;
      }
      :where(.series.flow) {
        stroke: var(--_flow);
      }
      :where(.series.bbw) {
        stroke: var(--_weight);
      }
      :where(.series.fast) {
        stroke: var(--_fast);
      }
      :where(.series.slow) {
        stroke: var(--_slow);
      }
      :where(.series.atm) {
        stroke: var(--_muted);
      }
      :where(.fill-top) {
        stop-opacity: var(--obbw-weight-fill-opacity, 0.36);
      }
      :where(.fill-top.flow) {
        stop-opacity: var(--obbw-flow-fill-opacity, 0.42);
      }
      :where(.fill-base) {
        stop-opacity: 0;
      }
      :where(.fill-base.flow) {
        stop-opacity: 0.02;
      }
      :where(.fill-top.flow, .fill-base.flow) {
        stop-color: var(--_flow);
      }
      :where(.fill-top.bbw, .fill-base.bbw) {
        stop-color: var(--_weight);
      }
      :where(.fill-top.fast, .fill-base.fast) {
        stop-color: var(--_fast);
      }
      :where(.fill-top.slow, .fill-base.slow) {
        stop-color: var(--_slow);
      }
      :where(.fill-top.atm, .fill-base.atm) {
        stop-color: var(--_muted);
      }
      :where(.final-point) {
        fill: var(--_surface);
        stroke: var(--_weight);
        stroke-width: 1.4;
      }
      :where(.final-point.shot) {
        stroke: var(--_shot);
      }
      :where(.flow-label) {
        fill: var(--obbw-flow-label-color, var(--_muted));
      }
      :where(.cursor-guide) {
        stroke: var(--_fg);
        stroke-opacity: 0.5;
        stroke-width: 1;
      }
      :where(.cursor-dot) {
        fill: var(--obbw-cursor-color, var(--_shot));
        stroke: var(--_surface);
        stroke-width: 1.5;
      }
      :where(.cursor-dot.weight) {
        fill: var(--obbw-cursor-color, var(--_weight));
      }
      :where(.cursor-dot.flow) {
        fill: var(--_flow);
      }
      :where(.legend .key-last i) {
        height: 0;
        border-top: 2.5px solid var(--_shot);
        border-radius: 0;
      }
      :where(.legend .key-last-drip i) {
        height: 0;
        border-top: 2.5px dashed var(--_shot);
        border-radius: 0;
      }
      /* The chart dots at the same painted size: the r=3 stop point and
         final point, with their 1.5px and 1.4px strokes. */
      :where(.legend .key-stopped i, .legend .key-final i) {
        width: 7.5px;
        height: 7.5px;
        border-radius: 50%;
        background: var(--_shot);
      }
      :where(.legend .key-final i) {
        width: 7.4px;
        height: 7.4px;
        background: var(--_surface);
        border: 1.4px solid var(--_shot);
        box-sizing: border-box;
      }
      :where(.legend .key-held i) {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--_muted);
        opacity: 0.6;
      }
      :where(.legend .key-weight i) {
        width: 7px;
        height: 3px;
        border-radius: 0;
        background: var(--_weight);
      }
      :where(.legend .key-weight i:first-child) {
        margin-left: 0;
      }
      :where(.legend .key-weight i + i) {
        margin-left: -4px;
      }
      :where(.legend .key-weight i.fast) {
        background: var(--_fast);
      }
      :where(.legend .key-weight i.slow) {
        background: var(--_slow);
      }
      :where(.legend .key-weight i.atm) {
        background: var(--_muted);
      }
      :where(.legend .key-flow i) {
        height: 3px;
        background: var(--_flow);
      }
      :where(.legend .key-drip i) {
        height: 0;
        border-top: 2.5px dashed var(--_muted);
        border-radius: 0;
      }
    `
		];
	}
}, Tt = [
	"mode_switch",
	"show_header",
	"show_readout",
	"show_legend"
], Et = class extends q {
	static {
		this.properties = {
			hass: { attribute: !1 },
			_config: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), Qe().then(() => this.requestUpdate());
	}
	setConfig(e) {
		this._config = e;
	}
	render() {
		if (!this.hass || !this._config) return W;
		let e = n(this.hass.locale?.language ?? this.hass.language), t = [
			{
				name: "device_id",
				selector: { device: { integration: J } }
			},
			{
				name: "chart",
				selector: { select: {
					mode: "dropdown",
					options: bt.map((t) => ({
						value: t,
						label: e(`view.${t}`)
					}))
				} }
			},
			{
				name: "title",
				selector: { text: {} }
			},
			{
				name: "",
				type: "grid",
				schema: Tt.map((e) => ({
					name: e,
					selector: { boolean: {} }
				}))
			}
		], r = {
			chart: "preset_weight",
			...Object.fromEntries(Tt.map((e) => [e, !0])),
			...this._config
		};
		return V`<ha-form
      .hass=${this.hass}
      .data=${r}
      .schema=${t}
      .computeLabel=${(t) => t.name ? e(`editor.${t.name === "device_id" ? "device" : t.name}`) : ""}
      @value-changed=${(e) => {
			let t = { ...e.detail.value };
			t.title || delete t.title, this.dispatchEvent(new CustomEvent("config-changed", {
				detail: { config: t },
				bubbles: !0,
				composed: !0
			}));
		}}
    ></ha-form>`;
	}
}, Dt = [
	10,
	25,
	50,
	100,
	500,
	1e3
];
function Ot(e, t = !1) {
	let n = Dt.filter((e) => t || e <= 100);
	return n.filter((t, r) => r === 0 || n[r - 1] < e);
}
function kt(e, t, n) {
	let r = (e) => (n?.facets?.presets ?? []).some(([t]) => t === e);
	return e === 0 || !n || r(e) ? e : r(t) ? t : 0;
}
var $ = (e, t) => (e = Math.round(e * 10) / 10, isFinite(e) ? `${e} ${t}` : "—");
function At(e) {
	let { lo: t, hi: n, a: r, b: i, h: a } = e, o = (e) => ((e - t) / (n - t) * 100).toFixed(2), s = (e) => {
		let r = (e - t) / (n - t) * 120, i = Math.max(0, Math.min(119, Math.floor(r)));
		return a[i] + (a[i + 1] - a[i]) * (r - i);
	}, c = Array.from({ length: 121 }, (e, r) => t + (n - t) * r / 120), l = {
		fast: e.n[0],
		on_recipe: e.n[1],
		slow: e.n[2]
	}, u = e.n[0] + e.n[1] + e.n[2], d = {}, f = 0, p = 0;
	for (let e of [
		"fast",
		"on_recipe",
		"slow"
	]) p += d[e] = Math.round(100 * (f += l[e]) / u) - p;
	let m = [
		[
			"fast",
			t,
			r
		],
		[
			"on_recipe",
			r,
			i
		],
		[
			"slow",
			i,
			n
		]
	].map(([e, t, n]) => {
		let r = [
			t,
			...c.filter((e) => e > t && e < n),
			n
		].map((e) => o(e) + " " + (50 - 46 * s(e) / 100).toFixed(2)).join(" L");
		return {
			key: e,
			t0: t,
			t1: n,
			area: `M${o(t)} 50 L${r} L${o(n)} 50Z`,
			line: `M${r}`,
			count: l[e],
			pct: d[e]
		};
	}), h = (n - t) / 120;
	return {
		d: e,
		zones: m,
		x: (e) => +o(e),
		dens: s,
		area: a.reduce((e, t, n) => e + (n && (t + a[n - 1]) / 2), 0) * h,
		peakT: t + a.indexOf(Math.max(...a)) * h
	};
}
function jt(e, t, n) {
	let { lo: r, hi: i, a, b: o, shared: s } = e, c = [[
		a,
		s ? $(a, n) : t(!0),
		80
	], [
		o,
		s ? $(o, n) : t(!1),
		80
	]];
	for (let e = 5; e < i - r; e += 5) c.push([
		a - e,
		s ? $(a - e, n) : "−" + $(e, n),
		20
	], [
		o + e,
		s ? $(o + e, n) : "+" + $(e, n),
		20
	]);
	return c.filter(([e]) => e > r && e < i).map(([e, t, n]) => ({
		at: (e - r) / (i - r),
		text: t,
		p: n
	}));
}
function Mt(e, t, n) {
	let r = [], i = [];
	for (let a of [...e].sort((e, t) => t.p - e.p)) {
		let e = n(a.text), o = a.at * t, s = o - e / 2 < 0 ? 0 : o + e / 2 > t ? t - e : o - e / 2;
		r.every(([t, n]) => s + e + 4 <= t || n + 4 <= s) && (r.push([s, s + e]), i.push({
			...a,
			left: s
		}));
	}
	return i.sort((e, t) => e.at - t.at);
}
var Nt = .05, Pt = .1, Ft = .5, It = .2, Lt = .5, Rt = (e, t, n) => Math.abs(e) <= t + 1e-9 ? "near" : Math.abs(e) <= n + 1e-9 ? "mid" : "far";
function zt(e) {
	let t = new Map(e.facets?.presets ?? []), n = e.cons?.p;
	return (e.cons?.t ?? []).map((r, i) => {
		let a = (Array.isArray(n) ? n[i] : n) ?? 0;
		return {
			arrivalS: r / 10,
			presetId: a,
			presetName: t.get(a),
			guard: e.cons.g?.[i] || 0
		};
	});
}
function Bt(e) {
	let t = e.length, n = {}, r = {};
	for (let t of e) (r[t.presetId] ??= []).push(t.arrivalS);
	for (let e in r) n[e] = r[e].reduce((e, t) => e + t, 0) / r[e].length;
	let i = e.map((e) => e.arrivalS / n[e.presetId] - 1), a = i.map(Math.abs).sort((e, t) => e - t), o = t < 5 ? null : (a[t - 1 >> 1] + a[t >> 1]) / 2, s = Object.keys(r).length === 1 ? n[e[0].presetId] : 0, c = Math.min(6 * Nt, Math.max(2 * Nt, Math.max(0, ...i.map(Math.abs)) * 1.15)), l = s ? (c * s < 2 ? .5 : 1) / s : .05;
	return {
		rows: e,
		rel: i,
		sec: s,
		typical: o,
		M: Math.ceil(c / l - 1e-9) * l,
		level: o == null ? "few" : o <= .05 ? "good" : o <= .1 ? "fair" : "poor",
		spread: t ? Math.max(...i) - Math.min(...i) : 0
	};
}
function Vt(e) {
	let t = e.e.map((t, n) => ({
		targetG: (Array.isArray(e.t) ? e.t[n] : e.t) / 10,
		presetId: Array.isArray(e.p) ? e.p[n] : e.p,
		missG: t / 100,
		guard: e.g?.[n] || 0
	})), n = (e) => e.guard ? `guard g${e.guard}` : Math.round(e.missG * 100) ? Rt(e.missG, It, Lt) : "bull", r = t.filter((e) => !e.guard), i = (e) => r.reduce((t, n) => t + e(n), 0) / (r.length || 1), a = Math.max(0, ...r.map((e) => Math.abs(e.missG)));
	return {
		rows: t,
		kind: n,
		scored: r.length,
		bulls: r.filter((e) => n(e) === "bull").length,
		within: r.filter((e) => Math.abs(e.missG) <= .200000001).length,
		miss: i((e) => Math.abs(e.missG)),
		lean: i((e) => e.missG),
		M: Math.min(1.5, Math.max(.5, Math.ceil(a * 1.15 / .25 - 1e-9) * .25))
	};
}
function Ht(e, t) {
	let n = Math.max(10, e), r = 94 / (n - 1);
	return {
		n: e,
		W: n,
		gap: r,
		half: r * .27,
		X: (t) => 3 + (n - e + t) * r,
		Y: (e) => 25 - 23 * Math.max(-t, Math.min(t, e)) / t,
		f: (e) => e.toFixed(2)
	};
}
function Ut(e, t, n, r, i) {
	let a = [];
	for (let i = 0, o = 0, s = 0, c = 0, l = 0; i < e.length; i++) {
		if (t(i)) {
			let t = e[i] - s;
			o++ ? (s += Ft * t, c = .5 * (c + Ft * t * t), l += Ft * (Math.abs(e[i]) - l)) : (s = e[i], l = Math.abs(s));
		}
		if (o >= 3) {
			let e = Math.sqrt(c);
			a.push({
				i,
				m: s,
				hi: Math.max(0, s + e),
				lo: Math.min(0, s - e),
				k: Rt(l, n, r)
			});
		}
	}
	let { X: o, Y: s, f: c } = i, l = [];
	for (let e = 1; e < a.length; e++) {
		let t = a[e - 1], n = a[e];
		l.push({
			k: n.k,
			d: "M" + [
				[o(t.i), s(t.hi)],
				[o(n.i), s(n.hi)],
				[o(n.i), s(n.lo)],
				[o(t.i), s(t.lo)]
			].map((e) => c(e[0]) + " " + c(e[1])).join("L") + "Z"
		});
	}
	return {
		spread: l,
		mean: a.length ? "M" + a.map((e) => c(o(e.i)) + " " + c(s(e.m))).join("L") : null
	};
}
function Wt(e, t, n, r, i) {
	let { n: a, X: o, Y: s, half: c, f: l } = i, u = [], d = [];
	for (let n = 0, r = []; n < a; n++) t(n) && (r = [...r, e[n]].slice(-5)), u.push(r.length ? r : null);
	let f = (e) => Math.min(e, 25), p = (e) => Math.max(e, 25), m = (e, t, n, r, i, a, o) => {
		Math.max(r - n, o - a) > .01 && d.push({
			k: e,
			d: [
				t,
				n,
				i,
				a,
				i,
				o,
				t,
				r
			].map((e, t) => (t % 2 ? " " : t ? "L" : "M") + l(e)).join("") + "Z"
		});
	}, h = null;
	for (let e = 0; e < a; e++) {
		let t = u[e];
		if (!t) continue;
		let i = {
			x: o(e),
			hi: s(Math.max(...t)),
			lo: s(Math.min(...t)),
			up: Rt(Math.max(0, ...t), n, r),
			down: Rt(Math.min(0, ...t), n, r)
		}, a = i.x - c;
		h && (m(h.up, h.x + c, f(h.hi), f(h.lo), a, f(i.hi), f(i.lo)), m(h.down, h.x + c, p(h.hi), p(h.lo), a, p(i.hi), p(i.lo))), m(i.up, a, f(i.hi), f(i.lo), i.x + c, f(i.hi), f(i.lo)), m(i.down, a, p(i.hi), p(i.lo), i.x + c, p(i.hi), p(i.lo)), h = i;
	}
	return d;
}
function Gt(e, t, n, r, i, a = () => !1) {
	let { X: o, Y: s, half: c, f: l } = n;
	return e.map((e, n) => {
		let u = l(o(n) - c), d = l(2 * c), f = s(e), p = Math.abs(f - 25), m = !!i(n);
		return {
			cls: r(n),
			ring: a(n),
			x: u,
			w: d,
			y: l(p < .6 ? 24.7 : Math.min(f, 25)),
			h: l(Math.max(p, .6)),
			edge: m ? `M${u} 25V${l(f)}h${d}V25` : `M${u} ${l(f)}h${d}`,
			rim: m,
			over: Math.abs(e) > t ? `M${u} ${e > 0 ? 1 : 49}h${d}` : null
		};
	});
}
function Kt(e) {
	let t = (Math.round(e * 100) / 100).toFixed(2);
	return t.endsWith("0") ? t.slice(0, -1) : t;
}
// src/stats-card.ts
var qt = {
	preset: "active",
	shots: 10,
	show_header: !0,
	show_preset_selector: !0,
	show_shots_selector: !0,
	show_figures: !0,
	show_legend: !0,
	band: "range"
}, Jt = -1, Yt = {
	near: "var(--_ok)",
	mid: "var(--_mid)",
	far: "var(--_fast)"
}, Xt = (e) => e === 1 ? "var(--_fast)" : "var(--_slow)", Zt = {
	fast: "var(--_fast)",
	on_recipe: "var(--_ok)",
	slow: "var(--_slow)"
}, Qt = 38.4, $t = 0, en = class extends X {
	static {
		this.properties = {
			...X.properties,
			_stats: { state: !0 },
			_pickPreset: { state: !0 },
			_pickWindow: { state: !0 },
			_held: { state: !0 }
		};
	}
	constructor() {
		super(), this.defaults = qt, this._id = `obbwst${++$t}`, this._plot = {
			w: 0,
			h: 0
		}, this._held = !1;
	}
	static getStubConfig(e) {
		return { device_id: Oe(e) };
	}
	setConfig(e) {
		if (e?.shots != null && !Dt.includes(e.shots)) throw Error(`Unknown shots: ${e.shots}`);
		if (e?.band != null && !["range", "ewma"].includes(e.band)) throw Error(`Unknown band: ${e.band}`);
		let t = e?.preset;
		if (t != null && t !== "active" && t !== "all" && !(Number.isInteger(t) && t > 0)) throw Error(`Unknown preset: ${t}`);
		super.setConfig(e);
		let n = {};
		try {
			n = JSON.parse(localStorage.getItem(this._pickKey) ?? "{}");
		} catch {}
		this._pickPreset = this._config.show_preset_selector ? n.preset : void 0, this._pickWindow = this._config.show_shots_selector ? n.window : void 0;
	}
	getCardSize() {
		return 4;
	}
	getGridOptions() {
		return {
			columns: 12,
			min_columns: 6
		};
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._stopStats?.(), this._stopStats = this._asked = void 0;
	}
	updated(e) {
		super.updated(e), this._followStats();
	}
	get _pickKey() {
		let e = this._config;
		return `obbw-stats:${this.kind}:${e.device_id}:${e.preset}:${e.shots}`;
	}
	_choice() {
		let e = this._config, t = this._stats?.chart, n = this._state.status === "ready" ? this._state.data.activePresetId : 0, r = e.preset === "all" ? 0 : e.preset === "active" || e.preset == null ? Jt : e.preset, i = this._pickPreset ?? r, a = t ? Ot(t.good, t.source === "companion") : [...Dt], o = this._pickWindow ?? e.shots ?? 10;
		return {
			preset: kt(i === Jt ? n : i, n, t?.stats),
			window: a.includes(o) ? o : a.at(-1),
			windows: a
		};
	}
	_followStats() {
		let e = this._config?.device_id;
		if (!this.hass || !e || !this.isConnected || this._state.status !== "ready") return;
		let { window: t, preset: n } = this._choice(), r = `${e}:${t}:${n}`;
		r !== this._asked && (this._stopStats?.(), this._asked = r, this._stopStats = je(this.hass, e, t, n, (e) => {
			e.status === "ready" && (this._stats = e.data.chart || !this._stats?.chart ? e.data : {
				...this._stats,
				available: e.data.available
			});
		}));
	}
	_pick(e) {
		"preset" in e && (this._pickPreset = e.preset), "window" in e && (this._pickWindow = e.window);
		try {
			localStorage.setItem(this._pickKey, JSON.stringify({
				preset: this._pickPreset,
				window: this._pickWindow
			}));
		} catch {}
	}
	render() {
		return this._config ? V`<ha-card><div class="body" part="body">${this._content(this.t)}</div></ha-card>` : W;
	}
	_content(e) {
		let t = this._state;
		if (t.status === "loading") return V`<p class="message">${e("state.loading")}</p>`;
		if (t.status === "not_found") return V`<p class="message">${e("state.not_found")}</p>`;
		let n = this._config, r = this._stats, i = r?.chart, a = n.show_header ? this._header(e) : W;
		if (r && !r.supported) return V`${a}<p class="message">${e("stats.unsupported")}</p>`;
		if (!i) return V`${a}<p class="message">${e("state.loading")}</p>`;
		let o = i.stats;
		if (!o.facets?.presets?.length) return V`${a}<p class="message">${e("shot.none")}</p>`;
		let s = o.preset ?? this._choice().preset;
		return V`${a}
      ${r.available ? W : V`<p class="message" part="status">${e("stats.unavailable")}</p>`}
      ${this._width ? this._chart(e, o, s) : V`<div class="plot"></div>`}`;
	}
	_nameOf(e, t) {
		return (this._state.status === "ready" ? this._state.data.presets : []).find((t) => t.id === e)?.name ?? new Map(t.facets?.presets ?? []).get(e) ?? "—";
	}
	_header(e) {
		let t = this._config, n = this._stats?.chart, { preset: r, window: i, windows: a } = this._choice(), o = (n?.stats.facets?.presets ?? []).map(([e]) => e), s = r ? this._nameOf(r, n?.stats ?? {}) : e("stats.all_presets"), c = t.show_preset_selector && n && o.length, l = t.show_shots_selector && n, u = [...l ? [] : [e("stats.last_n", i)], ...c ? [] : [s]].join(" · ");
		return V`<div class="header" part="header">
      <div class="titles">
        <div class="title" part="title">${t.title || e(`stats.title_${this.kind}`)}</div>
        ${u ? V`<div class="subtitle" part="subtitle">${u}</div>` : W}
      </div>
      <div class="selectors">
        ${l ? V`<select
              class="selector"
              part="selector"
              aria-label=${e("stats.window")}
              title=${e("stats.window")}
              @change=${(e) => this._pick({ window: Number(e.target.value) })}
            >
              ${a.map((t) => V`<option value=${t} ?selected=${t === i}>${e("stats.last_n", t)}</option>`)}
            </select>` : W}
        ${c ? V`<select
              class="selector"
              part="selector"
              aria-label=${e("stats.preset")}
              title=${e("stats.preset")}
              @change=${(e) => this._pick({ preset: Number(e.target.value) })}
            >
              ${[0, ...o].map((t) => V`<option value=${t} ?selected=${t === r}>
                    ${t ? this._nameOf(t, n.stats) : e("stats.all_presets")}
                  </option>`)}
            </select>` : W}
      </div>
    </div>`;
	}
	_cursorAt(e, t) {
		return e !== this._cursorKey && (this._cursorKey = e, this._cursor = t), this._cursor;
	}
	_pill(e, t, n) {
		if (!this._held) return W;
		let { w: r, h: i } = this._plot;
		return this._pillAt(e, t / 100 * r, n * i, r, i);
	}
	_scrub(e, t, n, r, i, a, o) {
		let s = (e) => {
			let t = e.currentTarget.querySelector(".cursor").getBoundingClientRect();
			this._plot = {
				w: t.width,
				h: t.height
			}, r(n(e.clientX - t.left, t.width));
		};
		return V`<div
      class=${`plot ${t} ${this._held ? "held" : ""}`}
      part="chart"
      tabindex="0"
      role="slider"
      aria-label=${i}
      aria-valuemin=${a[0]}
      aria-valuemax=${a[1]}
      aria-valuenow=${a[2]}
      aria-valuetext=${o}
      @pointerdown=${(e) => {
			let t = e.currentTarget, n = t.querySelector(".handle")?.getBoundingClientRect();
			e.pointerType !== "mouse" && (!n || Math.hypot(e.clientX - n.x - n.width / 2, e.clientY - n.y - n.height / 2) >= 22) || (e.preventDefault(), t.setPointerCapture(e.pointerId), t.focus({ preventScroll: !0 }), this._held = !0, s(e));
		}}
      @pointermove=${(e) => e.currentTarget.hasPointerCapture(e.pointerId) && s(e)}
      @lostpointercapture=${() => this._held = !1}
      @keydown=${(e) => {
			let t = {
				ArrowRight: .5,
				ArrowUp: .5,
				ArrowLeft: -.5,
				ArrowDown: -.5,
				PageUp: 5,
				PageDown: -5
			}[e.key];
			t && (e.preventDefault(), r(this._cursor + t));
		}}
    >
      ${e}
    </div>`;
	}
	_legend(e) {
		return this._config.show_legend ? V`<div class="slegend" part="legend">
          ${e.map(([e, t]) => V`<span>${e ? V`<i class=${e}></i>` : W}${t}</span>`)}
        </div>` : W;
	}
	_sizeLegend(e, t, n, r) {
		return [
			["near", e("stats.legend_within", t)],
			["mid", e("stats.legend_off_range", ...n)],
			["far", e("stats.legend_off_more", r)],
			this._config.band === "ewma" ? ["spread", e("stats.legend_spread")] : ["spread", e("stats.legend_range", 5)],
			["guard g1", e("stats.legend_guard_fast")],
			["guard g2", e("stats.legend_guard_slow")]
		];
	}
	_miss(e, t, n) {
		let { vals: r, M: i } = t, a = r.length, o = Ht(a, i), { X: s, Y: c, f: l } = o, u = this._id, d = this._config.band === "ewma" ? Ut(r, t.counts, t.near, t.far, o) : { range: Wt(r, t.counts, t.near, t.far, o) }, f = Gt(r, i, o, t.cls, t.guard, t.ring), p = this._cursorAt(n, a - 1), m = t.ring?.(p) ? 25 : c(r[p]), h = t.pill(p);
		return V`
      ${this._config.show_figures ? V`<div class=${`zones ${t.headClass}`} part="figures">${t.head}</div>` : W}
      ${this._scrub(V`<svg class="area" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
            ${"range" in d ? H`<defs>${[
			"near",
			"mid",
			"far"
		].map((e) => H`<linearGradient id=${`${u}band${e}`} gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="48">
                    ${[
			0,
			.5,
			1
		].map((t) => H`<stop class=${`band-stop ${e} ${t === .5 ? "mid-stop" : ""}`} offset=${t}/>`)}
                  </linearGradient>`)}</defs>
                ${d.range.map((e) => H`<path class=${`range ${e.k}`} d=${e.d} fill=${`url(#${u}band${e.k})`}/>`)}` : H`${d.spread.map((e) => H`<path class=${`spread ${e.k}`} d=${e.d}/>`)}
                ${d.mean ? H`<path class="mean" d=${d.mean}/>` : W}`}
            ${f.map((e) => e.ring ? W : H`<rect class=${`bar ${e.cls}`} x=${e.x} width=${e.w} y=${e.y} height=${e.h}/>
                  <path class=${`${e.rim ? "rim" : "cap"} ${e.cls}`} d=${e.edge}/>
                  ${e.over ? H`<path class=${`over ${e.cls}`} d=${e.over}/>` : W}`)}
            <path class="avg" d="M0 25H100" />
          </svg>
          ${t.edges.map((e, t) => V`<span class="edge" style=${`top:${[
			c(i),
			25,
			c(-i)
		][t] * 2}%`}>${e}</span>`)}
          <svg class="cursor" aria-hidden="true">
            ${f.map((e, t) => e.ring ? H`<circle class="ring" cx=${`${l(s(t))}%`} cy="50%" r="4"/>` : W)}
            <g style=${`--c:${t.color(p)}`}>
              <line class="guide" x1=${`${s(p)}%`} x2=${`${s(p)}%`} y1="0" y2="100%" />
              <circle class="handle" cx=${`${s(p)}%`} cy=${`${m * 2}%`} r="5" />
              ${this._pill(h, s(p), m / 50)}
            </g>
          </svg>`, "miss", (e, t) => Math.round((e / t * 100 - 3) / o.gap) - (o.W - a), (e) => {
			this._cursor = Math.max(0, Math.min(a - 1, e > p ? Math.ceil(e) : Math.floor(e))), this.requestUpdate();
		}, t.aria, [
			1,
			a,
			p + 1
		], h)}
      <div class="ticks miss-ticks">
        <span class="tick" ?hidden=${a < 4} style=${`left:${s(0) - o.half}%`}>${e("stats.consistency_oldest")}</span>
        <span class="tick last">${e("stats.consistency_latest")}</span>
      </div>
      ${this._legend(t.legend)}
    `;
	}
	static {
		this.styles = [
			Ke,
			qe,
			p`
      :where(ha-card) {
        display: flex;
        flex-direction: column;
      }
      :where(.body) {
        flex: 1;
        display: flex;
        flex-direction: column;
        container-type: inline-size;
      }
      /* The selectors move under the title rather than cut it short. */
      :where(.header) {
        flex-wrap: wrap;
        row-gap: 6px;
      }
      :where(.titles) {
        flex: 1 1 9rem;
      }
      :where(.selectors) {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        max-width: 100%;
      }
      :where(.selectors .selector) {
        max-width: 100%;
      }
      /* The figures above each chart: the Web UI's statsDensZones. */
      :where(.zones) {
        display: grid;
        grid-template-columns: var(--zf, 33.333%) var(--zo, 33.333%) 1fr;
        align-items: end;
        min-height: 2.35rem;
      }
      :where(.zones span) {
        justify-self: center;
        text-align: center;
        font-size: 0.72rem;
        font-weight: 650;
        white-space: nowrap;
        color: var(--_muted);
      }
      :where(.zones b) {
        display: block;
        font-size: 1.1rem;
        color: var(--_fg);
      }
      :where(.zones.cut) {
        grid-template-columns: repeat(4, 1fr);
      }
      /* Narrow cards wrap the captions, never the figures; the four cut figures go two by two. */
      @container (width < 300px) {
        :where(.zones span) {
          max-width: 100%;
          font-size: 0.66rem;
          white-space: normal;
          hyphens: auto;
          overflow-wrap: break-word;
        }
        :where(.zones b) {
          white-space: nowrap;
        }
        :where(.zones.cut) {
          grid-template-columns: repeat(2, 1fr);
          row-gap: 0.4rem;
        }
      }
      :where(.zones.cut > :first-child) {
        color: var(--_ok);
      }
      :where(.zones.level > :first-child) {
        color: var(--_z);
      }
      :where(.zones.time > :nth-child(1)) {
        color: var(--_fast);
      }
      :where(.zones.time > :nth-child(2)) {
        color: var(--_ok);
      }
      :where(.zones.time > :nth-child(3)) {
        color: var(--_slow);
      }
      :where(.level-good) {
        --_z: var(--_ok);
      }
      :where(.level-fair) {
        --_z: var(--_fair);
      }
      :where(.level-poor) {
        --_z: var(--_poor);
      }
      :where(.level-few) {
        --_z: var(--_muted);
      }
      /* The plot grows with the card; the Web UI's height is its least. */
      :where(.plot) {
        position: relative;
        flex: 1;
        min-height: 3.75rem;
        touch-action: pan-y;
        cursor: ew-resize;
      }
      :where(.plot.miss) {
        min-height: 4.5rem;
        margin: 0.85rem ${Qt}px 0 0;
      }
      /* Stretched to the plot: the viewBox's own ratio would set its height. */
      :where(.area) {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      :where(.cursor) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      :where(.guide) {
        stroke: var(--_fg);
        stroke-opacity: 0.5;
        stroke-width: 1;
      }
      :where(.handle) {
        fill: var(--c, var(--_shot));
        stroke: var(--_surface);
        stroke-width: 1.5;
      }
      :where(.cursor .pill rect) {
        stroke: var(--c, var(--_cut));
      }
      :where(.edge) {
        position: absolute;
        left: 100%;
        padding-left: 0.35rem;
        transform: translateY(-50%);
        font-size: 0.68rem;
        line-height: 1;
        white-space: nowrap;
        color: var(--_muted);
      }
      :where(.ticks) {
        position: relative;
        height: 1.05rem;
        margin: 0.15rem 0.1rem 0;
        font-size: 0.68rem;
        color: var(--_muted);
        overflow: hidden;
      }
      @container (width <= 420px) {
        :where(.ticks) {
          font-size: 0.62rem;
        }
      }
      :where(.miss-ticks) {
        margin-right: calc(${Qt}px + 1.6px);
      }
      :where(.tick) {
        position: absolute;
        top: 0;
        white-space: nowrap;
      }
      :where(.tick.last) {
        right: 0;
      }
      /* Density: each zone fades from its curve to the base. */
      :where(.dens-top) {
        stop-opacity: 0.45;
      }
      :where(.dens-base) {
        stop-opacity: 0.02;
      }
      :where(.fast) {
        --bc: var(--_fast);
        stop-color: var(--_fast);
      }
      :where(.on_recipe, .on) {
        --bc: var(--_ok);
        stop-color: var(--_ok);
      }
      :where(.slow) {
        --bc: var(--_slow);
        stop-color: var(--_slow);
      }
      :where(.dens-line) {
        fill: none;
        stroke: var(--bc);
        stroke-width: 1.35;
        vector-effect: non-scaling-stroke;
      }
      /* Bars: their colour by how far the shot landed, or the guard that stopped it. */
      :where(.near) {
        --bc: var(--_ok);
      }
      :where(.mid) {
        --bc: var(--_mid);
      }
      :where(.far) {
        --bc: var(--_fast);
      }
      :where(.g1) {
        --bc: var(--_fast);
      }
      :where(.g2) {
        --bc: var(--_slow);
      }
      :where(.bar) {
        fill: var(--bc);
        fill-opacity: 0.3;
      }
      :where(.bar.guard) {
        fill: color-mix(in srgb, var(--_fg) 12%, var(--_surface));
        fill-opacity: 1;
      }
      :where(.cap, .rim) {
        fill: none;
        stroke: var(--bc);
        vector-effect: non-scaling-stroke;
      }
      :where(.cap) {
        stroke-width: 2;
      }
      :where(.rim) {
        stroke-width: 1.5;
        stroke-dasharray: 3 2;
      }
      :where(.spread) {
        fill: var(--bc);
        fill-opacity: 0.26;
        stroke: none;
      }
      :where(.range) {
        stroke: none;
      }
      :where(.band-stop) {
        stop-color: var(--bc);
        stop-opacity: 0.45;
      }
      :where(.band-stop.mid-stop) {
        stop-opacity: 0.02;
      }
      :where(.mean) {
        fill: none;
        stroke: var(--_fg);
        stroke-opacity: 0.55;
        stroke-width: 1.5;
        vector-effect: non-scaling-stroke;
      }
      :where(.ring) {
        fill: var(--_surface);
        stroke: var(--_ok);
        stroke-width: 2.5;
      }
      :where(.over) {
        stroke: var(--bc);
        stroke-width: 2.5;
        stroke-dasharray: 2 1.5;
        vector-effect: non-scaling-stroke;
      }
      :where(.avg) {
        fill: none;
        stroke: var(--_fg);
        stroke-opacity: 0.45;
        stroke-dasharray: 3 3;
        vector-effect: non-scaling-stroke;
      }
      /* The Web UI's chart legend: a swatch per mark, as the mark is drawn. */
      :where(.slegend) {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem 0.8rem;
        margin: 0.55rem 0 0;
        font-size: 0.72rem;
        color: var(--_muted);
      }
      :where(.slegend i) {
        display: inline-block;
        width: 0.65rem;
        height: 0.65rem;
        margin-right: 0.3rem;
        border-radius: 2px;
        vertical-align: -1px;
        background: color-mix(in srgb, var(--bc) 30%, var(--_surface));
        box-shadow: inset 0 2px var(--bc);
      }
      :where(.slegend .spread) {
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--_ok) 35%, var(--_surface)) 0 33%,
          color-mix(in srgb, var(--_mid) 35%, var(--_surface)) 33% 67%,
          color-mix(in srgb, var(--_fast) 35%, var(--_surface)) 67%
        );
        box-shadow: none;
      }
      :where(.slegend .bull) {
        border-radius: 50%;
        background: var(--_surface);
        box-shadow: inset 0 0 0 2px var(--_ok);
      }
      :where(.slegend .guard) {
        background: color-mix(in srgb, var(--_fg) 12%, var(--_surface));
        box-shadow: none;
        outline: 1.5px dashed var(--bc, var(--_muted));
        outline-offset: -1.5px;
      }
    `
		];
	}
}, tn = class extends en {
	constructor(...e) {
		super(...e), this.kind = "time";
	}
	static getConfigElement() {
		return Object.assign(document.createElement("open-brew-by-weight-stats-card-editor"), { kind: "time" });
	}
	_chart(e, t, n) {
		let r = t.dens ?? [], i = !n || r[1] === !0 ? r[0] : r[1];
		if (!i || i === !0) return V`<p class="message">${e("stats.no_timed")}</p>`;
		let a = At(i), { lo: o, hi: s, a: c, b: l, shared: u } = i, d = e("stats.s"), f = this._id, p = {
			fast: e("verdict.fast"),
			on_recipe: e("verdict.on_recipe"),
			slow: e("verdict.slow")
		}, m = this._cursorAt(i, a.peakT), h = e("stats.time_pill", ((t) => u ? $(t, d) : t < c ? "−" + $(c - t, d) : t > l ? "+" + $(t - l, d) : e("stats.time_window", $(t - c, d)))(m), Math.round(100 * a.dens(m) / a.area)), g = 1 - .92 * a.dens(m) / 100, _ = a.zones[m < c ? 0 : m > l ? 2 : 1].key, v = this._width <= 420, y = Mt(jt(i, (t) => e(t ? "stats.window_start" : "stats.window_end"), d), this._width, (e) => this._measure(e, v ? 9.92 : 10.88));
		return V`
      ${this._config.show_figures ? V`<div class="zones time" part="figures" style=${`--zf:${a.x(c)}%;--zo:${a.x(l) - a.x(c)}%`}>
            ${a.zones.map((e) => V`<span><b>${e.pct}%</b>${e.count} ${p[e.key]}</span>`)}
          </div>` : W}
      ${this._scrub(V`<svg class="area" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              ${a.zones.map((e) => H`<linearGradient id=${`${f}sd${e.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop class=${`dens-top ${e.key}`}/><stop class=${`dens-base ${e.key}`} offset="1"/></linearGradient>`)}
            </defs>
            ${a.zones.map((e) => H`<path d=${e.area} fill=${`url(#${f}sd${e.key})`}/><path class=${`dens-line ${e.key}`} d=${e.line}/>`)}
          </svg>
          <svg class="cursor" aria-hidden="true">
            <g style=${`--c:${Zt[_]}`}>
              <line class="guide" x1=${`${a.x(m)}%`} x2=${`${a.x(m)}%`} y1="0" y2="100%" />
              <circle class="handle" cx=${`${a.x(m)}%`} cy=${`${g * 100}%`} r="5" />
              ${this._pill(h, a.x(m), g)}
            </g>
          </svg>`, "dens", (e, t) => o + e / t * (s - o), (e) => {
			this._cursor = Math.round(Math.max(o, Math.min(s, e)) * 10) / 10, this.requestUpdate();
		}, e("stats.time_cursor"), [
			o,
			s,
			m
		], h)}
      <div class="ticks" role="img" aria-label=${y.map((e) => e.text).join(", ")}>
        ${y.map((e) => V`<span class="tick" style=${`left:${e.left}px`}>${e.text}</span>`)}
      </div>
      ${this._legend([
			["fast", u ? e("stats.legend_fast", $(c, d)) : e("stats.legend_fast_window")],
			["on", u ? e("stats.legend_on", $(c, d), $(l, d)) : e("stats.legend_on_window")],
			["slow", u ? e("stats.legend_slow", $(l, d)) : e("stats.legend_slow_window")]
		])}
    `;
	}
}, nn = class extends en {
	constructor(...e) {
		super(...e), this.kind = "consistency";
	}
	static getConfigElement() {
		return Object.assign(document.createElement("open-brew-by-weight-stats-card-editor"), { kind: "consistency" });
	}
	_chart(e, t, n) {
		let r = Bt(zt(t).filter((e) => !n || e.presetId === n)), { rows: i, rel: a, sec: o, M: s } = r, c = i.length;
		if (!c) return V`<p class="message">${e("stats.no_timed")}</p>`;
		let l = e("stats.s"), u = (e) => o ? $(e * o, l) : +(e * 100).toFixed(1) + "%", d = (e, t = Math.round(e * (o || 100) * 10)) => (t > 0 ? "+" : t < 0 ? "−" : "") + u(Math.abs(e)), f = (e) => Rt(a[e], Nt, Pt), p = (e) => Math.round(e * 100);
		return this._miss(e, {
			head: V`<span><b>${r.typical == null ? "—" : "±" + u(r.typical)}</b>${e(`stats.consistency_${r.level}`)}</span>
            <span><b>${u(r.spread)}</b>${e("stats.consistency_spread")}</span>
            <span><b>${c}</b>${e("stats.consistency_shots")}</span>`,
			headClass: `level level-${r.level}`,
			vals: a,
			M: s,
			counts: () => !0,
			cls: (e) => i[e].guard ? "guard g" + i[e].guard : f(e),
			guard: (e) => i[e].guard,
			color: (e) => i[e].guard ? Xt(i[e].guard) : Yt[f(e)],
			near: Nt,
			far: Pt,
			edges: [
				"+" + u(s),
				o ? u(1) : e("stats.consistency_avg"),
				"−" + u(s)
			],
			pill: (t) => e("stats.consistency_pill", t + 1, o ? "" : " · " + (i[t].presetName || "—"), $(i[t].arrivalS, l), d(a[t])),
			aria: e("stats.consistency_cursor"),
			legend: this._sizeLegend(e, p(Nt) + "%", [String(p(Nt)), p(Pt) + "%"], p(Pt) + "%")
		}, t.cons);
	}
}, rn = class extends en {
	constructor(...e) {
		super(...e), this.kind = "cut";
	}
	static getConfigElement() {
		return Object.assign(document.createElement("open-brew-by-weight-stats-card-editor"), { kind: "cut" });
	}
	_chart(e, t, n) {
		if (!t.cut?.e?.length) return V`<p class="message">${e("stats.cut_none")}</p>`;
		let r = Vt(t.cut), { rows: i, kind: a, M: o } = r, s = e("stats.g"), c = (e) => Kt(e) + " " + s, l = (e, t = Math.round(e * 100)) => (t > 0 ? "+" : t < 0 ? "−" : "±") + c(Math.abs(e));
		return this._miss(e, {
			head: V`<span><b>${e("stats.cut_of", r.bulls, r.scored)}</b>${e("stats.cut_bullseyes")}</span>
          <span><b>${((e) => r.scored ? Math.round(100 * e / r.scored) + "%" : "—")(r.within)}</b>${e("stats.cut_within", c(It))}</span>
          <span><b>${r.scored ? c(r.miss) : "—"}</b>${e("stats.cut_avg_miss")}</span>
          <span
            ><b>${r.scored ? l(r.lean) : "—"}</b>${Math.abs(r.lean) < .05 ? e("stats.cut_centred") : r.lean > 0 ? e("stats.cut_leans_over") : e("stats.cut_leans_under")}</span
          >`,
			headClass: "cut",
			vals: i.map((e) => e.missG),
			M: o,
			counts: (e) => !i[e].guard,
			cls: (e) => a(i[e]),
			ring: (e) => a(i[e]) === "bull",
			guard: (e) => i[e].guard,
			color: (e) => i[e].guard ? Xt(i[e].guard) : Yt[Rt(i[e].missG, It, Lt)],
			near: It,
			far: Lt,
			edges: [
				"+" + c(o),
				e("stats.cut_target"),
				"−" + c(o)
			],
			pill: (r) => e("stats.cut_pill", r + 1, n ? "" : " · " + this._nameOf(i[r].presetId, t), e("stats.cut_of", c(i[r].targetG + i[r].missG), c(i[r].targetG)), a(i[r]) === "bull" ? e("stats.cut_bullseye") : l(i[r].missG)),
			aria: e("stats.cut_cursor"),
			legend: [["bull", e("stats.cut_bullseye")], ...this._sizeLegend(e, c(It), [Kt(It), c(Lt)], c(Lt))]
		}, t.cut);
	}
}, an = [
	"show_header",
	"show_shots_selector",
	"show_preset_selector",
	"show_figures",
	"show_legend"
], on = class extends q {
	static {
		this.properties = {
			hass: { attribute: !1 },
			kind: { attribute: !1 },
			_config: { state: !0 },
			_state: { state: !0 }
		};
	}
	constructor() {
		super(), this.kind = "time";
	}
	connectedCallback() {
		super.connectedCallback(), Qe().then(() => this.requestUpdate());
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._stop?.(), this._following = void 0;
	}
	setConfig(e) {
		this._config = e;
	}
	updated(e) {
		let t = this._config?.device_id;
		this.hass && t !== this._following && (this._stop?.(), this._following = t, this._state = void 0, t && (this._stop = Ae(this.hass, t, (e) => this._state = e)));
	}
	render() {
		if (!this.hass || !this._config) return W;
		let e = n(this.hass.locale?.language ?? this.hass.language), t = this._state?.status === "ready" ? this._state.data.presets : [], r = (e) => ({ select: {
			mode: "dropdown",
			options: e
		} }), i = [
			{
				name: "device_id",
				selector: { device: { integration: J } }
			},
			{
				name: "",
				type: "grid",
				schema: [{
					name: "preset",
					selector: r([
						{
							value: "active",
							label: e("editor.preset_active")
						},
						{
							value: "all",
							label: e("editor.preset_all")
						},
						...t.map((e) => ({
							value: String(e.id),
							label: e.name
						}))
					])
				}, {
					name: "shots",
					selector: r(Dt.map((t) => ({
						value: String(t),
						label: e("stats.last_n", t)
					})))
				}]
			},
			{
				name: "title",
				selector: { text: {} }
			},
			...this.kind === "time" ? [] : [{
				name: "band",
				selector: r(["range", "ewma"].map((t) => ({
					value: t,
					label: e(`band.${t}`)
				})))
			}],
			{
				name: "",
				type: "grid",
				schema: an.map((e) => ({
					name: e,
					selector: { boolean: {} }
				}))
			}
		], a = {
			preset: "active",
			shots: "10",
			band: "range",
			...Object.fromEntries(an.map((e) => [e, !0])),
			...this._config,
			...typeof this._config.preset == "number" ? { preset: String(this._config.preset) } : {},
			...this._config.shots ? { shots: String(this._config.shots) } : {}
		};
		return V`<ha-form
      .hass=${this.hass}
      .data=${a}
      .schema=${i}
      .computeLabel=${(t) => t.name ? e(`editor.${t.name === "device_id" ? "device" : t.name}`) : ""}
      @value-changed=${this._changed}
    ></ha-form>`;
	}
	_changed(e) {
		let t = { ...e.detail.value };
		t.preset != null && t.preset !== "active" && t.preset !== "all" && (t.preset = Number(t.preset)), t.shots != null && (t.shots = Number(t.shots)), t.title || delete t.title, this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: t },
			bubbles: !0,
			composed: !0
		}));
	}
}, sn = [
	["open-brew-by-weight-preset-card", Xe],
	["open-brew-by-weight-preset-card-editor", et],
	["open-brew-by-weight-shot-chart-card", wt],
	["open-brew-by-weight-shot-chart-card-editor", Et],
	["open-brew-by-weight-shot-card", gt],
	["open-brew-by-weight-shot-card-editor", _t],
	["open-brew-by-weight-shot-time-card", tn],
	["open-brew-by-weight-shot-consistency-card", nn],
	["open-brew-by-weight-cut-accuracy-card", rn],
	["open-brew-by-weight-stats-card-editor", on]
], cn = () => {
	for (let [e, t] of sn) if (!customElements.get(e)) try {
		customElements.define(e, t);
	} catch {}
};
cn();
var ln = 0, un = setInterval(() => {
	cn(), ++ln >= 60 && clearInterval(un);
}, 500);
o(document.documentElement.lang || navigator.language);
