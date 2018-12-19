"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils;
(function (Utils) {
    Utils.getRealDate = function (msgDate) {
        return new Date(1000 * msgDate);
    };
})(Utils = exports.Utils || (exports.Utils = {}));
