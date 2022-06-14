const React = require('react');
const Layout = require('../Layout');

module.exports = function Registration() {
  return (
    <Layout>
      <form action="/auth/register" method="POST">
        <input
          type="text"
          name="username"
          placeholder="username"
          className="block w-100  no-resize no-outline no-border no-resize pad-1 mar-b-2"
        />
        <input
          type="text"
          name="e-mail"
          placeholder="e-mail"
          className="block w-100  no-resize no-outline no-border no-resize pad-1 mar-b-2"
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          className="block w-100  no-resize no-outline no-border no-resize pad-1 mar-b-2"
        />
        <button
          type="submit"
          className="block button w-100 mar-t-4 mar-b-3 pad-2 round-1 text-c center no-border no-outline"
        >
          Create Account
        </button>
      </form>
    </Layout>
  );
};
