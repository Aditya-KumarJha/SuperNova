/** @type {import('jest').Config} */

module.exports = {
    testEnvironment: 'node',
    roots: [ '<rootDir>/tests' ],
    setupFiles: [ '<rootDir>/tests/setup/globalSetup.js' ],
    setupFilesAfterEnv: [ '<rootDir>/tests/setup/mongodb.js' ],
    collectCoverageFrom: [ 'src/**/*.js', '!src/db/**' ],
    verbose: true,
};