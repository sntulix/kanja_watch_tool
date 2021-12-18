
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta name="robots" content="noindex, nofollow">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=yes" />
  <title>カメラの映像を送信しています</title>
  <link rel="stylesheet" href="kanja.css<?php echo '?' . uniqid(); ?>">
</head>
<body>
  <div id="opencv_loading">ページを読み込んでいます</div>
  <div id="errorOutput"></div>
  <div id="policy_decline">
    利用を中止しました。
  </div>
  <div id="policy_information">
    <h2>個人情報について</h2>
    <ul>
      <li>利用目的
        <ul>
          <li>自宅療養者の容体把握に利用します。</li>
        </ul>
      </li>
      <li>取得情報項目
        <ul>
          <li>URLを開いた端末のカメラに映る映像（1分おきに取得）</li>
        </ul>
      </li>
    </ul>
    <div>
      個人情報の取得および、サービスの利用に同意しますか？
      <p>
        <button id="accept" onclick="user_camera_accept()" disabled>同意する</button>
        <button id="decline" onclick="user_camera_decline()" disabled>同意しない</button>
      </p>
    </div>
  </div>
  <div>
    <form>
      <input name="kanja_id" type="hidden">
      <input name="photo_base64" class="inputtag_photo_base64" type="hidden">
    </form>
  </div>
  <div id="camera_display">
    <h1>カメラの映像を送信しています</h1>
    <div id="message"></div>
    <video id="video" autoplay playsinline></video>
    <div>
      他の見守りサーバーアドレス<br>
      <input id="another_server" type="url"><button id="add_another_server" onclick="add_another_server(document.getElementById('another_server').value)">登録する</button><button id="remove_another_server" onclick="return remove_another_server(document.getElementById('another_server').value)">解除する</button>
    </div>
    <canvas id="canvasInput"></canvas>
  </div>
  <script src="utils.js<?php echo '?' . uniqid(); ?>"></script>
  <script src="kanja.js<?php echo '?' . uniqid(); ?>"></script>
</body>
</html>
