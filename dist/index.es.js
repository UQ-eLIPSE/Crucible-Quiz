import { defineComponent as _, ref as k, computed as x, openBlock as s, createElementBlock as a, createElementVNode as y, withModifiers as p, Fragment as m, renderList as B, normalizeStyle as b, toDisplayString as I } from "vue";
const T = ["onDragstart", "onDragend"], z = ["onDragstart", "onDragend"], w = /* @__PURE__ */ _({
  __name: "DraggableBox",
  setup(l) {
    const i = k([
      { id: 0, title: "Item A", list: 1, position: { x: 0, y: 0 } },
      { id: 1, title: "Item B", list: 1, position: { x: 100, y: 0 } },
      { id: 2, title: "Item C", list: 1, position: { x: 200, y: 0 } }
    ]), d = x(() => i.value.filter((e) => e.list === 1)), g = x(() => i.value.filter((e) => e.list === 2));
    let r = null;
    function u(e, n) {
      r = n, e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", n.id.toString());
    }
    function f(e) {
      r = e, r = null;
    }
    function D(e, n) {
      if (e.preventDefault(), r) {
        const t = e.dataTransfer.getData("text/plain"), o = i.value.find((c) => c.id === Number(t));
        if (o) {
          o.list = n;
          const v = e.currentTarget.getBoundingClientRect();
          o.position = {
            x: e.clientX - v.left,
            y: e.clientY - v.top
          };
        }
      }
    }
    return (e, n) => (s(), a("div", null, [
      y("div", {
        class: "drop-zone",
        onDrop: n[0] || (n[0] = (t) => D(t, 1)),
        onDragover: n[1] || (n[1] = p(() => {
        }, ["prevent"])),
        onDragenter: n[2] || (n[2] = p(() => {
        }, ["prevent"]))
      }, [
        (s(!0), a(m, null, B(d.value, (t) => (s(), a("div", {
          key: t.id,
          class: "drag-el",
          style: b({ top: t.position.y + "px", left: t.position.x + "px" }),
          draggable: "true",
          onDragstart: (o) => u(o, t),
          onDragend: (o) => f(t)
        }, I(t.title), 45, T))), 128))
      ], 32),
      y("div", {
        class: "drop-zone",
        onDrop: n[3] || (n[3] = (t) => D(t, 2)),
        onDragover: n[4] || (n[4] = p(() => {
        }, ["prevent"])),
        onDragenter: n[5] || (n[5] = p(() => {
        }, ["prevent"]))
      }, [
        (s(!0), a(m, null, B(g.value, (t) => (s(), a("div", {
          key: t.id,
          class: "drag-el",
          style: b({ top: t.position.y + "px", left: t.position.x + "px" }),
          draggable: "true",
          onDragstart: (o) => u(o, t),
          onDragend: (o) => f(t)
        }, I(t.title), 45, z))), 128))
      ], 32)
    ]));
  }
}), C = (l, i) => {
  const d = l.__vccOpts || l;
  for (const [g, r] of i)
    d[g] = r;
  return d;
}, S = /* @__PURE__ */ C(w, [["__scopeId", "data-v-8c9e9def"]]);
function E(l) {
  l.component("DraggableBox", S);
}
export {
  S as DraggableBox,
  E as quizPlugin
};
