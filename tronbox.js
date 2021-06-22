module.exports = {
  networks: {
    development: {
// For trontools/quickstart docker image
      privateKey: '0ff157dfd8a8a869a4933318ecb1a52f27739df8bd32502b356a5ccd53232e39',
      consume_user_resource_percent: 100,
      fee_limit: 1e7,
      fullNode: "http://127.0.0.1:8090",
      solidityNode: "http://127.0.0.1:8091",
      eventServer: "http://127.0.0.1:8092",
      network_id: "*"
    },
    shasta: {
      privateKey: '0ff157dfd8a8a869a4933318ecb1a52f27739df8bd32502b356a5ccd53232e39',
      consume_user_resource_percent: 100,
      fee_limit: 1e7,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "*"
    },
    mainnet: {
// Don't put your private key here, pass it using an env variable, like:
// PK=da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0 tronbox migrate --network mainnet
      privateKey: process.env.PK,
      consume_user_resource_percent: 100,
      fee_limit: 1e7,
      fullHost: "https://api.trongrid.io",
      network_id: "*"
    }
  }
};
