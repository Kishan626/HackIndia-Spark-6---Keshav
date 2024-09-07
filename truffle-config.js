module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Ensure this matches the port Ganache is running on
      network_id: "*", // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Ensure this matches the version of Solidity you're using
    },
  },
};
