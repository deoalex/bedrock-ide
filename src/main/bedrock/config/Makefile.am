SUBDIRS = .

bedrock_ide_confdir = @libdir@/bedrock-ide/config

@do_subst_command@

CONFIG = \
    perl_bedrock-ide.conf.in

XCONFIG = \
    bedrock-ide.xml.in

GCONFIG = $(CONFIG:.in=)
GXCONFIG = $(XCONFIG:.in=)

$(GCONFIG): % : %.in
	$(do_subst) $< > $@

$(GXCONFIG): % : %.in
	$(do_subst) $< > $@

bedrock_ide_conf_DATA = $(GCONFIG) $(GXCONFIG)

dist_noinst_DATA = $(CONFIG) $(XCONFIG)

all: 

CLEANFILES = $(GCONFIG) $(GXCONFIG)
