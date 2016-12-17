<!DOCTYPE html>
<html>
<head>
  <!-- Standard Meta -->
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <title>Bedrock IDE</title>

  <link rel="icon" type="image/icon" href="favicon.ico">

  <!-- css files -->
  <link rel="stylesheet" href="//cdn.jsdelivr.net/semantic-ui/2.2.6/semantic.min.css">
  <link rel="stylesheet" href="css/main.css">

</head>
<body>

  <!-- side bar -->

  <div class="ui vertical visible wide sidebar" id="file_list">
    <div class="logo-div">
      <a class="ui logo icon image" href="/bedrock-ide/index.roc">
        <img src="img/bedrock_logo.png" alt="bedrock image" class="bedrock-logo">
      </a>
    </div>
    <div class="files-div">
      <div class="header file-list-header">Files<i class="plus icon new-file"></i></div>
    </div>
    <div class="plugins-div">
      <div class="header plugin-list-header">Plugins<i class="plus icon new-plugin"></i></div>
    </div>
  </div>

  <!-- side bar -->

  <!-- pusher -->

  <div class="pusher">

    <div class="ui masthead vertical segment">
      <div class="ui container">
        <a class="popup icon item bedrock-settings" data-content="settings">
          <i class="settings large icon"></i>
        </a>
        <div class="introduction">
          <h1 class="ui header">
            Bedrock IDE           
          </h1>         
        </div>      
      </div>
    </div> 

    <div class="main ui container">
      <div class="ui right dividing rail right-side-rail">
        <div class="ui basic segment no-padding-left">        
          <div class="ui relaxed divided list bedrock-help-tags">
            <div class="item">
              <i class="tags icon"></i>
              <div class="content">
                <div class="header">Tags</div>              
                <div class="ui animated list bedrock-help-tag-list"></div>
              </div><!-- .content -->
            </div><!-- .item -->
          </div><!-- .bedrock-help-tags -->
        </div><!-- .segment -->
        <div class="ui basic segment no-padding-left">  
          <div class="ui relaxed divided list bedrock-help-plugins">
            <div class="item">
              <i class="plug icon"></i>
              <div class="content">
                <div class="header">Plugins</div>              
                <div class="ui animated list bedrock-help-plugin-list"></div>
              </div><!-- .content -->
            </div><!-- .item -->
          </div><!-- .bedrock-help-plugins -->
        </div><!-- .segment -->
        <div class="ui basic segment no-padding-left">  
          <div class="ui relaxed divided list bedrock-help-app-plugins">
            <div class="item">
              <i class="plug icon"></i>
              <div class="content">
                <div class="header">Application Plugins</div>              
                <div class="ui animated list bedrock-help-app-plugin-list"></div>
              </div><!-- .content -->
            </div><!-- .item -->
          </div><!-- .bedrock-help-app-plugins -->
        </div><!-- .segment -->
      </div><!-- .rail -->

      <div class="ui left floated main tiny menu file-menu">
        <a class="popup icon item save-file" data-content="save">
          <i class="save icon"></i>
        </a>
      </div>  

      <div class="ui right floated main tiny menu file-menu">    
        <a class="popup icon item run-file" data-content="run">
          <i class="caret right icon"></i>
        </a>
      </div>

      <div class="ui message bedrock-status-info"></div>

      <div class="main_tab_div">
        <input type="hidden" id="tab_cnt" name="tab_cnt" value="0">  
      </div>

      <div class="ui basic segment main-file-content">
        <div id="cursorDetails" class="ui basic segment"></div>
        <div id="fileLength" class="ui basic right floated"></div>
      </div>

    </div><!-- .main .ui .container -->

  </div><!-- .pusher -->

  <div class="ui large long modal bedrock-help-modal">
    <div class="header">
      <i class="close icon close-help-icon"></i>
      <div class="header-text"></div>      
    </div>
    <div class="content">
      <div class="ui message modal-status-info"></div>
      <div class="description"></div>
    </div>
    <div class="actions">
      <div class="ui button close-help-modal">OK</div>
    </div>
  </div>

  <div class="ui modal bedrock-settings-modal">
    <div class="header">
      Settings
      <i class="close icon close-settings-icon"></i>
    </div>
    <div class="content">
      <div class="ui message modal-status-info"></div>
      <form id="bedrock_settings_form" name="bedrock_settings_form" class="ui form">
        <div class="field">
          <label for="document_root">DOCUMENT_ROOT</label>
          <input type="text" id="document_root" name="document_root" placeholder="DOCUMENT_ROOT" size="60">
        </div>
        <div class="field">
          <label for="config_path_root">CONFIG_PATH_ROOT</label>
          <input type="text" id="config_path_root" name="config_path_root" placeholder="CONFIG_PATH_ROOT" size="60">
        </div>
        <div class="field">
          <label for="plugin_path">PLUGIN_PATH</label>
          <input type="text" id="plugin_path" name="plugin_path" placeholder="PLUGIN_PATH" size="60">
        </div>
        <div class="field">
          <label for="perl5lib">PERL5LIB</label>
          <input type="text" id="perl5lib" name="perl5lib" placeholder="PERL5LIB" size="60">
        </div>
        <div class="field">
          <label for="port">PORT</label>
          <input type="text" id="port" name="port" placeholder="PORT" size="60">
        </div>
        <div class="field">
          <label for="host_name">HOST_NAME</label>
          <input type="text" id="host_name" name="host_name" placeholder="HOST_NAME" size="60">
        </div>
        <div class="field">
          <label for="index_page">INDEX_PAGE</label>
          <input type="text" id="index_page" name="index_page" placeholder="INDEX_PAGE" size="60">
        </div>
      </form><!-- ui form -->
    </div>
    <div class="actions">
      <div class="ui red button close-settings-modal"><i class="remove icon"></i>Cancel</div>
      <div class="ui green button submit-settings-modal"><i class="checkmark icon"></i>Save</div>    
    </div>
  </div>

  <div class="ui modal bedrock-newfile-modal">
    <div class="header">
      New File
      <i class="close icon close-newfile-icon"></i>
    </div>
    <div class="content">
      <form id="bedrock_newfile_form" name="bedrock_newfile_form" class="ui form">
        <div class="field">
          <label for="file_name">File Name</label>
          <input type="text" id="file_name" name="file_name" placeholder="File Name" size="60">
        </div>
      </form><!-- ui form -->
    </div>
    <div class="actions">
      <div class="ui red button close-newfile-modal"><i class="remove icon"></i>Cancel</div>
      <div class="ui green button submit-newfile-modal"><i class="checkmark icon"></i>Create</div>    
    </div>
  </div>

  <div class="ui modal bedrock-newplugin-modal">
    <div class="header">
      New File
      <i class="close icon close-newplugin-icon"></i>
    </div>
    <div class="content">
      <form id="bedrock_newplugin_form" name="bedrock_newplugin_form" class="ui form">
        <div class="field">
          <label for="plugin_name">Plugin Name</label>
          <input type="text" id="plugin_name" name="plugin_name" placeholder="Plugin Name" size="60">
        </div>
        <div class="field">
          <label for="binding_name">Binding Name</label>
          <input type="text" id="binding_name" name="binding_name" placeholder="Binding Name" size="60">
        </div>
      </form><!-- ui form -->
    </div>
    <div class="actions">
      <div class="ui red button close-newplugin-modal"><i class="remove icon"></i>Cancel</div>
      <div class="ui green button submit-newplugin-modal"><i class="checkmark icon"></i>Create</div>    
    </div>
  </div>

  <div class="ui page inverted dimmer bedrock-dimmer">
    <div class="content">
      <div class="ui text loader">Loading</div>
    </div>
  </div>

  <!-- pusher -->  

  <!-- js files -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="//cdn.jsdelivr.net/semantic-ui/2.2.6/semantic.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ace.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ext-language_tools.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/theme-chrome.js"></script>
  <script src="javascript/main.js"></script>

</body>
</html>
