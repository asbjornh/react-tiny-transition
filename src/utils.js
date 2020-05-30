// NOTE: DOMTokenList errors out when passed empty strings (which can happen when splitting by a single space and there's multiple spaces, tabs etc)
const toList = classes => (classes || "").split(/\s+/g);

// NOTE: Internet Explorer does not support multiple arguments to `DOMTokenList.add`
export function addClasses(node, classString) {
  if (!node) return;
  toList(classString).forEach(className => node.classList.add(className));
}

// NOTE: Internet Explorer does not support multiple arguments to `DOMTokenList.remove`
export function resetClassList(node, classNames) {
  if (!node) return;
  Object.values(classNames || {}).forEach(value => {
    toList(value).forEach(className => node.classList.remove(className));
  });
}

export function canAnimate() {
  const raf = !!(window && window.requestAnimationFrame);
  const classList = !!(document && document.body && document.body.classList);
  return raf && classList;
}
