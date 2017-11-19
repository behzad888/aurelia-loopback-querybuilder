interface Object {
    extendext(...any): any
}
Object.extendext = function () {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        arrayMode = 'default';

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i++] || {};
    }

    // Handle array mode parameter
    if (typeof target === "string") {
        arrayMode = target.toLowerCase();
        if (arrayMode !== 'concat' && arrayMode !== 'replace' && arrayMode !== 'extend') {
            arrayMode = 'default';
        }

        // Skip the string param
        target = arguments[i++] || {};
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && typeof target === 'function') {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) !== null) {
            // Special operations for arrays
            if (Array.isArray(options) && arrayMode !== 'default') {
                clone = target && Array.isArray(target) ? target : [];

                switch (arrayMode) {
                    case 'concat':
                        target = clone.concat(Object.assign(deep, [], options));
                        break;

                    case 'replace':
                        target = Object.assign(deep, [], options);
                        break;

                    case 'extend':
                        options.forEach(function (e, i) {
                            if (typeof e === 'object') {
                                var type = Array.isArray(e) ? [] : {};
                                clone[i] = Object.extendext(deep, arrayMode, clone[i] || type, e);

                            } else if (clone.indexOf(e) === -1) {
                                clone.push(e);
                            }
                        });

                        target = clone;
                        break;
                }

            } else {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (typeof copy === 'object' ||
                        (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];

                        } else {
                            clone = src && typeof src === 'object' ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = Object.extendext(deep, arrayMode, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
    }

    // Return the modified object
    return target;
}
