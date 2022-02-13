"use strict";
exports.__esModule = true;
var mower_1 = require("./mower");
var point_1 = require("./point");
var errors_1 = require("./errors");
function main(input, config) {
    if (config === void 0) { config = {}; }
    var print = console.log;
    return solution(input);
    function solution(data_string) {
        var _a = handleInputValidation(data_string), parssed_mower_instruction = _a.data, err = _a.err;
        if (err) {
            throw err;
        }
        var grid_definitions = parssed_mower_instruction[0].split(' ');
        var grid_loan_x = (0, point_1.minPoint)(grid_definitions[0]);
        var grid_loan_y = (0, point_1.minPoint)(grid_definitions[1]);
        var end_pos_of_mower_strings = [];
        for (var row_in_input_string = 1; row_in_input_string < parssed_mower_instruction.length; row_in_input_string++) {
            var start_loc = parssed_mower_instruction[row_in_input_string];
            row_in_input_string++;
            var mower_instruction = parssed_mower_instruction[row_in_input_string];
            var directions = {
                NORTH: 'N',
                SOUTH: 'S',
                EAST: 'E',
                WEST: 'W'
            };
            var _b = start_loc.split(' '), x = _b[0], y = _b[1], dir = _b[2];
            var point = new point_1["default"](x, y, dir, directions);
            var mower = new mower_1["default"](point, grid_loan_x, grid_loan_y, { stric_mode: false });
            var end_point = mower.move(mower_instruction);
            var end_point_as_string = end_point.x + ' ' + end_point.y + ' ' + end_point.dir + ' \n';
            end_pos_of_mower_strings.push(end_point_as_string);
        }
        return end_pos_of_mower_strings;
    }
}
exports["default"] = main;
function handleInputValidation(any_input) {
    if (typeof any_input !== 'string') {
        return {
            data: null,
            err: errors_1["default"].input_must_be_of_type_string
        };
    }
    var valid_grid_size_regex = new RegExp(/^\d{1,}\s\d{1,}\s*?\r?\n/);
    if (!valid_grid_size_regex.test(any_input)) {
        return {
            data: null,
            err: errors_1["default"].invalid_grid_size_verbose
        };
    }
    var parssed_mower_instruction = any_input
        .split('\n')
        .map(function (str_line) { return str_line.trim(); });
    var start_pos_regex = new RegExp(/\d{1,}\s\d{1,}\s[N,S,E,W]?/);
    var mower_orders_regex = new RegExp(/[L,F,R]*/);
    var invalid_row = parssed_mower_instruction.findIndex(function (row, idx) {
        if (idx === 0)
            return false;
        return idx % 2 !== 0
            ? !start_pos_regex.test(row) && idx
            : !mower_orders_regex.test(row) && idx;
    });
    if (invalid_row > -1) {
        return {
            data: null,
            err: invalid_row % 2 === 0
                ? errors_1["default"].invalidStartPos(invalid_row)
                : errors_1["default"].undefinedDirection(parssed_mower_instruction[invalid_row].match(/[N,S,E,W]/))
        };
    }
    return { data: parssed_mower_instruction, err: null };
}
