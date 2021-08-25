<?php
require_once('../config.php');
require_once('../utility.php');

/**
 * IDごとに最新の写真を表示
 */
function view() {
  global $photo_dir, $photo_extension, $random_string_length, $kanja_disconnected_warning_second;

$url_watch_css_url = "watch.css" . '?' . uniqid();
echo <<<EOT
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta name="robots" content="noindex, nofollow">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.1, maximum-scale=1, user-scalable=yes" />
  <link rel="stylesheet" href="{$url_watch_css_url}">
</head>
<body>
EOT;

  $url_photo_reload = $_SERVER['REQUEST_URI'] . '?' . uniqid();
  $url_kanja_add = "kanja_url_form.php" . '?' . uniqid();
echo <<<EOT
<p>
<a href="{$url_photo_reload}">写真を新しく読み込む</a>
<a href="{$url_kanja_add}" target="_blank" rel="noopener noreferrer">アドレスを患者さんに伝える</a>
</p>
EOT;

  echo PHP_EOL . '<div id="photos">' . PHP_EOL;
  $date = new DateTime();
  $date->setTimeZone( new DateTimeZone('Asia/Tokyo'));

  $photo_count = 0;
  foreach(glob($photo_dir."*".$photo_extension) as $photo_fullpath) {
    if (strpos($photo_fullpath, $photo_extension, -4)) {
      $photo_basename = basename($photo_fullpath);
      $photo_url = $photo_dir.urlencode($photo_basename);
      $photo_url_nocache = $photo_url . "?" . uniqid();

      $kanja_id = GetPhotoID($photo_basename, $random_string_length+strlen($photo_extension));
      if (empty($kanja_id)) {
        $kanja_id = "(IDは無しです)";
      }

      $date->setTimestamp(filemtime($photo_fullpath));
      $photo_yyyymmdd = $date->format("Y年m月d日 H:i:s");
      
      $photo_warning_message = "";
      $photo_warning_class = "";
      if ((is_file_old($photo_fullpath, $kanja_disconnected_warning_second))) {
        $photo_warning_message = "写真の送信が止まっています";
        $photo_warning_class = " photo_warning";
      }
echo <<<EOT
<div class="photo {$photo_warning_class}">
<img src="{$photo_url_nocache}" title="{$kanja_id}"><br>
<span class="date">{$kanja_id} ({$photo_yyyymmdd})</span><br>
<span class="{$photo_warning_class}">{$photo_warning_message}</span>
<form class="form_make_invisible_photo" method="post" onsubmit="return click_make_invisible_photo()"><input type="hidden" name="menu" value="make_invisible_photo"><input type="hidden" name="photo" value="{$photo_basename}"><input type="submit" value="この写真を表示しない"></form>
</div>
EOT;
      $photo_count++;
    }
  }
  if (0 == $photo_count) {
    echo "<p>送信された写真はありません。</p>";
  }
  echo PHP_EOL . "</div>" . PHP_EOL;
  ?>
<?php
  $url_photo_reload = $_SERVER['REQUEST_URI'] . '?' . uniqid();
  $url_kanja_add = "kanja_url_form.php" . '?' . uniqid();
echo <<<EOT
<p>
<a href="{$url_photo_reload}">写真を新しく読み込む</a>
<a href="{$url_kanja_add}" target="_blank" rel="noopener noreferrer">アドレスを患者さんに伝える</a>
</p>
EOT;
?>
<form class="rename_self_form" method="post" onsubmit="return click_new_watch_url()">
  <input type="hidden" name="menu" value="rename_self">
  <input type="submit" value="見守るURLを変える">
</form>
<script>
function click_make_invisible_photo() {
  return window.confirm('ボタンを押した写真の表示を消します。よろしいですか？');
}
function click_new_watch_url() {
  return window.confirm('この機能を使うと見守るURLを変更します。よろしいですか？');
}
</script>
</body>
</html>

<?php
}
