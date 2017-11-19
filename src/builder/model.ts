import $ from 'jquery';
export class Model {
    $: any;
    root: any;
    constructor() {
        this.root = null;
        this.$ = $(this);
    }

    /**
     * Triggers an event on the model
     * @param {string} type
     * @returns {$.Event}
     */
    trigger(type: string) {
        var event = new $.Event(type);
        this.$.triggerHandler(event, Array.prototype.slice.call(arguments, 1));
        return event;
    }
    /**
   * Attaches an event listener on the model
   * @param {string} type
   * @param {function} cb
   * @returns {Model}
   */
    on() {
        this.$.on.apply(this.$, Array.prototype.slice.call(arguments));
        return this;
    }

    /**
     * Removes an event listener from the model
     * @param {string} type
     * @param {function} [cb]
     * @returns {Model}
     */
    off() {
        this.$.off.apply(this.$, Array.prototype.slice.call(arguments));
        return this;
    }

    /**
     * Attaches an event listener called once on the model
     * @param {string} type
     * @param {function} cb
     * @returns {Model}
     */
    once() {
        this.$.one.apply(this.$, Array.prototype.slice.call(arguments));
        return this;
    }
}