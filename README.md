# Overview

This is the README file for the `bedrock-ide` project.

`bedrock-ide` is a companion project to the web development framework
Bedrock.  It is a intended to be used by developers in a localhost
development environment.  `bedrock-ide` provides basic wiki-like
editing of web pages and Perl modules.

`bedrock-ide` is intended to be used by those learning Bedrock or
those interested in developing Bedrock applications using a
lightweight development framework.

Writing robust, secure, professional web applications most likely is
beyond the scope of what `bedrock-ide` is designed to provide,
however, with some intelligent feedback, Bedrock developers might be
able to help enhance this lightweight development environment.

Enjoy.

# CAUTION

**Bedrock IDE is designed to be used in a localhost environment.  That
means you probably should not be running the Bedrock IDE on a server
that is accessible from the internet.  The IDE allows you modify local
files in the webserver's document root as well as Perl modules you
might use as part of your application.  In other words, you (or
someone else) can write files and scripts to your server.**

If you do decide, **after being warned not to**, use Bedrock IDE over the
internet, you should consider some or all of these security
measures in addition to some I have not even thought of.

1. Use a sensible username and password by replacing the default
`/usr/lib/bedrock/config/bedrock.users` file.
2. Restrict the IPs that can access your website using either a
firewall on your server or modifying the Apache configuration.
3. Run your Apache server on a non-standard port to further obfuscate
your presence.

# Getting Started

See the Bedrock wiki to learn more about Bedrock IDE

http://twiki.openbedrock.net

------------------------------------------------------------------

See `NEWS` for fixes and enhancements since the last release.

See `ChangeLog` for information on specific files that have changed
since the last release.

See `INSTALL` for information on how to install the project using the
autotools toolchain.

See `HINTS` for tips and hints for installing and using
`bedrock-ide`.


