module.exports = {
  baseUrl: '/pv-web-viewer',
  work: './build-tmp',
  config: {
    title: 'ParaView Glance',
    description: '"The Web Viewer for your data"',
    subtitle: '"Enable visualization on any computer."',
    author: 'Kitware Inc.',
    timezone: 'UTC',
    url: 'https://kitware.github.io/pv-web-viewer',
    root: '/pv-web-viewer/',
    github: 'kitware/pv-web-viewer',
    google_analytics: 'UA-90338862-10',
  },
  copy: [
    {
      src: '../Distribution/*',
      dest: './build-tmp/public/nightly',
    },
    {
      src: '../node_modules/paraview-glance/Distribution/*',
      dest: './build-tmp/public/app',
    },
  ],
};
