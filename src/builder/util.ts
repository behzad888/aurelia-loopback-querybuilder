export interface IUtil {
    iterateOptions(options: Object | Array<any>, tpl: any);
    fmt(str: string, args: Array<any>): string;
    error();
    changeType(value: any, type: any, boolAsInt: boolean): any;
    escapestring(value: string): string;
    escapeRegExp(str: string): string;
    escapeElementId(str: string): string;
    groupSort(items: Object[], key: string): Object[];
    defineModelProperties(obj: Function, fields: string[]): string[]
};
export class Util implements IUtil {

    /**
     * Iterates over radio/checkbox/selection options, it accept three formats
     *
     * @example
     * // array of values
     * options = ['one', 'two', 'three']
     * @example
     * // simple key-value map
     * options = {1: 'one', 2: 'two', 3: 'three'}
     * @example
     * // array of 1-element maps
     * options = [{1: 'one'}, {2: 'two'}, {3: 'three'}]
     *
     * @param {object|array} options
     * @param {Utils#OptionsIteratee} tpl
     */
    iterateOptions(options: any, tpl: any) {
        if (options) {
            if (Array.isArray(options)) {
                options.forEach(function (entry) {
                    // array of one-element maps
                    if (typeof entry === 'object') {
                        entry.forEach((key, val) => {
                            tpl(key, val);
                            return false; // break after first entry
                        });
                    }
                    // array of values
                    else {
                        tpl(entry, entry);
                    }
                });
            }
            // unordered map
            else {
                options.forEach((key, val) => {
                    tpl(key, val);
                });
            }
        }
    }

    /**
     * Replaces {0}, {1}, ... in a string
     * @param {string} str
     * @param {...*} args
     * @returns {string}
     */
    fmt(str: string, args: any[]): string {
        if (!Array.isArray(args)) {
            args = Array.prototype.slice.call(arguments, 1);
        }

        return str.replace(/{([0-9]+)}/g, function (m, i) {
            return args[parseInt(i)];
        });
    }

    /**
     * Throws an Error object with custom name or logs an error
     * @param {boolean} [doThrow=true]
     * @param {string} type
     * @param {string} message
     * @param {...*} args
     */
    error() {
        var i = 0;
        var doThrow = typeof arguments[i] === 'boolean' ? arguments[i++] : true;
        var type = arguments[i++];
        var message = arguments[i++];
        var args = Array.isArray(arguments[i]) ? arguments[i] : Array.prototype.slice.call(arguments, i);

        if (doThrow) {
            var err = new Error(this.fmt(message, args));
            err.name = type + 'Error';
            throw err;
        }
        else {
            console.error(type + 'Error: ' + this.fmt(message, args));
        }
    }

    /**
     * Changes the type of a value to int, float or bool
     * @param {*} value
     * @param {string} type - 'integer', 'double', 'boolean' or anything else (passthrough)
     * @param {boolean} [boolAsInt=false] - return 0 or 1 for booleans
     * @returns {*}
     */
    changeType(value: any, type: any, boolAsInt: boolean) {
        switch (type) {
            // @formatter:off
            case 'integer': return parseInt(value);
            case 'double': return parseFloat(value);
            case 'boolean':
                var bool = value.trim().toLowerCase() === 'true' || value.trim() === '1' || value === 1;
                return boolAsInt ? (bool ? 1 : 0) : bool;
            default: return value;
            // @formatter:on
        }
    }

    /**
     * Escapes a string like PHP's mysql_real_escape_string does
     * @param {string} value
     * @returns {string}
     */
    escapestring(value: string): string {
        if (typeof value != 'string') {
            return value;
        }

        return value
            .replace(/[\0\n\r\b\\\'\"]/g, function (s) {
                switch (s) {
                    // @formatter:off
                    case '\0': return '\\0';
                    case '\n': return '\\n';
                    case '\r': return '\\r';
                    case '\b': return '\\b';
                    default: return '\\' + s;
                    // @formatter:off
                }
            })
            // uglify compliant
            .replace(/\t/g, '\\t')
            .replace(/\x1a/g, '\\Z');
    }

    /**
     * Escapes a string for use in regex
     * @param {string} str
     * @returns {string}
     */
    escapeRegExp(str: string): string {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }

    /**
     * Escapes a string for use in HTML element id
     * @param {string} str
     * @returns {string}
     */
    escapeElementId(str: string): string {
        // Regex based on that suggested by:
        // https://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
        // - escapes : . [ ] ,
        // - avoids escaping already escaped values
        return (str) ? str.replace(/(\\)?([:.\[\],])/g,
            function ($0, $1, $2) { return $1 ? $0 : '\\' + $2; }) : str;
    }

    /**
     * Sorts objects by grouping them by `key`, preserving initial order when possible
     * @param {object[]} items
     * @param {string} key
     * @returns {object[]}
     */
    groupSort(items: Object[], key: string): Object[] {
        var optgroups = [];
        var newItems = [];

        items.forEach(function (item) {
            var idx;

            if (item[key]) {
                idx = optgroups.lastIndexOf(item[key]);

                if (idx == -1) {
                    idx = optgroups.length;
                }
                else {
                    idx++;
                }
            }
            else {
                idx = optgroups.length;
            }

            optgroups.splice(idx, 0, item[key]);
            newItems.splice(idx, 0, item);
        });

        return newItems;
    }

    /**
     * Defines properties on an Node prototype with getter and setter.<br>
     *     Update events are emitted in the setter through root Model (if any).<br>
     *     The object must have a `__` object, non enumerable property to store values.
     * @param {function} obj
     * @param {string[]} fields
     */
    defineModelProperties(obj: Function, fields: Array<string>): any {
        fields.forEach(function (field) {
            Object.defineProperty(obj.prototype, field, {
                enumerable: true,
                get: function () {
                    return this.__[field];
                },
                set: function (value) {
                    var previousValue = (this.__[field] !== null && typeof this.__[field] == 'object') ?
                        Object.assign({}, this.__[field]) :
                        this.__[field];

                    this.__[field] = value;

                    if (this.model !== null) {
                        /**
                         * After a value of the model changed
                         * @event model:update
                         * @memberof Model
                         * @param {Node} node
                         * @param {string} field
                         * @param {*} value
                         * @param {*} previousValue
                         */
                        this.model.trigger('update', this, field, value, previousValue);
                    }
                }
            });
        });
    }

}