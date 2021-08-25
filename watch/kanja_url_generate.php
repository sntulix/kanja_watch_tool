<?php
header('Cache-Control: no-cache');

require("../config.php");
require("../utility.php");
require("phpqrcode/phpqrcode.php");

$kanja_id = "";
$kanja_id_label = "患者";
if ("POST" == $_SERVER["REQUEST_METHOD"]) {
	if (!empty($_POST['kanja_id'])) {
		$kanja_id = $_POST['kanja_id'];
    $kanja_id_label = $kanja_id;
	}
}

$uri = str_replace('?'.$_SERVER['QUERY_STRING'], "", $_SERVER['REQUEST_URI']);
if (isset($_SERVER['HTTPS'])) {
  $server_https = $_SERVER['HTTPS'];
} else {
  $server_https = '';
}
  $kanja_url = GetKanjaURL($uri, $server_https, $_SERVER['HTTP_HOST'],
 __FILE__, $watch_dir, $kanja_dir, $kanja_id);

$kanja_qrcode_url = "kanja_url_qrcode.php?kanja_id=" . $kanja_id . "&" . uniqid();

$url_kanja_add = "kanja_url_form.php" . '?' . uniqid();
?>

<!DOCTYPE html>
<html lang="ja">
<head>
	<meta name="robots" content="noindex, nofollow">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=yes" />
  <link rel="stylesheet" href="kanja_url.css<?php echo '?' . uniqid(); ?>">
</head>
<body>
  <div class="kanja_url_form">
  <?php
  echo <<<EOT
  <p>
  {$kanja_id_label}さんに伝えるアドレスは「<span id="kanja_url">{$kanja_url}</span>」です。 <button onclick="copy_kanja_url()">クリップボードにコピー</button>
  <br>
  <img src='{$kanja_qrcode_url}'>
  </p>
  <p>
  <a href="{$url_kanja_add}">次のアドレスを作る</a>
  </p>
EOT;
  ?>
</div>
<script type="text/javascript">
function copy_kanja_url() {
  const kanja_url = document.querySelector('#kanja_url').innerText;
  navigator.clipboard.writeText(kanja_url)
}</script>
</body>
</html>
