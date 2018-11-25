/**
 * Memory performance tests for the rolling time window class.
 *
 * Gives the user a report of memory usage from several orders of magnitude
 * of input size, but doesn't actually assert anything.
 *
 * Intended to be run with GC exposed to allow for manual garbage collection,
 * and with large values of max-*-space-size to prevent automatic ones.
 *
 * Author: Stefan Brus (github.com/stefan-brus)
 * Copyright: Sure
 * License: Beerware
 */

const RollingTime = require('../rollingtime.js');

/* -- Test utilities -- */

/**
 * Generates `N` random observations and puts them into the given
 * rolling time window object.
 *
 * The timestamp of each observation is (previous_timestamp + rand(TAU))
 * The cost of each observation is rand(0.0, 1.0)
 *
 * Params:
 *      rtw = The rolling time window object
 *      N = The number of observations to generate
 */

function generate(rtw, N) {
    let i = 0;
    let previous_timestamp = 0;
    while(i < N) {
        const timestamp = randomInt(previous_timestamp + 1,
            previous_timestamp + rtw.TAU);
        const cost = Math.random();

        rtw.put(timestamp, cost);

        i++;
        previous_timestamp = timestamp;
    }
}

/**
 * Generates a random integer between `low` (inclusive) and `high` (exclusive)
 *
 * Params:
 *      low = The lower bound
 *      high = The higher bound
 */

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/* -- Test cases -- */

/**
 * Generate one observation and print memory usage
 */

function testOne() {
    const TAU = 60;
    const rtw = new RollingTime(TAU);

    generate(rtw, 1);

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`1 observation used approx. ${used.toFixed(2)} MB`);
}

/**
 * Generate a thousand observations and print memory usage
 */

function testThousand() {
    const TAU = 60;
    const rtw = new RollingTime(TAU);

    generate(rtw, 1000);

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`1,000 observations used approx. ${used.toFixed(2)} MB`);
}

/**
 * Generate a million observations and print memory usage
 */

function testMillion() {
    const TAU = 60;
    const rtw = new RollingTime(TAU);

    generate(rtw, 1000000);

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`1,000,000 observations used approx. ${used.toFixed(2)} MB`);
}

/**
 * Generate a hundred million observations and print memory usage
 */

function testHundredMillion() {
    const TAU = 60;
    const rtw = new RollingTime(TAU);

    generate(rtw, 100000000);

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`100,000,000 observations used approx. ${used.toFixed(2)} MB`);
}

/* -- Run the tests -- */

// Call garbage collector before and after each test to ensure better
// memory usage measurements
global.gc();

testOne();
global.gc();

testThousand();
global.gc();

testMillion();
global.gc();

testHundredMillion();
global.gc();
