$(function() {
    get_config();

    $('#config-close').click(function() {
	if ( save_config() ) {
	    list('');
	    plugins();
	    $('#config-container').hide();
	}
    });

    $('#error-container-close').click(function() {
	$('#error-container').hide();
    });
			     
    list('');

    plugins();

    $('#toolbar-save').click(function() {
	save_file();
    });
    
    $('#toolbar-run').click(function() {
	if ( $('#path').val() != '' ) {
	    var class_name = $('#path').attr('class');
	    var file_name = $('#path').val();
	    
	    if ( class_name == 'bedrock-script' ) {
		// FIXME: HOST_NAME
		url = '/' + file_name;
	    }
	    else {
		// FIXME: HOST_NAME + INDEX_PAGE
		url = '/index.roc';
	    }
	    
	    window.open(url, '_blank');
	}
    });
    
    $('#toolbar-settings').click(function() {
	$('#config-container').show();
    });
    
    $('#toolbar-info').click(function() {
	alert("info");
    });

    $('#toolbar-delete').click(function() {
	var class_name = $('#path').attr('class');
	var file_name = $('#path').val();
	
	if ( class_name == 'bedrock-script' ) {
	    delete_file(file_name);
	}
	else {
	    delete_plugin(file_name);
	}
    });
			      
});

function trim(val){
    var str = "";
    
    str = val.replace(/^(\s*)(.*)$/, "$2");
    str = str.replace(/((.*)\S+)(\s*)$/, "$1");
    
    return (str);
}

function show_error(message) {
    $('#error-container-message').html(message);
    $('#error-container').show();
}

function save_file() {
    var class_name = $('#path').attr('class');
    var file_name = $('#path').val();
    
    if ( class_name == "bedrock-plugin" ) {
	_save_file(file_name, 'plugin');
    }
    else {
	_save_file(file_name, 'file');
    }
}

function _save_file(file_name, file_type) {
    
    $.ajax({url: '/bedrock-ide/api/' + file_type + '/' + file_name,
	    method: 'PUT',
	    contentType: 'text/plain',
	    dataType: 'json',
	    data: $('#bedrock-text').val(),
	    success: function(data) {
		if ( data.status == 'success' ) {
		    flash_screen();
		}
		else {
		    // whoops! compiler error?
		    show_error(data.message);
		}
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
		show_error(textStatus);
	    }
	   }
	  );
}

// let's flash the screen to give the user some feedback
function flash_screen(color) {
    // get current bgcolor 
    var bgcolor = $('#bedrock-text').css('background-color');
    
    if ( typeof color == 'undefined' ) {
	color = '#d5f5c6';
    }
    
    // flash green!
    $('#bedrock-text').css({'backgroundColor' : color});

    // reset after .75s
    setTimeout(function(){
	$('#bedrock-text').css({'background-color' : bgcolor });
    }, 750);
}

function delete_file(file_name) {
    if ( confirm("Are you sure you want to delete " + file_name + "?") ) {
        $.ajax({
	    url: '/bedrock-ide/api/file/' + file_name,
	    method: 'DELETE',
	    success: function(data) {
		if ( data.status == 'success' ) {
		    flash_screen();
		    list('');
		}
		else {
		    show_error(data.message);
		}
	    },
	    error: function() {
		flash_screen('red');
	    }
	});
    }
    else {
	return false;
    }
}

function save_config() {
    var document_root = trim($('#document-root').val());
    var config_path_root = trim($('#config-path-root').val());
    var perl5lib = trim($('#perl5lib').val());
    var plugin_path = trim($('#plugin-path').val());
    var port = trim($('#port').val());
    var host_name = trim($('#host_name').val());
    var index_page = trim($('#index_page').val());
    
    var err_str = '';
    var fatal = false;
    
    if ( document_root == '' ) {
	err_str += "DOCUMENT_ROOT cannot be blank!\n";
	$('#document-root').val(bedrock_ide_config.DOCUMENT_ROOT);
	fatal = true;
    }
    
    if ( config_path_root == '' ) {
	err_str += "CONFIG_PATH_ROOT cannot be blank!\n";
	$('#config-path-root').val(bedrock_ide_config.CONFIG_PATH_ROOT);
	fatal = true;
    }
    
    if ( plugin_path == '' ) {
	err_str += "PLUGIN_PATH cannot be blank!\n";
	$('#plugin-path').val(bedrock_ide_config.PLUGIN_PATH);
	fatal = true;
    }
    
    if ( port == '' ) {
	err_str += "PORT cannot be blank! Resetting to default.\n";
	$('#port').val(bedrock_ide_config.PORT);
    }
    
    if ( perl5lib == '' ) {
	err_str += "WARNING: Your plugins may not compile or execute without PERL5LIB.\n";
    }

    if ( index_page == '' ) {
	$('#index_page').val('/index.roc');
    }

    if ( err_str != '' ) {
	show_error(err_str);
	if ( fatal ) {
	    return false;
	}
    }
    else {
	$.ajax({url: '/bedrock-ide/api/config',
		method: 'POST',
		async: false,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify({
		    'DOCUMENT_ROOT' : document_root,
		    'CONFIG_PATH_ROOT' : config_path_root,
		    'PERL5LIB' : perl5lib,
		    'PORT' : port,
		    'PLUGIN_PATH' : plugin_path,
		    'HOST_NAME' : host_name,
		    'INDEX_PAGE' : index_page
		}),
		success: function(data) {
		    if ( data.status == 'success' ) {
			bedrock_ide_config = data.data;
			flash_screen();
		    }
		    else {
			show_error(data.message);
			fatal = true;
		    }
		},
		error: function() {
		    flash_screen('red');
		}
	       });
	
	return ! fatal;
    }    
}

function get_config() {
    
    $.ajax({url: '/bedrock-ide/api/config',
	    dataType: 'json',
	    success: function(data) {
		if ( data.status == 'success' ) {
		    data = data.data;
		    bedrock_ide_config = data;
		    $('#document-root').val(data.DOCUMENT_ROOT);
		    $('#config-path-root').val(data.CONFIG_PATH_ROOT);
		    $('#plugin-path').val(data.PLUGIN_PATH);
		    $('#port').val(data.PORT);
		    $('#perl5lib').val(data.PERL5LIB);
		    $('#host_name').val(data.HOST_NAME);
		}
		else {
		    show_error(data.message);
		}
	    },
	    error: function() {
		flash_screen('red');
	    }
	  
	   }
	  );
}


function clear_text() {
    // Save?
    if ( $('#path').val() != '' ) {
	var class_name = $('#path').attr('class');
	var file_name = $('#path').val();
	// verify
    }
    
    // clear
    $('#path').val('');
    $('#bedrock-text').val('');
}

function list(d) {
    clear_text();
    
    url = "/bedrock-ide/api/list/";
    
    if ( d == "/" ) {
	d = "";
    }
    
    if ( d != '' ) {
	url += d;
    }
    
    $.ajax({
        url: url,
	dataType: 'json',
	success: function(data) {
	    if ( data.status == 'success' ) {
		data = data.data;
		
		var ul = '<ul class="fa-ul" >\n';
		// breadcrumb
		if ( d != '' ) {
		    var folders = d.split("/");
		    folders.pop();
		    var folder = folders.join("/");
		    if (folder == "" ) {
			folder ="/";
		    }
		    li = "<li><a onclick='list(" + '"' + folder + '");' + "'>" + '<i class="fa fa-li fa-folder-open-o"></i>' + folder + "</a></li>\n";
		    ul += li;
		}
	    
		data.sort();
	    
		$.each(data, function(i, v) {
		    if ( typeof(v) == "object" ) {
			var k = Object.keys(v);
			
			if ( d != '' ) {
			    folder = d + '/' + k[0];
			}
			else {
			    folder = k[0];
			}
			
			li = "<li><a onclick='list(" + '"' + folder + '");' + "'>" + '<i class="fa-li fa fa-folder"></i>' + folder + "</a></li>\n";
			ul += li;
		    }
		    else {
			if ( d != '' ) {
			    file = d + '/' + v;
			}
			else {
			    file = v;
			}
			
			li = "<li><a onclick='get_file(" + '"' + file + '"' + ", this);'>" + '<i class="fa-li fa fa-file-code-o"></i>'  + file + "</a></li>\n";
			ul += li;
		    }
		});

		ul += "</ul>";

		$('#folder-list').html(ul);
	    }
	    else {
		show_error(data.message);
	    }
	}
    });
}

function plugins() {
    clear_text();
    
    url = "/bedrock-ide/api/plugin";
    
    $.ajax(
	{
            url: url,
	    dataType: 'json',
	    success: function(data) {
		if ( data.status == 'success' ) {
		    data = data.data;
		    
		    var ul = '<ul class="fa-ul">\n';

		    data.sort();
		
		    $.each(data, function(i, v) {
			li = "<li><a onclick='get_plugin(" + '"' + v + '"' + ", this);'>" + '<i class="fa fa-li fa-plug"></i>' + v + "</a></li>\n";
			ul += li;
		    });
		    
		    ul += "</ul>";
		    
		    $('#plugin-list').html(ul);
		}
		else {
		    show_error(data.message);
		}
	    }
	}
    );
}

function _get_text(text_type, file, class_name) {
    if ( $('#path').val() != "" ) {
	clear_text();
    }
    
    url = "/bedrock-ide/api/" + text_type + "/" + file;
    
    $.ajax({
	url: url,
	dataType: 'json', 
	success: function(data) {
	    if ( data.status == 'success') {
		$('#bedrock-text').val(data.data);
		$('#path').val(file);
		$('#path').attr("class", class_name);
	    }
	    else {
		show_error(data.status + ' ' + data.message);
	    }
	},
	error: function(a,b,c) {
	    show_error(b + c);
	}
    });
    
    return false;
}

function get_plugin(plugin, obj) {
    if ( $(obj).parent().hasClass('file-disabled') ) {
	return false;
    }
    
    $('.list li').removeClass('file-selected file-disabled');
    $(obj).parent().addClass('file-selected file-disabled');
    
    _get_text('plugin', plugin, 'bedrock-plugin');
}

function get_file(file, obj) {
    if ( $(obj).parent().hasClass('file-disabled') ) {
	return false;
    }
    
    $('.list li').removeClass('file-selected file-disabled');
    $(obj).parent().addClass('file-selected file-disabled');

    _get_text('file', file, 'bedrock-script');
}
