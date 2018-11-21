

document.addEventListener('DOMContentLoaded', function() {

  // arrays of channel names:
  if (!localStorage.getItem('channels')) {
                    localStorage.setItem('channels', JSON.stringify([]));
                  }


  // refresh list
  refreshList = function() {
    let channels = JSON.parse(localStorage.getItem("channels"));
    document.querySelector("#listChannels").innerHTML = "";
    for (let i=0; i < channels.length; i++) {
      const liEl = document.createElement('li');
            liEl.innerHTML = channels[i];
            document.querySelector('#listChannels').append(liEl);
    }
  }

  // function to append new channel to list:
  appendChannelList = function() {
    let newChannel = document.querySelector("#chanNameText").value;
    let channels = JSON.parse(localStorage.getItem("channels"));
    channels[channels.length] = newChannel;
    localStorage.setItem('channels', JSON.stringify(channels));
    refreshList()
  }

  toggleChannelList = function() {
    let listChan = document.querySelector("#chanlist")
    if (listChan.style.display != "none") {
      listChan.style.display = "none";
    }
    else {
      listChan.style.display = ""
    }
  }

  document.querySelector("#toggleChanBut").onclick = toggleChannelList;
  document.querySelector("#createChanButModal").onclick = appendChannelList;

  refreshList();

}) // end dom content loaded
