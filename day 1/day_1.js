#!/usr/bin/env/ node

function countIncreases (array) {
	let count = 0;

	for (let i = 1; i < array.length; i++)
		if (array[i] > array[i - 1])
			count++;

	return count;
}

function makeWindows (array, chunkLen) {
	if (chunkLen <= 0 || chunkLen > array.length)
		return [];

	return Array.from({length : array.length + 1 - chunkLen},
		(_, idx) => array.slice(idx, idx + chunkLen)
	);
}

function countIncreasesByWindows (array, windowLength = 3) {

	const sums = makeWindows(array, windowLength).map(chunk => chunk.reduce((sum, x) => sum + x, 0));

	return countIncreases(sums);
}

const readFileSync = require('fs').readFileSync;

const depths = readFileSync("input.txt", 'utf-8').trim().split('\n').map(x => +x);

console.log(`part one solution : ${countIncreases(depths)}`);

console.log(`part two solution : ${countIncreasesByWindows(depths)}`);
