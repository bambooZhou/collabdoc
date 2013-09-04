function divEscapedContentElement(message){
	return $('<div></div>').text(message);
}

function divSystemContentElement(message){
	return $('<div></div>').html('<i>'+message+'</i>');
}

function processUserInput(chatApp,socket){
	var message=$('#send-message').val();
	var systemMessage;

	if(message.charAt(0)=='/'){
		systemMessage=chatApp.processCommand(message);
		if(systemMessage){
			$('#messages').append(divSystemContentElement(systemMessage));
		}
	}else{
		chatApp.sendMessage($('#room').text(),message);
		$('#messages').append(divEscapedContentElement(message));
		$('#messages').scrollTop($('#message').prop('scrollHeight'));
	}
	$('#send-message').val('');
}

function shareDoc(chatApp,socket){
	var content=$('#content').val();
	chatApp.sendMessage('sharedoc',content);
}

var socket=io.connect();

$(document).ready(function(){
	var chatApp = new Chat(socket);

	socket.on('nameResult',function(result){
		var message;

		if(result.success){
			message='You are now known as '+result.name+'.';
		}else{
			message=result.message;
		}
		$('#messages').append(divSystemContentElement(message));
	});

	socket.on('joinResult',function(result){
		$('#room').text(result.room);
		$('#messages').append(divSystemContentElement('Room changed.'));
	});

	socket.on('message',function(message){
		$('#content').val(message.text);
		//alert(message.text);
		//alert(message.text);
		//var newElement=$('<div></div>').text(message.text);
		//$('#messages').append(newElement);
		$.post('http://192.168.190.44:7500/preview', {
			text: message.text
    	}, function(data) {
			$('#dictionary').html(data.text);
    	}, "json");
	});

	socket.on('rooms',function(rooms){
		$('#room-list').empty();

		for(var room in rooms){
			room=room.substring(1,room.length);
			if(room!=''){
				$('#room-list').append(divEscapedContentElement(room));
			}
		}

		$('#room-list div').click(function(){
			chatApp.processCommand('/join '+$(this).text());
			$('#send-message').focus();
		});
	});

	setInterval(function(){
		socket.emit('rooms');
	},1000);

	$('#send-message').focus();

	$('#send-form').submit(function(){
		processUserInput(chatApp,socket);
		return false;
	});

	$("#content").on('keyup', function() {
		shareDoc(chatApp,socket);

    	$.post('http://192.168.190.44:7500/preview', {
			text: $("#content").val()
    	}, function(data) {
			$('#dictionary').html(data.text);
    	}, "json");
    	return false;
	});


	$("#editor_btn").on('click', function() {
		$("#editor").execCommand('bold',false,null);
	});
});