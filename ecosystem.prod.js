module.exports = {
  apps : [
    {
      name      : 'api',
      cwd       : 'src',
      node_args : '-r tsconfig-paths/register',
      script    : 'index.js',
      env: {
        NODE_ENV: 'production'
      },
    },
  ]
};
