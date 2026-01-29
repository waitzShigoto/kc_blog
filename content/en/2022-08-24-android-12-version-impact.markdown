---
layout: post
title: >-
  How to Handle Version Differences in Android 12 Development? Key Tips
  Revealed!
date: '2022-08-24 14:39:48 +0800'
image: cover/android-version-adaptation-12-1.png
tags:
  - Android
  - Debug
  - aosp
  - ota
categories: DebugAndOptimize
excerpt: >-
  This article will introduce the development challenges brought by the Android
  12 version upgrade and their solutions. By sharing some key tips, we hope to
  help developers handle version differences more smoothly and complete their
  development tasks successfully.
---

<p class="table_container">
  This article will share my development experience with you,

  focusing on the challenges and solutions brought by Android version upgrades.

  By analyzing the problems I encountered,

  I hope to provide some valuable insights for you when facing similar issues during the development process.

  If you want to see what the official changes are,

  you can directly go to
  <a href="https://developer.android.com/about/versions/13/changes/battery#restricted-background-battery-usage" target="_blank">
    Android Developer</a>
</p>

## Features Affected by Android 12
<div class="c-border-content-title-4">
   New OS Camera and Microphone Permission Switches in Android 12 and Above
</div>
  - Users can enable/disable through the quick buttons in the start bar or the `Camera or Microphone Access` switch in settings.
  - This may affect the user experience with the camera,

  even if the camera permission is enabled,

  as long as the user disables camera access,

  it will show a black screen for the camera.

  The same applies to the microphone: [Reference](https://developer.android.com/training/permissions/explaining-access#toggles)

  - Currently, the following code can be used to detect if the system supports it and provide a prompt to the user. There is no API to determine if it is enabled.
  <script src="https://gist.github.com/waitzShigoto/c7469603bb0f6b6b533447c7d7c9e0cf.js"></script>

  <div class="c-border-content-title-4">
     Deprecated ACTION_CLOSE_SYSTEM_DIALOGS in Android 12 and Above:  
     <a href="https://developer.android.com/about/versions/12/behavior-changes-all#close-system-dialogs" target="_blank">Reference</a>
  </div>
   - However, in Android 13, it was tested that when `Accessibility Permission` is enabled, ACTION_CLOSE_SYSTEM_DIALOGS can still be sent.
   If not enabled, the broadcast will not be received.

   <div class="c-border-content-title-4">
      New Default Splash Screen in Android 12 and Above
      <a href="https://developer.android.com/guide/topics/ui/splash-screen/migrate" target="_blank">Migration guide</a>
   </div>

   - A new default icon splash screen is added as shown below:

     ![android12_splash_icon.gif](/images/others/android12_splash_icon.gif)
   - After testing, there is currently no method to remove this default splash screen.

     Only the method to remove the original custom Activity that does not display the screen but still runs the original cycle.

     The official documentation also provides some specifications for the new splash screen: <a href="https://developer.android.com/guide/topics/ui/splash-screen#elements" target="_blank">Reference</a>

   - Adjustment approach:

     - Add `implementation 'androidx.core:core-splashscreen:1.0.0'` to build.gradle

     Note that the minimum SDK requirement is 21 and above.

     ![android12_splash_min_sdk.png](/images/others/android12_splash_min_sdk.png)
     - Set the new splash screen Theme
     <script src="https://gist.github.com/waitzShigoto/dd55d7b2cb70cedf158763083390d426.js"></script>
      `windowSplashScreenBackground` is the background color, which can only be set to @color.

      `windowSplashScreenAnimatedIcon` is the icon for the circular view in the middle, which can be set to an image, but the size must follow the official specifications.

      `windowSplashScreenBrandingImage` is the small background image below the icon.

      `windowSplashScreenAnimationDuration` is the animation duration.

      <a href="https://developer.android.com/guide/topics/ui/splash-screen#set-theme" target="_blank">Other properties</a>
      

     - Add the new SplashTheme to `AndroidManifest.xml`

     - Add initial code
     <script src="https://gist.github.com/waitzShigoto/7799d22f3d2839965678d9f75435bda5.js"></script>

     `SplashScreen.installSplashScreen(this)` must be called before `super.onCreate`

     `splashScreen.setKeepOnScreenCondition(() -> true );`

     This line ensures that the old activity screen does not display, but the activity lifecycle will still run.

     However, this approach uses the new official splash screen, so the original customized screen will not be displayed. Product owners can consider this as needed.

  <div class="c-border-content-title-4">
    On Android target SDK 12 and above, if the value of android:exported is not declared in the intent-filter, it may cause installation failure.
  </div>

  - As shown, when compiling and installing, the following error `INSTALL_PARSE_FAILED_MANIFEST_MALFORMED` is displayed:
   ![android12_exported_crash.png](/images/others/android12_exported_crash.png)

  - Additionally, when using PendingIntent, corresponding flags must be added to avoid errors:
    <script src="https://gist.github.com/waitzShigoto/7ba7f042607cde3cb472af503088bce9.js"></script>
  - Solution & Demo:

    - Add `FLAG_IMMUTABLE` or `FLAG_MUTABLE` tags at each PendingIntent creation.

    - Also, add the latest work-runtime: `implementation 'androidx.work:work-runtime:2.7.1'`

    ![android12_workmanager.png](/images/others/android12_workmanager.png)

    - Notes

      - For example, in the project, since Different modules and repos are separate, other places also need to be corrected.
      - Implicit PendingIntent also needs modification, as libraries used in the implementation may also use PendingIntent.
      For instance, if the current project uses Google Analytics version 17.0.0, errors are still prompted.
      (You will only know if there is a PendingIntent error when running that specific code segment)
      ![android_12_error_01.png](/images/others/android_12_error_01.png)
      In this case, upgrading the version will suffice:
      `implementation 'com.google.android.gms:play-services-analytics:18.0.1'`

  <div class="c-border-content-title-4">
    When upgrading the target SDK to 32, setAppCacheEnabled(flag Boolean) and setAppCachePath(path String) are removed.
  </div>

   Since Chromium has removed this feature, the SDK no longer supports it: <a href="https://web.dev/appcache-removal/" target="_blank">Reference</a>
  ![android12_appcache.png](/images/others/android12_appcache.png)

  <div class="c-border-content-title-4">
    When upgrading the target SDK to 32, enabling foreground services while running in the background is restricted:
      <a href="https://developer.android.com/guide/components/foreground-services#background-start" target="_blank">Reference</a>
  </div>

  Currently, testing on SDK 32 shows that foreground services can still run in the background.

  Initially tried running StartForegroundService in the background Service, and it worked fine. This will be monitored further.

  The official recommendation is to use WorkManager as a replacement for execution:
  <a href="https://developer.android.com/about/versions/12/foreground-services?hl=zh-cn#recommended-alternative" target="_blank">Reference</a>

  <div class="c-border-content-title-4">
    To encourage saving system resources
  </div>

 Alarm Manager API in Android 12 requires declaring the `SCHEDULE_EXACT_ALARM` permission to use

 <div class="c-border-content-title-4">
   Android 12 has imposed sampling rate limits on motion sensors
   <a href="https://developer.android.com/guide/topics/sensors/sensors_overview#sensors-rate-limiting" target="_blank">Reference (only available on the English official website, not in Chinese)</a>
 </div>

 When using registerListener() to register a sensor listener to monitor sensor events, the maximum sampling rate is limited to 200Hz

 To use a higher Hz, you must add the `HIGH_SAMPLING_RATE_SENSORS` permission

 <div class="c-border-content-title-4">
    Android 12 behavior changes for approximate/precise location
 </div>

 In this version, when requesting approximate/precise location permissions,

 you need to request both `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION` simultaneously,

 to display the new location permission request dialog

 If you encounter this, take note: <a href="https://developer.android.com/training/location/permissions#approximate-request" target="_blank">Reference</a>

 <div class="c-border-content-title-4">
    Android 12 has separated Bluetooth permissions
 </div>
  Previously, when using Bluetooth-related APIs, you needed to declare

  `Manifest.permission.BLUETOOTH_ADMIN` and `Manifest.permission.ACCESS_FINE_LOCATION`

  to search for nearby Bluetooth devices

  If you encounter using startDiscovery.. and other APIs to search for nearby devices

  Using the old permissions when targeting API 32, `API returns fail or some APIs directly crash`

  ![android12_ble.png](/images/others/android12_ble_crash.png)

  You can modify it like this:

  1. Add `android:maxSdkVersion="30"` to the old permissions
  2. Declare new permissions `BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN`, or `BLUETOOTH_ADVERTISE` as needed
  ![android12_ble.png](/images/others/android12_ble.png)
  3. Previously, runtime permission requests only required the `ACCESS_FINE_LOCATION` permission, now they are separated, and you need to add the above `Bluetooth permission requests` at runtime

  Reference
  <a href="https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#startDiscovery()" target="_blank">API documentation</a>
    and <a href="https://developer.android.com/guide/topics/connectivity/bluetooth/permissions#declare-android12-or-higher" target="_blank">Bluetooth permission separation explanation</a>

  Here is a simple demo on how to modify

  <script src="https://gist.github.com/waitzShigoto/cd5950dcc9247ea889e835a4085694f8.js"></script>
```
