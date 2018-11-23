/**
 * Simple node.js implementation of a "Rolling Time Window".
 *
 * This implementation assumes that the input is in sorted order.
 *
 * Author: Stefan Brus (github.com/stefan-brus)
 * Copyright: Sure
 * License: Beerware
 */

/**
 * Class representing a rolling time window. Implemented as a sliding buffer
 * of observations, which are pairs of `timestamp` and `cost` values.
 *
 * Properties:
 *      TAU = The size of the rolling time window, in seconds
 *      observations = The list of observations within the current time window
 *      sum = The sum of all observations in the current time window
 *      min = The minimum cost in the current time window
 *      max = The maximum cost in the current time window
 */

class RollingTime {

    /**
     * Constructor
     *
     * Params:
     *      TAU = The size of the rolling time window, in seconds
     */

    constructor(TAU) {
        this.TAU = TAU;
        this.observations = [];
        this.sum = 0.0;
        this.min = Number.MAX_VALUE;
        this.max = 0.0;
    }

    /**
     * Put a new observation into the rolling time window.
     *
     * If the difference between the timestamp of the given observation is
     * greater than (the first observation - TAU), observations are removed,
     * starting with the first one, until the current first observation is
     * within the defined size of the rolling time window.
     *
     * Params:
     *      timestamp = The timestamp of the observation
     *      cost = The cost of the observation
     */

    put(timestamp, cost) {
        this.observations.push({
            timestamp: timestamp,
            cost: cost
        });

        if (timestamp - this.TAU < this.observations[0].timestamp) {
            this.sum += cost;
            this.min = Math.min(this.min, cost);
            this.max = Math.max(this.max, cost);
        }
        else {
            // When the end of the window has been reached,
            // the following properties need to be re-calculated
            this.sum = 0.0;
            this.min = Number.MAX_VALUE;
            this.max = 0.0;

            // The index of the first observation inside the new window
            // is kept track of, so that the expired ones can be easily removed
            let newStartIndex = 0;

            this.observations.forEach(obs => {
                if (timestamp - this.TAU >= obs.timestamp) {
                    newStartIndex++;
                    return;
                }

                this.sum += obs.cost;
                this.min = Math.min(this.min, obs.cost);
                this.max = Math.max(this.max, obs.cost);
            });

            // Remove the obsolete observations
            this.observations = this.observations.slice(newStartIndex);
        }
     }
}

module.exports = RollingTime;
