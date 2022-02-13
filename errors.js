"use strict";
exports.__esModule = true;
var errorTypes = {
    input_must_be_of_type_string: 'input must be of type string',
    invalid_start_pos_or_instruction: 'invalid start position or instruction',
    invalid_grid_size: 'invalid grid size',
    invalid_grid_size_verbose: 'grid size not defined proeprly, use one digit or more space digit and one digit or more',
    invalidStartPos: function (row) {
        return "invalid start position in row ".concat(1 + row);
    },
    invalidOrNegativeNumber: function (v, parsed_v) {
        return "The value ".concat(v, " parsed as ").concat(parsed_v, " and it is not a valid grid point");
    },
    undefined_direction: 'undefined direction',
    undefinedDirection: function (v) {
        return "The value ".concat(v, " is not a valid direction point");
    },
    start_pos_out_of_grid: 'mower out of loan grid in start position'
};
exports["default"] = errorTypes;
