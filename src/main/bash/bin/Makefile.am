SUBDIRS = . 

perlrun = @PERL@
bashrun = @BASHRUN@

init_ddir = /etc/init.d

@do_subst_command@

BASHSCRIPTS = 

GBASHSCRIPTS = $(BASHSCRIPTS:.sh.in=.sh)

$(GBASHSCRIPTS): % : %.in
	$(do_subst) $< > $@

INIT_DSCRIPTS = bedrock-ided.in

GINIT_DSCRIPTS=$(INIT_DSCRIPTS:.in=)    

$(GINIT_DSCRIPTS): % : %.in
	$(do_subst) $< > $@

dist_noinst_DATA = \
    $(BASHSCRIPTS) \
    $(INIT_DSCRIPTS)

libexec_SCRIPTS = $(GBASHSCRIPTS)

init_d_SCRIPTS = $(GINIT_DSCRIPTS)

CLEANFILES = $(GBASHSCRIPTS) $(GINIT_DSCRIPTS)



