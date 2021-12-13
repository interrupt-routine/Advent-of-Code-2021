#!/usr/bin/env/ node

function areOpposite (a, b) {
	switch (a) {
	case '{': return b === '}';
	case '[': return b === ']';
	case '(': return b === ')';
	case '<': return b === '>';
	}
	return false;
}

const COMPLETE = "complete";
const INCOMPLETE = "incomplete";
const CORRUPTED = "corrupted";

function checkSyntax (line) {

	const stack = [];

	for (const char of line) {
		if ("{([<".includes(char)) {
			stack.push(char);
		} else if ("})]>".includes(char)) {
			if (!areOpposite(stack.pop(), char))
				return {status : CORRUPTED, illegalChar : char};
		}
	}
	return {status : stack.length === 0 ? COMPLETE : INCOMPLETE, stack : stack};
}


function fileScore (lines) {

	let score = 0;

	const charScore = {')' : 3, ']' : 57, '}' : 1197, '>' : 25137};

	for (const line of lines) {
		const check = checkSyntax(line);

		if (check.status === CORRUPTED)
			score += charScore[check.illegalChar];
	}
	return score;
}

function autocompleteScore (stack) {

	const charScore = {'(' : 1, '[' : 2, '{' : 3, '<' : 4};

	return stack.reduceRight(
		(score, char) => 5 * score + charScore[char]
	, 0);
}

function middleScore (lines) {
	const scores = [];

	for (const line of lines) {
		const check = checkSyntax(line);

		if (check.status === INCOMPLETE)
			scores.push(autocompleteScore(check.stack));
	}
	return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
}


const readFileSync = require('fs').readFileSync;

const lines = readFileSync('input.txt', 'utf-8').trim().split('\n');


console.log(`the file score is : ${fileScore(lines)}`);

console.log(`the middle autocomplete score is : ${middleScore(lines)}`);