---
layout: post
title: "釋放 Android 11 adb wireless debug 的力量：從有線到無線，探索更自由的debug體驗教學！"
date: 2022-02-22 15:16:12 +0800
image: cover/android-adb-wirless-share-1.png
tags: [Android,adb]
categories: Android教學
excerpt: "想要釋放你的 Android 11 的真正潛力嗎？那就來探索無線 adb wireless debug 吧！從有線到無線，讓你的 debug 體驗更自由、更便利。"
---

## 前言
因應專案需求，
我們不斷地尋找使用 ADB Debug 的新方式，

最近發現 Android 推出了一種方式。

在這裡，我們分享了adb wireless debug的研究心得。

<div align="start" class="table_container">
  如果您還不熟悉 ADB wifi來Debug，之前我們也分享過相關的心得，建議您可以參考一下。

  <a href="{{site.baseurl}}/2022/02/15/android-adb-wifi-note/">
    <img src="/images/others/adb_wifi.png" alt="Cover" width="30%"/>
  </a>
  <a href="{{site.baseurl}}/2022/02/15/android-adb-wifi-note/">擁抱無線：教你使用adb無線連接Android實機！</a>
</div>

<div class="c-border-main-title-2">針對Android 11 新出的adb wireless debug 研究
  <a style ="color:white;" herf="https://developer.android.com/studio/command-line/adb#connect-to-a-device-over-wi-fi-android-11+">可參考此篇</a>
</div>

<div class="c-border-content-title-4"><b style="color:red;">Android 11</b> 後續版本才新增wireless debug功能，首先環境需達到：</div>
  1.Android 11 以上

  2.連接的電腦或自己包的環境下 platform tool SDK版本必需大於 30.0.0 (<b style="color:red;">adb version</b> 可查看當前sdk version)

  3.需在同個區域網路下

<div class="c-border-content-title-4">實際操作 <b>**(不需要 USB 線)**</b></div>
  1.Android手機至setting開啟開發者模式並進入找到‘Wireless debugging’開啟

  2.進入Wireless debugging子選單

  3.點pair device with code 進入查看ip、port還有paring code.

  4.Terminal上 <b>adb pair `ipaddr`:`port`</b> 輸入指令配對

  5.出現 <b>Enter pairing code:</b> 則輸入步驟3看到的paring code.

<div class="c-border-content-title-4">特色</div>
  1.Wireless debugging內可看到已經配對過的device，可管理刪除

  2.下次重開會自動重連

  3.無需USB線即可配對

  4.與舊版(Android10以下)adb 連wifi不同 ，舊版每次連都要手動重連

    - 簡述Android 10 以下 adb連線方法  **(需要借助 USB 線)**

    切換tcpip port : <b style="color:red;">adb tcpip <port></b>

    <b style="color:red;">adb connect <ip>:<port></b> 輸入ip 與剛剛的port來連接

## 其他筆記

  - Android 11 AOSP 內develop option 內的 WirelessDebuggingFragment內 看看能否知道如何產生pair code

    -> AOSP folder路徑 ：

     `/Android/11/packages/apps/Settings/com/android/settings/development/WirelessDebuggingFragment.java`

    這邊我看的結果看起來他需要特殊的key才能產生，

    不確定 `應用層` 能不能做到 

    有興趣研究的可以再去AOSP內看看

  - 部分機種Android 11 沒支援，意思是有可能廠商會鎖這項功能，如：LG 手機

     -> 開發者選項中看不到wireless debuging選項，

     故實際有無支援還是要看該廠商燒的OTA有沒有帶

  - `adb connect <ip>:<port> 連線`` 

     -> 用這個來測試連線是否能連到wireless debug 頁面上的那組<b style="color:red;">IP:port</b>

     但這指令一種是用來連線tcpip的ip(需要線)

     另一種則是恢復有記錄在wireless debuging下已pair過的device

     故僅能拿來手動恢復連線

