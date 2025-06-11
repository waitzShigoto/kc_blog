---
layout: post
title: "無線を活用：adbを使用してAndroid実機に無線で接続する方法！"
date: 2022-02-15 13:46:32 +0800
image: others/adb_wifi.png
tags: [Android,adb]
categories: Android教學
excerpt: "この記事では、adbを使用してWiFi経由でAndroid実機に接続する方法を紹介します。有線の制約から解放され、より快適に開発とテストを行いましょう。"
---

## 前言
本記事では、adb wifi cliを使用してAndroidスマートフォンに接続する方法を記録します。

無線ネットワーク環境での開発やデバッグを希望するユーザーに最適です。

以前はAndroid Studioの機能を使ってスマートフォンに接続していましたが、

adb wifiを使用するのも良い方法です。

関連情報を調査し、メモとしてまとめました。

将来の参照に便利で、他のユーザーにも役立つことを願っています！

<div class="table_container">
    <span style="text-align:center;">さらに、Android 11では新しい方法も追加され、テストやデバッグが可能です：</span>

   <a href="{{site.baseurl}}/2022/02/22/android-adb-wifi-note-detail/">
     <img src="/images/others/adb_wifi.png" alt="Cover" width="30%"/>
   </a>
   <a href="{{site.baseurl}}/2022/02/22/android-adb-wifi-note-detail/">Android 11 adb wireless debugの力を解放：有線から無線へ、より自由なデバッグ体験を探る！</a>
 </div>

## 実際の手順

1.パソコンとAndroidスマートフォンを同じネットワークに接続

2.USBケーブルでAndroidスマートフォンをパソコンに接続し、開発者モードを有効にする

3.以下のコマンドを使用してスマートフォンのIPアドレスを確認

```linux
adb shell ifconfig
```
4.192.168.xxx.xxxのようなIPアドレスが表示されます

<img src="/images/others/ipconfig.png"/>

5.以下のコマンドを使用してTCP/IPモードに切り替え

```linux
adb tcpip <port>
```
-> ここでportは任意の番号

6. 最後に以下のコマンドを使用して接続

```
adb connect 192.168.0.101:5555
```
(5555は前に設定したportです)
これでadb wifiを使ってスマートフォンを操作できます

補足：
Android TVに接続する際にUSBポートがない場合、
設定->WiFi->同じネットワーク内でIPを確認すれば、コマンドを使用せずに接続できます。

<div class="c-border-content-title-4">注意点</div>
以前はAndroid Studioのadb wifiプラグインを使用してスマートフォンに接続していましたが、

同じポート設定やプラグインを使用する他のユーザーがいる場合、

IPアドレスが同じであれば、コマンドを使用して他のスマートフォンにAPKをインストールする可能性があります。

そのため、異なるポートを設定することをお勧めします。

## その他のメモ
- Android 10以下のadb接続の詳細
  - `adb connect`でスマートフォンに接続するには、**少なくとも一度はUSBケーブルで接続**し、TCP/IPポートを設定する必要があります。
  - 一部のadb wifiプラグインはデフォルトでポート5555を使用します。そのため、同じネットワーク内の他のユーザーがIPアドレスを知っている場合、接続される可能性があります。
  - 接続を解除するには `adb disconnect <ip>:<port>` を使用。
  - `adb kill-server` を使用すると接続が解除されます。
  - スマートフォンのローカルIPを確認するには `adb shell ifconfig` を使用し、次のように表示されます：
 ```
 wlan0   Link encap:Ethernet  HWaddr F0:XX:B7:XX:XX:97
         inet addr:192.168.X01.XXX  Bcast:192.XXX.X01.255  Mask:255.255.255.0
         inet6 addr: fe80::fxxxx:x2xx:fee1:7d97/64 Scope: Link
         UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
         RX packets:543 errors:0 dropped:0 overruns:0 frame:0
         TX packets:574 errors:0 dropped:0 overruns:0 carrier:0
         collisions:0 txqueuelen:1000
         RX bytes:198035 TX bytes:125461
 ```
   または、以下のCLIを使用してターゲットIPを直接取得できます：`adb shell ip route | awk '{print $9}'`

    ![adb-ip-photo.png](/images/others/adb-ip-photo.png)
