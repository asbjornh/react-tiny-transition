/* eslint-disable no-console */

function logError(...whatevs) {
  if (process.env.NODE_ENV !== "production") {
    console.error(...whatevs);
  }
}

export function resetClassList(node, classNames) {
  if (node) {
    Object.keys(classNames).forEach(key => {
      node.classList.remove(classNames[key]);
    });
  }
}

export function canAnimate(shouldLogError) {
  const raf = !!(window && window.requestAnimationFrame);
  const classList = !!(document && document.body && document.body.classList);
  const errorMessage = featureName =>
    `TinyTransition: Your browser doesn't support ${featureName}. Consider adding a polyfill.`;

  if (shouldLogError && !raf) {
    logError(errorMessage("requestAnimationFrame"));
  }

  if (shouldLogError && !classList) {
    logError(errorMessage("element.classList"));
  }

  return raf && classList;
}
