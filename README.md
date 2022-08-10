![Glance](documentation/content/GlanceLogo.png)

Introduction
============
[Glance][] is an open-source, javascript visualization application created by [Kitware][], based on [Visualization Toolkit (VTK)][VTK], and intended to serve as a light-weight companion to [Paraview][].  It is part of
the [ParaView Web][] suite of tools.

[Glance]: https://kitware.github.io/glance/
[ParaView Web]: http://www.paraview.org/web
[ParaView]: http://www.paraview.org
[VTK]: http://www.vtk.org
[Kitware]: http://www.kitware.com

Learning Resources
==================

* General information is available at the [ParaView][] and [ParaView Web][] homepages.

* Community discussion takes place on the [ParaView Discourse][].

* Commercial [support][Kitware Support] and [training][Kitware Training] are available from [Kitware][].

* Additional documentation is being created and will be released as it is created on our [documentation pages][Glance GitHub.io].

[ParaView Discourse]: https://discourse.paraview.org/
[Kitware Support]: http://www.kitware.com/products/support.html
[Kitware Training]: http://www.kitware.com/products/protraining.php
[Glance GitHub.io]: https://kitware.github.io/glance/


Live Demonstrations
===================

As a javascript application, Glance can be run by pointing any browser at an appropriate URL or loading an HTML file.

[Click on this link][app] to run the live version of Glance.

[app]: https://kitware.github.io/glance/app


Building
========

The prerequisites are [git][] and [node.js + npm][].

If you wish to view, enhance, or adapt this application in any way, you can access and run the freely available source code from any platform using the following commands:


```
$ git clone https://github.com/Kitware/glance.git
$ cd glance/
$ npm install
$ npm run build
$ npm run dev
```

This will run a development build and you can visit the application at `http://localhost:9999`.

[git]: https://git-scm.com
[node.js + npm]: https://nodejs.org/en

Deploying to Production
=======================

To generate a production build, use the following commands:

```
$ npm run build:release
```

This will output the final bundle and assets to `dist/`.
You can then recursively copy all of those files into the web location of your choice.
As there is no server-side code involved, all you need is some web hosting!

If you make changes to any of the ITK filtering code under `itk/`, you should run the following
command from the root folder. For more information, check out [itk.js].

```
$ npx itk-js build itk/
```

[itk.js]: https://insightsoftwareconsortium.github.io/itk-js/examples/hello_world_node.html


Reporting Bugs and Making Contributions
=======================================

If you have found a bug or have a suggestion for improving Glance:

1. If you have source code to contribute, please fork the github repository into your own github account, create a branch with your changes, and then create a merge request with the main repo.

2. If you have a bug to report or a feature to request, please open an entry in the [Glance Issue Tracker][].

[Glance Issue Tracker]: https://github.com/kitware/glance/issues


License
=======

Glance is distributed under the OSI-approved BSD 3-clause License.  See [COPYRIGHT][] and [LICENSE][] for details. For additional licenses, refer to [ParaView Licenses][].

[COPYRIGHT]: COPYRIGHT
[LICENSE]: LICENSE
[ParaView Licenses]: http://www.paraview.org/paraview-license/
