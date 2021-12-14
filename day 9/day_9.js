#!/usr/bin/env/ node

function isLowPoint (heightMap, row, col) {

	const moves = [[-1, 0], [+1, 0], [0, -1], [0, +1]];

	const height = heightMap[row][col].height;

	for (const move of moves) {
		const adjHeight = heightMap?.[row + move[0]]?.[col + move[1]]?.height;

		if (adjHeight !== undefined && height >= adjHeight)
			return false;
	}
	return true;
}

function riskLevelsSum (heightMap) {

	let sum = 0;

	const nRows = heightMap.length, nCols = heightMap[0].length;

	for (let row = 0; row < nRows; row++)
		for (let col = 0; col < nCols; col++)
			if (isLowPoint(heightMap, row, col))
				sum += heightMap[row][col].height + 1;

	return sum;
}


function getBasinSize (heightMap, row, col) {

	const moves = [[-1, 0], [+1, 0], [0, -1], [0, +1]];

	let basinSize = 0;

	function flow (row, col) {

		basinSize += 1;

		const point = heightMap[row][col];
		const height = point.height;
		point.visited = true;

		// flood fill from low depth to hight depth
		for (const move of moves) {
			const adjRow = row + move[0], adjCol = col + move[1];

			const neighbor = heightMap?.[adjRow]?.[adjCol];

			if (neighbor === undefined || neighbor.visited)
				continue;
			if (neighbor.height !== 9 && neighbor.height > height)
				flow(adjRow, adjCol);
		}
	}
	flow(row, col);
	return basinSize;
}

function largestBasins (heightMap) {

	const nRows = heightMap.length, nCols = heightMap[0].length;

	const sizes = [];

	for (let row = 0; row < nRows; row++)
		for (let col = 0; col < nCols; col++)
			if (isLowPoint(heightMap, row, col))
				sizes.push(getBasinSize(heightMap, row, col));

	return sizes.sort((a, b) => a - b).slice(-3).reduce((prod, x) => prod * x, 1);
}



const readFileSync = require('fs').readFileSync;

const heightMap = readFileSync('input.txt', 'utf-8').trim().split('\n').map(
	line => [...line].map(digit => ({height : +digit, visited : false}))
);


console.log(`the sum of risk levels is: ${riskLevelsSum(heightMap)}`);

console.log(`the product of the sizes of the 3 largest basins is : ${largestBasins(heightMap)}`);