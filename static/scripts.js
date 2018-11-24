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
  //localStorage.removeItem("userid");
  localStorage.setItem("userid", "merda")
}

// setHeight = function() {
//   // set chhannel list to span the viewport:
//   var lc = document.querySelector("#listChannels");
//   var fp = document.querySelector("#acChannelsPar");
//   lc.style.height = document.documentElement.scrollHeight - fp.clientHeight - 50 + "px";
// }


document.addEventListener('DOMContentLoaded', function () {

  //setHeight();

  document.querySelector("#toggleChanBut").onclick = toggleChannelList;


  document.querySelector("#nameForm").onsubmit = () => {
      localStorage.setItem('userid', document.querySelector("#unameid").value);
  }

  //document.querySelector("#logoutButton").onclick = removeUser;


}
)
