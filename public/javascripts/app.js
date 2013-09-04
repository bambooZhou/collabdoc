(function ($, undefined) {
    $.fn.getCursorPositionStart = function() {
	var el = $(this).get(0);
	var pos = 0;
	if ('selectionStart' in el) {
	    pos = el.selectionStart;
	} else if ('selection' in document) {
	    el.focus();
	    var Sel = document.selection.createRange();
	    var SelLength = document.selection.createRange().text.length;
	    Sel.moveStart('character', -el.value.length);
	    pos = Sel.text.length - SelLength;
	}
	return pos;
    }

    $.fn.getCursorPositionEnd = function() {
	var el = $(this).get(0);
	var pos = 0;
	if ('selectionEnd' in el) {
	    pos = el.selectionEnd;
	} else if ('selection' in document) {
	    el.focus();
	    var Sel = document.selection.createRange();
	    var SelLength = document.selection.createRange().text.length;
	    Sel.moveEnd('character', -el.value.length);
	    pos = Sel.text.length - SelLength;
	}
	return pos;
    }

    $.fn.setCursorPosition = function(start, end) {
	return this.each(function() {
	    if (this.setSelectionRange) {
		this.focus();
		this.setSelectionRange(start, end);
	    } else if (this.createTextRange) {
		var range = this.createTextRange();
		range.collapse(true);
		range.moveEnd('character', end);
		range.moveStart('character', start);
		range.select();
	    }
	});
    };
})(jQuery);

$("#content").on('keyup', function() {
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("a#download").on('click', function() {
    if ($("#content").val() == "") {
	alert("please input content");
    } else {
	$("#form").attr("action","/download");
	$("#form").submit();
    }
});

$("#hd1").on('click', function() {
    insert_word_pre('head1');
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#hd2").on('click', function() {
    insert_word_pre('head2');
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#hd3").on('click', function() {
    insert_word_pre('head3');
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#Bol").on('click', function() {
    insert_word_both('bold');
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#Ita").on('click', function() {
    insert_word_both('italic');
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#Cod").on('click', function() {
    insert_word_both('code');
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#Uolist").on('click', function() {
    insert_word_ul();
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#Olist").on('click', function() {
    insert_word_ol();
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#Blo").on('click', function() {
    insert_word_pre('bq');
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#Hor").on('click', function() {
    insert_word_pre('hr');
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

function insert_word_pre(str) {

    var insertstr = "";
    switch(str) {
    case "head1":
	insertstr = "# ";
	break;
    case "head2":
	insertstr = "## ";
	break;
    case "head3":
	insertstr = "### ";
	break;
    case "bq":
	insertstr = "\n> ";
	break;
    case "hr":
	insertstr = "\n***\n";
	break;
    default:
	insertstr = str;
	break;
    }

    var tmpStr = $("#content").val();
    var startPos = $("#content").getCursorPositionStart();
    var endPos = $("#content").getCursorPositionEnd();

    if ((startPos == 0) || (tmpStr.charAt(startPos-1) == '\n')) {
	tmpStr = tmpStr.substring(0, startPos)
	    + insertstr
	    + tmpStr.substring(startPos, endPos)
	    + tmpStr.substring(endPos, tmpStr.length+1);
	startPos = endPos + insertstr.length;
	endPos = endPos + insertstr.length;
    } else {
	tmpStr = tmpStr.substring(0, startPos)
	    + '\n'
	    + insertstr
            + tmpStr.substring(startPos, endPos)
            + tmpStr.substring(endPos, tmpStr.length+1);
	startPos = endPos + insertstr.length + 1;
	endPos = endPos + insertstr.length + 1;
    }
    $("#content").val(tmpStr);
    $("#content").setCursorPosition(startPos, endPos);
}

function insert_word_both(str) {

    var insertstr = "";
    switch(str) {
    case "bold":
	insertstr = "**";
	break;
    case "italic":
	insertstr = "_";
	break;
    case "code":
	insertstr = "`";
	break;
    default:
	break;
    }

    var content = $("#content");
    var tmpStr = $("#content").val();
    var startPos = $("#content").getCursorPositionStart();
    var endPos = $("#content").getCursorPositionEnd();

    tmpStr = tmpStr.substring(0, startPos)
        + insertstr
        + tmpStr.substring(startPos, endPos)
        + insertstr
	+ tmpStr.substring(endPos, tmpStr.length+1);

    if (endPos != startPos) {
	endPos += insertstr.length;
    }
    endPos += insertstr.length;
    $("#content").val(tmpStr);
    $("#content").setCursorPosition(endPos, endPos);
}

function insert_word_ol() {

    var startPos = $("#content").getCursorPositionStart();
    var endPos = $("#content").getCursorPositionEnd();

    if (startPos == 0) {
	insert_word_pre("1. ");
    } else {
	var pos = $("#content").val().substring(0,startPos-1).lastIndexOf("\n");
	if (pos == -1) {
	    pos = 0;
	}
	var tmpStr = $("#content").val().substring(pos, startPos);
	var endp = tmpStr.indexOf('.');
	if (Number(tmpStr.substring(1, endp))) {
	    var count = "" + (Number(tmpStr.substring(1, endp))+1) + ". ";
	    insert_word_pre(count);
	} else {
	    insert_word_pre("\n1. ");
	}
    }
}

function insert_word_ul() {

    var content = $("#content");
    var startPos = $("#content").getCursorPositionStart();
    var endPos = $("#content").getCursorPositionEnd();

    if (startPos == 0) {
	insert_word_pre("* ");
    } else {
	var pos = $("#content").val().substring(0,startPos-1).lastIndexOf("\n");
	if ($("#content").val().charAt(pos+1) == '*') {
	    insert_word_pre("* ");
	} else {
	    insert_word_pre("\n* ");
	}
    }
}

function insert_link(str) {

    var text = "#" + str + "text";
    var url = "#" + str + "url";
    var linktext = $(text).val();
    var linkurl = $(url).val();

    if (linktext == "") {
	var alertstr = "please input " + str +" text";
	alert(alertstr);
	return;
    }
    if (linkurl =="") {
	var alertstr = "please input " + str + " url"
	alert(alertstr);
	return;
    }

    var content = $("#content");
    var startPos = $("#content").getCursorPositionStart();
    var endPos = $("#content").getCursorPositionEnd();
    var tmp = ""
    var tmpStr = $("#content").val()

    if (str == "link") {
	tmp = "["
    }
    if (str == "image") {
	tmp = "!["
    }

    tmpStr = tmpStr.substring(0,startPos)
	+ tmp
	+ linktext
	+ "]("
	+ linkurl
	+ ")"
	+ tmpStr.substring(endPos, tmpStr.length+1);

    $("#content").val(tmpStr);
    $("button.datadis").attr("data-dismiss", "modal");
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
}

$("#Clean").on("click", function() {
    $("#content").val("");
    $("#title").val("");
    $.post('/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$("#Pic-cli").on("click", function() {
    var startPos = $("#content").getCursorPositionStart();
    var endPos = $("#content").getCursorPositionEnd();
    if (startPos == endPos) {
	$("#imagetext").val("");
    } else {
	$("#imagetext").val($("#content").val().substring(startPos, endPos));
    }
    $("#imageurl").val("");
});

$("#Lin-cli").on("click", function() {
    var startPos = $("#content").getCursorPositionStart();
    var endPos = $("#content").getCursorPositionEnd();
    if (startPos == endPos) {
	$("#linktext").val("");
    } else {
	$("#linktext").val($("#content").val().substring(startPos, endPos));
    }
    $("#linkurl").val("");
});

$(window).load(function () {
    $("#title").val(localStorage.getItem('mdtitle'));
    $("#content").val(localStorage.getItem('mdcontent'));
    $.post('http://192.168.190.44:7500/preview', {
	text: $("#content").val()
    }, function(data) {
	$('#dictionary').html(data.text);
    }, "json");
    return false;
});

$(window).on('beforeunload', function () {
    localStorage.setItem('mdcontent', $("#content").val());
    localStorage.setItem('mdtitle', $("#title").val());
});

$("#uploadok").on('click', function() {
    var formData = new FormData();
    formData.append('uploadfile', $("#uploadfile")[0].files[0]);
    $.ajax({
	url: '/upload',
	type: 'POST',
	data: formData,
	processData: false,
	contentType: false
    }).done(function (data) {
	if (data.error)
	{
	    alert(data.error);
	} else {
	    $("#content").val(data.content);
	    $("#title").val(data.title);
	    $("#dictionary").html(data.text);
	}
    }, "json");
    $(this).attr("data-dismiss", "modal");
});

$("#content").on("keydown", function (e) {
    if (e.altKey && e.ctrlKey && e.which == 49) {
	insert_word_pre('head1');
    }
    if (e.altKey && e.ctrlKey && e.which == 50) {
	insert_word_pre('head2');
    }
    if (e.altKey && e.ctrlKey && e.which == 51) {
	insert_word_pre('head3');
    }
    if (e.altKey && e.ctrlKey && e.which == 52) {
	insert_word_both('bold');
    }
    if (e.altKey && e.ctrlKey && e.which == 53) {
	insert_word_both('italic');
    }
    if (e.altKey && e.ctrlKey && e.which == 54) {
	insert_word_both('code');
    }
    if (e.altKey && e.ctrlKey && e.which == 55) {
	insert_word_ul();
    }
    if (e.altKey && e.ctrlKey && e.which == 56) {
	insert_word_ol();
    }
    if (e.altKey && e.ctrlKey && e.which == 57) {
	insert_word_pre('bq');
    }
    if (e.altKey && e.ctrlKey && e.which == 48) {
	insert_word_pre('hr');
    }
    if (e.altKey && e.ctrlKey && e.which == 173) {
	$("#Pic-cli").click();
    }
    if (e.altKey && e.ctrlKey && e.which == 61) {
	$("#Lic-cli").click();
    }
    if (e.altKey && e.ctrlKey && e.which == 220) {
	$("Clean").click();
    }
});
