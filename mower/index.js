"use strict";
exports.__esModule = true;
var errors_1 = require("../errors");
var Mower = /** @class */ (function () {
    function Mower(pos, grid_x, grid_y, config) {
        var _this = this;
        this.pos = pos;
        this.grid_x = grid_x;
        this.grid_y = grid_y;
        this.config = config;
        this.directions = {
            // FORWARD: 'F',
            // LEFT: 'L',
            // RIGHT: 'R',
            NORTH: 'N',
            SOUTH: 'S',
            EAST: 'E',
            WEST: 'W'
        };
        this.move = function (instructions) {
            /** @note: maybe already parsed by the regex validation function  named handleInputValidation
             * but mostly used for the typescript type reference
             */
            var parsed_start_x = _this.pos.x;
            var parsed_start_y = _this.pos.y;
            var paresed_start_dir = _this.pos.dir;
            if (parsed_start_x > _this.grid_x || parsed_start_y > _this.grid_y) {
                if (_this.config.stric_mode) {
                    throw Error(errors_1["default"].start_pos_out_of_grid);
                }
                else {
                    /** @note: no movment, just return starting point */
                    return { x: _this.pos.x, y: _this.pos.y, dir: _this.pos.dir };
                }
            }
            var curr_x = parsed_start_x, curr_y = parsed_start_y, curr_dir = paresed_start_dir;
            for (var _i = 0, _a = instructions.split(''); _i < _a.length; _i++) {
                var order = _a[_i];
                if (order === _this.movments.FORWARD &&
                    _this.isInsideGridAreaAfterMovement({ max_x: _this.grid_x, max_y: _this.grid_y }, { x: curr_x, y: curr_y, dir: curr_dir }, _this.directions)) {
                    var _b = _this.calcMovmentByDirection(curr_x, curr_y, curr_dir, _this.directions), x = _b.x, y = _b.y;
                    curr_x = x;
                    curr_y = y;
                }
                else if (order !== _this.movments.FORWARD) {
                    curr_dir = _this.calcNextDirByLeftAndRight(order, curr_dir, _this.directions);
                }
            }
            return { x: curr_x, y: curr_y, dir: curr_dir };
        };
        this.pos = pos;
        this.grid_x = grid_x;
        this.grid_y = grid_y;
        this.config = config;
        this.movments = {
            FORWARD: 'F',
            LEFT: 'L',
            RIGHT: 'R'
        };
    }
    Mower.prototype.isInsideGridArea = function (max_x, max_y, x, y) {
        return x <= max_x && y <= max_y && x >= 0 && y >= 0;
    };
    Mower.prototype.calcMovmentByDirection = function (x, y, dir, directions) {
        switch (dir) {
            case directions.NORTH:
                y = +y + 1;
                break;
            case directions.SOUTH:
                y = +y - 1;
                break;
            case directions.EAST:
                x = +x + 1;
                break;
            case directions.WEST:
                x = +x - 1;
                break;
        }
        return { x: x, y: y };
    };
    Mower.prototype.isInsideGridAreaAfterMovement = function (grid, curr_point, directions) {
        var _a = this.calcMovmentByDirection(curr_point.x, curr_point.y, curr_point.dir, directions), x = _a.x, y = _a.y;
        return this.isInsideGridArea(grid.max_x, grid.max_y, x, y);
    };
    Mower.prototype.calcNextDirByLeftAndRight = function (left_or_right, curr_dir, directions) {
        var new_dir;
        switch (curr_dir) {
            case directions.NORTH:
                new_dir =
                    left_or_right === this.movments.LEFT
                        ? directions.WEST
                        : directions.EAST;
                break;
            case directions.SOUTH:
                new_dir =
                    left_or_right === this.movments.LEFT
                        ? directions.EAST
                        : directions.WEST;
                break;
            case directions.EAST:
                new_dir =
                    left_or_right === this.movments.LEFT
                        ? directions.NORTH
                        : directions.SOUTH;
                break;
            case directions.WEST:
                new_dir =
                    left_or_right === this.movments.LEFT
                        ? directions.SOUTH
                        : directions.NORTH;
                break;
        }
        return new_dir;
    };
    return Mower;
}());
exports["default"] = Mower;
