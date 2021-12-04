#!/usr/bin/env/ node

function getPower (numbers) {
	const nRows = numbers.length, nCols = numbers[0].length;

	const ones = Array(nCols).fill(0);

	for (const number of numbers)
		for (let i = 0; i < nCols; i++)
			ones[i] += number[i] === '1';

	let gamma = 0, epsilon = 0;

	for (let i = 0; i < nCols; i++) {
		gamma <<= 1;
		epsilon <<= 1;
		const mostCommonBit = ones[i] > (nRows / 2);
		gamma |= mostCommonBit;
		epsilon |= (mostCommonBit ^ 1);
	}
	let power = gamma * epsilon;
	return power;
}

const MOST_COMMON = "most common";
const LEAST_COMMON = "least common";

function filterByBits (numbers, criteria) {

	for (let i = 0; numbers.length > 1; i++) {
		const balance = numbers.reduce((balance, x) => balance + ((x[i] === '1') ? +1 : -1), 0);

		let criteriaBit;

		switch (criteria) {
		case LEAST_COMMON:
			criteriaBit = (balance >= 0) ? '0' : '1';
			break;
		case MOST_COMMON:
			criteriaBit = (balance >= 0) ? '1' : '0';
			break;
		}
		numbers = numbers.filter(num => num[i] === criteriaBit);
	}
	return parseInt(numbers[0], 2);
}

function getO2andCO2 (numbers) {

	const O2 = filterByBits(numbers, MOST_COMMON);
	const CO2 = filterByBits(numbers, LEAST_COMMON);

	return O2 * CO2;
}

const readFileSync = require('fs').readFileSync;

const numbers = readFileSync("input.txt", 'utf-8').trim().split('\n');

console.log(`part one solution : ${getPower(numbers)}`);

console.log(`part two solution : ${getO2andCO2(numbers)}`);
