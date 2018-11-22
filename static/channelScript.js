toggleChannelList = function() {
  let listChan = document.querySelector("#chanlist")
  if (listChan.style.display != "none") {
    listChan.style.display = "none";
  }
  else {
    listChan.style.display = ""
  }
}

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
          if (messageResponse[i].user === sessionStorage.getItem('userid')) {
            classMes = 'same-user';
          } else {
            classMes = 'dif_user';
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
  return false;

}


// When create channel is clicked,


document.addEventListener('DOMContentLoaded', function () {
  alert('yoo');

  document.querySelector("#toggleChanBut").onclick = toggleChannelList;

  sendRequest();

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure button
  socket.on('connect', () => {
      const button = document.querySelector('#sendMessage');

      var userid;
      if (!sessionStorage.getItem('userid')) {
                       userid = 'Unknown';
                     } else {
                       userid = sessionStorage.getItem('userid');
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
      const p = document.createElement('p');
      p.innerHTML = `${data.user} says ${data.message}`;
      document.querySelector('#messageDiv').append(p);
  });


}
)





// document.addEventListener('DOMContentLoaded', function() {
//
//   // arrays of channel names:
//   if (!localStorage.getItem('channels')) {
//                     localStorage.setItem('channels', JSON.stringify([]));
//                   }
//
//
//   // refresh list
//   refreshList = function() {
//     let channels = JSON.parse(localStorage.getItem("channels"));
//     document.querySelector("#listChannels").innerHTML = "";
//     for (let i=0; i < channels.length; i++) {
//       const liEl = document.createElement('li');
//             liEl.innerHTML = channels[i];
//             document.querySelector('#listChannels').append(liEl);
//     }
//   }
//
//   // function to append new channel to list:
//   appendChannelList = function() {
//     let newChannel = document.querySelector("#chanNameText").value;
//     let channels = JSON.parse(localStorage.getItem("channels"));
//     channels[channels.length] = newChannel;
//     localStorage.setItem('channels', JSON.stringify(channels));
//     refreshList()
//   }
//
//   toggleChannelList = function() {
//     let listChan = document.querySelector("#chanlist")
//     if (listChan.style.display != "none") {
//       listChan.style.display = "none";
//     }
//     else {
//       listChan.style.display = ""
//     }
//   }
//
//   document.querySelector("#toggleChanBut").onclick = toggleChannelList;
//   document.querySelector("#createChanButModal").onclick = appendChannelList;
//
//   refreshList();
//
// }) // end dom content loaded