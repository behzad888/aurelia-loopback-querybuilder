export class Node {
    __: any;
    parent: any;
    model: any;
    id: any;
    $el: any;
    data: any;
    flags: {
    };
    error: any;
    level: number;
    constructor(parent, $el) {
        if (!(this instanceof Node)) {
            return new Node(parent, $el);
        }

        Object.defineProperty(this, '__', { value: {} });

        $el.data('queryBuilderModel', this);

        /**
         * @name level
         * @member {int}
         * @memberof Node
         * @instance
         * @readonly
         */
        this.__.level = 1;

        /**
         * @name error
         * @member {string}
         * @memberof Node
         * @instance
         */
        this.error = null;

        /**
         * @name flags
         * @member {object}
         * @memberof Node
         * @instance
         * @readonly
         */
        this.flags = {};

        /**
         * @name data
         * @member {object}
         * @memberof Node
         * @instance
         */
        this.data = undefined;

        /**
         * @member {jQuery}
         * @readonly
         */
        this.$el = $el;

        /**
         * @member {string}
         * @readonly
         */
        this.id = $el[0].id;

        /**
         * @member {Model}
         * @readonly
         */
        this.model = null;

        /**
         * @member {Group}
         * @readonly
         */
        this.parent = parent;

        Object.defineProperty(Node.prototype, 'parent', {
            enumerable: true,
            get: function () {
                return this.parent;
            },
            set: function (value) {
                this.parent = value;
                this.level = value === null ? 1 : value.level + 1;
                this.model = value === null ? null : value.model;
            }
        });
    }

    /**
   * Checks if this Node is the root
   * @returns {boolean}
   */
    isRoot() {
        return (this.level === 1);
    };

    /**
     * Returns the node position inside its parent
     * @returns {int}
     */
    getPos() {
        if (this.isRoot()) {
            return -1;
        }
        else {
            return this.parent.getNodePos(this);
        }
    };

    /**
     * Deletes self
     * @fires Model.model:drop
     */
    drop() {
        var model = this.model;

        if (!!this.parent) {
            this.parent.removeNode(this);
        }

        this.$el.removeData('queryBuilderModel');

        if (model !== null) {
            /**
             * After a node of the model has been removed
             * @event model:drop
             * @memberof Model
             * @param {Node} node
             */
            model.trigger('drop', this);
        }
    };

    /**
     * Moves itself after another Node
     * @param {Node} target
     * @fires Model.model:move
     */
    moveAfter(target) {
        if (!this.isRoot()) {
            this.move(target.parent, target.getPos() + 1);
        }
    };

    /**
     * Moves itself at the beginning of parent or another Group
     * @param {Group} [target]
     * @fires Model.model:move
     */
    moveAtBegin(target) {
        if (!this.isRoot()) {
            if (target === undefined) {
                target = this.parent;
            }

            this.move(target, 0);
        }
    };

    /**
     * Moves itself at the end of parent or another Group
     * @param {Group} [target]
     * @fires Model.model:move
     */
    moveAtEnd(target) {
        if (!this.isRoot()) {
            if (target === undefined) {
                target = this.parent;
            }

            this.move(target, target.length() === 0 ? 0 : target.length() - 1);
        }
    };

    /**
     * Moves itself at specific position of Group
     * @param {Group} target
     * @param {int} index
     * @fires Model.model:move
     */
    move(target, index) {
        if (!this.isRoot()) {
            if (typeof target === 'number') {
                index = target;
                target = this.parent;
            }

            this.parent.removeNode(this);
            target.insertNode(this, index, false);

            if (this.model !== null) {
                /**
                 * After a node of the model has been moved
                 * @event model:move
                 * @memberof Model
                 * @param {Node} node
                 * @param {Node} target
                 * @param {int} index
                 */
                this.model.trigger('move', this, target, index);
            }
        }
    };

}