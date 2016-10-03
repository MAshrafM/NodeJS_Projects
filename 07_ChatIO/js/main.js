$(function(){
  var socket = io.connect();
  var messageForm = $('#messageForm');
  var message = $('#message');
  
  var chat = $('#chatWindow');
  
  var usernameForm = $('#usernameForm');
  var users = $('#users');
  var username = $('#username');
  var error = $('#error');
  
  usernameForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user', username.val(), function(data){
      if(data){
        $('#namesWrapper').hide();
        $('#mainWrapper').show();
      }
      else{
        error.html('Username Already Taken!');
      }
    });
    username.val('');
  });
  
  socket.on('usernames', function(data){
    var html = '';
    for(i = 0; i < data.length; i++){
      html += data[i] + '<br />';
    }
    users.html(html);
  });
  messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', message.val());
    message.val('');
  });
  
  socket.on('new message', function(data){
    chat.append('<strong>'+data.user+'</strong>: '+data.msg+'<br />');
  });
});