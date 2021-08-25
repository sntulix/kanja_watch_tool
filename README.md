# 患者watchツール "Home recuperation watching over tool"
自宅療養者の容体をスマートフォンのカメラを使って間接的にリモートで見守るツールです。

This is a tool keeping an eye on a home recuperation remotely.

## 概要 Overview
![自宅療養患者みまもりオープンソースシステムの図](https://user-images.githubusercontent.com/616940/130732815-825d9e39-7762-4e3c-8fb8-c90c44a125e8.png)

## 動作に必要なもの Requirements

患者 Patient  
iPhoneか、Androidのスマートフォン、またはカメラとネット回線の付いたパソコン。
- スマートフォン SmartPhoneの場合
  - iPhone
    - iPhone 5sから。iOSがアップデートされていること（iOS11〜）。
  - Android
    - 2015年発売から。最新のGoogle Chrome。AndroidOSがアップデートされていること（Android7〜）。
  - フェイスカメラ
  - 見守るサーバーへつながるネット回線（主にキャリア回線かWifi）。
- パソコンの場合
  - Windowsパソコンの場合、最新バージョンのEdge、Firefoxブラウザ、またはChrome系ブラウザ
  - Mac、最新バージョンのSafari、Firefoxブラウザ、またはChrome系ブラウザ
  - その他、最新バージョンのFirefoxブラウザ、またはChrome系ブラウザ
  - Webカメラ
  - 見守るサーバーへつながるネット回線（主にインターネットプロバイダ回線）。

見守る側 Keeper
PHPが動く公開Webサーバー
- Webサーバー
  - PHP7.2以降が動くこと。
  - 独自ドメインがなくても動きます。
  - SSL通信ができるアドレスであること。共用SSLでも動きます。
  - 月額固定のレンタルWebサーバーでも動きます。

# インストール Install  
1. サーバーを用意します。Prepare the server.
1. SSL通信できることを確認します。Confirm that SSL communication is possible.
1. ソースをWebサーバーにアップします。Upload the source to your web server.
1. アップしたディレクトリやファイルのパーミッション（755）を設定します。Set the permissions (755) of the uploaded directory and file.
1. ブラウザで設置したアドレスを開きます。ページ上に見守るアドレスを知らせますので、ブックマークなどで書き留めてください。Open the address you set up in your browser. We will inform you of the address to watch on the page, so please write it down with a bookmark etc.
1. この後は、見守るページにあるリンクから患者さんへ知らせるアドレスを作成し、患者さんがそのURLをブラウザで開くと見守るページに写真が送られてきます。After this, create an address to inform the patient from the link on the watching page, and when the patient opens the URL in the browser, the photo will be sent to the watching page.

# 使用上の注意
- 患者さんは渡されたアドレスをブラウザ開いておくと1分おきにカメラの映像がサーバーに送られますので、ご留意ください。Please note that if the patient opens the browser with the passed address, the camera image will be sent to the server every minute.
- 見守れる患者の人数（カメラ数）はサーバーの性能によります。さくらサーバーのレンタルサーバーのスタンダードプランでおおよそ20人だと思います。The number of patients (number of cameras) that can be watched depends on the performance of the server.
- スマートフォンやノートパソコンは電源をつなぎながら利用してください。Please use this whiling connecting the power supply of your smartphone or laptop.
- 日本内では利用形態によって個人情報保護法の適用対象になりますので取り扱い義務に気をつけて下さい。In using, be careful of personal information protection law.
- 見守るページで患者さんのアドレスを作成する際に、患者さんごとにIDをつける必要があります。IDは被らなければ構いません。When creating a patient's address on the watch page, you need to give each patient an ID. You don't have to wear an ID.

# ライセンス License
MIT License

# 利用オープンソース
- PHP QR Code (http://phpqrcode.sourceforge.net/)
