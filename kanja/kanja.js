const medias = {
  audio: false,
  video: { facingMode: "user" }
};
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
promise = null;

function user_camera_accept() {
  promise = navigator.mediaDevices.getUserMedia(medias);
  promise.then(successCallback)
  .catch(errorCallback);
  var policy_node = document.getElementById("policy_information");
  policy_node.style.display = "none";
}

function user_camera_decline() {
  var tags = document.getElementById("policy_decline");
  tags.style.display = "block";

  var tags = document.getElementById("policy_information");
  tags.style.display = "none";
}

function successCallback(stream) {
  const another_server_address = get_another_server();
  if ("" !== another_server_address) {
    document.getElementById("another_server").value = another_server_address;
    document.getElementById('add_another_server').style.display = "none";
    document.getElementById('remove_another_server').style.display = "inline";
  }

  video.srcObject = stream;

  var camera_display = document.getElementById("camera_display");
  camera_display.style.display = "block";

  requestAnimationFrame(drawCanvas);
}

function errorCallback(err) {
  console.log(err);
  alert(err);
}

function drawCanvas() {
//    console.log("drawCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
ctx.clearRect(0,0, canvas.width, canvas.height);
ctx.drawImage(video, 0,0, canvas.width, canvas.height);
var jpeg_base64 = canvas.toDataURL('image/jpeg', 0.6).substr(23);
document.querySelector(".inputtag_photo_base64").value = jpeg_base64;

requestAnimationFrame(drawCanvas);
}


function asyncSend() {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
  if (req.readyState == 4) { // 通信の完了時
      if (req.status == 200) { // 通信の成功時
        notifyMe();
        var message = document.getElementById("message");
        msg = "送信しました" + "（" + new Date().toLocaleString() + "）";
        message.innerText = msg;
        message.style.visibility = "visible";
      }
    } else {
    }
  }

  req.open('POST', 'photo_upload.php', true);
  req.setRequestHeader('content-type',
    'application/x-www-form-urlencoded;charset=UTF-8');
  params = 'photo_base64=' + encodeURIComponent(document.querySelector(".inputtag_photo_base64").value);
  if (""!=kanja_id) {
    params += "&kanja_id=" + encodeURIComponent(kanja_id);
  }
  req.send(params);

  const another_server_address = get_another_server();
  if ("" !== another_server_address) {
    var another_req = new XMLHttpRequest();

    another_req.onreadystatechange = function() {
    if (another_req.readyState == 4) { // 通信の完了時
        if (another_req.status == 200) { // 通信の成功時
          notifyMe();
          var message = document.getElementById("message");
          msg = "送信しました" + "（" + new Date().toLocaleString() + "）";
          message.innerText = msg;
          message.style.visibility = "visible";
        }
      } else {
      }
    }

    another_req.open('POST', another_server_address + 'kanja/' + 'photo_upload.php', true);
    another_req.setRequestHeader('content-type',
      'application/x-www-form-urlencoded;charset=UTF-8');
    params = 'photo_base64=' + encodeURIComponent(document.querySelector(".inputtag_photo_base64").value);
    if (""!=kanja_id) {
      params += "&kanja_id=" + encodeURIComponent(kanja_id);
    }
    another_req.send(params);
  }

}

function notifyMe() {
  if (!("Notification" in window)) {
    return;
  }

  else if (Notification.permission === "granted") {
    var notification = new Notification("カメラの映像を送信しました");
  }

  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        var notification = new Notification("部屋の写真を送った時に知らせますか？");
      }
    });
  }
}

function add_another_server(add_address) {

  if ("" !== add_address) {
    domain = window.location.hostname;
    path = window.location.pathname;
    cookie_string = "another_server=" + add_address + ";domain=" + domain + ";path=" + path + ";secure";
    document.cookie = cookie_string;
    document.getElementById('add_another_server').style.display = "none";
    document.getElementById('remove_another_server').style.display = "inline";
  }
}

function remove_another_server() {
  if (window.confirm('他に登録した見守りサーバーを解除します。よろしいですか？')) {
    domain = window.location.hostname;
    path = window.location.pathname;
    cookie_string = "another_server=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=" + domain + ";path=" + path + ";secure";
    document.cookie = cookie_string;
    document.getElementById('remove_another_server').style.display = "none";
    document.getElementById('add_another_server').style.display = "inline";
    return true;
  }
  return false;
}

function get_another_server() {
  if ("" !== document.cookie) {
    const another_server_address = document.cookie.split(';').find(row => row.startsWith('another_server')).split('=')[1];
    return another_server_address
  }
  return "";
}

kanja_id = "";
const url_params = window.location.search;
if (0<url_params.length) {
  kanja_id = url_params.substring(1+("kanja_id=".length));
}

setInterval("asyncSend()",55000);
