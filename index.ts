export interface main_config {
	stric_mode?: boolean
}

import Mower from "./mower";
import type { directions } from "./point/types";
import Point, { minPoint } from "./point";
import errorTypes from "./errors";

function main(input: string, config = {}) {
	const print = console.log

	return solution(input)

	function solution(data_string: unknown) {
		const { data: parssed_mower_instruction, err } =
			handleInputValidation(data_string)
		if (err) {
			throw err
		}

		const grid_definitions = parssed_mower_instruction[0].split(' ')
		const grid_loan_x = minPoint(grid_definitions[0])
		const grid_loan_y = minPoint(grid_definitions[1])

		let end_pos_of_mower_strings = []
		for (
			let row_in_input_string = 1;
			row_in_input_string < parssed_mower_instruction.length;
			row_in_input_string++
		) {
			const start_loc: string =
				parssed_mower_instruction[row_in_input_string]
			row_in_input_string++
			const mower_instruction: string =
				parssed_mower_instruction[row_in_input_string]

			const directions = {
				NORTH: 'N',
				SOUTH: 'S',
				EAST: 'E',
				WEST: 'W'
			} as directions;
			const [x, y, dir] = start_loc.split(' ')
			const point = new Point(x, y, dir, directions)
			const mower = new Mower(point, grid_loan_x, grid_loan_y, {stric_mode: false})

			const end_point = mower.move(
				mower_instruction,
			)
			let end_point_as_string =
				end_point.x + ' ' + end_point.y + ' ' + end_point.dir + ' \n'
			end_pos_of_mower_strings.push(end_point_as_string)
		}

		return end_pos_of_mower_strings
	}
}

export default main



function handleInputValidation(any_input: unknown): {
	data: string[]
	err: string
} {
	if (typeof any_input !== 'string') {
		return {
			data: null,
			err: errorTypes.input_must_be_of_type_string,
		}
	}

	const valid_grid_size_regex = new RegExp(/^\d{1,}\s\d{1,}\s*?\r?\n/)
	if (!valid_grid_size_regex.test(any_input)) {
		return {
			data: null,
			err: errorTypes.invalid_grid_size_verbose,
		}
	}
	
	const parssed_mower_instruction = any_input
		.split('\n')
		.map(str_line => str_line.trim())
	const start_pos_regex = new RegExp(/\d{1,}\s\d{1,}\s[N,S,E,W]?/)
	const mower_orders_regex = new RegExp(/[L,F,R]*/)
	const invalid_row = parssed_mower_instruction.findIndex((row, idx) => {
		if (idx === 0) return false
		return idx % 2 !== 0
			? !start_pos_regex.test(row) && idx
			: !mower_orders_regex.test(row) && idx
	})

	if (invalid_row > -1) {
		return {
			data: null,
			err:
				invalid_row % 2 === 0
					? errorTypes.invalidStartPos(invalid_row)
					: errorTypes.undefinedDirection(
							parssed_mower_instruction[invalid_row].match(
								/[N,S,E,W]/
							)
					  ),
		}
	}

	return { data: parssed_mower_instruction, err: null }
}


