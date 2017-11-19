import './chunk';
import Defaults from './defaults';
import { Model } from "./model";
export class Builder {
    private model: any;
    private settings: any;
    constructor(el: Element, options: object) {

        /**
         * Configuration object
         * @member {object}
         * @readonly
         */
        this.settings = Object.extendext(true, 'replace', {}, Defaults.DEFAULTS, options);


        /**
         * Internal model
         * @member {Model}
         * @readonly
         */
        this.model = new Model();
    }
}