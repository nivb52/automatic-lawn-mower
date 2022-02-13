"use strict";
exports.__esModule = true;
exports.minPoint = void 0;
var errors_1 = require("../errors");
var point = /** @class */ (function () {
    function point(x, y, dir, allowed_directions) {
        this.minPoint = function (value) {
            var number = +value;
            if ((!number && number !== 0) || number < 0) {
                throw new Error(errors_1["default"].invalidOrNegativeNumber(value, number));
            }
            return number;
        };
        this.allowedDirections = function (value, allowed_directions) {
            if (!Object.values(allowed_directions).includes(value)) {
                var error_direction = new Error(errors_1["default"].undefinedDirection(value));
                error_direction.name = errors_1["default"].undefined_direction;
                throw error_direction;
            }
            return value;
        };
        this.x = this.minPoint(x);
        this.y = this.minPoint(y);
        this.allowed_directions = allowed_directions;
        this.dir = this.allowedDirections(dir, this.allowed_directions);
    }
    return point;
}());
exports["default"] = point;
var minPoint = function (value) {
    var number = +value;
    if ((!number && number !== 0) || number < 0) {
        throw new Error(errors_1["default"].invalidOrNegativeNumber(value, number));
    }
    return number;
};
exports.minPoint = minPoint;
