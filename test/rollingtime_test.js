/**
 * Unit tests for the rolling time window class
 *
 * Author: Stefan Brus (github.com/stefan-brus)
 * Copyright: Sure
 * License: Beerware
 */

/**
 * The built-in `assert` library contains basic test functions.
 */

const assert = require('assert');

/**
 * `almost-equal` is used for floating point comparisons.
 */

const almostEqual = require('almost-equal')

const RollingTime = require('../rollingtime.js');

/* -- Test utilities -- */

/**
 * Check the state of a given rolling time window
 *
 * Params:
 *      rtw = The rolling time window object
 *      obs = The number of observations
 *      sum = The current sum
 *      min = The current minimum value
 *      max = The current maximum value
 */

function checkRtw(rtw, obs, sum, min, max) {
    assert.equal(rtw.observations.length, obs);

    // These values are floats, hence the usage of almost-equal here
    // Exact comparisons causes a lot of false positives to be caught
    assert.ok(almostEqual(rtw.sum, sum));
    assert.ok(almostEqual(rtw.min, min));
    assert.ok(almostEqual(rtw.max, max));
}

/* -- Test cases -- */

/**
 * Test the initial state of a newly created rolling time window
 */

function testInit() {
    const TAU = 1;
    const rtw = new RollingTime(TAU);

    assert.equal(rtw.TAU, TAU);
    checkRtw(rtw, 0, 0.0, Number.MAX_VALUE, 0.0);
}

/**
 * Test putting one observation into the rolling time window
 */

function testPutOne() {
    const TAU = 10;
    const rtw = new RollingTime(TAU);

    rtw.put(1, 0.1);
    checkRtw(rtw, 1, 0.1, 0.1, 0.1);
}

/**
 * Test putting a few observations into the rolling time window
 */

function testPutSome() {
    const TAU = 10;
    const rtw = new RollingTime(TAU);

    rtw.put(1, 0.1);
    checkRtw(rtw, 1, 0.1, 0.1, 0.1);

    rtw.put(2, 0.5);
    checkRtw(rtw, 2, 0.6, 0.1, 0.5);

    rtw.put(3, 0.05);
    checkRtw(rtw, 3, 0.65, 0.05, 0.5);
}

/**
 * Test putting observations that rolls the time window over
 */

function testRollWindow() {
    const TAU = 10;
    const rtw = new RollingTime(TAU);

    rtw.put(1, 1);
    checkRtw(rtw, 1, 1, 1, 1);

    rtw.put(5, 5);
    checkRtw(rtw, 2, 6, 1, 5);

    rtw.put(10, 10);
    checkRtw(rtw, 3, 16, 1, 10);

    rtw.put(15, 15);
    checkRtw(rtw, 2, 25, 10, 15);

    rtw.put(30, 30);
    checkRtw(rtw, 1, 30, 30, 30);
}

/**
 * Test the example input from `small.txt`
 */

function testExampleInput() {
    const TAU = 60;
    const rtw = new RollingTime(TAU);

    rtw.put(1355270609, 1.80215);
    checkRtw(rtw, 1, 1.80215, 1.80215, 1.80215);

    rtw.put(1355270621, 1.80185);
    checkRtw(rtw, 2, 3.604, 1.80185, 1.80215);

    rtw.put(1355270646, 1.80195);
    checkRtw(rtw, 3, 5.40595, 1.80185, 1.80215);

    rtw.put(1355270702, 1.80225);
    checkRtw(rtw, 2, 3.6042, 1.80195, 1.80225);

    rtw.put(1355270702, 1.80215);
    checkRtw(rtw, 3, 5.40635, 1.80195, 1.80225);

    rtw.put(1355270829, 1.80235);
    checkRtw(rtw, 1, 1.80235, 1.80235, 1.80235);

    rtw.put(1355270854, 1.80205);
    checkRtw(rtw, 2, 3.6044, 1.80205, 1.80235);

    rtw.put(1355270868, 1.80225);
    checkRtw(rtw, 3, 5.40665, 1.80205, 1.80235);

    rtw.put(1355271000, 1.80245);
    checkRtw(rtw, 1, 1.80245, 1.80245, 1.80245);

    rtw.put(1355271023, 1.80285);
    checkRtw(rtw, 2, 3.6053, 1.80245, 1.80285);

    rtw.put(1355271024, 1.80275);
    checkRtw(rtw, 3, 5.40805, 1.80245, 1.80285);

    rtw.put(1355271026, 1.80285);
    checkRtw(rtw, 4, 7.2109, 1.80245, 1.80285);

    rtw.put(1355271027, 1.80265);
    checkRtw(rtw, 5, 9.01355, 1.80245, 1.80285);

    rtw.put(1355271056, 1.80275);
    checkRtw(rtw, 6, 10.8163, 1.80245, 1.80285);

    rtw.put(1355271428, 1.80265);
    checkRtw(rtw, 1, 1.80265, 1.80265, 1.80265);

    rtw.put(1355271466, 1.80275);
    checkRtw(rtw, 2, 3.6054, 1.80265, 1.80275);

    rtw.put(1355271471, 1.80295);
    checkRtw(rtw, 3, 5.40835, 1.80265, 1.80295);

    rtw.put(1355271507, 1.80265);
    checkRtw(rtw, 3, 5.40835, 1.80265, 1.80295);

    rtw.put(1355271562, 1.80275);
    checkRtw(rtw, 2, 3.6054, 1.80265, 1.80275);

    rtw.put(1355271588, 1.80295);
    checkRtw(rtw, 2, 3.6057, 1.80275, 1.80295);
}

/* -- Run the tests -- */
testInit();
testPutOne();
testPutSome();
testRollWindow();
testExampleInput();
