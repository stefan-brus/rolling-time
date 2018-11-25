/**
 * Program for testing the rolling time window implementation
 *
 * Author: Stefan Brus (github.com/stefan-brus)
 * Copyright: Sure
 * License: Beerware
 */

/**
 * `fs` and `readline` are used in combination to read the contents of a file
 * on disk without storing the whole thing in memory.
 */

const fs = require('fs');
const readline = require('readline');

/**
 * `yargs` is used for simple command line argument parsing.
 */

const argv = require('yargs').argv;

/**
 * `printf` is used to print with C-style format strings.
 */

const printf = require('printf');

const RollingTime = require('./rollingtime.js');

/**
 * `main` function.
 *
 * Parses the command line arguments, reads lines one-by-one from a file
 * (expected format: `${TIMESTAMP}\t${COST}`), puts each line into a
 * rolling time window, and prints the status of the rolling time window as
 * new observations are put in.
 *
 * Command line arguments:
 *      `--input` = Path to the input file
 *      `--tau` = Size of the rolling time window. Defaults to 60.
 *
 * Params:
 *      args = The command line arguments
 */

function main(args) {
    const tau = args.tau == null ? 60 : args.tau;
    const input = args.input;

    // `input` is required
    if (input == null) {
        printUsage();
        return;
    }

    const rtw = new RollingTime(tau);

    // Create a `readline`-stream to read lines one by one
    const istream = fs.createReadStream(input);
    const rl = readline.createInterface(istream);

    printTableHeader();

    // Store the current line number for error message purposes
    let curLine = 0;

    // Attempt to parse each line, put it into `rtw`, and print the state of `rtw`
    // Print an error message to stderr on unsuccessful parse
    rl.on('line', line => {
        curLine++;
        const err = parseObservation(line, rtw);
        if (err == null) {
            // `rtw` state should only be printed if the line parsed successfully
            printRtwState(rtw);
        }
        else {
            console.error(`Error on line ${curLine}: ${err}`);
        }
    });
}

/**
 * Parse an observation line and put it into the given rolling time window.
 *
 * Expected format: `${TIMESTAMP}\t${COST}`
 *
 * Params:
 *      line = The line to parse
 *      rtw = The rolling time window instance
 *
 * Returns:
 *      An error message, on parse error
 */

function parseObservation(line, rtw) {
    const numPair = line.split('\t');
    if (numPair.length !== 2) {
        return `Expected format: \${TIMESTAMP}\t\${COST}, got: ${line}`;
    }

    const timestamp = Number(numPair[0]);
    if (isNaN(timestamp)) {
        return 'Timestamp expected to be a number';
    }

    const cost = Number(numPair[1]);
    if (isNaN(cost)) {
        return 'Cost expected to be a number';
    }

    rtw.put(timestamp, cost);
    return null;
}

/**
 * Print the state of the given rolling time window.
 *
 * Attempts to roughly format it as a row in a table.
 *
 * Params:
 *      rtw = The rolling time window instance
 */

function printRtwState(rtw) {
    const lastObservation = rtw.observations.slice(-1)[0];

    console.log(printf('%12d %.5f%3d %.5f %.5f %.5f',
        lastObservation.timestamp,
        lastObservation.cost,
        rtw.observations.length,
        rtw.sum,
        rtw.min,
        rtw.max
    ));
}

/**
 * Print the header of the output table.
 */

function printTableHeader() {
    console.log('   Time       Value N_O Roll_Sum Min_Value Max_Value');
    console.log('-------------------------------------------------------');
}

/**
 * Print the program usage.
 */

function printUsage() {
    console.log("Usage:");
    console.log("rollingtime --input (path-to-input-file) [--tau (window-size)]");
}

// Actual entry point
main(argv);
