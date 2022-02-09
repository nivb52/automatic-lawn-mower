const print = console.log
const rewire = require('rewire')
const index = rewire('./index')
const main = index.__get__('main')
const errorTypes = index.__get__('errorTypes')
// const calcMownMove = index.__get__('calcMownMove')

describe('Main', () => {
	const mower1 = {
		input: { start_pos: `1 2 N`, insturctions: `LFLFLFLFF` },
		output: () => `1 3 N \n`,
	}
	const mower2 = {
		input: { start_pos: `3 3 E`, insturctions: `FFRFFRFRRF` },
		output: () => `5 1 E \n`,
	}
	const mower_stay_in_place = {
		input: { start_pos: `0 0 S`, insturctions: `F` },
		output: () => `0 0 S \n`,
	}
	const mower_move_north = {
		input: { start_pos: `0 0 N`, insturctions: `FFFF` },
		output: (y = 4, dir = 'N') => `0 ${y} ${dir} \n`,
	}

	const mower_move_south = {
		input: { start_pos: `4 4 S`, insturctions: `FFFF` },
		output: (y = 0, dir = 'S') => `4 ${y} ${dir} \n`,
	}

	const mower_move_east = {
		input: { start_pos: `0 0 E`, insturctions: `FFFF` },
		output: (x = 4, dir = 'E') => `${x} 0 ${dir} \n`,
    }
    
	test('2 valid mowers : 1 + 2', () => {
		const result = main(`5 5 
            ${mower1.input.start_pos}
            ${mower1.input.insturctions}
            ${mower2.input.start_pos}
            ${mower2.input.insturctions}`)
		expect(result).toEqual([mower1.output(), mower2.output()])
	})
	test('valid mower1', () => {
		const result = main(`5 5 
            ${mower1.input.start_pos}
            ${mower1.input.insturctions}`)
		expect(result).toEqual([mower1.output()])
	})

	test('mower_stay_in_place', () => {
		const result = main(`2 2 
            ${mower_stay_in_place.input.start_pos}
            ${mower_stay_in_place.input.insturctions}`)
		expect(result).toEqual([mower_stay_in_place.output()])
	})

	test('mower move north', () => {
		const result = main(`5 5 
            ${mower_move_north.input.start_pos}
            ${mower_move_north.input.insturctions}`)
		expect(result).toEqual([mower_move_north.output()])
	})

	test('mower move north : 2 out of 4 F', () => {
		const result = main(`2 2 
            ${mower_move_north.input.start_pos}
            ${mower_move_north.input.insturctions}`)
		expect(result).toEqual([mower_move_north.output(2)])
	})
	test('mower move south', () => {
		const result = main(`6 6 
            ${mower_move_south.input.start_pos}
            ${mower_move_south.input.insturctions}`)
		expect(result).toEqual([mower_move_south.output()])
	})

	test('mower move south : turn north', () => {
		const result = main(`6 6 
            ${mower_move_south.input.start_pos}
            ${mower_move_south.input.insturctions + 'LL'}`)
		expect(result).toEqual([mower_move_south.output(0, 'N')])
	})

	test('mower move east', () => {
		const result = main(`6 6 
            ${mower_move_east.input.start_pos}
            ${mower_move_east.input.insturctions}`)
		expect(result).toEqual([mower_move_east.output()])
	})

	test('mower move east : turn west', () => {
		const result = main(`6 6 
            ${mower_move_east.input.start_pos}
            ${mower_move_east.input.insturctions + 'LL'}`)
		expect(result).toEqual([mower_move_east.output(4, 'W')])
	})

	test('invalid grid input : minus', () => {
		expect(() =>
			main(`-1 -1 
            ${mower1.input.start_pos}
            ${mower1.input.insturctions}`)()
		).toThrow(errorTypes.invalid_grid_size_verbose)
	})

	test('invalid grid input : Letter', () => {
		expect(() =>
			main(`A1 1 
            ${mower1.input.start_pos}
            ${mower1.input.insturctions}`)()
		).toThrow(errorTypes.invalid_grid_size_verbose)
	})

	test('invalid point input : minus', () => {
		expect(() =>
			main(`5 5
            -7 4 N
            ${mower1.input.insturctions}`)()
		).toThrow(errorTypes.invalid_start_pos)
	})

	test('invalid point input : Letter', () => {
		expect(() =>
			main(`5 5
            7 A4 N
            ${mower1.input.insturctions}`)()
		).toThrow(errorTypes.invalid_start_pos)
	})

	test('invalid point input : Missing Direction', () => {
		expect(() =>
			main(`5 5
            4 4 
            ${mower1.input.insturctions}`)()
		).toThrow(errorTypes.undefinedDirection('null'))
	})

	test('invalid point input : Wrong Direction', () => {
		expect(() =>
			main(`5 5
            4 4 T
            ${mower1.input.insturctions}`)()
		).toThrow(errorTypes.undefinedDirection('T'))
	})

	test('invalid type input : number', () => {
		expect(() => main(55)()).toThrow(
			errorTypes.input_must_be_of_type_string
		)
	})

	test('invalid type input : array', () => {
		expect(() => main([55])()).toThrow(
			errorTypes.input_must_be_of_type_string
		)
	})
})
