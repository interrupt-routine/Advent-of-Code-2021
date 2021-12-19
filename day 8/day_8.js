#!/usr/bin/env/ node


/*
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
*/

/*
d -> n abcdefg

0 -> 6 abc.efg
1 -> 2 ..c..f.
2 -> 5 a.cde.g
3 -> 5 a.cd.fg
4 -> 4 .bcd.f.
5 -> 5 ab.d.fg
6 -> 6 ab.defg
7 -> 3 a.c..f.
8 -> 7 abcdefg
9 -> 6 abcd.fg

letters frequencies :
       abcdefg
       8787497
*/

function count1478 (lines) {
	return lines.reduce(
		(count, curLine) => 
			count + curLine.outputValue.filter(
				str => [2, 3, 4, 7].includes(str.length)
			).length
	, 0);
}

// our 7 segments, each with a unique bit
const TOP_HORIZONTAL        = 0b0000001;
const MIDDLE_HORIZONTAL     = 0b0000010;
const BOTTOM_HORIZONTAL     = 0b0000100;
const BOTTOM_LEFT_VERTICAL  = 0b0001000;
const BOTTOM_RIGHT_VERTICAL = 0b0010000;
const TOP_LEFT_VERTICAL     = 0b0100000;
const TOP_RIGHT_VERTICAL    = 0b1000000;

/* associates a code to each digit by using binary OR on the segments which compose it */
/* to check if a digit has a certain segment we can use binary AND operator on this code */
const digitsCode = {
	0 : TOP_HORIZONTAL     | TOP_RIGHT_VERTICAL    | BOTTOM_RIGHT_VERTICAL | BOTTOM_HORIZONTAL    | BOTTOM_LEFT_VERTICAL | TOP_LEFT_VERTICAL,
	1 : TOP_RIGHT_VERTICAL | BOTTOM_RIGHT_VERTICAL,
	2 : TOP_HORIZONTAL     | TOP_RIGHT_VERTICAL    | BOTTOM_HORIZONTAL     | BOTTOM_LEFT_VERTICAL | MIDDLE_HORIZONTAL,
	3 : TOP_HORIZONTAL     | TOP_RIGHT_VERTICAL    | BOTTOM_RIGHT_VERTICAL | BOTTOM_HORIZONTAL    | MIDDLE_HORIZONTAL,
	4 : TOP_RIGHT_VERTICAL | BOTTOM_RIGHT_VERTICAL | TOP_LEFT_VERTICAL     | MIDDLE_HORIZONTAL,
	5 : TOP_HORIZONTAL     | BOTTOM_RIGHT_VERTICAL | BOTTOM_HORIZONTAL     | TOP_LEFT_VERTICAL    | MIDDLE_HORIZONTAL,
	6 : TOP_HORIZONTAL     | BOTTOM_RIGHT_VERTICAL | BOTTOM_HORIZONTAL     | BOTTOM_LEFT_VERTICAL | TOP_LEFT_VERTICAL    | MIDDLE_HORIZONTAL,
	7 : TOP_HORIZONTAL     | TOP_RIGHT_VERTICAL    | BOTTOM_RIGHT_VERTICAL,
	8 : TOP_HORIZONTAL     | TOP_RIGHT_VERTICAL    | BOTTOM_RIGHT_VERTICAL | BOTTOM_HORIZONTAL    | BOTTOM_LEFT_VERTICAL | TOP_LEFT_VERTICAL | MIDDLE_HORIZONTAL,
	9 : TOP_HORIZONTAL     | TOP_RIGHT_VERTICAL    | BOTTOM_RIGHT_VERTICAL | BOTTOM_HORIZONTAL    | TOP_LEFT_VERTICAL    | MIDDLE_HORIZONTAL,
};
// reverse dictionary from above
const codeDigits = {};

for (const [digit, segments] of Object.entries(digitsCode))
	codeDigits[segments] = digit;

function getFrequencies (signals) {
	const frequencies = {a : 0, b : 0, c : 0, d : 0, e : 0, f : 0, g : 0};

	for (const signal of signals)
		for (const letter of signal)
			frequencies[letter]++;

	return frequencies;
}

// preconditions :
// * only one segment from the digit is not solved
// * only one letter from the signal is not solved

function deduceSegment (letterSegments, digit, signal) {
	const missingLetter = [...signal].find(letter => !letterSegments[letter]);

	const segments = digitsCode[digit];
	const solvedSegments = Object.values(letterSegments).reduce((mask, bit) => mask | bit, 0);

// we look for the segment which is in the digit, but which hasnt been solved yet
	for (var bit = 1; !(segments & bit) || (solvedSegments & bit); bit <<= 1)
		;

	const missingSegment = bit;


	letterSegments[missingLetter] = missingSegment;
}


// we use a mix of frequency analysis and deduction from the digits which have 
// a unique number of segments :
// * 1 (2 segments)
// * 7 (3 semgents)
// * 4 (4 segments)
// * 8 (8 segments)

function decode (signals) {
	const letterSegments = {a : 0, b : 0, c : 0, d : 0, e : 0, f : 0, g : 0};


	// group the signals by their length, with the length as a key
	const groupByLengths = {};

	for (const signal of signals)
		(groupByLengths[signal.length] ??= []).push(signal);

// segments BOTTOM_LEFT_VERTICAL and BOTTOM_RIGHT_VERTICAL have unique frequencies : 
//                     4         and       9 respectively

	const frequencies = getFrequencies(signals);

	const letterBLV = Object.keys(frequencies).find(letter => frequencies[letter] === 4);
	letterSegments[letterBLV] = BOTTOM_LEFT_VERTICAL;

	const letterBRV = Object.keys(frequencies).find(letter => frequencies[letter] === 9);
	letterSegments[letterBRV] = BOTTOM_RIGHT_VERTICAL;

// one is composed of BOTTOM_RIGHT_VERTICAL and TOP_RIGHT_VERTICAL
// we already know BOTTOM_RIGHT_VERTICAL, so we can deduce the other
	deduceSegment(letterSegments, 1, groupByLengths[2][0]);
// we can deduce the TOP_HORIZONTAL from 7, which is the only digit with 3 segments lit
	deduceSegment(letterSegments, 7, groupByLengths[3][0]);

// at this point we know :
// BOTTOM_LEFT_VERTICAL, BOTTOM_RIGHT_VERTICAL, TOP_RIGHT_VERTICAL, TOP_HORIZONTAL

// now we do frequency analysis again. if we consider the group of digits which have 5 segments
// (2, 3, 5), TOP_LEFT_VERTICAL and BOTTOM_RIGHT_VERTICAL appear once each in this group
// since we already know the letter for BOTTOM_RIGHT_VERTICAL we can deduce TOP_LEFT_VERTICAL
	const frequenciesLength5 = getFrequencies(groupByLengths[5]);

	const letterTLV = Object.keys(frequenciesLength5).find(letter => frequenciesLength5[letter] === 1 && !letterSegments[letter]);
	letterSegments[letterTLV] = TOP_LEFT_VERTICAL;

// now we can deduce MIDDLE_HORIZONTAL with 4
	deduceSegment(letterSegments, 4, groupByLengths[4][0]);
// only segment left is BOTTOM_HORIZONTAL, we can deduce it with 8
	deduceSegment(letterSegments, 8, groupByLengths[7][0]);

	return letterSegments;
}

// ["abcde", "abc", "ef" ... ]  =>  9873
function getOutputValue (digits, letterSegments) {
	return +(digits.map(
		digitLetters => [...digitLetters].reduce(
			(digit, letter) => digit | letterSegments[letter],
		0)
	).map(code => codeDigits[code]).join(''));
}

function outputValuesSum (lines) {
	let sum = 0;

	for (const line of lines) {
		const letterSegments = decode(line.digits);
		sum += getOutputValue(line.outputValue, letterSegments);
	}
	return sum;
}

const readFileSync = require('fs').readFileSync;

const lines = readFileSync('input.txt', 'utf-8').trim().split('\n').map(
	function parseLine (line) {
		const [digits, outputValue] = line.split('|').map(str => str.trim().split(' '));
		return {digits : digits, outputValue : outputValue};
	} 
);

console.log(`the digits 1,4,7,8 appear ${count1478(lines)} times`);

console.log(`the sum of all the output values is : ${outputValuesSum(lines)}`)