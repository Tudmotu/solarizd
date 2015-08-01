============================================================
Solarizd - Music Player App
============================================================

*Solarizd* is a music player which enables you to create playlists and get
recommendations for more music you might like. *Solarizd* uses freely available
streaming APIs such as `YouTube`_ and `SoundCloud`_ to deliver music-on-demand, and
harnesses the power of APIs like `The Echo Nest`_ and `last.fm`_ for recommendations.

A live demo can be viewed here: http://app.solarizd.com/

.. _YouTube: http://youtube.com
.. _SoundCloud: http://soundcloud.com
.. _`The Echo Nest`: http://the.echonest.com
.. _`last.fm`: http://last.fm

This README describes the steps required for setting up a development
environment. You are required to supply a json file containing API keys for
the relevant services used by this app, make sure to read `API Keys`_ section.


Installation
---------------------

Installation of *Solarizd* is simple and straightforward. First, you need to clone this repository (or clone your own fork of the
repository)::

    $ git clone https://github.com/Tudmotu/solarizd.git

Now that you have the code base, ``cd`` into the directory. We will now want to
install all of the dependencies for this project. First, you need to make sure you
already have ``node``, ``npm``, ``grunt`` and ``bower``. Depending on the
operating system that you are using, installation of ``node`` and ``npm`` may
vary. After installing these two, ``grunt`` and ``bower`` can be installed in
the following manner::

    $ npm install -g grunt-cli
    $ npm install -g bower

After veryfing your system satisfies the above requirements, the project's
dependencies can be installed in two simple steps::

    $ npm install
    $ bower install

After running these commands, you will be able to use the grunt tasks.


Development Workflow
--------------------
Solarizd is written with es6 syntax. This requires running Babel + Browserify
before changes take effect. There's a grunt task that instantiates a Watchify
instance, that will recompile the es6 code each time anything changes::

    $ grunt browserify:dev

Running this command will spawn a Watchify instance that will automatically
recompile your es6 code into browser-supported code.

You can also compile the bundle once, by running the following task::

    $ grunt browserify:build

*Note*: It is recommended to use the ``browserify:dev`` task while developing.

Karma Tests
-----------
There are some (currently only a few) tests that are run using Karma (Jasmine
as testing framework).

These tests can be run in two ways:

- Run the tests once::

    $ grunt karma:test

- Run a karma watch task, that will automatically run the
  tests whenever you make changes to code::

    $ grunt karma:dev


Running a Development Static Server
------------------------------------

We can run two instances of a development static server using
``grunt-contrib-connect``. In order to run static server that is pointed at
``src/``, execute::

    $ grunt connect:src

In order to run a static server pointed at ``target/``::

    $ grunt connect:target

The ``connect`` server will listen to ``localhost:9000``.


Build Process
---------------------

There's a grunt-task that will concatenate and minify the JS and CSS files,
and dump the result in ``target/``::

    $ grunt build

This will generate the minified app under the ``target/`` directory.


API Keys
---------------------

For the app to function, you need to supply it with API keys for the different
services it uses. Currently, *Solarizd* uses two APIs: YouTube, and The Echo Nest.
In the future it might and probably will support others. When it first loads,
the app will look for a file called ``apikeys.json``, in the same directory as
``index.html``. This file should contain a map of services and their appropriate
API keys. It should look something like this::

    {
        "youtube"     : "AIza......kq0A",
        "echonest"    : "TI..........UO",
    }

You should add this file to both the ``src/`` and the ``target/`` directories.


Credits
----------

Developed by Yotam Bar-On (Tudmotu), 2014-2015.


License
----------

This project is released under the MIT license (see LICENSE.rst).
