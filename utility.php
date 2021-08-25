<?php
function get_random_string($random_string_length) {
	$random_string = substr(str_shuffle(str_repeat('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()+-,.;=@[]^_`{}~', $random_string_length)), 0, $random_string_length);
	return $random_string;
}

function GetPhotoID($photo_basename, $remove_suffix_length) {
	$basekeys = substr($photo_basename, 0, strlen($photo_basename)-$remove_suffix_length);
  $tokens = explode('-', $basekeys);
  return urldecode($tokens[0]);
}

function GetKanjaURL($uri_query_string_removed, $SERVER_HTTPS, $host, $relative_selfpath, $watch_dir, $kanja_dir, $kanja_id="") {
  $base_url = rtrim((empty($SERVER_HTTPS) ? 'http://' : 'https://') . $host . $uri_query_string_removed, basename($relative_selfpath));

  $kanja_url = str_replace('/'.$watch_dir, '/'.$kanja_dir."kanja.php", $base_url);
  if (!empty($kanja_id)) {
    $kanja_url = $kanja_url . "?kanja_id=" . urlencode($kanja_id);
  }
  return $kanja_url;
}

function is_file_old($filepath, $after_second) {
  $file_last_change_timestamp = filemtime($filepath);
  if (time() >= $file_last_change_timestamp+$after_second) {
    return true;
  }
  return false;
}

function random_rename_selfscript($self_filename) {
  $watch_basename_before_init = $self_filename;
  $watch_basename_after_init = get_random_string(128) . ".php";
  if (file_exists($watch_basename_before_init)) {
    rename($watch_basename_before_init, $watch_basename_after_init);
  }
  return $watch_basename_after_init;
}
