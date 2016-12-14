
$(document).ready(function() {

  /******** functions ***********/

  function add_new_tab(data, file_name) {
    $(".file_list_tab .item").removeClass("active");
    $(".main_tab_div .segment").removeClass("active");

    $("#tab_cnt").val(parseInt($("#tab_cnt").val()) + 1);
    if ($(".file_list_tab").size() == "0") {
      var file_list_tab = $("<div>").addClass("ui top attached tabular menu file_list_tab");
      $(file_list_tab).appendTo(".main_tab_div");
    }
    var tab_link = $("<a>").addClass("item active").attr("data-tab", "tab-item" + $("#tab_cnt").val()).html(file_name);
    var close_link = $("<i>").addClass("close icon close-tab");
    $(close_link).appendTo(tab_link);
    $(tab_link).appendTo(".file_list_tab");

    var tab_segment = $("<div>").addClass("ui bottom attached active tab segment")
                        .attr("data-tab", "tab-item" + + $("#tab_cnt").val());

    var editor = $("<div>").addClass("editor").attr("id", "editor" + $("#tab_cnt").val()).attr("data-file-name", file_name);
    $(editor).appendTo(tab_segment);

    $(tab_segment).appendTo(".main_tab_div");
    $(".file_list_tab .item").tab({
      onVisible: function() {
        $("#cursorDetails, #fileLength").html("");
      }
    });

    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor" + $("#tab_cnt").val());  
    editor.setTheme("ace/theme/chrome");
    editor.getSession().setMode("ace/mode/html");
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

    editor.setValue(data);
    editor.gotoLine(1);
  }

  function get_file_content(file_name) {
    var file_type = "file";
    var uri = "/bedrock-ide/api/" + file_type + "/" + file_name;

    $.ajax({
      url: uri,          
      type: "GET",
      success: function(data) {
        if(data.status == "success") {          
          data = data.data;
          $("#path").val(file_name);
          add_new_tab(data, file_name); 
        }
        else {
          alert(data.message)
        }
      },
      error: function(xhr,status,error) {
        alert("Error happened..");
      }
    });
  }

  function save_file_content(file_content, file_name) {
    var file_type = "file";
    var uri = "/bedrock-ide/api/" + file_type + "/" + file_name;
    
    $.ajax({
      url: uri,
      method: "PUT",
      contentType: "text/plain",
      dataType: "json",
      data: file_content,
      success: function(data) {
        if ( data.status == "success" ) {
          alert("saved");
        }
        else {
          alert(data.message);
        }
      },
      error: function() {
        alert("Error happened");
      }
    });
  }

  function delete_file(file_name) {
    $.ajax({
      url: "/bedrock-ide/api/file/" + file_name,
      method: "DELETE",
      success: function(data) {
        if ( data.status == "success" ) {
          return true;
        }
        else {
          alert(data.message);
        }
      },
      error: function() {
        alert("Error happened");
      }
    });
  }

  function get_files_list(isFolder, folderDOM) {
    //ajax call to load folder content

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
              var header = $("<div>").addClass("header load-folder").attr("data-folder-uri", folder + k[0] + "/").html("<i class='icon folder'></i>" + k[0]);

              $(header).appendTo(list_item);

              $(list_item).appendTo(list);
              $(list).appendTo(item);
            }
            else {
              var list_item = $("<div>").addClass("item");

              //var edit = $("<a>").html($("<i>").addClass("edit icon edit-file"));
              var file = $("<a>").html(val).addClass("item load-file").attr("data-file-uri", folder + val);
              var del = $("<a>").html($("<i>").addClass("trash icon delete-file"));

              //$(edit).appendTo(list_item);
              $(file).appendTo(list_item);
              $(del).appendTo(list_item);

              $(list_item).appendTo(list);
              $(list).appendTo(item);
            }
          });
        }
        else {
          alert(data.message);
        }
      },
      error: function() {
        alert("Error happened");
      }
    });
  }

  function get_plugins_list() {
    var url = "/bedrock-ide/api/plugin";

    $.ajax({
      url: url,
      dataType: "json",
      success: function(data) {
        if ( data.status == "success" ) {
          data = data.data;
          data.sort();
          console.log(data);

          //var list = $("<div>").addClass("ui list files-list");
        }
        else {
          alert(data.message);
        }
      },
      error: function() {
        alert("Error happened");
      }
    });
  }

  function get_config() {
    //make an ajax call to get config info
  }

  /********************************/

  $("#file_list").sidebar();
  $(".help_accordion").accordion();

  $(".popup").popup({
    position : "bottom center",
    hoverable  : true,
    inline     : true
  });

  $(".main_tab_div, .file-menu").css("display", "none");

  //initial files & folder load
  get_files_list(false);

  //initial plugins load
  get_plugins_list();

  $(document).on("click", ".load-file", function(e) {
    e.stopPropagation();
    var uri = $(this).data("file-uri");
    $(".main_tab_div, .file-menu").css("display", "block");
    get_file_content(uri);    
  });

  $(document).on("click", ".load-folder", function(e) {
    e.stopPropagation();
    var uri = $(this).data("folder-uri");
    get_files_list(true, $(this));
  });

  $(document).on("click", ".file-list-header", function() { 
    $(".files-list:first").transition("toggle");
  });

  $(document).on("click", ".close-tab", function() {
    var data_value = $(this).closest("a").data("tab");
    $("*[data-tab=" + data_value + "]").remove();
    $(".file_list_tab a:first").click();
    if($(".file_list_tab a").size() == "0") {
      $(".file_list_tab").remove();
      $(".main_tab_div, .file-menu").css("display", "none");
      $("#cursorDetails, #fileLength").html("");
    }
  });

  $(document).on("click", ".help-file", function() {
    $(".bedrock-help-modal").modal("show");
  });

  $(".close-help-icon, .close-help-modal").click(function() {
    $(".bedrock-help-modal").modal("hide");
  });

  $(document).on("click", ".save-file", function() {
    var current_editor = $("div.tab.active").find(".editor").attr("id");
    var file_name = $("#" + current_editor).data("file-name");
    var editor = ace.edit(current_editor);
    save_file_content(editor.getValue(), file_name);
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
            item.remove();
          }
          else {
            alert(data.message);
          }
        },
        error: function() {
          alert("Error happened");
        }
      });
    }
    else {
      return false;
    }
  });

  //settings related code
  $("#bedrock_settings_form").form({
    inline: true,
    fields: {
      document_root: {
        identifier: "document_root",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter document root"
          }
        ]
      },
      config_path_root: {
        identifier: "config_path_root",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter config path root"
          }
        ]
      },
      plugin_path: {
        identifier: "plugin_path",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter plugin path"
          }
        ]
      },
      perl5lib: {
        identifier: "perl5lib",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter perl5lib"
          }
        ]
      },
      port: {
        identifier: "port",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter port"
          }
        ]
      },
      host_name: {
        identifier: "host_name",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter host name"
          }
        ]
      },
      index_page: {
        identifier: "index_page",
        rules: [
          {
            type   : "empty",
            prompt : "Please enter index page"
          }
        ]
      }
    }
  });

  $(document).on("click", ".bedrock-settings", function() {
    get_config();
    $(".bedrock-settings-modal").modal("setting", "closable", false).modal("show");
  });

  $(".close-settings-icon, .close-settings-modal").click(function() {
    $(".bedrock-settings-modal").modal("hide");
  });

  $(".submit-settings-modal").click(function() {
    if ($("#bedrock_settings_form").form("is valid")) {
      //submit as ajax
      alert("ready to submit");
    }
  });

  //new file

  $("#bedrock_newfile_form").form({
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

  $(document).on("click", ".new-file", function() {
    $(".bedrock_newfile_form").form("clear");
    $(".bedrock-newfile-modal").modal("setting", "closable", false).modal("show");
  });

  $(".close-newfile-icon, .close-newfile-modal").click(function() {
    $(".bedrock-newfile-modal").modal("hide");
  });

  $(".submit-newfile-modal").click(function() {
    if ($("#bedrock_newfile_form").form("is valid")) {
      //submit as ajax
      alert("ready to submit");
    }
  });

});
