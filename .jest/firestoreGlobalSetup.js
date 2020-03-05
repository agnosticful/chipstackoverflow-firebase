const { setup } = require("jest-dev-server");

module.exports = async () => {
  await setup({
    command: `npm run serve`,
    launchTimeout: 50000,
    port: 8080
  });
};
