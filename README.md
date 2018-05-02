![ParaView Glance](Documentation/content/paraview.png)Glance

Introduction
============
[ParaView Glance][] is an open-source, javascript 
visualization application created by [Kitware][], based on
[Visualization Toolkit (VTK)][VTK], and intended to serve
as a light-weight companion to [Paraview][].

[ParaView]: http://www.paraview.org
[VTK]: http://www.vtk.org
[Kitware]: http://www.kitware.com

Learning Resources
==================

* General information is available at the [ParaView Glance Homepage][] and
  at the [ParaView Hompage][].

* Community discussion takes place on the [ParaView Mailing Lists][].

* Commercial [support][Kitware Support] and [training][Kitware Training]
  are available from [Kitware][].

* Additional documentation, including Doxygen-generated nightly
  reference documentation, is available [online][Documentation].

[ParaView Glance Homepage]: https://kitware.github.io/pv-web-viewer
[ParaView Homepage]: http://www.paraview.org
[Documentation]: https://kitware.github.io/pv-web-viewer/
[ParaView Mailing Lists]: http://www.paraview.org/mailing-lists/
[Kitware]: http://www.kitware.com/
[Kitware Support]: http://www.kitware.com/products/support.html
[Kitware Training]: http://www.kitware.com/products/protraining.php


Live Demonstrations
===================

As a javascript application, ParaView Glance can be run by pointing
any browser at an appropriate URL or loading an HTML file.

Because of ParaView Glance's ease of distribution,
the stable and nightly releases of the code on [github][] can be
run by visiting the appropriate web page:

Visit these URLs to run the [stable][] and [nightly][] release of
ParaView Glance.

[github]: https://github.com/kitware/pv-web-viewer
[stable]: https://kitware.github.io/pv-web-viewer/app
[nightly]: https://kitware.github.io/pv-web-viewer/nightly


Building
========

If you wish to view, enhance, or adapt this application in any way,
you can access and run the freely available source code from any
platform using the following commands:

 $ git clone https://github.com/Kitware/pv-web-viewer.git
 $ cd pv-web-viewer/
 $ git checkout cornerstone_integration
 $ npm install
 $ npm run start

The prerequesits are [git][] and [node.js-npm][].

[git]: https://git-scm.com
[node.js-npm]: https://nodejs.org/en


Reporting Bugs and Making Contributions
=======================================

If you have found a bug or have a suggestion for improving ParaView Glance:

1. If you have source code to contribute, please fork the github
   repository into your own github account, create a branch with your
   changes, and then create a merge request with the main repo.

2. If you have a bug to report or a feature to request, please open an
   entry in the [ParaView Glance Issue Tracker][].

[ParaView Glance Issue Tracker]: https://github.com/kitware/pv-web-viewer/issues


License
=======

ParaView Glance is distributed under the OSI-approved BSD 3-clause License.
See [COPYRIGHT][] and [LICENSE][] for details. For additional licenses, refer to
[ParaView Licenses][].

[COPYRIGHT]: COPYRIGHT
[LICENSE]: LICENSE
[ParaView Licenses]: http://www.paraview.org/paraview-license/
