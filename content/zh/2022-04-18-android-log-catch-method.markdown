---
layout: post
title: "Android Logcat 抓取技巧教學，讓你輕鬆掌握：非開發人員也能懂的log抓取技巧！"
date: 2022-04-18 16:37:48 +0800
image: cover/android-catch-log-1.png
tags: [Android,Debug]
categories: Debug探討
---

## 前言

* 今天我想跟大家分享一些讓你輕鬆抓取Android log的技巧！

  在開發過程中，常常會有這樣的問題：「有什麼方法可以快速抓log呢？」

  「怎麼讓測試或其他非開發人員也能輕鬆抓到Android log呢？」

  別擔心！我整理了一些簡單易懂的方法，希望能幫助你們更有效率地開發和測試。

## 快速抓取 Android log，從基本觀念開始！

  * 要抓Android的log，可以使用logcat這個工具，不過需要注意的是logcat只會抓取系統內部的log
    - 抓取整包log：使用指令 adb logcat 來抓取整包log，

    可以透過指定篩選條件來只抓取特定的log，

    詳細的篩選方法可以參考[篩選log參考](https://developer.android.com/studio/command-line/logcat#options)
    - 查看各個buffer的大小：使用指令 `adb logcat -g` 來查看各個buffer的大小。
    - 查看不同buffer內的log：除了主要的buffer之外，

    還有其他的buffer可以查看，

    例如radio、events、system等等，

    可以使用    
    ```
    [adb] logcat [-b 'buffer name']
    ```
    來查看特定的log，

    其中<buffer_name>為要查看的buffer名稱。

    例如：

    main buffer log :

    <b>adb logcat -b main</b>

    events buffer log : 

    <b>adb logcat -b events</b>

    以此類推
    - 想了解各buffer區差異可參考官方文件 ：[查看備用日志緩衝區](https://developer.android.com/studio/command-line/logcat#alternativeBuffers)

## Android log 抓取思路
<div class="c-border-content-title-4">以下是幾個使用 adb 抓取 Android 系統 log 的方式：</div>

<p class ="table_container">
  <i style="text-align: center;">需su權限</i>

 1. 拉出 Kernel panic log : <b style="color:red;">adb pull /sys/fs/pstore/console-ramoops</b>

 2. 印出 Kernel log：<b style="color:red;">adb shell cat /proc/kmsg</b> (抓取當前那次的log、第二次呼叫同指令會從上次結束後的log後面開始顯示)

 3. Linux kernel-ring buffer log : <b style="color:red;">adb shell su dmesg</b>

 <a herf="https://man7.org/linux/man-pages/man1/dmesg.1.html">dmesg指令參考</a>
</p>

<p class ="table_container">
  <i style="text-align: center;">不需權限</i>

  1. 拉出 ANR log : <b style="color:red;">adb pull /data/anr</b>

</p>

<div class="c-border-content-title-4">透過pc端執行adb logcat指令</div>
  - 使用 adb logcat 亦可以取得當前連接的裝置log，如：
  ```
  adb logcat
  ```

 

 <div class="c-border-content-title-4">從Android app用程式碼去抓log</div>
  * 這個思路是透過開發人員用以下方式將抓log的功能寫在app內讓非開發人員去抓
    - 開一個procees去執行commend :
    例如：`Runtime.getRuntime().exec("logcat -b radio")`

    - 在 Android 4.1 之前，

      開發者可以在 Manifest.xml 中添加 "READ_LOGS" 權限，

      獲得此權限後可以取得需要 su 權限才能取得的 log。

      但在 Android 4.1 之後，

      Google 將 "READ_LOGS" 權限列為十大不良權限，

      因此不再建議使用。可以參考 Google 開發者相關影片。

      [google developer相關影片](https://www.youtube.com/watch?v=WDDgoxvQsrQ&t=1323s)

    - 因此 Android > 4.1 時 在app內抓取log使用權限被變更為 `“signature|privileged”`
       等同於 需要有 `系統簽名` 或
       build image時包在特權資料夾`../priv-app`的app ([特許權限白名單](https://source.android.google.cn/devices/tech/config/perms-whitelist?hl=zh-cn))
       才能取得該`READ_LOGS`權限

    - 如果透過PC下指令：
      `adb shell "pm grant <package name> android.permission.READ_LOGS && am force-stop <package name>" `

       可以打開`READ_LOGS`權限 + 強制關閉app （因下完要重啟app才會生效）
       要關閉權限則將`grant`改成`revoke`

<div class="c-border-content-title-4">土法煉鋼：結合前面幾種</div>
  - 開發人員編寫程式碼在android app 內寫下 log 至對應資料夾

    之後再用`adb pull`拉出來

  - 例如：app寫好後，用adb pull拉出來

      `adb pull /sdcard/Android/data/your.package.name/files/`

<div class="c-border-content-title-4">另一種，更快的方法：Scrpit or shell 大法</div>

  - 透過寫好的shell直接小黑窗執行在背景抓log
  - 這邊分享個簡易的寫法：

<script src="https://gist.github.com/waitzShigoto/ff02fe2fa4d02a0b6521bdc75ef61666.js"></script>

<p class ="table_container">
  1. 如果是需要<b style="color:red;">開發人員</b>要客製的話就是要從頭到尾自己了解上面這份code

  2. 但若是<b style="color:red;">非開發人員</b>直接複製上面code到txt 或空白檔案中
  
     首先先確認電腦環境中有adb

     修改<b style="color:red;">packageName</b> 成指定的app包名

     配置<b style="color:red;">adbPath</b> 改成你`adb`的系統路徑

     (如果你要給非開發人員用 也可以配置./adb 在你同個資料夾的路徑 讓電腦沒裝`adb`的人，下載含有`adb`的就能執行)

  4. (optional) 可以自定義輸出的`log file name` 也可以自行帶入時間碼來區分等等

</p>
  - 最後寫好就可以在小黑窗(mac terminal / win cmd)執行`./your_add_log.sh`

  就開始抓囉！

  ![shell_log_start.png](/images/others/shell_log_start.png)
