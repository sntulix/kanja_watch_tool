
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta name="robots" content="noindex, nofollow">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=yes" />
  <title>患者さんに伝えるアドレス</title>
  <link rel="stylesheet" href="kanja_url.css<?php echo '?' . uniqid(); ?>">
</head>
<body>
    <div>
      <form method="POST" action="kanja_url_generate.php" class="kanja_url_form" onsubmit="return check_kanja_id()">
        <label for="kanja_id">患者さんに付けるID：</label><input type="text" name="kanja_id" id="kanja_id" maxlength="20" pattern="[^¥\x5c\x3a\x2a\x22\x3c\x3e\x7c\x2d]*">（入れる文字は長さ20文字まで入ります。文字¥/:*?"<>|-は使えません）
       <input type="submit" name="submit" value="アドレスを作成">
      </form>
      <p>※患者さんのIDは被ると写真が上書きされますので、被らないようにIDを付けてください。</p>
    </div>
<script>
  function check_kanja_id() {
    var kanja_id_tag = document.getElementById("kanja_id");
    if ("" !== kanja_id_tag.value) {
      return true;
    }
    alert("患者さんにIDを付けてください");
    return false;
  }
</script>
</body>
</html>
