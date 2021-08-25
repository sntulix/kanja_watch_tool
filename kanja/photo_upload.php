<?php
header('Cache-Control: no-cache');

require_once('../config.php');
require_once("../utility.php");

if (file_exists("../allow_list.php")) {
	header('Access-Control-Allow-Origin: *');
}

$photo_basename = "";

/*
$remote_addr = $_SERVER['REMOTE_ADDR'];
$count_semi = substr_count($_SERVER['REMOTE_ADDR'], ':');
$count_dot = substr_count($_SERVER['REMOTE_ADDR'], '.');
if ($count_semi > 0 && $count_dot == 0) {
    $remote_addr = str_replace(':', "_", $_SERVER['REMOTE_ADDR']);
}

$remote_addr_hash = password_hash($remote_addr, PASSWORD_BCRYPT);
if (!isset($_POST['kanja_id'])) {
	$photo_basename = $remote_addr_hash;
} else {
	$photo_basename = $remote_addr_hash . '-' . $_POST['kanja_id'];
}
*/ 
$photo_basename = $_POST['kanja_id'];
$photo_filename = $photo_basename . '-' . get_random_string($random_string_length) . $photo_extension;
$photo_file_fullpath = $photo_dir . $photo_filename;

if (!file_exists($photo_dir)) {
	mkdir($photo_dir);
}
if (!file_exists($photo_expired_dir)) {
	mkdir($photo_expired_dir);
}

if (isset($_POST['photo_base64'])) {
	/*
	if (!isset($_POST['kanja_id'])) {
		$target_filename_pattern = $photo_basename."-*.jpg";
	} else {
		$target_filename_pattern = '*-' . $_POST['kanja_id'] . "-*.jpg";
	}
	*/
	$target_filename_pattern = $_POST['kanja_id'] . "-*.jpg";
	foreach(glob($photo_dir.$target_filename_pattern) as $previous_photo_path) {
		rename($previous_photo_path, $photo_expired_dir . basename($previous_photo_path));
	}

	$photo_base64 = $_POST['photo_base64'];
	$jpeg_binary = base64_decode($photo_base64);
	file_put_contents($photo_file_fullpath, $jpeg_binary);
	echo "ok";
}
