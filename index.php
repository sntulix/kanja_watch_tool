<?php
header('Cache-Control: no-cache');

require_once('utility.php');

if (file_exists("config.php")) {
echo <<<EOT
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta name="robots" content="noindex, nofollow">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.1, maximum-scale=1, user-scalable=yes" />
</head>
<body>
インストールは以前に行われました。<br>
</body>
</html>
EOT;
  return;
}

$conf =<<<EOT
<?php
\$kanja_dir = "kanja/";
\$watch_dir = "watch/";
\$photo_dir = "../photos/";
\$photo_extension = ".jpg";
\$photo_expired_dir = "../photos/expired/";
\$random_string_length = 128;
\$kanja_disconnected_warning_second = 180; /* 3分（秒） */
\$kanja_photo_expire_second = 2678400; /* 31日（秒） */

EOT;
file_put_contents("config.php", $conf);

$watch_dir = "watch/";
$watch_basename_before_init = $watch_dir . "watch.php";
$watch_basename_after_init = get_random_string(128) . ".php";
rename($watch_basename_before_init, $watch_dir . $watch_basename_after_init);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta name="robots" content="noindex, nofollow">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.1, maximum-scale=1, user-scalable=yes" />
  <link rel="stylesheet" href="watch.css">
</head>
<body>
<a href="<?php echo $watch_dir . urlencode($watch_basename_after_init);?>">見守りページを開いてください</a>
</body>
</html>
