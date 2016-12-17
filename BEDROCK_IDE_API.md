# API Endpoints

## Overview

This API is for internal use by Bedrock IDE developers running a
localhost version of Bedrock under Apache.  Bedrock IDE is designed to
run on a local Apache installation (or server protected by firewall)
by a Bedrock developer that has installed the `bedrock-ide` project.
This API supports the Javascript based Bedrock IDE.

All API calls return a JSON object, possibly populated with the
following keys:

+ `data` - *whatever data might be presented by this API*
+ `status` - *`success` or `error`. If an error occurs look at `message`.*
+ `message` - *text message associated with API call, possibly an error message*

You can access the API locally on port 8080 (configurable) after starting the service.

```
$ sudo service bedrock-ided start
Starting bedrock-ided: Bedrock::IDE: You can connect to your server at http://localhost:8080/
                                                           [  OK  ]
$ curl http://localhost:8080/list
HTTP/1.0 200 OK
Content-Type: application/json

{
   "status" : "success",
   "data" : [
      {
         "bedrock" : []
      },
      {
         "foo" : []
      },
      {
         "bedrock-ide" : []
      },
      "itworks.rock",
      "index.roc",
      "notworking.html",
      "error.roc",
      "index.rock"
   ],
   "message" : ""
}
```

## Troubleshooting

### Apache Configuration

By default the project installs an Apache configuration file
`perl_bedrock-ide.conf` in `/etc/httpd/conf.d` that includes a
`ProxyPassMatch` directive creating a browser accessible endpoint at:

`http://localhost/bedrock-ide/api`

You should make sure your Apache configuration includes `mod_proxy` and `mod_proxy_http`.

```
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```

### Security

By default the Apache configuration requires a valid user using an
HTTP challenge.  Valid users by default are found in the
`bedrock.users` file as shown below.

```
<Directory /usr/share/bedrock-ide/htdocs>
   AcceptPathInfo On
   DirectorySlash Off
   Options -Indexes

   Order allow,deny
   Allow from all

   AuthType Basic
   AuthName Bedrock
   AuthUserFile /usr/lib/bedrock/config/bedrock.users
   require valid-user
</Directory>
````

**IMPORTANT: Remove the default the default user `admin` and add a new user.**

```
$ sudo htpasswd -D /usr/lib/bedrock/config/bedrock.users admin
$ sudo htpasswd /usr/lib/bedrock/config/bedrock.users <username>
```

### Log File

You can find a log file of API calls at `/var/log/httpd/bedrock-ide.log`.

You can modify the logging level by editing the `bedrock-ide.xml`
configuration file and hacking the `log4perl` section.

```
<object name="log4perl">
  <scalar name="log4perl.rootLogger">DEBUG, LOGFILE</scalar>
  <scalar name="log4perl.appender.LOGFILE">Log::Log4perl::Appender::File</scalar>
  <scalar name="log4perl.appender.LOGFILE.filename">/var/log/httpd/bedrock-ide.log</scalar>
  <scalar name="log4perl.appender.LOGFILE.mode">append</scalar>
  <scalar name="log4perl.appender.LOGFILE.layout">PatternLayout</scalar>
  <scalar name="log4perl.appender.LOGFILE.layout.ConversionPattern">%H %d [%P] - %F %M %L - %m%n</scalar>
</object>
```

## Endpoints

### /list

`GET /list/{sub-folder}`

*List files in the root or sub-folder*

*Returns a JSON object of scalars (files) and objects (folders).
Objects will have one key which is the folder name.  Note this API
only returns the files and folders at the level specified relative
to the `DOCUMENT_ROOT` defined in the Bedrock IDE configuration file.*

### /file

`GET /file/{path}`

*Create, update, delete, a file*

Returns the file text.

`POST /file/{path}`

Saves the file text.

`DELETE /file/{path}`

*Deletes the file.*

### /plugin

*Retrieve, Create, update, delete, a plugin*

`GET /plugin/{plugin-name}`

*Returns the plugin text. Plugins are found in by the IDE by looking
 in the `PLUGIN_PATH` defined in the Bedrock IDE configuration file.*

`POST /plugin`

*Creates a new plugin.  Provide `plugin` (plugin name, example: Foo)
and `binding` (example: foo) as data elements.  The binding is the
Bedrock object name that is used to invoke methods on the plugin. In
the example below `foo` is the binding.*


```
<var $foo.bar()>
```

**curl Example:**

```
$ curl -X POST --data "plugin=Foo&binding=foo" http://localhost:8080/plugin
```

`PUT /plugin/{plugin-name}`

*Saves the plugin script.  Note that the `message` key in the response
will contain an object rather than a text string.  The object will
contain two keys:*

+ `error` -> error message if any when the plugin is compiled
+ `lines` -> an array of line numbers where errors have occurred

*Reported line numbers are subject to all of the idiosyncracies and
nuances associated with `perl`'s error reporting.  As always, read
the error messages carefully and use your noggin.*

** jQuery (AJAX) example:**

```
$.ajax({url: '/bedrock-ide/api/plugin/Foo',
        data: $('#text').val(),
	method: 'PUT'
	contentType: 'plain/text',
	dataType: 'json',
	success: funciont(data) {
	  var message = data.message;
	  if ( data.status == "success" ) {
	    alert("woohoo, you roc(k)!");
	  }
	  else {
	    alert("you have an error: " + message.error);
	    alert("lines in error: " + message.lines.join(","));
          }
        }
       });
       
```

**curl Example:**

```
$ curl -X PUT -H 'Content-Type: plain/text' --data-binary @Foo.pm http://localhost:8080/plugin/Foo
```

`DELETE /plugin/{plugin-name}`

*Deletes the plugin and the configuration file.*

**curl example:**

```
$ curl -X DELETE http://localhost:8080/plugin/Foo
```

### /plugin/config

*Create, update, a plugin configuration*

`GET /plugin/config/{plugin-name}`

*Retrieve the plugin configuation (as a JSON object).*

**curl Example:**

```
$ curl -s http://localhost:8080/plugin/config/Foo
```

`POST /plugin/config/{plugin-name}`

*Save a plugin configuration.*

**curl Example:**

```
$ curl -s -o Foo.json http://localhost:8080/plugin/config/Foo
```

...then

```
$ curl -X POST -H 'Content-Type: application/json' --data-binary @Foo.json http://localhost:8080/plugin/config/Foo
```

### /config

*Retrieve or update the Bedrock IDE configuration. Make sure you
return all of the configuration information if you want to make
configuration changes.*

`GET /config`

*Returns a JSON object that represents the configuration. Configuration values include:*

+ `CONFIG_PATH_ROOT`
+ `PERL5LIB`
+ `DOCUMENT_ROOT`
+ `PLUGIN_PATH`
+ `HOST_NAME`
+ `INDEX_PAGE`
+ `PORT`

`POST /config`

*Send a JSON object that represents the configuration.*

You send a JSON object that contains **ALL* of the configuration
values listed above.  If not, you'll get an error.

### /tag

*Returns a list of Bedrock tags or the tag documentation.*

`GET /tag`

*Returns an array of Bedrock tag names.*

`GET /tag/{tag-name}`

*Returns the HTML documentation for a tag.*

**curl example:**

```
$ curl -s http://localhost:8080/tag/sqlconnect
```

### /plugin-doc

*Returns a JSON objec containing lists of Bedrock Application Plugins
 and Bedrock Plugins or the plugin documentation.*

`GET /plugin-doc`

*Returns a list of plugins.*

`GET /plugin-doc/{plugin-name}`

*Returns the HTML documentation of a tag.*

**curl example:**

```
$ curl -s http://localhost:8080/plugin-doc/BLM::Startup::UserSession
```
