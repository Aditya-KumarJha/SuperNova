/** @type {import('jest').Config} */

module.exports = {
    testEnvironment: 'node',
    roots: [ '<rootDir>/tests' ],
    setupFilesAfterEnv: [ '<rootDir>/tests/setup/globalSetup.js' ],
    collectCoverageFrom: [ 'src/**/*.js', '!src/db/**' ],
    verbose: true,
};