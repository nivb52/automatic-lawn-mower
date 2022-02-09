export interface main_config {
	stric_mode?: boolean
}

interface directions {
	FORWARD: string
	LEFT: string
	RIGHT: string
	NORTH: allowedDirection
	SOUTH: allowedDirection
	EAST: allowedDirection
	WEST: allowedDirection
}

type direction =
	| directions['NORTH']
	| directions['SOUTH']
	| directions['WEST']
	| directions['EAST']

interface point {
	x: gridMinimumPoint
	y: gridMinimumPoint
	dir: direction
}

interface grid {
	max_x: gridMinimumPoint
	max_y: gridMinimumPoint
}

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

			const end_point = calcMownMove(
				start_loc,
				mower_instruction,
				grid_loan_x,
				grid_loan_y,
				config
			)
			let end_point_as_string =
				end_point.x + ' ' + end_point.y + ' ' + end_point.dir + ' \n'
			end_pos_of_mower_strings.push(end_point_as_string)
		}

		return end_pos_of_mower_strings
	}
}

export default main

interface calcMownMove_config {
	stric_mode?: boolean
}

function calcMownMove(
	start: string,
	instructions: string,
	grid_x: gridMinimumPoint,
	grid_y: gridMinimumPoint,
	config: calcMownMove_config
) {
	const directions = {
		FORWARD: 'F',
		LEFT: 'L',
		RIGHT: 'R',
		NORTH: 'N',
		SOUTH: 'S',
		EAST: 'E',
		WEST: 'W',
	} as directions


	const [start_x, start_y, start_dir] = start.split(' ')
	/** @note: maybe already parsed by the regex validation function  named handleInputValidation
	 * but mostly used for the typescript type reference
	 */
	const parsed_start_x = minPoint(start_x)
	const parsed_start_y = minPoint(start_y)
	const paresed_start_dir = allowedDirections(start_dir, directions)

	if (parsed_start_x > grid_x || parsed_start_y > grid_y) {
		if (config.stric_mode) {
			throw Error(errorTypes.start_pos_out_of_grid)
		} else {
			/** @note: no movment, just return starting point */
			return { x: start_x, y: start_y, dir: start_dir }
		}
	}

	let curr_x = parsed_start_x,
		curr_y = parsed_start_y,
		curr_dir = paresed_start_dir
	for (let order of instructions.split('')) {
		if (
			order === directions.FORWARD &&
			isInsideGridAreaAfterMovement(
				{ max_x: grid_x, max_y: grid_y },
				{ x: curr_x, y: curr_y, dir: curr_dir },
				directions
			)
		) {
			const { x, y } = calcMovmentByDirection(
				curr_x,
				curr_y,
				curr_dir,
				directions
			)
			curr_x = x as gridMinimumPoint
			curr_y = y as gridMinimumPoint
		} else if (order !== directions.FORWARD) {
			curr_dir = calcNextDirByLeftAndRight(order, curr_dir, directions)
		}
	}

	return { x: curr_x, y: curr_y, dir: curr_dir }
}

function isInsideGridArea(
	max_x: number,
	max_y: number,
	x: number,
	y: number
): boolean {
	return x <= max_x && y <= max_y && x >= 0 && y >= 0
}

function calcMovmentByDirection(
	x: number,
	y: number,
	dir: string,
	directions: directions
): { x: number | gridMinimumPoint; y: number | gridMinimumPoint } {
	switch (dir) {
		case directions.NORTH:
			y = +y + 1
			break
		case directions.SOUTH:
			y = +y - 1
			break
		case directions.EAST:
			x = +x + 1
			break
		case directions.WEST:
			x = +x - 1
			break
	}

	return { x, y }
}

function isInsideGridAreaAfterMovement(
	grid: grid,
	curr_point: point,
	directions: directions
): boolean {
	const { x, y } = calcMovmentByDirection(
		curr_point.x,
		curr_point.y,
		curr_point.dir,
		directions
	)

	return isInsideGridArea(grid.max_x, grid.max_y, x, y)
}

function calcNextDirByLeftAndRight(
	left_or_right: string,
	curr_dir: direction,
	directions: directions
): allowedDirection {
	let new_dir: allowedDirection
	switch (curr_dir) {
		case directions.NORTH:
			new_dir =
				left_or_right === directions.LEFT
					? directions.WEST
					: directions.EAST
			break
		case directions.SOUTH:
			new_dir =
				left_or_right === directions.LEFT
					? directions.EAST
					: directions.WEST
			break
		case directions.EAST:
			new_dir =
				left_or_right === directions.LEFT
					? directions.NORTH
					: directions.SOUTH
			break
		case directions.WEST:
			new_dir =
				left_or_right === directions.LEFT
					? directions.SOUTH
					: directions.NORTH
			break
	}
	return new_dir
}

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

type gridMinimumPoint = number & { _type_: 'gridMinimumPoint' }

const minPoint = (value: number | string): gridMinimumPoint => {
	let number = +value
	if ((!number && number !== 0) || number < 0) {
		throw new Error(errorTypes.invalidOrNegativeNumber(value, number))
	}

	return number as gridMinimumPoint
}

type allowedDirection = string & { _type_: 'allowedDirection' }

const allowedDirections = (
	value: unknown,
	allowed_directions: directions
): allowedDirection => {
	if (!Object.values(allowed_directions).includes(value)) {
		const error_direction = new Error(errorTypes.undefinedDirection(value))
		error_direction.name = errorTypes.undefined_direction
		throw error_direction
	}

	return value as allowedDirection
}

const errorTypes = {
	input_must_be_of_type_string: 'input must be of type string',
	invalid_start_pos_or_instruction: 'invalid start position or instruction',
	invalid_grid_size: 'invalid grid size',
	invalid_grid_size_verbose:
		'grid size not defined proeprly, use one digit or more space digit and one digit or more',
	invalidStartPos: (row: number) =>
		`invalid start position in row ${1 + row}`,
	invalidOrNegativeNumber: (v: string | number, parsed_v) =>
		`The value ${v} parsed as ${parsed_v} and it is not a valid grid point`,
	undefined_direction: 'undefined direction',
	undefinedDirection: (v: unknown) =>
		`The value ${v} is not a valid direction point`,
	start_pos_out_of_grid: 'mower out of loan grid in start position',
}
