"use strict";
exports.__esModule = true;
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
        var grid_loan_x = minPoint(grid_definitions[0]);
        var grid_loan_y = minPoint(grid_definitions[1]);
        var end_pos_of_mower_strings = [];
        for (var row_in_input_string = 1; row_in_input_string < parssed_mower_instruction.length; row_in_input_string++) {
            var start_loc = parssed_mower_instruction[row_in_input_string];
            row_in_input_string++;
            var mower_instruction = parssed_mower_instruction[row_in_input_string];
            var end_point = calcMownMove(start_loc, mower_instruction, grid_loan_x, grid_loan_y, config);
            var end_point_as_string = end_point.x + ' ' + end_point.y + ' ' + end_point.dir + ' \n';
            end_pos_of_mower_strings.push(end_point_as_string);
        }
        return end_pos_of_mower_strings;
    }
}
exports["default"] = main;
function calcMownMove(start, instructions, grid_x, grid_y, config) {
    var directions = {
        FORWARD: 'F',
        LEFT: 'L',
        RIGHT: 'R',
        NORTH: 'N',
        SOUTH: 'S',
        EAST: 'E',
        WEST: 'W'
    };
    var _a = start.split(' '), start_x = _a[0], start_y = _a[1], start_dir = _a[2];
    /** @note: maybe already parsed by the regex validation function  named handleInputValidation
     * but mostly used for the typescript type reference
     */
    var parsed_start_x = minPoint(start_x);
    var parsed_start_y = minPoint(start_y);
    var paresed_start_dir = allowedDirections(start_dir, directions);
    if (parsed_start_x > grid_x || parsed_start_y > grid_y) {
        if (config.stric_mode) {
            throw Error(errorTypes.start_pos_out_of_grid);
        }
        else {
            /** @note: no movment, just return starting point */
            return { x: start_x, y: start_y, dir: start_dir };
        }
    }
    var curr_x = parsed_start_x, curr_y = parsed_start_y, curr_dir = paresed_start_dir;
    for (var _i = 0, _b = instructions.split(''); _i < _b.length; _i++) {
        var order = _b[_i];
        if (order === directions.FORWARD &&
            isInsideGridAreaAfterMovement({ max_x: grid_x, max_y: grid_y }, { x: curr_x, y: curr_y, dir: curr_dir }, directions)) {
            var _c = calcMovmentByDirection(curr_x, curr_y, curr_dir, directions), x = _c.x, y = _c.y;
            curr_x = x;
            curr_y = y;
        }
        else if (order !== directions.FORWARD) {
            curr_dir = calcNextDirByLeftAndRight(order, curr_dir, directions);
        }
    }
    return { x: curr_x, y: curr_y, dir: curr_dir };
}
function isInsideGridArea(max_x, max_y, x, y) {
    return x <= max_x && y <= max_y && x >= 0 && y >= 0;
}
function calcMovmentByDirection(x, y, dir, directions) {
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
}
function isInsideGridAreaAfterMovement(grid, curr_point, directions) {
    var _a = calcMovmentByDirection(curr_point.x, curr_point.y, curr_point.dir, directions), x = _a.x, y = _a.y;
    return isInsideGridArea(grid.max_x, grid.max_y, x, y);
}
function calcNextDirByLeftAndRight(left_or_right, curr_dir, directions) {
    var new_dir;
    switch (curr_dir) {
        case directions.NORTH:
            new_dir =
                left_or_right === directions.LEFT
                    ? directions.WEST
                    : directions.EAST;
            break;
        case directions.SOUTH:
            new_dir =
                left_or_right === directions.LEFT
                    ? directions.EAST
                    : directions.WEST;
            break;
        case directions.EAST:
            new_dir =
                left_or_right === directions.LEFT
                    ? directions.NORTH
                    : directions.SOUTH;
            break;
        case directions.WEST:
            new_dir =
                left_or_right === directions.LEFT
                    ? directions.SOUTH
                    : directions.NORTH;
            break;
    }
    return new_dir;
}
function handleInputValidation(any_input) {
    if (typeof any_input !== 'string') {
        return {
            data: null,
            err: errorTypes.input_must_be_of_type_string
        };
    }
    var valid_grid_size_regex = new RegExp(/^\d{1,}\s\d{1,}\s*?\r?\n/);
    if (!valid_grid_size_regex.test(any_input)) {
        return {
            data: null,
            err: errorTypes.invalid_grid_size_verbose
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
                ? errorTypes.invalidStartPos(invalid_row)
                : errorTypes.undefinedDirection(parssed_mower_instruction[invalid_row].match(/[N,S,E,W]/))
        };
    }
    return { data: parssed_mower_instruction, err: null };
}
var minPoint = function (value) {
    var number = +value;
    if ((!number && number !== 0) || number < 0) {
        throw new Error(errorTypes.invalidOrNegativeNumber(value, number));
    }
    return number;
};
var allowedDirections = function (value, allowed_directions) {
    if (!Object.values(allowed_directions).includes(value)) {
        var error_direction = new Error(errorTypes.undefinedDirection(value));
        error_direction.name = errorTypes.undefined_direction;
        throw error_direction;
    }
    return value;
};
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
