Contributing to Glance
================================

This page documents at a very high level how to contribute to the Glance Viewer.

1. Glance's source is maintained on Github at [github.com/kitware/glance](https://github.com/kitware/glance)

2. [Fork Glance] into your user's namespace on Github.

3. Create a local clone of the main repository:

    ```sh
    $ git clone https://github.com/kitware/glance.git
    $ cd Glance
    ```

    The main repository will be configured as your `origin` remote.

4. Run the setup script to prepare Glance:
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


Glance uses Github for code review and Travis-CI to test proposed
patches before they are merged.

Our [DevSite] is used to document features, flesh out designs and host other
documentation as well as the API. There are also a [forum]
to coordinate development and to provide support.


[Fork Glance]: https://help.github.com/articles/fork-a-repo/
[Create a Pull Request]: https://help.github.com/articles/creating-a-pull-request/
[DevSite]: http://kitware.github.io/glance
[forum]: https://discourse.paraview.org/
