toggleChannelList = function() {
  let listChan = document.querySelector("#chanlist")
  if (listChan.style.display != "none") {
    listChan.style.display = "none";
  }
  else {
    listChan.style.display = "block";
  }
}


removeUser = function() {
  localStorage.removeItem("userid");
}


// setHeight = function() {
//   // set chhannel list to span the viewport:
//   var lc = document.querySelector("#listChannels");
//   var fp = document.querySelector("#acChannelsPar");
//   lc.style.height = document.documentElement.scrollHeight - fp.clientHeight - 50 + "px";
// }

// Send request when channel page is loaded, to get messages from server:
sendRequest = function() {
  // Get channel name to send to server:

  const template = Handlebars.compile(document.querySelector('#channelNameTemp').innerHTML);
  const chanNameSend = document.querySelector('#sendMessage').dataset.channel;

  // Request to get message list:
  const request = new XMLHttpRequest();
  request.open('POST', '/message_list');

  // Callback function for when request completes
  request.onload = () => {

      // Extract JSON data from request
      const data = JSON.parse(request.responseText);
      var content;
      // If user id from server is the same as the client one, show one class otherwise the other class:
      if (data.messages.length > 0) {
        let messageResponse = data.messages;
        for (let i = 0; i < messageResponse.length; i++) {
          let classMes;
          // if user for the message is the same as session user, give one class
          if (messageResponse[i].user === localStorage.getItem('userid')) {
            classMes = 'same-user';
          } else {
            classMes = 'dif-user';
          }
          messageResponse[i].class = classMes;

        }
        content = template({'values': messageResponse});
        document.querySelector('#messageDiv').innerHTML = content
      }


      // Update the result div
      // document.querySelector('#messageDiv').innerHTML = content
  }

  // Add data to send with request
  const data = new FormData();
  data.append('channel', chanNameSend);

  // Send request
  request.send(data);

  //setHeight();

  return false;

}


// When create channel is clicked,


document.addEventListener('DOMContentLoaded', function () {

  document.querySelector("#toggleChanBut").onclick = toggleChannelList;

  //document.querySelector("#logoutButton").onclick = removeUser;

  sendRequest();

  // click button when pressing ctrl+enter:
  var textArea = document.querySelector("#messContent");
  textArea.onkeyup = function(e) {
    if (e.keyCode === 10 || e.keyCode  == 13 && e.ctrlKey) {
      document.querySelector("#sendMessage").click();
    }
  }

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + 80);

  // When connected, configure button
  socket.on('connect', () => {
      const button = document.querySelector('#sendMessage');

      var userid;
      if (!localStorage.getItem('userid')) {
                       userid = 'Unknown';
                     } else {
                       userid = localStorage.getItem('userid');
                     }
      // Each button should emit a "submit vote" event
      button.onclick = function() {
              let message = document.querySelector("#messContent");
              socket.emit('send message', {'message': message.value, 'channel': button.dataset.channel, 'user': userid});
              message.value = '';
          };
      });

  // When a message is announced append to div:
  socket.on('receive message', data => {
      const div = document.createElement('div');
      // If the current user has sent the message one class, otherwise another:
      var classMes;
      if (data.user === localStorage.getItem('userid')) {
        classMes = "same-user";
      } else {
        classMes = "dif-user";
      }

      div.innerHTML = `<div class = ${classMes}><h4 class = 'message-head'>${data.user}</h4><p class = 'message-tstamp'>
        ${data.timestamp}</p><hr class = 'message-divider'><p class = 'message-body'>${data.message}</p></div>`;
      // p.innerHTML = `${data.user} says ${data.message}`;
      document.querySelector('#messageDiv').append(div);

      //setHeight();
  });


}
)
