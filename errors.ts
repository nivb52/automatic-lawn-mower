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

export default errorTypes;