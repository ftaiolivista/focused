import { prop, index } from "./lens";
import { maybeProp } from "./traversal";
import { compose2, set, over, preview } from "./operations";

// idLens : SimpleLens<S,S>
export function idLens(_, f, s) {
  return f(s);
}

/**
 *  returns a Proxy object for easing creation & composition of optics
 *
 *  const _ = lensProxy()
 *  _.name          <=>     prop("name")
 *  _.todo.title    <=>     compose(prop("todo"), prop("title"))
 *
 *  For convenience, safe access to non existing is provided by perfixng the prop name with '$'
 *
 * _.$name          <=>     maybeProp("name")
 *
 * You can also insert other optics usin '$' method of the proxy lensProxy, for example
 *
 *  _.todos.$(each).title   <=>    compose(prop("todos"), each, prop("title"))
 *
 * is a traversal that focuses on all titles of the todo array
 */

function getOrCreateLens(memo, parent, key) {
  let l = memo.get(key);
  if (l == null) {
    let child;
    const num = Number(key);
    if (String(num) === key) {
      child = index(num);
    } else if (key[0] === "$") {
      child = maybeProp(key.slice(1));
    } else {
      child = prop(key);
    }
    l = lensProxy(compose2(parent, child));
    memo.set(key, l);
  }
  return l;
}

function setOrCreateSetter(memo, getter) {
  let l = memo.get(getter);
  if (l == null) {
    l = set(getter);
    memo.set(getter, l);
  }
  return l;
}

function overOrCreateSetter(memo, getter) {
  let l = memo.get(getter);
  if (l == null) {
    l = over(getter);
    memo.set(getter, l);
  }
  return l;
}

function previewOrCreateSetter(memo, getter) {
  let l = memo.get(getter);
  if (l == null) {
    l = preview(getter);
    memo.set(getter, l);
  }
  return l;
}

export function lensProxy(parent = idLens) {
  const memo = new Map();
  const setterMemo = new Map();
  const overMemo = new Map();
  const previewMemo = new Map();
  return new Proxy(() => {}, {
    get(target, key) {
      if (key === "$") {
        return child => {
          return lensProxy(compose2(parent, child));
        };
      }
      if (key === "_") {
        return setOrCreateSetter(setterMemo, parent);
      }
      if (key === "ø") {
        return overOrCreateSetter(overMemo, parent);
      }
      if (key === "µ") {
        return previewOrCreateSetter(previewMemo, parent);
      }
      return getOrCreateLens(memo, parent, key);
    },
    apply(target, thiz, [F, f, s]) {
      return parent(F, f, s);
    }
  });
}
