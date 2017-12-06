Contributing to ParaView Web Viewer
===================================

This page documents at a very high level how to contribute to ParaView Web Viewer.

1. The ParaView Web Viewer source is maintained on Github at [github.com/kitware/pv-web-viewer](https://github.com/kitware/pv-web-viewer)

2. [Fork VTK] into your user's namespace on Github.

3. Create a local clone of the main VTK repository:

    ```sh
    $ git clone https://github.com/kitware/pv-web-viewer.git
    $ cd pv-web-viewer
    ```

    The main repository will be configured as your `origin` remote.

4. Run the setup script to prepare ParaView Web Viewer:
    ```sh
    $ npm install
    ```

5. Edit files and create commits (repeat as needed):
    ```sh
    $ edit file1 file2 file3
    $ git add file1 file2 file3
    $ npm run commit
    ```

6. Push commits in your topic branch to your fork in Github:
    ```sh
    $ git push
    ```

7. Visit your fork in Github, browse to the "**Pull Requests**" link on the
    left, and use the "**New Pull Request**" button in the upper right to
    create a Pull Request.

    For more information see: [Create a Pull Request]


ParaView Web Viewer uses Github for code review and Travis-CI to test proposed
patches before they are merged.

Our [DevSite] is used to document features, flesh out designs and host other
documentation as well as the API. There are also several [Mailing Lists]
to coordinate development and to provide support.


[Fork VTK]: https://help.github.com/articles/fork-a-repo/
[Create a Pull Request]: https://help.github.com/articles/creating-a-pull-request/
[DevSite]: http://kitware.github.io/pv-web-viewer
[Mailing Lists]: http://www.vtk.org/VTK/help/mailing.html
