# Rolling time window

Simple node.js implementation of a rolling time window class.

Versions used:
npm = 6.4.1
node = 10.13.0

## Dependencies

- yargs: Simple parsing of command-line arguments
- printf: Print to console using C-style format strings
- almost-equal: Comparison of floating point numbers

## Future improvements

- A future version of ES seems to support private properties in classes, this
  can be used to encapsulate the properties of `RollingTime`.

- Use more of `yargs` built-in facilities to handle required arguments, and
  arguments with default values.

- Improve the build process with automated test runs and linter.

- The format of the printed table is not perfect...

- Validate the input value of `TAU` when creating new window objects.

- Add performance tests for CPU usage.

- Automate memory performance test to ensure no memory leaks.
