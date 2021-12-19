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
  let srcBackup = src.clone();
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
      /* mosaic to face */
      setMosaic(src, faces.get(i).x, faces.get(i).y, faces.get(i).width, faces.get(i).height);
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);

      // detect eyes in face ROI
      eyeCascade.detectMultiScale(roiGray, eyes);
      for (let j = 0; j < eyes.size(); ++j) {
          let point1 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
          let point2 = new cv.Point(eyes.get(j).x + eyes.get(j).width,
                                    eyes.get(j).y + eyes.get(j).height);
          mat_rect_blit(srcBackup, faces.get(i).x+eyes.get(j).x, faces.get(i).y+eyes.get(j).y, eyes.get(j).width, eyes.get(j).height,
            src, faces.get(i).x+eyes.get(j).x, faces.get(i).y+eyes.get(j).y);
          cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
      }
      roiGray.delete(); roiSrc.delete();
  }

  cv.imshow("canvasInput", src);
  src.delete(); gray.delete(); srcBackup.delete(); faces.delete(); eyes.delete();

  let jpeg_base64 = canvasInput.toDataURL('image/jpeg', 0.6).substr(23);
  document.querySelector(".inputtag_photo_base64").value = jpeg_base64;
}

function setMosaic(src, x, y, width, height) {
  let mosaic_mat = new cv.Mat();
  let copy_rect = new cv.Rect(x, y, width, height);
  mosaic_mat = src.roi(copy_rect);

  let small_size = new cv.Size(10, 10);
  let original_size = new cv.Size(width, height);
  cv.resize(mosaic_mat, mosaic_mat, small_size, 1, 1, cv.INTER_NEAREST);
  cv.resize(mosaic_mat, mosaic_mat, original_size, 1, 1, cv.INTER_NEAREST);

  mat_blit(mosaic_mat, src, x, y)
}

function mat_blit(src_mat, dest_mat, dest_mat_start_x, dest_mat_start_y) {
  let dest_mat_start_pixel = (dest_mat_start_y*dest_mat.cols*dest_mat.channels())+(dest_mat_start_x*dest_mat.channels());
  let src_mat_pixel_pos = 0;
  for (var y = 0; y<src_mat.size().height; y++) {
    for (var x = 0; x<src_mat.size().width; x++) {
      let dest_mat_current_pos = (x*dest_mat.channels())+(y*dest_mat.cols*dest_mat.channels()) + dest_mat_start_pixel;
      for (let c = 0; c<dest_mat.channels(); c++) {
        dest_mat.data[dest_mat_current_pos+c] = src_mat.data[src_mat_pixel_pos+c];
      }
      src_mat_pixel_pos = src_mat_pixel_pos + dest_mat.channels();
    }
  }
}

function mat_rect_blit(src_mat, src_mat_start_x, src_mat_start_y, src_rect_width, src_rect_height,
  dest_mat, dest_mat_start_x, dest_mat_start_y) {
  for (var y = 0; y<src_rect_height; y++) {
    for (var x = 0; x<src_rect_width; x++) {
      let src_mat_current_pos = ((src_mat.channels()*src_mat.cols)*(src_mat_start_y+y))
       + (src_mat.channels()*(src_mat_start_x+x));

      let dest_mat_current_pos = ((dest_mat.channels()*dest_mat.cols)*(dest_mat_start_y+y))
       + (dest_mat.channels()*(dest_mat_start_x+x));

      for (let c = 0; c<dest_mat.channels(); c++) {
        dest_mat.data[dest_mat_current_pos+c] = src_mat.data[src_mat_current_pos+c];
      }
    }
  }
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
