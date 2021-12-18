const medias = {
  audio: false,
  video: { facingMode: "user" }
};
const video = document.getElementById("video");
const canvasInput = document.getElementById("canvasInput");
const ctx = canvasInput.getContext("2d");
promise = null;

let send_time_interval = 30000;
//let send_time_interval = 55000;

var faceCascade;
var eyeCascade;

function user_camera_accept() {
  promise = navigator.mediaDevices.getUserMedia(medias);
  promise.then(successCallback)
  .catch(errorCallback);
  var policy_node = document.getElementById("policy_information");
  policy_node.style.display = "none";

  setInterval("asyncSend()",send_time_interval);
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
canvasInput.width  = video.videoWidth;
canvasInput.height = video.videoHeight;
ctx.clearRect(0,0, canvasInput.width, canvasInput.height);
ctx.drawImage(video, 0,0, canvasInput.width, canvasInput.height);

requestAnimationFrame(drawCanvas);
addMosaic_to_canvas_and_build_upload_image();
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

function addMosaic_to_canvas_and_build_upload_image() {
  let src = cv.imread("canvasInput");
  let gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  // detect faces
  let faces = new cv.RectVector();
  let eyes = new cv.RectVector();
  let msize = new cv.Size(0, 0);
  faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
  for (let i = 0; i < faces.size(); ++i) {
      let roiGray = gray.roi(faces.get(i));
      let roiSrc = src.roi(faces.get(i));
      let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                                faces.get(i).y + faces.get(i).height);
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
      // detect eyes in face ROI
      eyeCascade.detectMultiScale(roiGray, eyes);
      for (let j = 0; j < eyes.size(); ++j) {
          let point1 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
          let point2 = new cv.Point(eyes.get(j).x + eyes.get(j).width,
                                    eyes.get(j).y + eyes.get(j).height);
          cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
      }
      roiGray.delete(); roiSrc.delete();
  }
  cv.imshow("canvasInput", src);
  let jpeg_base64 = canvasInput.toDataURL('image/jpeg', 0.6).substr(23);
  document.querySelector(".inputtag_photo_base64").value = jpeg_base64;
  src.delete(); gray.delete(); faces.delete(); eyes.delete();
}

let utils = new Utils('errorOutput');
utils.loadOpenCv(() => {
  let eyeCascadeFile = 'haarcascade_eye.xml';
  utils.createFileFromUrl(eyeCascadeFile, eyeCascadeFile, () => {
    let faceCascadeFile = 'haarcascade_frontalface_default.xml';
    utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
      faceCascade = new cv.CascadeClassifier();
      eyeCascade = new cv.CascadeClassifier();
      faceCascade.load('haarcascade_frontalface_default.xml');
      eyeCascade.load('haarcascade_eye.xml');
//      console.log("load complete opencv");
      document.getElementById('opencv_loading').style.display = "none";
      document.getElementById('policy_information').style.display = "block";
      document.getElementById('accept').removeAttribute('disabled');
      document.getElementById('accept').removeAttribute('disabled');
      document.getElementById('decline').removeAttribute('disabled');
    });
  });
});
