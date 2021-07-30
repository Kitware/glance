module.exports = {
  baseUrl: '/paraview-glance',
  work: './build-tmp',
  config: {
    title: 'ParaView Glance',
    description: '"The Web Viewer for your data"',
    subtitle: '"Enable visualization on any computer."',
    author: 'Kitware Inc.',
    timezone: 'UTC',
    url: 'https://kitware.github.io/paraview-glance',
    root: '/paraview-glance/',
    github: 'kitware/paraview-glance',
    google_analytics: 'UA-90338862-10',
  },
  copy: [
    {
      src: '../dist/*',
      dest: './build-tmp/public/nightly',
    },
    {
      src: '../stable/dist/*',
      dest: './build-tmp/public/app',
    },
    // use analytics-enabled index.html
    {
      src: '../dist/index-ga.html',
      dest: './build-tmp/public/nightly/index.html',
      destIsTarget: true,
    },
    {
      src: '../stable/dist/index-ga.html',
      dest: './build-tmp/public/app/index.html',
      destIsTarget: true,
    },
  ],
};
