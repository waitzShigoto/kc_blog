---
layout: post
title: '[Android][Kotlin]AndroidスマホでBluetoothパケットログを取得する方法'
date: '2021-11-12 16:16:32 +0800'
image: cover/ea-android_bluetooth_hci_packet.png
tags:
  - Android
  - Bluetooth
categories: AndroidDev
---

今日は、以前に研究した

logcatやコードを書かずに

Bluetooth通信のパケットを取得する方法を記録します。

これらの方法はネット上で多くの人が紹介していますが、

多くはコピー＆ペーストや古い情報が多いので、

実際にどうやって行うかを研究しました。

今日はその解説をします。

もし、gattサーバーの接続方法を見たい場合は、こちらをご覧ください。

<a href="{{site.baseurl}}/2021/11/12/android-kotlin-bluetooth-gatt-client/">
<img src="/images/cover/android-kotlin-bluetooth-gatt-client.png" alt="Cover" width="25%" >
[Android][Kotlin][2021]Android低功耗藍芽Gatt連線實作教學！</a>

本文開始：

# 方法1
### Step 1 - 開発者モードを有効にする
まず、開発者モードを有効にする必要があります。

<img src="/images/bluetooth/open_developer.png" alt="Cover" width="30%" >

通常はソフトウェア情報内でバージョン番号を数回タップして開発者モードに入りますが、

各メーカーのスマホによって異なる場合があります。

一部のメーカーでは、電話ダイヤル画面で特定のコマンドを入力するか、

他の隠しキーを押す方法があります。

もしうまくいかない場合は、手持ちのスマホの開発者モードの入り方をネットで調べてください。

成功すると、設定内に開発者オプションが表示されます。

<img src="/images/bluetooth/developer.png" alt="Cover" width="30%" >

### Step 2 - Bluetooth HCIログを有効にする
次に、開発者オプションに入り、

Bluetooth HCIログオプションを有効にします。

<img src="/images/bluetooth/open_hci.png" alt="Cover" width="30%" >

このオプションを有効にすると、

システムがBluetoothのHCIスヌープログを記録します。

ここで問題に直面しました。

古いバージョンのAndroidスマホでは、HCIログが/sdcardや/storageに保存されますが、

新しいバージョンでは異なるパスに保存される可能性があります。

さらに、読み取り権限のないディレクトリに保存されることがあります。

そのため、このファイルがあっても読むことができません。

スマホのroot権限やadb shell su権限がない限り、

簡単に読むことは難しいです。

もし、あなたのスマホが私と同じように読み取り権限のあるディレクトリに保存されていない場合、

以下の手順を参考にしてダンプしてください。

### Step 3 - CLIツールADBをインストールする

ADBはAndroid開発でよく使用されるデバッグツールです。

Android Studioをインストールしている場合、

インストールディレクトリのplatform tool内に内蔵されています。

全域で使用したい場合は、環境変数に設定できます。

Android開発の習慣がなく、

単にBluetoothログをテストしたい場合は、以下のURLからダウンロードできます。

<a href="https://developer.android.com/studio/releases/platform-tools" class="btn btn-primary" role="button">Android Platform Toolを見る</a>

### Step 4 - スマホを接続し、USBデバッグモードを確認する
開発者モードのUSBデバッグモードが有効になっていることを確認し、

PCに接続されていることを確認します。

以下のコマンドで確認できます。

```
adb devices
```

以下のようなメッセージが表示されれば、

接続されています。

```
List of devices attached
LXXXXXGYPXXCXXXXXX7	device
```

### Step 5 - Bluetooth HCIログファイルをダンプする

ファイルが読み取り権限のない場所に保存されているため、

コマンドを使用してダンプする必要があります。

まず、上記の手順を実行し、

Bluetooth HCIキャプチャを有効にし、

Bluetooth関連の操作を開始して、

システムにログを生成させます。

ここに一小段のシェルスクリプトがあります

<script src="https://gist.github.com/waitzShigoto/8d55a3492f8cafbfd86196ce8f6d610d.js"></script>

直接コピーしてシェルで実行できます

または一行ずつターミナルにコピーして実行することもできます
主に使用するのは

```
adb bugreport <FileName>
```
元々ログが保存されているディレクトリを読み取れないため
bugreportコマンドを使用します

これにより、現在のAndroidスマートフォン内のシステムログをダンプし

zipファイルに圧縮して現在のディレクトリに保存します
そのため、スクリプトではまず/tmpディレクトリにpushdします

ただし、これは個人の使用習慣によるので

自由に変更できます

その後、解凍するだけです
```
unzip fetchBugReport.zip
```
bugreportで出力されたデータ

スマートフォン内のログデータが表示されます

その後、関連するログファイルをcatするか

特定のソフトウェアを使用して読み取りにくいファイルを読むことができます

通常、解凍するとフォルダ構造が連結されます
例：
FS/data/log/.../btsnoop_hci.log

探しているファイルはBluetoothのログファイルです

ただし、異なるスマートフォンで試したところ

出力されるディレクトリ構造が異なる場合があります

シェルスクリプトをワンクリックで実行できるようにしたい場合

ここを変数にしておくと

ログを簡単に取得できます

例：
<script src="https://gist.github.com/waitzShigoto/d862a1007ddb5bbef96b28a8a5c3e723.js"></script>
ここは個人のニーズに応じて書き換え可能です

最後に共有しますが

研究過程で

すべてのスマートフォンがBluetoothのログを生成するわけではないことがわかりました

そのため、これらの不確実性により

パケットを簡単にキャプチャするという元々の考えが

あまり信頼できないものになりました

ただし、この方法を知っておくと

後で使用する場合に損はありません

# 方法2 - nRF Sniffer + WiresharkでBluetoothパケットをキャプチャ

### Step 1 - Pythonとpyserialのインストール
入力

```
python --version
```
バージョンが表示されれば

グローバル環境に既にインストールされています

<img src="/images/bluetooth/python_version.png" alt="Cover" width="100%" >

表示されない場合は

方法1:
<a href = "https://www.python.org/downloads/">Python公式サイト</a>
からインストール

方法2:brewを使用してインストール

<img src="/images/bluetooth/python_install.png" alt="Cover" width="30%" >

ターミナルに以下のコマンドを入力して

pyserialをインストールします

```
pip install pyserial
```
Successfullyと表示されればインストール成功です

### Step 2 - WireSharkのインストール   

<a href = "https://www.wireshark.org/download.html">WireShark公式サイト</a>
にアクセスしてインストーラをダウンロードします

<img src="/images/bluetooth/wireshark_web.png" alt="Cover" width="50%" >

自分のOSに合ったバージョンを選択し

通常のソフトウェアインストールのようにインストールします

<img src="/images/bluetooth/wireshark_dmg_phtot.png" alt="Cover" width="30%" >

### Step 3 - nRF-Sniffer-for-Bluetooth-LEプラグインのインストール  

リンクからダウンロードします
<a href = "https://www.nordicsemi.com/Products/Development-tools/nRF-Sniffer-for-Bluetooth-LE/Download#infotabs">nRF-Sniffer-for-Bluetooth-LE</a>

必要なバージョンを選択します

バージョンのChangelogはドロップダウンで確認できます

<img src="/images/bluetooth/nRF_changelog.png" alt="Cover" width="50%" >

私は4.1.0をダウンロードしました

ここは自分の必要に応じて選択してください

ダウンロードしたzipを解凍し、extcapフォルダを見つけます

<img src="/images/bluetooth/excap.png" alt="Cover" width="50%" >

並打開WireShark のAbout WireShark

mac版的是在應用程式名稱內

<img src="/images/bluetooth/wireshark_about.png" alt="Cover" width="30%" >

Golbal Extcap Path を見つける

<img src="/images/bluetooth/wireshark_folder.png" alt="Cover" width="60%" >

extcapは wiresharkがプラグインを置くフォルダです

上記でダウンロードしたnRF-Sniffer-for-Bluetooth-LE extcapフォルダ内のファイルをすべてこのフォルダにコピーします

### Step 4 - 公式提供のハードウェアを使用してパケットキャプチャを開始する {/*examples*/}

公式サイトでは、パケットキャプチャを行うために以下のハードウェアが必要とされています

<img src="/images/bluetooth/nRF_dongle.png" alt="Cover" width="60%" >

オンラインで購入するか

既に持っている場合は、コンピュータに挿入してwiresharkを開きます

接続されたソースを見つけて選択します

nRF Sniffer for Bluetooth LE COMXX

これでキャプチャを開始できます

結論

この方法でBluetoothパケットをキャプチャするには、追加のハードウェアが必要なため、少しコストがかかります

したがって、手元に適切なハードウェアがある場合は、この方法を試してみる価値があります

