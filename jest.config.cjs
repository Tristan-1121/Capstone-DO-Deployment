module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  // If some node_modules need transpiling, add them to the negative lookahead:
  // transformIgnorePatterns: ['/node_modules/(?!module-to-transform)'],
};