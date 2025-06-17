---
layout: post
title: >-
  How to Handle Version Differences in Android 13 Development? Key Tips
  Revealed!
date: '2022-08-25 11:11:58 +0800'
image: cover/android-version-adaptation-13-1.png
tags:
  - Android
  - Debug
  - aosp
  - ota
categories: DebugAndOptimize
excerpt: >-
  This article will introduce the development challenges and solutions brought
  by the Android 13 version upgrade. By sharing some key tips, we hope to help
  developers handle version differences more smoothly and successfully complete
  their development tasks.
---

This article will share my development experience with you,

focusing on the challenges and solutions brought by Android version upgrades.

By analyzing the problems I encountered,

I hope to provide some valuable insights for you when facing similar issues during the development process.

<div class="c-border-content-title-4">
   New Battery Usage Restrictions in Android 13 and Above: <a href="https://developer.android.com/about/versions/13/changes/battery#restricted-background-battery-usage" target="_blank">Reference Document</a>
</div>
  - When targeting Android 13, the system will not send any of the following broadcasts unless the app is started for other reasons:
      - BOOT_COMPLETED
      - LOCKED_BOOT_COMPLETED

<div class="c-border-content-title-4">
   After Upgrading BUILD_SDK Version to 33, a New writeBytes(byte data[]) Method is Added in ByteArrayOutputStream
</div>

 - Previously, during development, someone had written a custom `writeBytes` method
   which coincidentally had the same name, causing compilation errors.
 - If considering upgrading the build SDK, the project owner can consider removing, renaming, or adding public to the method.
   ![android13_lib_error.png](/images/others/android13_lib_error.png)

<div class="c-border-content-title-4">
   Device Admin Permission Behavior Adjustment
</div>
  - If Device Admin permission is granted, it will be permanently disabled if the app is not used.
  (Self-testing found that if Device Admin permission is turned off, it remains grayed out and cannot be modified)
<div class="c-border-content-title-4">
     Refined Access Permissions in Android 13
</div>
  - Only requesting old permissions will cause a crash, but it can be replaced with `All Files Access Permission`.
  ![android13_access_permission.png](/images/others/android13_access_permission.png)
  - AirDroid requests `All Files Access Permission`, so no modification is needed currently. Below is the Intent to navigate to that page: 

    `new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);`
  - For modifications, refer to the demo:
  <script src="https://gist.github.com/waitzShigoto/d75998c921b176e659c911a938da4930.js"></script>

  <div class="c-border-content-title-4">
       Changes in Notification Permissions in Android 13
  </div>
  - Since Android 13 disables notifications by default: [Official Document on Notification Permission Changes](https://developer.android.com/guide/topics/ui/notifiers/notification-permission?hl=zh-tw)
  - Therefore, when executing NotificationManager,
    the system will prompt to enable notifications.

  - For behavior changes, refer to [Articles on Adaptation by Netizens](https://zhuanlan.zhihu.com/p/572147515)

  - To handle permissions yourself, you need to upgrade to target SDK 33
    to handle the Manifest.permission.POST_NOTIFICATIONS permission.

    Or, when targeting SDK 32, move the initialization of NotificationManager to a later point,
    but you won't be able to handle user rejection of Manifest.permission.POST_NOTIFICATIONS.

  - target SDK 33 demo patch: [Demo](http://192.168.201.72:8080/c/airsos/+/21558)
