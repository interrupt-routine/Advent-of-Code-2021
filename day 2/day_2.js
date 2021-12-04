#!/usr/bin/env/ node

function getDestination (moves) {
	let vertical = 0, horizontal = 0;

	for (const move of moves) {
		const incr = move.distance;

		switch (move.direction) {
		case 'up':
			vertical -= incr;
			break;
		case 'down':
			vertical += incr;
			break;
		case 'forward':
			horizontal += incr;
			break;
		}
	}
	return vertical * horizontal;
}

function getDestinationWithAim (moves) {
	let aim = 0, vertical = 0, horizontal = 0;

	for (const move of moves) {
		const incr = move.distance;

		switch (move.direction) {
		case 'up':
			aim -= incr;
			break;
		case 'down':
			aim += incr;
			break;
		case 'forward':
			horizontal += incr;
			vertical += aim * incr;
			break;
		}
	}
	return vertical * horizontal;
}

function parseMoves (lines) {
	return lines.trim().split('\n').map(
		function (string) {
			const [direction, distance] = string.split(' ');
			return {direction : direction, distance : +distance};
		}
	);
}

const readFileSync = require('fs').readFileSync;

const moves = parseMoves(readFileSync('input.txt', 'utf-8'));

console.log(`part one solution : ${getDestination(moves)}`);

console.log(`part two solution : ${getDestinationWithAim(moves)}`);