
$(document).ready(function() {

  /******** functions ***********/

  function bedrock_status_message_set(mode, msg) {
    $(".bedrock-status-info").removeClass("success error").html("").hide();
    if (mode == "success") {
      $(".bedrock-status-info").removeClass("success error").addClass("success").html($("<p>").html(msg));
    }
    else if (mode == "error") {
      $(".bedrock-status-info").removeClass("success error").addClass("error").html($("<p>").html(msg));
    }
    $(".bedrock-status-info").show();
    setTimeout(function() {
      $(".bedrock-status-info").fadeOut(1000, function() {
        $(this).removeClass("success error").empty();
      });
    }, 5000);
  }

  function modal_status_message_set(mode, msg) {
    $(".modal-status-info").removeClass("success error").html("").hide();
    if (mode == "success") {
      $(".modal-status-info").removeClass("success error").addClass("success").html($("<p>").html(msg));
    }
    else if (mode == "error") {
      $(".modal-status-info").removeClass("success error").addClass("error").html($("<p>").html(msg));
    }
    $(".modal-status-info").show();
    setTimeout(function() {
      $(".modal-status-info").fadeOut(1000, function() {
        $(this).removeClass("success error").empty();
      });
    }, 5000);
  }

  function add_new_tab(data, file_name, file_type) {
    $(".file_list_tab .item").removeClass("active");
    $(".main_tab_div .segment").removeClass("active");

    $("#tab_cnt").val(parseInt($("#tab_cnt").val()) + 1);
    if ($(".file_list_tab").size() == "0") {
      var file_list_tab = $("<div>").addClass("ui top attached tabular menu file_list_tab");
      $(file_list_tab).appendTo(".main_tab_div");
    }
    var tab_link = $("<a>").addClass("item active").attr("data-tab", "tab-item" + $("#tab_cnt").val()).html(file_name);
    var close_link = $("<i>").addClass("close icon link close-tab");
    $(close_link).appendTo(tab_link);
    $(tab_link).appendTo(".file_list_tab");

    var tab_segment = $("<div>").addClass("ui bottom attached active tab segment")
                        .attr("data-tab", "tab-item" + + $("#tab_cnt").val());

    var edit = $("<div>").addClass("editor")
                    .attr("id", "editor" + $("#tab_cnt").val())
                    .attr("data-file-name", file_name)
                    .attr("data-file-type", file_type);
    $(edit).appendTo(tab_segment);

    $(tab_segment).appendTo(".main_tab_div");

    $(".file_list_tab .item").tab({
      onVisible: function() {
        $("#cursorDetails, #fileLength").html("");
        $(".bedrock-status-info").removeClass("success error").html("").hide();
        var id = $(this).find(".editor").attr("id");
        var current = ace.edit(id);
        current.focus();
      }
    });

    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor" + $("#tab_cnt").val());  
    editor.setTheme("ace/theme/chrome");
    if (file_type == "file") {
      editor.getSession().setMode("ace/mode/php");
    }
    else if (file_type == "plugin") {
      editor.getSession().setMode("ace/mode/perl");
    }
    else if(file_type == "script") {
      editor.getSession().setMode("ace/mode/sh");
    }
    editor.$blockScrolling = Infinity;
    editor.getSession().setTabSize(2);

    // enable autocompletion and snippets
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });

    editor.selection.on("changeCursor", function(e) {    
      $("#cursorDetails").html("<label> Row: " + (parseInt(editor.selection.getCursor().row) + 1) + " Col: " + (parseInt(editor.selection.getCursor().column) + 1) + "</label>");   
      $("#fileLength").html("<label> #Lines: " + editor.session.getLength() + "</label>");        
    });

    editor.on("change", function() {
      if(!editor.session.getUndoManager().isClean()) {
        $(edit).attr("data-is-updated", "1");
      }
    });

    editor.commands.addCommand({
      name: "saveCommand",
      bindKey: {win: "Ctrl-S",  mac: "Cmd-S"},
      exec: function(editor) {
        $(".save-file").trigger("click");
      },
      readOnly: false
    });

    editor.commands.addCommand({
      name: "closeCommand",
      bindKey: {win: "Ctrl-X",  mac: "Cmd-X"},
      exec: function(editor) {
        $(".file_list_tab a.item.active i.close-tab").trigger("click");
      }
    });

    update_recently_viewed(file_name, file_type);

    editor.setValue(data);
    $("body").animate({ scrollTop: "0px" }, 500);
    editor.gotoLine(1);
    editor.getSession().setUseWrapMode(true);
    editor.focus();
  }

  function get_file_content(file_name, file_type) {
    var uri = "/bedrock-ide/api/" + file_type + "/" + file_name;
    $.ajax({
      url: uri,          
      type: "GET",
      success: function(data) {
        if(data.status == "success") {          
          data = data.data;
          add_new_tab(data, file_name, file_type); 
        }
        else {
          bedrock_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  }

  function build_project() {
    var uri = "/bedrock-ide/api/build";
    var source = new EventSource(uri);
    source.onmessage = function(e) {
      append_build_stream(e.data);
    };
    source.onerror = function(e) {
      append_build_stream(e.data);
      toggle_stream(true);
      this.close();
    };
    source.addEventListener('close', function(e) {
      append_build_stream(e.data);
      toggle_stream(true);
      this.close();
    });
  }

  function append_build_stream(line) {
    var stream = $('.build-stream');
    stream.append(line+"\n");
    stream.scrollTop(stream[0].scrollHeight - stream[0].clientHeight);
  }

  function toggle_stream(on) {
    var button = $('.run-build');
    if (on)
      button.css('pointer-events', 'auto');
      /*button.removeClass('disabled loading');*/
    else {
      button.css('pointer-events', 'none');
      /*button.addClass('disabled loading');*/
      $('.build-stream').empty();
      $('.build-stream').css("display", "flex");
    }
  }

  function save_file_content(file_content, file_name, file_type) {  
    var uri;
    if (file_type == "script") {
      uri = "/bedrock-ide/api/build-script";
    }
    else {
      uri = "/bedrock-ide/api/" + file_type + "/" + file_name;   
    }

    $.ajax({
      url: uri,
      method: "PUT",
      contentType: "text/plain",
      data: file_content,
      dataType: 'json',
      success: function(data) {
        if ( data.status == "success" ) {
          if (file_type == "plugin") {
            var current_editor = $("div.tab.active").find(".editor").attr("id");
            var editor = ace.edit(current_editor);
            editor.getSession().setAnnotations([]);
          }
          bedrock_status_message_set("success", "File saved successfully.");
        }
        else {
          if (file_type == "file") {
            bedrock_status_message_set("error", data.message);
          }
          else {
            var lines = "";
            if (typeof(data.message.lines) != "undefined") {    
              var current_editor = $("div.tab.active").find(".editor").attr("id");
              var editor = ace.edit(current_editor);
              editor.session.setOption("useWorker", false);              
              var line_marker_collection = [];
              $.each(data.message.lines, function(index) {              
                var line_num = data.message.lines[index];
                if (lines == "") {
                  lines = line_num;
                }
                else {
                  lines += ", " + line_num;
                }
                line_marker = {};
                line_marker["row"] = line_num - 1;
                line_marker["column"] = "0";
                line_marker["type"] = "error";              
                line_marker_collection.push(line_marker);
              });
              editor.getSession().setAnnotations(line_marker_collection);
            }
            var msg= "";
            if (lines != "") {
              msg = "<p>" + data.message.error + "</p><p>Please check line no: " + lines + "</p>";
            }
            else {
              msg = "<p>" + data.message.error + "</p>";
            }
            bedrock_status_message_set("error", msg);            
          }
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  }

  function get_files_list(isFolder, folderDOM) {
    var url, item, folder;

    if(isFolder) {
      item = folderDOM;
      folder = $(folderDOM).data("folder-uri");
      url = "/bedrock-ide/api/list/" + folder;
      item.find(".files-list").remove();
    }
    else {
      item = $(".files-div");
      folder = "";
      url = "/bedrock-ide/api/list/";
    }

    $.ajax({
      url: url,
      dataType: "json",
      success: function(data) {        
        if(data.status == "success") {          
          data = data.data;
          data.sort();

          var list = $("<div>").addClass("ui list files-list");

          $.each(data, function(key,val){
            if ( typeof(val) == "object" ) {
              var k = Object.keys(val);

              var list_item = $("<div>").addClass("item");
              var header = $("<div>").addClass("header load-folder").attr("data-folder-uri", folder + k[0] + "/").html("<i class='icon folder link'></i>" + k[0]);

              $(header).appendTo(list_item);

              $(list_item).appendTo(list);
              $(list).appendTo(item);
            }
            else {
              var list_item = $("<div>").addClass("item");

              var file = $("<a>").html(val).addClass("item load-file").attr("data-file-uri", folder + val);
              var del = $("<a>").html($("<i>").addClass("trash icon link delete-file").attr("title", "delete"));

              $(file).appendTo(list_item);
              $(del).appendTo(list_item);

              $(list_item).appendTo(list);
              $(list).appendTo(item);
            }
          });
        }
        else {
          bedrock_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  }

  function get_plugins_list() {
    var url = "/bedrock-ide/api/plugin";
    var item = $(".plugins-div");      

    $.ajax({
      url: url,
      dataType: "json",
      success: function(data) {
        if ( data.status == "success" ) {
          data = data.data;
          data.sort();

          var list = $("<div>").addClass("ui list plugins-list");

          $.each(data, function(index){
            var list_item = $("<div>").addClass("item");

            var edit = $("<a>").html($("<i>").addClass("setting icon link edit-plugin"));            
            var plugin = $("<a>").html(data[index]).addClass("item load-plugin").attr("data-file-uri", data[index]);
            var del = $("<a>").html($("<i>").addClass("trash icon link delete-plugin"));     

            $(edit).appendTo(list_item);
            $(plugin).appendTo(list_item);
            $(del).appendTo(list_item);

            $(list_item).appendTo(list);
            $(list).appendTo(item);     

          });
        }
        else {
          bedrock_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  }

  function update_recently_viewed(file_name, file_type) {
    var item; 
    var list;

    if ($(".recent-div").find("div.recently-viewed-list").size() == "0") {
      var item = $(".recent-div");
      list = $("<div>").addClass("ui list recently-viewed-list");
    }
    else {
      list = $(".recent-div").find("div.recently-viewed-list");
    }

    var list_item = $("<div>").addClass("item");

    var load_class;

    if (file_type == "file") {
      load_class = "load-file";
    }
    else if (file_type == "plugin") {
      load_class = "load-plugin";
    }

    var file = $("<a>").html(file_name).addClass("item " + load_class).attr("data-file-uri", file_name);

    $(file).appendTo(list_item);

    $(list_item).appendTo(list);

    if ($(".recent-div").find("div.recently-viewed-list").size() == "0") {
      $(list).appendTo(item); 
    }

    var list_size = $(".recent-div").find("a.item").size();

    if(list_size > 5) {
      var del_item = list_size - 5;
      for (var i = 1; i <= del_item; i++) {
        $(".recent-div").find("a.item:first").parent("div.item").remove();
      };
    }

    $(".recent-div").show();

    if ($(".show-recent-files").is(":visible")) {
      $(".recently-viewed-list").hide();
    } else {
      $(".recently-viewed-list").show();
    }
  }

  function initialize_config() {
    $.ajax({
      url: "/bedrock-ide/api/config",
      dataType: "json",
      success: function(data) {
        if ( data.status == "success" ) {
          data = data.data;
          bedrock_ide_config = data;
          $.each(data, function(key, val) {            
            var div = $("<div>").addClass("field");
            var label = $("<label>").attr("for", key).html(key);
            var input = $("<input>").attr({
              "id" : key,
              "name" : key,
              "placeholder" : key,
              "size": "60",
              "class": "bedrock-config-inputs"
            }).val(val);
            $(label).appendTo($(div));
            $(input).appendTo($(div));
            $(div).appendTo($("#bedrock_settings_form"));
          });
          
          var edit_script_icon = $("<i>").addClass("edit large icon link add_edit_script");
          var field = $("#BUILD_SCRIPT").parent("div.field");
          $(edit_script_icon).appendTo(field);

          $(".bedrock-settings-modal").modal("refresh");
        }
        else {
          bedrock_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  }

  function get_config() {
    //make an ajax call to get config info
    $(".bedrock-settings-modal").modal("setting", "closable", false).modal("show");
    $.ajax({
      url: "/bedrock-ide/api/config",
      dataType: "json",
      success: function(data) {
        if ( data.status == "success" ) {
          data = data.data;
          bedrock_ide_config = data;
          $.each(data, function(key, val) {            
            var div = $("<div>").addClass("field");
            var label = $("<label>").attr("for", key).html(key);
            var input = $("<input>").attr({
              "id" : key,
              "name" : key,
              "placeholder" : key,
              "size": "60",
              "class": "bedrock-config-inputs"
            }).val(val);
            $(label).appendTo($(div));
            $(input).appendTo($(div));
            $(div).appendTo($("#bedrock_settings_form"));
          });
          
          var edit_script_icon = $("<i>").addClass("edit large popup icon link add_edit_script")
                                          .attr("data-content", "edit build script");
          var field = $("#BUILD_SCRIPT").parent("div.field");
          $(edit_script_icon).appendTo(field);

          $(".bedrock-settings-modal").modal("refresh");
          $(".add_edit_script").popup({
            hoverable  : true,
            inline     : true
          });
        }
        else {
          modal_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        modal_status_message_set("error", error);
      }
    });
  }

  function save_config() {
    var config_json = {};
    $.each($(".bedrock-config-inputs"), function() {        
      config_json[$(this).attr("id")] = $(this).val();
    });
    
    $.ajax({
      url: "/bedrock-ide/api/config",
      method: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(config_json),
      success: function(data) {
        if ( data.status == "success" ) {
          bedrock_ide_config = data.data;
          modal_status_message_set("success", "Settings saved successfully.");
          var files_div = $(".files-div");
          files_div.find(".files-list").remove();   
          var plugins_div = $(".plugins-div");
          plugins_div.find(".plugins-list").remove();
          get_files_list(false); 
          get_plugins_list();           
        }
        else {
          modal_status_message_set("error", data.message);             
          fatal = true;
        }
      },
      error: function() {
        modal_status_message_set("error", error);         
      }
    });
  }

  function new_file_content(file_content, file_name, binding_name, file_type) {
    var method_type, content_type;
    if (file_type == "file") {
      var uri = "/bedrock-ide/api/" + file_type + "/" + file_name;
      method_type = "PUT";
      data_value = "";
      content_type = "text/plain";
    }
    else if (file_type == "plugin") {
      var uri = "/bedrock-ide/api/" + file_type;
      method_type = "POST";
      data_value = 
          { 
           "plugin"  : file_name,
           "binding" : binding_name
          };
      content_type = "application/x-www-form-urlencoded; charset=UTF-8";
    }
    
    $.ajax({
      url: uri,
      method: method_type,
      contentType: content_type,
      data: data_value,
      success: function(data) {
        if ( data.status == "success" ) {
          $(".main_tab_div, .file-menu").css("display", "block");                  
          if (file_type == "file") {
            $(".file-list-header").next(".files-list").remove();
            get_files_list(false);
            bedrock_status_message_set("success", "File created successfully.");
          }
          else if (file_type == "plugin") {
            $(".plugin-list-header").next(".plugins-list").remove();
            get_plugins_list();
            bedrock_status_message_set("success", "Plugin created successfully.");
          }
          get_file_content(file_name, file_type);
        }
        else {
          bedrock_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  }

  function get_tags_list() {
    var url = "/bedrock-ide/api/tag";
    var list = $(".bedrock-help-tag-list");      

    $.ajax({
      url: url,
      dataType: "json",
      success: function(data) {
        if ( data.status == "success" ) {
          data = data.data;
          data.sort();
          $.each(data, function(index){
            var item = $("<div>").addClass("item");
            var content = $("<div>").addClass("content");
            var description = $("<div>").addClass("description");
            var a = $("<a>").addClass("help-file").html(data[index]).attr("data-tag-name", data[index]);
            $(a).appendTo(description);
            $(description).appendTo(content);
            $(content).appendTo(item);
            $(item).appendTo(list);
          });
        }
        else {
          bedrock_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  }

  function get_plugins_doc_list() {
    var url = "/bedrock-ide/api/plugin-doc";
    var list_plugins = $(".bedrock-help-plugin-list");
    var list_app_plugins = $(".bedrock-help-app-plugin-list");

    $.ajax({
      url: url,
      dataType: "json",
      success: function(data) {
        if ( data.status == "success" ) {
          var data_plugins = data.data["plugins"];
          data_plugins.sort();
          $.each(data_plugins, function(index){
            var item = $("<div>").addClass("item");
            var content = $("<div>").addClass("content");
            var description = $("<div>").addClass("description");
            var a = $("<a>").addClass("help-plugin").html(data_plugins[index]).attr("data-plugin-name", data_plugins[index]);
            $(a).appendTo(description);
            $(description).appendTo(content);
            $(content).appendTo(item);
            $(item).appendTo(list_plugins);
          });

          var data_app_plugins = data.data["application-plugins"];
          data_app_plugins.sort();
          $.each(data_app_plugins, function(index){
            var item = $("<div>").addClass("item");
            var content = $("<div>").addClass("content");
            var description = $("<div>").addClass("description");
            var a = $("<a>").addClass("help-plugin").html(data_app_plugins[index]).attr("data-plugin-name", data_app_plugins[index]);
            $(a).appendTo(description);
            $(description).appendTo(content);
            $(content).appendTo(item);
            $(item).appendTo(list_app_plugins);
          });
        }
        else {
          bedrock_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  }

  function get_build_script() {
    var uri = "/bedrock-ide/api/build-script";
    $.ajax({
      url: uri,          
      type: "GET",
      success: function(data) {
        if(data.status == "success") {          
          data = data.data.data.data;
          $(".bedrock-settings-modal").modal("hide");
          add_new_tab(data, bedrock_ide_config.BUILD_SCRIPT, "script"); 
        }
        else {
          var error = data.message;
          var regExp = /no BUILD_SCRIPT found at/;
          if (regExp.test(error)) {
            $(".bedrock-settings-modal").modal("hide");
            new_build_script();
          }
          else {
            modal_status_message_set("error", data.message);
          }
        }
      },
      error: function(xhr,status,error) {
        modal_status_message_set("error", error);
      }
    });
  }

  function new_build_script() {
    var uri = "/bedrock-ide/api/build-script";
    $.ajax({
      url: uri,          
      type: "POST",
      contentType: "text/plain",
      success: function(data) {
        if(data.status == "success") {          
          data = data.data;
          add_new_tab(data, bedrock_ide_config.BUILD_SCRIPT, "script"); 
        }
        else {
          modal_status_message_set("error", error);
        }
      },
      error: function(xhr,status,error) {
        modal_status_message_set("error", error);
      }
    });
  }

  /********************************/

  $("#file_list").sidebar();
  $(".help_accordion").accordion();

  $(".chk_attr").checkbox();

  $(".popup").popup({
    position : "bottom center",
    hoverable  : true,
    inline     : true
  });

  $(".bedrock-dimmer").dimmer({
    closable: false
  });

  $(".bedrock-help-modal").modal({
    blurring: true
  });

  $(".main_tab_div, .file-menu").css("display", "none");

  //initial files & folder load
  get_files_list(false);

  //initial plugins load
  get_plugins_list();

  //initial tags load
  get_tags_list();

  //initial plugins load
  get_plugins_doc_list();

  //get config variables
  initialize_config();

  $.ajaxSetup({
    cache: false
  });

  $(".hide-sidebar-btn").click(function() {
    if ($("#file_list").hasClass("visible")) {
      $("#file_list").removeClass("visible");
      $("#screen_width").val($(".main.ui.container").css("width"));
      $(".main.ui.container").css("width", "75%");
    }
    else {
      $("#file_list").addClass("visible");
      $(".main.ui.container").css("width", $("#screen_width").val());
    }
  });

  $(document).on("click", ".load-file", function(e) {
    e.stopPropagation();
    var file_name = $(this).data("file-uri");
    $(".main_tab_div, .file-menu").css("display", "block");
    get_file_content(file_name, "file");    
  });

  $(document).on("click", ".load-plugin", function(e) {
    e.stopPropagation();
    var file_name = $(this).data("file-uri");
    $(".main_tab_div, .file-menu").css("display", "block");
    get_file_content(file_name, "plugin");    
  });

  $(document).on("click", ".load-folder", function(e) {
    e.stopPropagation();
    if ($(this).find(".files-list").size() != "0") {
      $(this).find(".files-list").toggle();
    }
    else {
      get_files_list(true, $(this));
    }
  });

  $(document).on("click", ".file-list-header", function(e) { 
    e.stopPropagation();
    $(".files-list:first").transition("toggle");
  });

  $(document).on("click", ".plugin-list-header", function(e) { 
    e.stopPropagation();
    $(".plugins-list:first").transition("toggle");
  });

  $(document).on("click", ".close-tab", function(e) {
    e.preventDefault();
    var current_editor = $("div.tab.active").find(".editor").attr("id");  
    var is_updated = $("#" + current_editor).data("is-updated");
    var file_name = $("#" + current_editor).data("file-name");

    var close_flag = false;
    
    if (is_updated == "1") {
      if ( confirm("Are you sure you want to close " + file_name + " before save ?") ) { 
        close_flag = true;
      }
    }
    else {
      close_flag = true;
    }

    if(close_flag) {
      var data_value = $(this).closest("a").data("tab");
      $("*[data-tab=" + data_value + "]").remove();
      $(".file_list_tab a:first").click();
      if($(".file_list_tab a").size() == "0") {
        $(".file_list_tab").remove();
        $(".main_tab_div, .file-menu").css("display", "none");
        $("#cursorDetails, #fileLength").html("");
      }
    }
  });

  $(".bedrock-help-tags .header:first").click(function(e) { 
    e.stopPropagation();
    $(".bedrock-help-tag-list").toggle();
  });

  $(".bedrock-help-plugins .header:first").click(function(e) { 
    e.stopPropagation();
    $(".bedrock-help-plugin-list").toggle();
  });

  $(".bedrock-help-app-plugins .header:first").click(function(e) { 
    e.stopPropagation();
    $(".bedrock-help-app-plugin-list").toggle();
  });

  $(document).on("click", ".help-file", function(e) {
    e.stopPropagation();
    var tag_name = $(this).data("tag-name");
    var url = "/bedrock-ide/api/tag/" + tag_name;    

    $.ajax({
      url: url,
      dataType: "json",
      success: function(data) {
        if ( data.status == "success" ) {
          $(".bedrock-help-modal .header .header-text").html(tag_name);
          $(".bedrock-help-modal .description").html(data.data);
          $(".bedrock-help-modal").modal("show");
        }
        else {
          bedrock_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  });

  $(document).on("click", ".help-plugin", function(e) {
    e.stopPropagation();
    var plugin_name = $(this).data("plugin-name");
    var url = "/bedrock-ide/api/plugin-doc/" + plugin_name;    

    $.ajax({
      url: url,
      dataType: "json",
      success: function(data) {
        if ( data.status == "success" ) {
          $(".bedrock-help-modal .header .header-text").html(plugin_name);
          $(".bedrock-help-modal .description").html(data.data);
          $(".bedrock-help-modal").modal("show");
        }
        else {
          bedrock_status_message_set("error", data.message);
        }
      },
      error: function(xhr,status,error) {
        bedrock_status_message_set("error", error);
      }
    });
  });

  $(".close-help-icon, .close-help-modal").click(function() {
    $(".bedrock-help-modal").modal("hide");
  });

  $(document).on("click", ".save-file", function() {
    var current_editor = $("div.tab.active").find(".editor").attr("id");
    var file_name = $("#" + current_editor).data("file-name");
    var file_type = $("#" + current_editor).data("file-type");
    $("#" + current_editor).removeData("is-updated").removeAttr("data-is-updated");
    var editor = ace.edit(current_editor);
    save_file_content(editor.getValue(), file_name, file_type);
  });

  $(document).on("click", ".run-build", function() {
    var msg="";
    if($("#BUILD_SCRIPT").val() == "") {
      msg += " * BUILD_SCRIPT\n\n";
    }
    if($("#SCRIPT_PATH").val() == "") {
      msg += " * SCRIPT_PATH\n\n";
    }
    if(msg == "") {
      toggle_stream(false);
      build_project();
    }
    else {
      alert("Please set up the following variables in Settings:\n\n" + msg);
    }
  });

  $(document).on("click", ".run-file", function() {
    var current_editor = $("div.tab.active").find(".editor").attr("id");
    var file_name = $("#" + current_editor).data("file-name");

    var url = "/" + file_name;
    window.open(url, "_blank");
  });

  $(document).on("click", ".delete-file", function() {
    var item = $(this).closest(".item");
    var file_name = item.find("a.load-file").data("file-uri");

    if ( confirm("Are you sure you want to delete " + file_name + "?") ) {    
      $.ajax({
        url: "/bedrock-ide/api/file/" + file_name,
        method: "DELETE",
        success: function(data) {
          if ( data.status == "success" ) {
            $(".file-list-header").next(".files-list").remove();
            get_files_list(false);
            bedrock_status_message_set("success", "File deleted successfully.");
          }
          else {
            bedrock_status_message_set("error", data.message);
          }
        },
        error: function(xhr,status,error) {
          bedrock_status_message_set("error", error);
        }
      });
    }
    else {
      return false;
    }
  });

  $(document).on("click", ".delete-plugin", function() {
    var item = $(this).closest(".item");
    var file_name = item.find("a.load-plugin").data("file-uri");

    if ( confirm("Are you sure you want to delete " + file_name + "?") ) {    
      $.ajax({
        url: "/bedrock-ide/api/plugin/" + file_name,
        method: "DELETE",
        success: function(data) {
          if ( data.status == "success" ) {
            $(".plugin-list-header").next(".plugins-list").remove();
            get_plugins_list();
            bedrock_status_message_set("success", "Plugin deleted successfully.");
          }
          else {
            bedrock_status_message_set("error", data.message);
          }
        },
        error: function(xhr,status,error) {
          bedrock_status_message_set("error", error);
        }
      });
    }
    else {
      return false;
    }
  });

  //settings related code
  
  $(document).on("click", ".bedrock-settings", function() {
    $(".modal-status-info").removeClass("success error").html("").hide();
    $("#bedrock_settings_form").html("");
    get_config();    
  });

  $(".close-settings-icon, .close-settings-modal").click(function() {
    $(".bedrock-settings-modal").modal("hide");
  });

  $(".submit-settings-modal").click(function() {
    $(".bedrock-settings-status").html("");
    save_config();
  });

  //new file

  $("#bedrock_newfile_form").form({
    keyboardShortcuts: false,
    inline: true,
    fields: {
      file_name: {
        identifier: "file_name",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter file name"
          }
        ]
      }
    }
  });

  $(document).on("click", ".new-file", function(e) {
    e.stopPropagation();
    $("#bedrock_newfile_form").form("clear");
    $(".bedrock-newfile-modal").modal("setting", "closable", false).modal("show");
  });

  $(".close-newfile-icon, .close-newfile-modal").click(function() {
    $(".bedrock-newfile-modal").modal("hide");
  });

  $(".submit-newfile-modal").click(function(e) {
    e.preventDefault();
    $("#bedrock_newfile_form").submit();
  });

  $("#bedrock_newfile_form").submit(function(e) {
    e.preventDefault();
    if ($("#bedrock_newfile_form").form("is valid")) {
      new_file_content("", $("#file_name").val(), "", "file");
      $(".bedrock-newfile-modal").modal("hide");
    }
    return false;
  });

  //new plugin

  $("#bedrock_newplugin_form").form({
    inline: true,
    fields: {
      plugin_name: {
        identifier: "plugin_name",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter plugin name"
          }
        ]
      },
      binding_name: {
        identifier: "binding_name",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter binding name"
          }
        ]
      }
    }
  });

  $(document).on("click", ".new-plugin", function(e) {
    e.stopPropagation();
    $("#bedrock_newplugin_form").form("clear");
    $(".bedrock-newplugin-modal").modal("setting", "closable", false).modal("show");
  });

  $(".close-newplugin-icon, .close-newplugin-modal").click(function() {
    $(".bedrock-newplugin-modal").modal("hide");
  });

  $(document).on("click", ".submit-newplugin-modal", function(e) {
    e.stopPropagation();
    $("#bedrock_newplugin_form").submit();
  });

  $("#bedrock_newplugin_form").submit(function(e) {
    e.preventDefault();
    if ($("#bedrock_newplugin_form").form("is valid")) {      
      new_file_content("", $("#plugin_name").val(), $("#binding_name").val(), "plugin");
      $(".bedrock-newplugin-modal").modal("hide");
    }
    return false;
  });

  /* edit plugin */

  $(document).on("click", ".edit-plugin", function(e) {
    e.preventDefault();
    $(".bedrock-editplugin-modal").modal("setting", "closable", false).modal("show");
  });

  $(".close-editplugin-icon, .close-editplugin-modal").click(function() {
    $(".bedrock-editplugin-additems-modal").modal("hide");
    $(".bedrock-editplugin-modal").modal("hide");
  });

  $(document).on("click", ".new-object", function(e){
    e.preventDefault();
    $("#bedrock_editplugin_form").form("clear");
    $(".bedrock-editplugin-additems-modal .object-div").hide();
    $(".bedrock-editplugin-additems-modal .keyval-div").hide();
    $(".bedrock-editplugin-additems-modal .list-div").hide();
    $(".bedrock-editplugin-additems-modal").modal({
      "closable": false,
      "allowMultiple": true
    }).modal("show");
  });

  $(".close-editplugin-additems-icon, .close-editplugin-additems-modal").click(function() {
    $(".bedrock-editplugin-additems-modal").modal("hide");
  });

  $(".chk_attr").checkbox({
    onChecked: function() {
      if ($("#chk_list").is(":checked")) {
        $(".bedrock-editplugin-additems-modal .object-div").hide();
        $(".bedrock-editplugin-additems-modal .keyval-div").hide();
        $("#list_values").dropdown({
          allowAdditions: true
        });
        $(".bedrock-editplugin-additems-modal .list-div").show();
      }
      else if ($("#chk_keyval").is(":checked")) {
        $(".bedrock-editplugin-additems-modal .object-div").hide();
        $(".bedrock-editplugin-additems-modal .list-div").hide();
        $(".bedrock-editplugin-additems-modal .keyval-div").show();
      }
      else if ($("#chk_object").is(":checked")) {
        $(".bedrock-editplugin-additems-modal .list-div").hide();
        $(".bedrock-editplugin-additems-modal .keyval-div").hide();
        $(".bedrock-editplugin-additems-modal .object-div").show();
      }
    }
  });

  $(document).on("click", ".add_edit_script", function() {
    var msg="";
    if($("#BUILD_SCRIPT").val() == "") {
      msg += " * BUILD_SCRIPT\n\n";
    }
    if($("#SCRIPT_PATH").val() == "") {
      msg += " * SCRIPT_PATH\n\n";
    }
    if(msg == "") {
      save_config();
      get_build_script();
      $(".main_tab_div, .file-menu").css("display", "block");
    }
    else {
      alert("Please set up the following:\n\n" + msg);
    }
  }); 

  $(".hide-recent-files").toggle();  
  $(document).on("click", ".show-recent-files, .hide-recent-files, .recent-list-header", function(e) {
    e.stopPropagation();
    $(".show-recent-files").toggle();
    $(".hide-recent-files").toggle();
    $(".recently-viewed-list").toggle();
  });

});
