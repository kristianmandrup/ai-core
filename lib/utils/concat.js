function uniq(target, source, key) {
  if (source[key]) {
    target[key] = target[key].concat(source[key]);
    target[key] = _.uniqBy(target[key], (item) => {
      return item.name || item;
    });
  } else {
    // no such key
  }
  return target;
}

function uniqKeys(target, source, keys) {
  if (Array.isArray(keys)) {
    keys.forEach(key => {
      target = uniq(target, source, key)
    })
    return target;
  } else {
    return uniq(target, source, key);
  }
}

module.exports = {
  uniqKeys: uniqKeys,
  uniq: uniq
}