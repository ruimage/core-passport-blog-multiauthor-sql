const React = require('react');
const Layout = require('./Layout');

module.exports = function Error({ username, message, error }) {
  return (
    <Layout username={username}>
      <h1>{message}</h1>
      <h2>{error.status}</h2>
      <pre>{error.stack}</pre>
    </Layout>
  );
};
