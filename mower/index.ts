import point from '../point';
import errorTypes from '../errors'

import type {
	gridMinimumPoint,
	directions,
	direction,
	allowedDirection,
} from '../point/types'

export default class Mower {
	directions = {
		// FORWARD: 'F',
		// LEFT: 'L',
		// RIGHT: 'R',
		NORTH: 'N',
		SOUTH: 'S',
		EAST: 'E',
		WEST: 'W',
	} as directions
	movments: { FORWARD: 'F'; LEFT: 'L'; RIGHT: 'R' }
	constructor(
		public pos: point,
		public grid_x: gridMinimumPoint,
		public grid_y: gridMinimumPoint,
		public config: calcMownMove_config
	) {
		this.pos = pos
		this.grid_x = grid_x
		this.grid_y = grid_y
		this.config = config
		this.movments = {
			FORWARD: 'F',
			LEFT: 'L',
			RIGHT: 'R',
		}
	}

	 move = (instructions: string) => {

		/** @note: maybe already parsed by the regex validation function  named handleInputValidation
		 * but mostly used for the typescript type reference
		 */
		const parsed_start_x = this.pos.x
		const parsed_start_y = this.pos.y
		const paresed_start_dir = this.pos.dir

		if (parsed_start_x > this.grid_x || parsed_start_y > this.grid_y) {
			if (this.config.stric_mode) {
				throw Error(errorTypes.start_pos_out_of_grid)
			} else {
				/** @note: no movment, just return starting point */
				return { x: this.pos.x, y: this.pos.y, dir: this.pos.dir }
			}
		}

		let curr_x = parsed_start_x,
			curr_y = parsed_start_y,
			curr_dir = paresed_start_dir
		for (let order of instructions.split('')) {
			if (
				order === this.movments.FORWARD &&
				this.isInsideGridAreaAfterMovement(
					{ max_x: this.grid_x, max_y: this.grid_y },
					{ x: curr_x, y: curr_y, dir: curr_dir },
					this.directions
				)
			) {
				const { x, y } = this.calcMovmentByDirection(
					curr_x,
					curr_y,
					curr_dir,
					this.directions
				)
				curr_x = x as gridMinimumPoint
				curr_y = y as gridMinimumPoint
			} else if (order !== this.movments.FORWARD) {
				curr_dir = this.calcNextDirByLeftAndRight(
					order,
					curr_dir,
					this.directions
				)
			}
		}

		return { x: curr_x, y: curr_y, dir: curr_dir }
	}

	private isInsideGridArea(
		max_x: number,
		max_y: number,
		x: number,
		y: number
	): boolean {
		return x <= max_x && y <= max_y && x >= 0 && y >= 0
	}

	private calcMovmentByDirection(
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

	private isInsideGridAreaAfterMovement(
		grid: grid,
		curr_point: { x: number; y: number; dir: string },
		directions: directions
	): boolean {
		const { x, y } = this.calcMovmentByDirection(
			curr_point.x,
			curr_point.y,
			curr_point.dir,
			directions
		)

		return this.isInsideGridArea(grid.max_x, grid.max_y, x, y)
	}

	private calcNextDirByLeftAndRight(
		left_or_right: string,
		curr_dir: direction,
		directions: directions
	): allowedDirection {
		let new_dir: allowedDirection
		switch (curr_dir) {
			case directions.NORTH:
				new_dir =
					left_or_right === this.movments.LEFT
						? directions.WEST
						: directions.EAST
				break
			case directions.SOUTH:
				new_dir =
					left_or_right === this.movments.LEFT
						? directions.EAST
						: directions.WEST
				break
			case directions.EAST:
				new_dir =
					left_or_right === this.movments.LEFT
						? directions.NORTH
						: directions.SOUTH
				break
			case directions.WEST:
				new_dir =
					left_or_right === this.movments.LEFT
						? directions.SOUTH
						: directions.NORTH
				break
		}
		return new_dir
	}
}

export interface grid {
	max_x: gridMinimumPoint
	max_y: gridMinimumPoint
}
export interface calcMownMove_config {
	stric_mode?: boolean
}
