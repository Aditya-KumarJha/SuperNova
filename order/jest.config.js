/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    roots: [ '<rootDir>/tests' ],
    setupFiles: [ 
        '<rootDir>/tests/setup/env.js',
        '<rootDir>/tests/setup/axios-mock.js'
    ],
    setupFilesAfterEnv: [ '<rootDir>/tests/setup/mongodb.js' ],
};
