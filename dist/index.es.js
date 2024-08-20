import { defineComponent as B, openBlock as p, createElementBlock as u, Fragment as f, renderList as T, normalizeStyle as k, toDisplayString as m, createElementVNode as n, ref as I, computed as y, withModifiers as c, createVNode as b, createTextVNode as w, pushScopeId as z, popScopeId as E } from "vue";
const N = /* @__PURE__ */ n("h3", null, "Draggable item", -1), C = ["onDragstart", "onDragend"], S = /* @__PURE__ */ B({
  __name: "DragItems",
  props: {
    itemList: {}
  },
  emits: ["start-drag", "end-drag"],
  setup(o, { emit: i }) {
    const s = i;
    return (d, a) => (p(), u(f, null, [
      N,
      (p(!0), u(f, null, T(d.itemList, (l) => (p(), u("div", {
        key: l.id,
        class: "drag-el",
        style: k({ top: l.position.y + "px", left: l.position.x + "px" }),
        draggable: "true",
        onDragstart: (g) => s("start-drag", { event: g, item: l }),
        onDragend: (g) => s("end-drag", l)
      }, m(l.title), 45, C))), 128))
    ], 64));
  }
}), L = (o) => (z("data-v-d7b5c0f5"), o = o(), E(), o), P = { class: "dropped-item-area" }, V = /* @__PURE__ */ L(() => /* @__PURE__ */ n("tr", null, [
  /* @__PURE__ */ n("th", null, "Item Id"),
  /* @__PURE__ */ n("th", null, "Item Title"),
  /* @__PURE__ */ n("th", null, "Item Position")
], -1)), Z = /* @__PURE__ */ B({
  __name: "DraggableBox",
  setup(o) {
    const i = I([
      { id: 0, title: "Item A", list: 1, position: { x: 0, y: 0 } },
      { id: 1, title: "Item B", list: 1, position: { x: 100, y: 0 } },
      { id: 2, title: "Item C", list: 1, position: { x: 200, y: 0 } }
    ]), s = y(() => i.value.filter((e) => e.list === 1)), d = y(() => i.value.filter((e) => e.list === 2)), a = I(null);
    function l({ event: e, item: t }) {
      a.value = t, e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", t.id.toString());
    }
    function g(e) {
      a.value = e, a.value = null;
    }
    function v(e, t) {
      if (e.preventDefault(), a.value) {
        const r = e.dataTransfer.getData("text/plain"), D = i.value.find((_) => _.id === Number(r));
        if (D) {
          D.list = t;
          const x = e.currentTarget.getBoundingClientRect();
          D.position = {
            x: e.clientX - x.left,
            y: e.clientY - x.top
          };
        }
      }
    }
    return (e, t) => (p(), u("div", null, [
      n("div", {
        class: "drop-zone",
        onDrop: t[0] || (t[0] = (r) => v(r, 1)),
        onDragover: t[1] || (t[1] = c(() => {
        }, ["prevent"])),
        onDragenter: t[2] || (t[2] = c(() => {
        }, ["prevent"]))
      }, [
        b(S, {
          "item-list": s.value,
          onStartDrag: l,
          onEndDrag: g
        }, null, 8, ["item-list"])
      ], 32),
      n("div", P, [
        n("div", {
          class: "drop-zone",
          onDrop: t[3] || (t[3] = (r) => v(r, 2)),
          onDragover: t[4] || (t[4] = c(() => {
          }, ["prevent"])),
          onDragenter: t[5] || (t[5] = c(() => {
          }, ["prevent"]))
        }, [
          b(S, {
            "item-list": d.value,
            onStartDrag: l,
            onEndDrag: g
          }, null, 8, ["item-list"])
        ], 32),
        n("div", null, [
          w("Item Position In Drop Zone 2 "),
          n("table", null, [
            V,
            (p(!0), u(f, null, T(d.value, (r) => (p(), u("tr", {
              key: r.id
            }, [
              n("td", null, m(r.id), 1),
              n("td", null, m(r.title), 1),
              n("td", null, m(r.position), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}), $ = (o, i) => {
  const s = o.__vccOpts || o;
  for (const [d, a] of i)
    s[d] = a;
  return s;
}, A = /* @__PURE__ */ $(Z, [["__scopeId", "data-v-d7b5c0f5"]]);
function h(o) {
  o.component("DraggableBox", A);
}
export {
  A as DraggableBox,
  h as quizPlugin
};
