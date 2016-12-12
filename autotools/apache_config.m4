dnl dnl -*-m4-*-
dnl 
dnl ##
dnl ## $Id: apache_config.m4,v 1.1.1.1 2012/01/21 15:10:56 eutl420 Exp $
dnl ##
dnl 
dnl This file provides the 'APACHE_CONFIG' autoconf macro, which may be
dnl used to provide support for configuring Apache websites
dnl 
dnl autoconf variables provided by this macro include:
dnl 
dnl apache_vhost_addr     => address and port used in <VirtualHost> directive, ex: *:80
dnl
dnl apache_vhost_dir      => the directory where all the virtual hosts reside
dnl                          examples: /usr/local/vhosts, /var, /var/www/vhosts, etc.
dnl
dnl apache_vhost_confdir  => the directory where all the virtaul host configuration files reside 
dnl                          examples: /etc/httpd/conf.d, /etc/apache2/sites-available, 
dnl                          /usr/local/bin/conf/conf.d
dnl
dnl apache_vhost_config   => the name of the apache virtual host configuration file
dnl                          examples: www.signatureinfo.conf.in
dnl
dnl apache_vhost_domain   => the domain name of the website 
dnl                          examples: signatureinfo.com, charlesjones.com
dnl
dnl apache_vhost_server   => the fully qualified domain name (including subdomain) of the website
dnl                          examples: mars.signatureinfo.com, cjops.charlesjones.com
dnl
dnl apache_user           => the user that runs the apache server
dnl                          examples: www-data, apache, nobody
dnl
dnl apache_group          => the group the user that runs apache belongs to
dnl                          examples: www-data, apache, nobody 
dnl
dnl Dependencies
dnl ============
dnl 
dnl NONE
dnl 
dnl Usage
dnl =====
dnl 
dnl APACHE_CONFIG
dnl
dnl You might find a Makefile.am similar to that found below helpful.
dnl
dnl    SUBDIRS = .
dnl    
dnl    apache_vhost_dir = @apache_vhost_dir@
dnl    
dnl    apache_vhost_config = @apache_vhost_config@
dnl
dnl    apache_vhost_addr = @apache_vhost_addr@
dnl    
dnl    apache_user  = @apache_user@
dnl    apache_group = @apache_group@
dnl    
dnl    apache_vhost_domain  = @apache_vhost_domain@
dnl    apache_vhost_server  = @apache_vhost_server@
dnl    apache_vhost_confdir = @apache_vhost_confdir@
dnl    apache_vhost_config  = @apache_vhost_config@
dnl    
dnl    apache_sitedir = $(apache_vhost_dir)/$(apache_vhost_server)
dnl    
dnl    apache_site_configdir  = $(apache_sitedir)/config
dnl    apache_site_cgibindir  = $(apache_sitedir)/cgi-bin
dnl    apache_site_htmldir    = $(apache_sitedir)/html
dnl    apache_site_logdir     = $(apache_sitedir)/logs
dnl    
dnl    @do_subst_command@
dnl    
dnl    CONFIG = \
dnl        vhost-template.conf.in
dnl    
dnl    GCONFIG = \
dnl        $(apache_vhost_config)
dnl        
dnl    apache_vhost_conf_DATA = $(GCONFIG)
dnl    dist_noinst_DATA = $(CONFIG)
dnl    
dnl    $(GCONFIG): $(CONFIG)
dnl            $(do_subst) $< > $@
dnl    
dnl    all:
dnl    
dnl    CLEANFILES = $(GCONFIG)
dnl    
AC_DEFUN([APACHE_CONFIG],[
    dnl APACHE configuration

    dnl see if we can guess the layout
    if test -z "$apache_layout"; then
      if test -f /etc/debian_version; then
        apache_layout="Debian"
      elif test -f /etc/redhat-release; then
        apache_layout="RedHat"
      fi
    fi

    AC_ARG_WITH(
    	[apache-vhost-server],[  --with-apache-vhost-server=name, default: localhost],
    	[apache_vhost_server=$withval]
    	)
    
    AC_ARG_WITH(
    	[apache-vhost-domain],[  --with-apache-vhost-domain=name],
    	[apache_vhost_domain=$withval]
    	)
    
    if test -n "$apache_vhost_server"; then
      apache_vhost_domain=${apache_vhost_server#*.}
    fi

    if test -z "$apache_vhost_domain"; then
      AC_MSG_WARN([You don't have a domain name, so you won't have a ServerAlias])
      apache_vhost_server=localhost
      apache_vhost_domain=localhost
    else
      apache_vhost_alias="ServerAlias ${apache_vhost_domain}"
      AC_SUBST([apache_vhost_alias])
      AC_SUBST([apache_vhost_domain])
    fi

    if test -z "$apache_vhost_server"; then
      apache_vhost_server=www.${apache_vhost_domain}
    fi

    apache_vhost_domain_name=${apache_vhost_domain%.*}

    AC_MSG_RESULT([apache_vhost_domain_name = ${apache_vhost_domain_name}])

    AC_SUBST([apache_vhost_domain_name])
    AC_SUBST([apache_vhost_domain])
    AC_SUBST([apache_vhost_server])

    if test -z "$apache_vhost_dir"; then
      if test -d "/var/www"; then 
        apache_vhost_dir=/var/www/vhosts
      else
        apache_vhost_dir=${localstatedir}/vhosts
      fi
    fi

    AC_ARG_WITH(
    	[apache-vhost-dir],[  --with-apache-vhost-dir=DIR],
    	[apache_vhost_dir=$withval]
    	)
    
    AC_SUBST([apache_vhost_dir])

    dnl typical locations for configuration directory based on distro
    if test -z "$apache_vhost_confdir"; then
      if test "$apache_layout" = "Debian"; then
        if test -d /etc/apache2/sites-available; then
          apache_vhost_confdir=/etc/apache2/sites-available
        fi
      elif test "$apache_layout" = "RedHat"; then
         if test -d /etc/httpd/conf.d; then
           apache_vhost_confdir=/etc/httpd/conf.d
         fi
      else
         apache_vhost_confdir=${sysconfdir}/httpd/conf.d
      fi
    fi

    AC_ARG_WITH(
    	[apache-vhost-confdir],[  --with-apache-vhost-confdir=DIR, where Apache looks for virtual host configuration files],
    	[apache_vhost_confdir=$withval]
    	)
    
    AC_SUBST([apache_vhost_confdir])

    AC_MSG_RESULT([Apache configuration directory set to ${apache_vhost_confdir}?])
    
    dnl Your Apache virtual host config file should be named thusly
    apache_vhost_config=${apache_vhost_server}.conf
    AC_SUBST([apache_vhost_config])

    if test "$apache_layout" = "RedHat"; then
      apache_user=apache
      apache_group=apache
      apache_vhost_htdocsdir=/var/www/html
    elif test "$apache_layout" = "Debian"; then
      apache_user=www-data
      apache_group=www-data
      apache_vhost_htdocsdir=/var/www
    else
      apache_user=$(id www-data 2>/dev/null)

      if test -z "$apache_user"; then
        apache_user=$(id apache 2>/dev/null)
        if ! test -z "$apache_user"; then
          apache_user=apache
          apache_group=apache
        fi
      else
        apache_user=www-data
        apache_group=www-data
      fi
    fi

    AC_SUBST([apache_vhost_htdocsdir])

    AC_MSG_RESULT([apache user = ${apache_user} ?])
    AC_MSG_RESULT([apache group = ${apache_user} ?])
    
    AC_ARG_WITH(
    	[apache-user],[  --with-apache-user=USER          user id that should own the web pages],
    	[apache_user=$withval],
	[apache_user=${apache_user}]
    	)
    
    AC_SUBST([apache_user])
    
    AC_ARG_WITH(
    	[apache-group],[  --with-apache-group=GROUP        group that should own the web pages],
    	[apache_group=$withval],
	[apache_group=${apache_user}]
    	)
    
    AC_SUBST([apache_group])

    apache_vhost_addr="*:80"
    AC_ARG_WITH(
    	[apache-vhost_addr],[  --with-apache-vhost_addr=VHOST_ADDR        Address and port that should be used in the <VirtualHost> directive],
    	[apache_vhost_addr=$withval]
	[apache_vhost_addr=${apache_vhost_addr}]
    	)
    
    AC_SUBST([apache_vhost_addr])
])
