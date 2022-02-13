import * as types from './types';
import errorTypes from '../errors';


export default class point {
	x: types.gridMinimumPoint
	y: types.gridMinimumPoint
	dir: types.allowedDirection
	allowed_directions: types.directions
	constructor(
		x: string | number,
		y: string | number,
		dir: string | types.allowedDirection,
		allowed_directions: types.directions
	) {
		this.x = this.minPoint(x)
		this.y = this.minPoint(y)
		this.allowed_directions = allowed_directions
		this.dir = this.allowedDirections(dir, this.allowed_directions)
	}

	minPoint = (value: number | string): types.gridMinimumPoint => {
		let number = +value
		if ((!number && number !== 0) || number < 0) {
			throw new Error(errorTypes.invalidOrNegativeNumber(value, number))
		}

		return number as types.gridMinimumPoint
	}

	allowedDirections = (
		value: string | number,
		allowed_directions: types.directions
	): types.allowedDirection => {
		if (!Object.values(allowed_directions).includes(value)) {
			const error_direction = new Error(
				errorTypes.undefinedDirection(value)
			)
			error_direction.name = errorTypes.undefined_direction
			throw error_direction
		}
		return value as types.allowedDirection
	}
}


export const minPoint = (value: number | string): types.gridMinimumPoint => {
	let number = +value
	if ((!number && number !== 0) || number < 0) {
		throw new Error(errorTypes.invalidOrNegativeNumber(value, number))
	}

	return number as types.gridMinimumPoint
}