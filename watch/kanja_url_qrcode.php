<?php
header('Cache-Control: no-cache');

require("../config.php");
require("../utility.php");
require("phpqrcode/phpqrcode.php");

$kanja_id = "";
if ("GET" == $_SERVER["REQUEST_METHOD"]) {
  if (isset($_GET['kanja_id'])) {
    $kanja_id = $_GET['kanja_id'];
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

header("Content-type: image/png");
QRcode::png($kanja_url, null, QR_ECLEVEL_H);
?>
