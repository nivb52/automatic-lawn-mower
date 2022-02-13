export interface pointType {
	x: gridMinimumPoint
	y: gridMinimumPoint
	dir: allowedDirection
}

export type gridMinimumPoint = number & { _type_: 'gridMinimumPoint' }
export type allowedDirection = string & { _type_: 'allowedDirection' }

export interface directions {
	NORTH: allowedDirection
	SOUTH: allowedDirection
	EAST: allowedDirection
	WEST: allowedDirection
}

export type direction =
	| directions['NORTH']
	| directions['SOUTH']
	| directions['WEST']
	| directions['EAST']
