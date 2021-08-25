<?php
header('Cache-Control: no-cache');
require_once('../config.php');
require_once('../utility.php');

if (!isset($_SERVER['HTTPS'])) {
echo <<<EOT
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta name="robots" content="noindex, nofollow">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.1, maximum-scale=1, user-scalable=yes" />
</head>
<body>
HTTPS接続で利用してください。<br>
<a href="https://{$_SERVER['HTTP_HOST']}{$_SERVER['SCRIPT_NAME']}">HTTPS接続はこちらです。</a>
</body>
</html>
EOT;
}

require_once('watch_view.php');

/**
 * 機能の切り替え
 */
$menu = "";
if (isset($_POST['menu'])) {
  $menu = $_POST['menu'];
}
switch($menu) {
  case "rename_self":
    $new_watch_url = urlencode(random_rename_selfscript(__FILE__));
echo <<<EOT
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta name="robots" content="noindex, nofollow">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.1, maximum-scale=1, user-scalable=yes" />
</head>
<body>
<a href="{$new_watch_url}>見守る新しいURL</a>
</body>
</html>
EOT;
    break;

  case "make_invisible_photo":
    if ("POST" == $_SERVER["REQUEST_METHOD"]) {
      if (isset($_POST['photo'])) {
       $photo_filename = $_POST['photo'];
       if (file_exists($photo_dir.$photo_filename)) {
         rename($photo_dir.$photo_filename, $photo_expired_dir.$photo_filename);
       }
      }
    }
    view();
    break;

  default:
    view();
    break;
}
