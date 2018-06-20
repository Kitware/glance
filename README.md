![ParaView Glance](documentation/content/ParaViewGlance_Logo.png)

Introduction
============
[ParaView Glance][] is an open-source, javascript visualization application created by [Kitware][], based on [Visualization Toolkit (VTK)][VTK], and intended to serve as a light-weight companion to [Paraview][].  It is part of
the [ParaView Web][] suite of tools.

[ParaView Glance]: https://kitware.github.io/paraview-glance/
[ParaView Web]: http://www.paraview.org/web
[ParaView]: http://www.paraview.org
[VTK]: http://www.vtk.org
[Kitware]: http://www.kitware.com

Learning Resources
==================

* General information is available at the [ParaView][] and [ParaView Web][] homepages.

* Community discussion takes place on the [ParaView Discourse][].

* Commercial [support][Kitware Support] and [training][Kitware Training] are available from [Kitware][].

* Additional documentation is being created and will be released as it is created on our [documentation pages][ParaView Glance GitHub.io].

[ParaView Discourse]: https://discourse.paraview.org/
[Kitware Support]: http://www.kitware.com/products/support.html
[Kitware Training]: http://www.kitware.com/products/protraining.php
[ParaView Glance GitHub.io]: https://kitware.github.io/paraview-glance/


Live Demonstrations
===================

As a javascript application, ParaView Glance can be run by pointing any browser at an appropriate URL or loading an HTML file.

Because of ParaView Glance's ease of distribution, the stable and nightly releases of the code on [github][] can be run by visiting the appropriate web page:

Visit these URLs to run the [stable][] and [nightly][] release of ParaView Glance.

[github]: https://github.com/kitware/paraview-glance
[stable]: https://kitware.github.io/paraview-glance/app
[nightly]: https://kitware.github.io/paraview-glance/nightly


Building
========

If you wish to view, enhance, or adapt this application in any way, you can access and run the freely available source code from any platform using the following commands:

```
$ git clone https://github.com/Kitware/paraview-glance.git
$ cd paraview-glance/
$ npm install
$ npm run start
```

The prerequesits are [git][] and [node.js-npm][].

[git]: https://git-scm.com
[node.js-npm]: https://nodejs.org/en


Reporting Bugs and Making Contributions
=======================================

If you have found a bug or have a suggestion for improving ParaView Glance:

1. If you have source code to contribute, please fork the github repository into your own github account, create a branch with your changes, and then create a merge request with the main repo.

2. If you have a bug to report or a feature to request, please open an entry in the [ParaView Glance Issue Tracker][].

[ParaView Glance Issue Tracker]: https://github.com/kitware/paraview-glance/issues


License
=======

ParaView Glance is distributed under the OSI-approved BSD 3-clause License.  See [COPYRIGHT][] and [LICENSE][] for details. For additional licenses, refer to [ParaView Licenses][].

[COPYRIGHT]: COPYRIGHT
[LICENSE]: LICENSE
[ParaView Licenses]: http://www.paraview.org/paraview-license/
