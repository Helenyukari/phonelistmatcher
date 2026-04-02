const { normalize } = require('./normalizer');

function compare(rawListA, rawListB) {
  const mapA = new Map();
  const mapB = new Map();

  rawListA.forEach(num => mapA.set(normalize(num), num));
  rawListB.forEach(num => mapB.set(normalize(num), num));

  const setA = new Set(mapA.keys());
  const setB = new Set(mapB.keys());

  const matching = [];
  const missing = [];
  const extra = [];

  for (const key of setA) {
    if (setB.has(key)) {
      matching.push({ normalized: key, originalA: mapA.get(key), originalB: mapB.get(key) });
    } else {
      missing.push({ normalized: key, original: mapA.get(key) });
    }
  }

  for (const key of setB) {
    if (!setA.has(key)) {
      extra.push({ normalized: key, original: mapB.get(key) });
    }
  }

  return {
    matching,
    missing,
    extra,
    summary: {
      totalA: setA.size,
      totalB: setB.size,
      correspondentes: matching.length,
      ausentes: missing.length,
      extras: extra.length,
    },
  };
}

module.exports = { compare };
