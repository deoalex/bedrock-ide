<html>
  <title>Bedrock IDE</title>
  <head>
    <script src="http://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>

    <script type="text/JavaScript" src="/bedrock-ide/javascript/bedrock-ide.js"></script>
    <link rel="stylesheet" type="text/css" href="/bedrock-ide/css/bedrock-ide.css" />
    <link rel="stylesheet" type="text/css" href="/bedrock-ide/css/font-awesome.css" />
  </head>
  
  <body>
    <div id="bedrock-ide-container">
      <img id="bedrock-logo" src="/bedrock/img/bedrock.png">

      <div id="error-container" style="z-index:999;" class="modal-container">
	<div id="error-container-content" class="popup">
	  <div id="error-container-close" class="close-container">
	    <span id="error-close" class="window-close"><i class="fa fa-window-close"></i></span>
	  </div>
	  <div id="error-container-message">
	  </div>
	</div>
      </div>
      
      <div id="config-container" style="z-index:1;" class="modal-container">
	<div id="config-container-content" class="popup">
	  <div id="close-container" class="close-container">
	    <span id="config-close" class="window-close"><i class="fa fa-window-close"></i></span>
	  </div>
	  <label for="document-root">DOCUMENT_ROOT</label><input id="document-root" type="text" name="document_root" size="60"><br/>
	  <label for="config-path-root">CONFIG_PATH_ROOT</label><input id="config-path-root" type="text" name="config_path_root" size="60"><br/>
	  <label for="plugin-path">PLUGIN_PATH</label><input id="plugin-path" type="text" name="plugin_path" size="60"><br/>
	  <label for="perl5lib">PERL5LIB</label><input id="perl5lib" type="text" name="perl5lib" size="60"><br/>
	  <label for="port">PORT</label><input id="port" type="text" name="port" size="60"><br/>
	  <label for="host_name">HOST_NAME</label><input id="host_name" type="text" name="host_name" size="60"><br/>
	  <label for="index_page">INDEX_PAGE</label><input id="index_page" type="text" name="index_page" size="60"><br/>
	</div>
      </div>
      
      <div id="toolbar-container">
	<span class="toolbar" id="toolbar-save"     alt="Save"><i class="fa fa-2x fa-floppy-o"></i></span>
	<span class="toolbar" id="toolbar-run"      alt="Run"><i class="fa fa-2x fa-play-circle"></i></span>
	<span class="toolbar" id="toolbar-settings" alt="Settings"><i class="fa fa-2x fa-gears"></i></span>
	<span class="toolbar" id="toolbar-info"     alt="Info"><i class="fa fa-2x fa-info"></i></span>
	<span class="toolbar" id="toolbar-delete"   alt="Delete"><i class="fa fa-2x fa-trash"></i></span>
      </div>
      
      <div id="list-container">
	<h2>Bedrock Pages</h2>
	<div class="list" id="folder-list"></div>
	
	<h2>Plugins</h2>
	<div class="list" id="plugin-list"></div>
      </div>
      
      <div id="bedrock-text-container">
	<textarea id="bedrock-text"></textarea>
      </div>
      
    </div>
 
    <input id="path" type="hidden">
  </body>
</html>
