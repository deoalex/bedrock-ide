## Process this file with automake to produce Makefile.in -*-Makefile-*-
SUBDIRS = . src

# The ACLOCAL_AMFLAGS are used by 'autoreconf' and by the Makefile
# rebuild rule when they need to run 'aclocal'.
ACLOCAL_AMFLAGS = -I autotools

MARKDOWN = \
    BEDROCK_IDE_API.md \
    HINTS.md \
    README.md \
    TODO.md

FILES = \
    AUTHORS \
    INSTALL \
    BUGS \
    NEWS \
    COPYING \
    ChangeLog 

dist_doc_DATA = $(FILES) $(MARKDOWN)

## ensure that these files make it into the distribution tarball
EXTRA_DIST = \
    bedrock-ide.spec

MAINTAINERCLEANFILES = config.status \
                       config.log    \
                       bedrock-ide.spec  \
                       $(PACKAGE)-$(VERSION).tar.gz \
                       *~
