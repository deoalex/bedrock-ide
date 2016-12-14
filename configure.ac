dnl Process this file with autoconf to produce a configure script. -*-Autoconf-*-

AC_INIT([bedrock-ide], [2.0.0], [rlauer6@comcast.net])

dnl Ensure that a recent-enough version of Autoconf is being used
AC_PREREQ([2.61])

AC_CONFIG_AUX_DIR([autotools])

dnl Indicate dir where our custom m4 macros may be found (future
dnl proofing; as of may not be used yet...)
AC_CONFIG_MACRO_DIR([autotools])

dnl Turn on all Automake warnings and report them as errors
AM_INIT_AUTOMAKE([-Wall -Werror foreign])

dnl AC_REVISION puts cvs revision in comment at top of generated 'configure'
AC_REVISION([$Revision: 1.5 $])dnl

DFLT_MAINTAINER="rlauer6@comcast.net"

AC_SUBST([DFLT_MAINTAINER])

__poor_mans_expand_file_name () {
    _tmp_name=$1
    _tmp_last="`eval echo '${'"${_tmp_name}"'}'`"
    if test -z "${_tmp_last}"; then
        printf "__poor_mans_expand_file_name() (WARNING): var \"%s\" is empty\n" \
          "${_tmp_name}" 1>&2
        return 0;  # nothing to do
    fi
    _tmp_last_expanded="`eval echo ${_tmp_last}`"
    while test "${_tmp_last_expanded}" != "${_tmp_last}"; do

        # Set 'last' hold var to most recently expanded version...
        _tmp_last="${_tmp_last_expanded}"

        # ...and try to expand further.
        _tmp_last_expanded="`eval echo ${_tmp_last_expanded}`"
    done
    printf "%s\n" "${_tmp_last_expanded}"
    unset _tmp_last_expanded
    unset _tmp_last
    unset _tmp_name
    return 0;
}

[
do_subst_command='do_subst = sed \
  -e '"'"'s,[@]PACKAGE[@],$(PACKAGE),g'"'"' \
  -e '"'"'s,[@]VERSION[@],$(VERSION),g'"'"' \
  -e '"'"'s,[@]PATH_SEPARATOR[@],$(PATH_SEPARATOR),g'"'"' \
  -e '"'"'s,[@]configure_input[@],Generated from $@.in; do not edit by hand.,g'"'"' \
  -e "s,[@]BUILD_DATE[@],$$(date '"'"'+%Y-%m-%d %H:%M:%S'"'"'),g" \
  \
  -e '"'"'s,[@]bindir[@],$(bindir),g'"'"' \
  -e '"'"'s,[@]datadir[@],$(datadir),g'"'"' \
  -e '"'"'s,[@]exec_prefix[@],$(exec_prefix),g'"'"' \
  -e '"'"'s,[@]includedir[@],$(includedir),g'"'"' \
  -e '"'"'s,[@]infodir[@],$(infodir),g'"'"' \
  -e '"'"'s,[@]libdir[@],$(libdir),g'"'"' \
  -e '"'"'s,[@]libexecdir[@],$(libexecdir),g'"'"' \
  -e '"'"'s,[@]localstatedir[@],$(localstatedir),g'"'"' \
  -e '"'"'s,[@]mandir[@],$(mandir),g'"'"' \
  -e '"'"'s,[@]oldincludedir[@],$(oldincludedir),g'"'"' \
  -e '"'"'s,[@]prefix[@],$(prefix),g'"'"' \
  -e '"'"'s,[@]sbindir[@],$(sbindir),g'"'"' \
  -e '"'"'s,[@]sharedstatedir[@],$(sharedstatedir),g'"'"' \
  -e '"'"'s,[@]sysconfdir[@],$(sysconfdir),g'"'"' \
  \
  -e '"'"'s,[@]abs_builddir[@],$(abs_builddir),g'"'"' \
  -e '"'"'s,[@]abs_srcdir[@],$(abs_srcdir),g'"'"' \
  -e '"'"'s,[@]abs_top_builddir[@],$(abs_top_builddir),g'"'"' \
  -e '"'"'s,[@]srcdir[@],$(srcdir),g'"'"' \
  -e '"'"'s,[@]top_builddir[@],$(top_builddir),g'"'"' \
  -e '"'"'s,[@]top_srcdir[@],$(top_srcdir),g'"'"' \
  \
  -e '"'"'s,[@]cgibindir[@],$(cgibindir),g'"'"' \
  -e '"'"'s,[@]htdocsdir[@],$(htdocsdir),g'"'"' \
  -e '"'"'s,[@]pebblesdir[@],$(pebblesdir),g'"'"' \
  -e '"'"'s,[@]imgdir[@],$(imgdir),g'"'"' \
  -e '"'"'s,[@]cssdir[@],$(cssdir),g'"'"' \
  -e '"'"'s,[@]jsdir[@],$(jsdir),g'"'"' \
  -e '"'"'s,[@]configdir[@],$(configdir),g'"'"' \
  -e '"'"'s,[@]pkglibdir[@],$(pkglibdir),g'"'"' \
  \
  -e '"'"'s,[@]perlrun[@],$(perlrun),g'"'"' \
  -e '"'"'s,[@]co[@],$(co),g'"'"' \
  -e '"'"'s,[@]ci[@],$(ci),g'"'"' \
  -e '"'"'s,[@]rlog[@],$(rlog),g'"'"' \
\
  -e '"'"'s,[@]PERL[@],$(PERL),g'"'"' \
  -e '"'"'s,[@]PERL_LIBDIR[@],$(PERL_LIBDIR),g'"'"' \
  -e '"'"'s,[@]POD2MAN[@],$(POD2MAN),g'"'"' \
  -e '"'"'s,[@]ax_perl5_extra_includes[@],$(ax_perl5_extra_includes),g'"'"' \
  -e '"'"'s,[@]ax_perl5_extra_includes_opt[@],$(ax_perl5_extra_includes_opt),g'"'"' \
\
  -e '"'"'s,[@]apache_vhost_htdocsdir[@],$(apache_vhost_htdocsdir),g'"'"' \
  -e '"'"'s,[@]apache_vhost_dir[@],$(apache_vhost_dir),g'"'"' \
  -e '"'"'s,[@]apache_vhost_confdir[@],$(apache_vhos_confdir),g'"'"' \
  -e '"'"'s,[@]apache_default_htdocsdir[@],$(apache_default_htdocsdir),g'"'"' \
\
  -e '"'"'s,[@]bedrockdir[@],$(bedrockdir),g'"'"' \
  -e '"'"'s,[@]bedrock_perl5libdir[@],$(bedrock_perl5libdir),g'"'"' \
\
  -e '"'"'s,[@]AWK[@],$(AWK),g'"'"' \
  -e '"'"'s,[@]BASH_SH[@],$(BASH_SH),g'"'"' \
  -e '"'"'s,[@]bashrun[@],$(bashrun),g'"'"' \
  -e '"'"'s,[@]BASHRUN[@],$(BASHRUN),g'"'"' \
  -e '"'"'s,[@]CAT[@],$(CAT),g'"'"' \
  -e '"'"'s,[@]CHGRP[@],$(CHGRP),g'"'"' \
  -e '"'"'s,[@]CHOWN[@],$(CHOWN),g'"'"' \
  -e '"'"'s,[@]CI[@],$(CI),g'"'"' \
  -e '"'"'s,[@]CO[@],$(CO),g'"'"' \
  -e '"'"'s,[@]FIND[@],$(FIND),g'"'"' \
  -e '"'"'s,[@]GREP[@],$(GREP),g'"'"' \
  -e '"'"'s,[@]SED[@],$(SED),g'"'"' \
  -e '"'"'s,[@]RCS[@],$(RCS),g'"'"' \
  -e '"'"'s,[@]RCSDIFF[@],$(RCSDIFF),g'"'"' \
  -e '"'"'s,[@]RLOG[@],$(RLOG),g'"'"' \
  -e '"'"'s,[@]RM[@],$(RM),g'"'"' \
  -e '"'"'s,[@]RMDIR[@],$(RMDIR),g'"'"' \
'
]
AC_SUBST([do_subst_command])

dnl +------------------------+
dnl |  Checks for programs.  |
dnl +------------------------+

dnl makes $(LN_S) available in our Makefile.am files
AC_PROG_LN_S

AC_PATH_PROG([BASHRUN],
	[bash])
if test -z "$BASHRUN" ; then 
  AC_MSG_ERROR([bash not found?])
fi

AC_PATH_PROG([CAT], [cat])
if test -z "$CAT"; then
    AC_MSG_ERROR([cat not found])
fi

AC_PATH_PROG([CHGRP], [chgrp])
if test -z "$CHGRP"; then
    AC_MSG_ERROR([chgrp not found])
fi

AC_PATH_PROG([CHOWN], [chown])
if test -z "$CHOWN"; then
    AC_MSG_ERROR([chown not found])
fi

AC_PATH_PROG([FIND], [find])
if test -z "$FIND"; then
    AC_MSG_ERROR([find not found]);
fi

AC_PATH_PROG([AWK], [awk])
if test -z "$AWK"; then
    AC_MSG_ERROR([awk not found]);
fi

AC_PATH_PROG([GREP], [grep])
if test -z "$GREP"; then
    AC_MSG_ERROR([grep not found])
fi

AC_PATH_PROG([SED], [sed])
if test -z "$SED"; then
    AC_MSG_ERROR([sed not found])
fi

AC_PATH_PROG([RM], [rm])
if test -z "$RM"; then
    AC_MSG_ERROR([rm not found])
fi

AC_PATH_PROG([RMDIR], [rmdir])
if test -z "$RMDIR"; then
    AC_MSG_ERROR([rmdir not found])
fi

AC_ARG_WITH(
        [apache-layout],[  --with-apache-layout=LAYOUT      apache layout style (Debian or RedHat), default=NONE],
        [
         case "$withval" in

           'Debian')
                     apache_layout="$withval"
                     if test -z "$A2ENSITE"; then
                       AC_WARN([Debian layout doubtful, no a2ensite?])
                     fi
                     ;;
          'RedHat')
                     apache_layout="$withval"
                     ;;
                 *)
                    if test "$withval"; then
                      AC_ERROR([only values Debian or RedHat allowed])
                    fi
                    ;;
         esac
        ]
        )

AC_SUBST([apache_layout])

AC_ARG_WITH(
	[bedrockdir], [  --with-bedrockdir=DIR, default: /usr],
	[bedrockdir=$withval],
	[bedrockdir=/usr]
)

AC_SUBST([bedrockdir])

bedrock_perl5libdir=${bedrockdir}/lib/bedrock/perl5
bedrock_htdocsdir=${bedrockdir}/share/bedrock/htdocs
bedrock_cgibindir=${bedrockdir}/lib/bedrock/cgi-bin

AC_CHECK_FILES(
        [${bedrock_htdocsdir}/error.roc ${bedrock_cgibindir}/bedrock.cgi], 
	[AC_SUBST([bedrock_htdocsdir])],
        [AC_MSG_ERROR([Your Bedrock installation directory is incorrect or broken.  Can't find "error.roc".  Try --with-bedrockdir=DIR])]
)

APACHE_CONFIG

perl5libdir=\${datadir}/perl5
AC_ARG_WITH(
        [perl5libdir],[  --with-perl5libdir (defaults to [DATAROOTDIR]/perl5)],
        [
    if test "${withval}" = 'no'; then
        true
    elif test "$withval" = 'yes'; then
        perl5libdir=$($PERL -MConfig -wle 'print $Config{sitelib};')
    else
        perl5libdir=$withval    
    fi
        ]
)

if ! test -e release; then
 RELEASE="0"
else
  RELEASE=$(cat release)
fi

AC_SUBST([RELEASE])

AC_SUBST([perl5libdir])

dnl require /at least/ perl version 5.8.0
ads_PROG_PERL([5.008000])

# pod2man comes with perl, which the above verifies that we have. Not yet sure
# if we can rely on that (distribution packaging may provide it in an optional
# package, for instance), so we check for it explicitly here. We use pod2man
# at build time to create some of our man pages.
AC_PATH_PROG([POD2MAN], [pod2man])
if test -z "$POD2MAN"; then
    AC_MSG_ERROR([pod2man program not found])
fi

# Required Perl modules
ads_PERL_MODULE([CGI], [REQUIRED], [3.15])
ads_PERL_MODULE([Cwd],  [REQUIRED])
ads_PERL_MODULE([File::Basename],  [REQUIRED])
ads_PERL_MODULE([File::Copy],  [REQUIRED])
ads_PERL_MODULE([File::Path],  [REQUIRED])
ads_PERL_MODULE([File::Temp],  [REQUIRED])
ads_PERL_MODULE([Getopt::Long], [REQUIRED])
ads_PERL_MODULE([IO::File], [REQUIRED])
ads_PERL_MODULE([IO::Handle], [REQUIRED])
ads_PERL_MODULE([HTTP::Server::Simple], [REQUIRED])

dnl +---------------------+
dnl |  Autotools Output.  |
dnl +---------------------+
ads_PERL_LIBDIR

pkglibdir=${libdir}/${PACKAGE}
AC_SUBST([pkglibdir])

cgibindir=${pkglibdir}/cgi-bin
AC_SUBST([cgibindir], ["\${pkglibdir}/cgi-bin"])

htdocsdir=${datadir}/${PACKAGE}/htdocs
AC_SUBST([htdocsdir], ["\${datadir}/\${PACKAGE}/htdocs"])

pebblesdir=${datadir}/${PACKAGE}/pebbles
AC_SUBST([pebblesdir], ["\${datadir}/\${PACKAGE}/pebbles"])

imgdir=${datadir}/${PACKAGE}/img
AC_SUBST([imgdir], ["\${datadir}/\${PACKAGE}/img"])


cssdir=${datadir}/${PACKAGE}/css
AC_SUBST([cssdir], ["\${datadir}/\${PACKAGE}/css"])

jsdir=${datadir}/${PACKAGE}/js
AC_SUBST([cssdir], ["\${datadir}/\${PACKAGE}/css"])

configdir=${libdir}/${PACKAGE}/config
AC_SUBST([configdir], ["\${libdir}/\${PACKAGE}/config"])

AX_DISTCHECK_HACK

dnl Declare our output Makefiles
AC_CONFIG_FILES(
	[${PACKAGE_NAME}.spec]
        [Makefile]
        [src/Makefile]
        [src/main/Makefile]
        [src/main/bedrock/Makefile]
        [src/main/bedrock/css/Makefile]
        [src/main/bedrock/htdocs/Makefile]
        [src/main/bedrock/img/Makefile]
        [src/main/bedrock/config/Makefile]
        [src/main/bedrock/javascript/Makefile]
        [src/main/perl/Makefile]
        [src/main/perl/bin/Makefile]
        [src/main/perl/lib/Makefile]
        [src/main/bash/Makefile]
        [src/main/bash/bin/Makefile]
)

dnl Actually output the declared files
AC_OUTPUT

dnl show user a summary of the configured options
printf "\n"
printf "${PACKAGE} has been configured with the following options:\n"
printf "                        Prefix: %s\n" "`__poor_mans_expand_file_name prefix`"
printf "                 User binaries: %s\n" "`__poor_mans_expand_file_name bindir`"
printf "               System binaries: %s\n" "`__poor_mans_expand_file_name sbindir`"
printf "           Configuration files: %s\n" "`__poor_mans_expand_file_name sysconfdir`"
printf "                  Manual pages: %s\n" "`__poor_mans_expand_file_name mandir`"
printf "\n"
printf "                     cgibindir: %s\n" "`__poor_mans_expand_file_name cgibindir`"
printf "                        imgdir: %s\n" "`__poor_mans_expand_file_name imgdir`"
printf "\n"
printf "                          bash: %s\n" "`__poor_mans_expand_file_name BASHRUN`"
printf "                          perl: %s\n" "`__poor_mans_expand_file_name PERL`"
printf "\n"
printf "          Apache Configuration:\n"
printf "                   apache_user: %s\n" "`__poor_mans_expand_file_name apache_user`"
printf "                  apache_group: %s\n" "`__poor_mans_expand_file_name apache_group`"
printf "              apache_vhost_dir: %s\n" "`__poor_mans_expand_file_name apache_vhost_dir`"
printf "          apache_vhost_confdir: %s\n" "`__poor_mans_expand_file_name apache_vhost_confdir`"
printf "        apache_vhost_htdocsdir: %s\n" "`__poor_mans_expand_file_name apache_vhost_htdocsdir`"
