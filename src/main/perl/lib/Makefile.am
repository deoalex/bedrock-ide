SUBDIRS = .

include $(top_srcdir)/directories.inc

perlrun = @PERL@

perlwc = @PERL@ -wc

# you should be using perl5libdir as the base target of your perl
# modules, not as simply part of your PERLINCLUDE
ax_perl5_extra_includes_opt = @ax_perl5_extra_includes_opt@
ax_perl5_extra_includes = @ax_perl5_extra_includes@

PERLMODULES = \
    Bedrock/IDE.pm.in \
    Bedrock/IDE/Config.pm.in \
    Bedrock/IDE/API.pm.in \
    Bedrock/IDE/Trapper.pm.in \
    Bedrock/IDE/Docs.pm.in

GPERLMODULES = $(PERLMODULES:.pm.in=.pm)
G1MANPAGES = $(GPERLSCRIPTS:.pm=.1man)

bedrock_ide_perl5libdir = $(perl5libdir)/Bedrock/IDE
bedrock_perl5libdir = $(perl5libdir)/Bedrock

bedrock_ide_perl5lib_DATA = \
    Bedrock/IDE/API.pm \
    Bedrock/IDE/Config.pm \
    Bedrock/IDE/Trapper.pm \
    Bedrock/IDE/Docs.pm

bedrock_perl5lib_DATA = \
    Bedrock/IDE.pm

dist_noinst_DATA = $(PERLMODULES)

man1_MANS = $(G1MANPAGES)

@do_subst_command@

if USING_PERL5_EXTRA_INCLUDES
PERL5_EXTRA_INCLUDES = $(ax_perl5_extra_includes_opt)
else
endif

# Please see the notes concerning PERLINCLUDE in the ../bin/Makefile.am file
PERLINCLUDE = \
    -I $(builddir) \
    -I $(builddir)/../lib \
    $(PERL5_EXTRA_INCLUDES) \
    -I $(perl5libdir)

Bedrock/IDE/API.pm: % : %.in Bedrock/IDE/Trapper.pm Bedrock/IDE/Config.pm Bedrock/IDE/Docs.pm
	test -d "$$(dirname "$@")" || $(INSTALL) -d "$$(dirname "$@")"
	$(do_subst) $< > $@
	$(perlwc) $(PERLINCLUDE) -wc $@ || { rm $@ && exit 1; }

Bedrock/IDE.pm: % : %.in Bedrock/IDE/API.pm Bedrock/IDE/Trapper.pm
	test -d "$$(dirname "$@")" || $(INSTALL) -d "$$(dirname "$@")"
	$(do_subst) $< > $@
	$(perlwc) $(PERLINCLUDE) -wc $@ || { rm $@ && exit 1; }

Bedrock/IDE/Trapper.pm: % : %.in
	test -d "$$(dirname "$@")" || $(INSTALL) -d "$$(dirname "$@")"
	$(do_subst) $< > $@
	$(perlwc) $(PERLINCLUDE) -wc $@ || { rm $@ && exit 1; }

Bedrock/IDE/Config.pm: % : %.in
	test -d "$$(dirname "$@")" || $(INSTALL) -d "$$(dirname "$@")"
	$(do_subst) $< > $@
	$(perlwc) $(PERLINCLUDE) -wc $@ || { rm $@ && exit 1; }

Bedrock/IDE/Docs.pm: % : %.in
	test -d "$$(dirname "$@")" || $(INSTALL) -d "$$(dirname "$@")"
	$(do_subst) $< > $@
	$(perlwc) $(PERLINCLUDE) -wc $@ || { rm $@ && exit 1; }

all:

CLEANFILES = $(GPERLMODULES)

$(G1MANPAGES): %.1man : %.pm
	target_name="$@";\
	tname=$$(echo "$${target_name}" | sed -e 's/\.1man$$//') ;\
	"$(POD2MAN)"  $< \
	--center="$(PACKAGE)" \
	--name="$${tname}" \
	--release=$(PACKAGE)-$(VERSION) \
	--section=1man > "$${target_name}" || true

.PHONY: clean-local
clean-local:
	$(MAKE) clean-generated-man-pages

.PHONY: clean-generated-man-pages
clean-generated-man-pages:
	for mpath in $(G1MANPAGES); do \
	rm -f "$${mpath}" ;\
	test $$? -eq 0 || exit 1 ;\
	done



