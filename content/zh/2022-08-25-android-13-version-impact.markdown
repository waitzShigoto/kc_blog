---
layout: post
title: 如何應對 Android 13 開發中的版本差異？關鍵技巧大公開！
date: '2022-08-25 11:11:58 +0800'
image: cover/android-version-adaptation-13-1.png
tags:
  - Android
  - Debug
  - aosp
  - ota
categories: DebugAndOptimize
excerpt: >-
  本文將介紹 Android 13
  版本升級帶來的開發挑戰以及解決方案。透過分享一些關鍵技巧，希望能幫助開發人員在應對版本差異時更加得心應手，順利完成開發任務。
---

這篇文章將與您分享我的開發經驗，

著重於探討 Android 版本升級帶來的挑戰及解決方案。

透過分析我所遇到的問題，

希望能為您在開發過程中遇到類似問題提供一些有價值的見解。

<div class="c-border-content-title-4">
   Android 13以上 電池用量新限制:<a href="https://developer.android.com/about/versions/13/changes/battery#restricted-background-battery-usage" target="_blank">參考文件</a>
</div>
  - Android 13 為目標平台時，除非應用因其他原因啟動，否則係統不會傳送以下任何廣播：
      - BOOT_COMPLETED
      - LOCKED_BOOT_COMPLETED

<div class="c-border-content-title-4">
   把BUILD_SDK版本升上33後 ByteArrayOutputStream內多了一個 writeBytes(byte data[])方法
</div>

 - 剛好之前在開發遇到剛好有人有自己寫了一個`writeBytes`方法
   所以剛好重名，導致編譯出錯
 - 這邊若有考慮要把build sdk升上去 project owner可以考慮移除,改名或在前面加入public
   ![android13_lib_error.png](/images/others/android13_lib_error.png)

<div class="c-border-content-title-4">
   Device Admin permission行為調整
</div>
  - 如果有Device Admin 權限，未使用應用程式則移除權限則永遠關閉。
  （自測發現如果把 Device admin 權限關閉，此權限還是制灰無法修改）
<div class="c-border-content-title-4">
     Android 13 存取權限細化
</div>
  - 只要求舊的權限會crash，不過可以用`所有檔案存取權`取代
  ![android13_access_permission.png](/images/others/android13_access_permission.png)
  - 此專案有請求`所有檔案存取權`，所以目前不用修改，下方為跳轉到該頁面的Intent 附錄：

    `new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);`
  - 遇到要修改可參考demo：
  <script src="https://gist.github.com/waitzShigoto/d75998c921b176e659c911a938da4930.js"></script>

  <div class="c-border-content-title-4">
       Android 13 通知權限變化
  </div>
  - 因為Android 13 預設停用通知功能：[通知權限改變官方文件](https://developer.android.com/guide/topics/ui/notifiers/notification-permission?hl=zh-tw)
  - 所以執行NotificationManager時
    系統就會要求開啟通知

  - 改變的行為可參考 [網路上網友適配的文章](https://zhuanlan.zhihu.com/p/572147515)

  - 要自行處理權限的話需要升到target SDK 33
    才有Manifest.permission.POST_NOTIFICATIONS權限可處理

    或target SDK 32 時 把 初始化NotificationManager移到後面
    但就不能針對Manifest.permission.POST_NOTIFICATIONS 做一些 使用者選拒絕時的處理

  - target SDK 33 demo patch: [Demo](http://192.168.201.72:8080/c/airsos/+/21558)
