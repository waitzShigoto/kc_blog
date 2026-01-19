---
layout: post
title: 擁抱無線：教你使用adb無線連接Android實機教學！
date: '2022-02-15 13:46:32 +0800'
image: others/adb_wifi.png
tags:
  - ADB
  - Android
categories: AndroidDev
excerpt: 本文教你如何使用adb透過wifi連接Android實機，讓你不再受到煩人的有線限制，輕鬆進行開發與測試。
---

## 前言
本篇主要記錄如何使用 adb wifi cli 連接 Android 手機，

適用於想要在無線網路環境下進行開發和debug的使用者。

過去，我們常常使用 Android Studio 的功能來連接手機，
但其實使用 adb wifi 也不失為一種好方法。

因此，我特別查詢了相關資料並整理成筆記，

方便自己以後查閱，也希望能對其他使用者有所幫助！

 <div class="table_container">
    <span style="text-align:center;">另外android 11 也新增了另一種方法，供測試或debug的方案：</span>

   <a href="{{site.baseurl}}/posts/android-adb-wifi-note-detail">
     <img src="/images/others/adb_wifi.png" alt="Cover" width="30%"/>
   </a>
   <a href="{{site.baseurl}}/posts/android-adb-wifi-note-detail">釋放 Android 11 adb wireless debug 的力量：從有線到無線，探索更自由的debug體驗！</a>
 </div>

## 實際作法

 1.讓電腦與Android手機進入同一個區域網路

 2.用USB線將Android手機連上電腦 要開啟開發者mode

 3.透過以下指令尋找手機ip位址

 ```linux
 adb shell ifconfig
 ```
 4.會找到類似192.168.xxx.xxx的IP

 <img src="/images/others/ipconfig.png"/>

 5.用以下指令切換到tcp/ip模式

 ```linux
 adb tcpip <port>
 ```
 -> 這邊的port是可以自己指定的

 6. 最後使用指令

 ```
 adb connect 192.168.0.101:5555
 ```
 (5555是你前面設定的port)
 至此就能用adb wifi控制你的手機了

 補充：
 後來遇到要連線上android TV的方式
 但剛好沒遇到沒有usb插槽的情況
 這時候就可以去設定->wifi->同個網路下去找ip
 就不用透過指令

 <div class="c-border-content-title-4">這邊分享一個雷：</div>
由於之前一直使用android studio下載的adb wifi插件來連接手機(該插件的效果就跟上面一樣)，

又因該插件所設定的端口都是相同的，

且公司中有其他人也使用同樣的端口設定或同一套插件，

而沒去改port的話，

又剛好你們的ip被分發到上一次另一位同事的舊IP，

則有機會在同一區域網路下使用指令，

即可透過你的IP和端口安裝APK到你的手機。

不過這個就是爾偶發生

只是就可以趁機用 scrcpy看別人在幹嘛而已XD（誤

所以還是要設不同的port比較好

## 其他筆記
- 補充Android 10 以下的 adb連線細節
  - 使用`adb connect`連上手機 **至少需連接一次USB線**，需先設定你的tcpip的port
 之後不用插線只要同ip跟port就能直接連

  - 一些俗稱adb wifi 插件通常預設port為5555，故有機會手機已設定過adb tcpip port
 有人同區網又知道你的ip，就能輕易嘗試connect，並控制手機
 (這裡試過 ， 對沒設定過 `adb tcpip` 的直接用預設5555 會被refused)
 ![adb-connect.png](/images/others/adb-connect.png)
  - 要斷連用 `adb disconnect <ip>:<port>`
  - 主要運作在adb server下 ，用 `adb kill-server` 亦會斷連
  - 找手機本地IP可以用 `adb shell ifconfig`，可看到類似的如下：
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
   或是用這串CLI `adb shell ip route | awk '{print $9}'`
   直接取得目標IP

    ![adb-ip-photo.png](/images/others/adb-ip-photo.png)
