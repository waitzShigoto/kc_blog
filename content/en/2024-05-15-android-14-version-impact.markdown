---
layout: post
title: "How to Handle Version Differences in Android 14 Development? Quick Adaptation Guide for Android 14!"
date: 2024-05-15 10:33:18 +0800
image: cover/android-version-adaptation-14.png
tags: [Android]
categories: SDK升級
excerpt: "This article will introduce the development challenges and solutions brought by the Android 14 version upgrade."
---
<div class="c-border-content-title-4">Summary of some important changes in the Android 14 platform, all applications will behave differently on this platform</div>
<div class="c-border-content-title-1">Core Features</div>

* The system no longer grants precise alarm permissions by default, applications need to apply for them themselves.
   - Android 14 no longer grants the `SCHEDULE_EXACT_ALARM` permission by default for apps targeting SDK >= 33

   (By default, it is set to `deny`)
   - This permission was introduced in Android 12 (previous <a href="{{site.baseurl}}/2022/08/24/android-12-version-impact/">note</a>)

   At that time, it was only necessary to declare it in AndroidManifest.xml
   Now you need to `request permission`
   - `Request permission` steps:
     1. Use `AlarmManager.canScheduleExactAlarms()` to check for permission
     2. Call an intent containing `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` in `onResume()`
     3. Example:
     ```Kotlin
     override fun onResume() {
           …  
           if (alarmManager.canScheduleExactAlarms()) {
               // Set exact alarms.
               alarmManager.setExact(...)
           }
           else {
               // Permission not yet approved. Display user notice and revert to a fallback  
               // approach.
               alarmManager.setWindow(...)
           }
        }
     ```
   - The official recommendation is to remove the use of precise alarms if not necessary: [Click here](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms?authuser=7&hl=zh-cn#use-cases)

  * When the application enters the `cached state`, broadcasts registered by the context will be queued.
    - Broadcasts received at this time will enter the queue and will be returned to the app sequentially the next time the app returns to the `foreground` or leaves the `cached state`.
    - Cached state: Simply understood as an app in the background, not currently in the foreground process, so if the system needs memory elsewhere, it can freely terminate these processes as needed.
    - Only context-registered broadcasts will be queued, `static registrations will not`, such as those added in AndroidManifest.xml.

<div class="c-border-content-title-1">Application Management</div>

   * Apps can only terminate their own background processes and cannot affect other applications.
     - After targeting SDK 34, you can no longer use `killBackgroundProcesses` to close other app background processes
     - If your app uses this method to close other app background processes, it may no longer work in the future
   * The MTU setting for the first GATT client requesting MTU is set to `517` bytes and `ignores` all subsequent MTU requests for that ACL connection.
       - Simply put, after the GATT client in the app creates and connects (BluetoothGatt#connect),

       the first time the API `BluetoothGatt#requestMtu(int)` is used to set the MTU, the system sets it to 517 bytes

       - Related knowledge:
       `MTU (Maximum Transmission Unit)`: The maximum amount of data that can be sent in a single packet

       `Bluetooth Core Specification 5.2`: The official change is mainly to strictly comply with this specification. [Click to view the specification](https://www.bluetooth.com/wp-content/uploads/2020/01/Bluetooth_5.2_Feature_Overview.pdf)
       - If you plan to implement Gatt connection to `Bluetooth devices` and set MTU in the future, you can refer to: [This tutorial](https://blog.csdn.net/qq_38436214/article/details/132334688)
       - `If your product actually transmits data with Bluetooth devices`,

       due to MTU limitations, you may encounter many situations that need adaptation.

       For example: setting MTU in Gatt, but the target Bluetooth device does not support it, you may need a contingency plan

       Or the Bluetooth device needs to adjust its firmware due to changes in Android 14, etc...

<div class="c-border-content-title-1">User Experience</div>

* New permissions allow users to select which `photos` and `videos` can be accessed.
    - Android 14 introduces the `photo selection` permission `READ_MEDIA_VISUAL_USER_SELECTED`
    - Using `READ_MEDIA_VISUAL_USER_SELECTED` allows users to `select` which `photos` and `videos` can be accessed

    or choose to `allow all` access. As shown in the image below, two options will appear for the user to choose from:

    <img src="/images/android14/001.png" width="35%">

    - In `Android 13`, permissions were already refined once,

    using `READ_MEDIA_VIDEO` and `READ_MEDIA_IMAGES` to access `all` photos and videos at once: <a href="{{site.baseurl}}/2022/08/25/android-13-version-impact/">Previous Android 13 notes</a>
      ```kotlin
         <!-- Devices running Android 12L (API level 32) or lower  -->
         <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
         android:maxSdkVersion="32" />

         <!-- Devices running Android 13 (API level 33) or higher -->
         <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
         <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />

         <!-- To handle the reselection within the app on Android 14 (API level 34) -->
         <uses-permission android:name="android.permission.READ_MEDIA_VISUAL_USER_SELECTED" />
      ```
    - The above methods can be adjusted according to needs, but
    if `READ_MEDIA_VISUAL_USER_SELECTED` is not used in Android 14, it will use [compatibility mode](https://developer.android.com/about/versions/14/changes/partial-photo-video-access?authuser=7&hl=zh-cn#compatibility-mode)

    - Compatibility mode: Each time, it will prompt the user to select which photos and videos can be used by the app.
    - The official statement is that this is a way to enhance `user privacy`.

    - Practical example:
      ```kotlin
       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
           requestPermissions.launch(arrayOf(READ_MEDIA_IMAGES, READ_MEDIA_VIDEO, READ_MEDIA_VISUAL_USER_SELECTED))
       } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
           requestPermissions.launch(arrayOf(READ_MEDIA_IMAGES, READ_MEDIA_VIDEO))
       } else {
           requestPermissions.launch(arrayOf(READ_EXTERNAL_STORAGE))
       }
      ```
      Or see the official permission example: [Click here](https://developer.android.com/about/versions/14/changes/partial-photo-video-access?authuser=7&hl=zh-cn#permissions)
  * New behavior: `Non-dismissible` notifications can now be `dismissed` by users. [Official documentation](https://developer.android.com/about/versions/14/behavior-changes-all?hl=zh-tw&authuser=7#non-dismissable-notifications)
    - Android 14 has changed this behavior, allowing users to dismiss such notifications
    - In simple terms: Currently using `Notification.Builder#setOngoing(true)` and `NotificationCompat.Builder#setOngoing(true)`
    to set Notification.FLAG_ONGOING_EVENT to prevent users from dismissing foreground notifications `will no longer work`
    - The actual effect will be like this (left: Android 14, right: Android 11):

      <img src="/images/android14/002.gif" width="35%">
    - However, the following two situations are still not prohibited:
      1. The phone is locked
      2. The user selects `Clear all` notifications
    - And the following types are currently not affected:
      1. CallStyle notifications: Simply put, `phone-like` notifications
      For example:
      ```Kotlin
         val builder = NotificationCompat.Builder(context, CHANNEL_ID)
             .setSmallIcon(R.drawable.notification_icon)
             .setContentTitle("Incoming call")
             .setContentText("Caller Name")
             .setPriority(NotificationCompat.PRIORITY_HIGH)
             .setCategory(NotificationCompat.CATEGORY_CALL)
             .setFullScreenIntent(fullScreenPendingIntent, true)
             .setOngoing(true)
             .addAction(R.drawable.ic_accept, "Accept", acceptPendingIntent)
             .addAction(R.drawable.ic_decline, "Decline", declinePendingIntent)
             .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
      ```

      2. Becoming a Device Policy Controller (DPC) and supporting software packages

<div class="c-border-content-title-1">Accessibility Features</div>

* Non-linear font scaling up to 200%.
   - Refers to Android adjusting system support for `text font` scaling up to 200%

     Before adaptation, font scaling might cause layout issues.
   - You can adapt using the following methods:
     1. a. Always use `sp` to set text font size
     2. b. You can also set it programmatically
     Using `TypedValue.applyDimension()`: sp to pixel
     `TypedValue.deriveDimension()`: pixel to sp
     3. c. (optional) Use sp units for `lineHeight`: If using dp or px units

     In this case, text cannot scale or may look squeezed

     Set both textSize and lineHeight using sp

     The system will adjust line height and font size according to settings.
     (Mainly depends on whether your product needs to set line height)
     4. d. [Official documentation](https://developer.android.com/about/versions/14/features?authuser=7&hl=zh-cn#sp-units)
   - Testing method:
     Open `Settings` > `Accessibility` > `Display size and text`
     In the font size option, click the plus (+) icon to adjust to the maximum scale.
   - It has little impact on `compilation`, mainly requiring additional adaptation if needed,
   In older code, you might see font settings using dp, or some code `converting dp to pixel`,
   So if encountered, you can change it conveniently, or develop a habit of using the officially recommended solution.

<div class="c-border-content-title-1">Security</div>
* The minimum installation requirement for `targetSdkVersion` API level has been raised to `23`.
  - Mainly, after `Android 14`, only apps with targetSdkVersion `>= 23` can be installed.

  - However, if you just want to test during development, you can use the following adb command:

  `adb install --bypass-low-target-sdk-block filename.apk`

  - The main purpose of this is to `prevent malicious software` from using old versions to bypass new security constraints,

  for example: using targetSDK 22 to bypass the permission request restrictions of `Android 6.0 Marshmallow (API 23)`. 

* The data safety information displayed on Google Play has been adjusted: it mainly displays based on the provided information,

it will not have a compilation impact on the app, mainly the information displayed on the page after listing,

you can refer to this URL to see if your app or product needs adjustments: [click here](https://support.google.com/googleplay/android-developer/answer/10787469?authuser=7&hl=zh-Hans#zippy=%2C%E5%A6%82%E6%9E%9C%E6%82%A8%E7%9A%84%E5%BA%94%E7%94%A8%E4%BC%9A%E5%88%86%E4%BA%AB%E7%94%A8%E6%88%B7%E6%95%B0%E6%8D%AE%E7%94%A8%E6%88%B7%E4%BC%9A%E7%9C%8B%E5%88%B0%E4%BB%80%E4%B9%88%E4%BF%A1%E6%81%AF)

* System notifications: Now, if an app shares location with a third-party library, users will be notified which apps have shared location with third parties within 30 days.

  <img src="/images/android14/003.png" width="60%">
* You can use the media storage query to list the OWNER_PACKAGE_NAME field of applications that store specific media files.

Starting from Android 14, unless at least one of the following conditions is met, the system will mask this value:
  - The application storing the media file has a package name that is always browsable by other applications.
  - The application querying the media storage requests the QUERY_ALL_PACKAGES permission.

<div class="c-border-content-title-4">Behavior changes for apps targeting Android 14</div>

* For applications targeting Android 14 (API level 34) or higher,

Android 14 will enforce the `BLUETOOTH_CONNECT` permission when calling the BluetoothAdapter#getProfileConnectionState() method.

  - If used, add this permission in `AndroidManifest.xml`
  - Check if the permission has been granted before use

* If JobScheduler uses `setRequiredNetworkType` or `setRequiredNetwork`,

  it now needs to declare the `ACCESS_NETWORK_STATE` permission,

  otherwise, it will cause a SecurityException on Android 14 or higher.

* Restrictions on `implicit` intents and pending intents: Android 14 adds restrictions on the use of implicit intents.
  - Implicit intents can now only be used on components that are already exported, you can set `exported = true`, or use `explicit intent`

  e.g. Use `explicit intent` or `exported = true`

  ```xml
  <activity android:name=".MyActivity" android:exported="true">
     <intent-filter>
         <action android:name="com.example.action.APP_ACTION" />
         <category android:name="android.intent.category.DEFAULT" />
     </intent-filter>
  </activity>
  ```

  ```kotlin
   // This makes the intent explicit.
   val explicitIntent =
           Intent("com.example.action.APP_ACTION")
   explicitIntent.apply {
       package = context.packageName
   }
   context.startActivity(explicitIntent)
  ```

  - When using `mutable` pending intents without specifying the package name, exceptions may be thrown.

  Example of an exception using a pending intent with `FLAG_MUTABLE`:

  ```
  Intent intent = new Intent(Intent.ACTION_VIEW);
  PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_MUTABLE);
  ```
  Add the package name to avoid exceptions:

  ```
   Intent intent = new Intent(Intent.ACTION_VIEW);
   intent.setPackage("com.example.myapp");
   PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_MUTABLE);
  ```
* Now you need to add the flag `RECEIVER_EXPORTED` or `RECEIVER_NOT_EXPORTED` to the Broadcast receiver registered in the context,

  to protect the application from security vulnerabilities.

```
 val receiverFlags = if (listenToBroadcastsFromOtherApps) {
      ContextCompat.RECEIVER_EXPORTED
   } else {
      ContextCompat.RECEIVER_NOT_EXPORTED
   }
   ContextCompat.registerReceiver(context, br, filter, receiverFlags)
```

* Files currently using dynamic code loading must be set to `read only`

Otherwise, an exception will occur

This is due to the official consideration of its [security](https://developer.android.com/privacy-and-security/security-tips?authuser=7&hl=zh-cn#DynamicCode)
  - Official recommendations for existing loading files can be found [here](https://developer.android.com/about/versions/14/behavior-changes-14?authuser=7&hl=zh-cn#handle-existing-files)
  - If you must dynamically load code, use the following method

  Set the dynamic file (such as DEX, JAR, or APK file) to read-only immediately before opening and writing any content to it:

  ```Kotlin
   val jar = File("DYNAMICALLY_LOADED_FILE.jar")
   val os = FileOutputStream(jar)
   os.use {
       // Set the file to read-only first to prevent race conditions
       jar.setReadOnly()
       // Then write the actual file content
   }
   val cl = PathClassLoader(jar, parentClassLoader)
   ```

* To prevent zip traversal vulnerabilities

Now, when using ZipInputStream.getNextEntry(), paths containing `..` or `/` will throw a `ZipException`

  - If you want to bypass this validation step, you can directly call `dalvik.system.ZipPathValidator.clearCallback().`

* `USE_FULL_SCREEN_INTENT`: Used to display full-screen notifications on Android 11 and above

  However, on Android 14, it can only be used on `call` and `alarm` type apps

  After `2024/05/31`, Google Play will revoke apps that use this permission for other purposes.

  - Currently, you can use the API `NotificationManager#canUseFullScreenIntent()` to check if full-screen notifications can be used.
  - If you do not have permission, you can request the `ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT` permission.

* Now, when using a foregroundService, you must declare the `android:foregroundServiceType` attribute
  - This attribute was introduced in Android 10, and now in Android 14, it must be declared, otherwise, an error will occur.
  - The official documentation provides `13` types for developers to declare, refer to [documentation](https://developer.android.com/about/versions/14/changes/fgs-types-required?hl=zh-tw&authuser=7)
  - The official recommendation is that `if it is unrelated to the above types`, you can migrate the logic to `WorkManager` or `user-initiated data transfer operations`.
  - If you declare using the above types, each type requires different permissions to be declared, for example: for the commonly used `mediaProjection` in our project, the following steps need to be completed:

    a. Declare `android:foregroundServiceType mediaProjection` in AndroidManifest.xml

    b. In addition to the original ForegroundService permission, declare the `FOREGROUND_SERVICE_MEDIA_PROJECTION` permission

    c. Before executing startForeground, use the `createScreenCaptureIntent()` method to confirm the permission with the user, then start the foreground service.

    d. When calling startForeground, include `FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION`

    ```kotlin
     startForeground(
         AIRSOS_ID,
         notification,
         ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION)
    ```

  - Other types follow similar concepts, but the permissions to be declared or the ServiceInfo to be added will vary depending on the type, please refer to the aforementioned documentation.
  - Besides the above, currently using `AirDroid Remote Support` to adjust and see, there are several directions to fix this issue
    a. Use the `dataSync` type to bypass this issue.

       `dataSync` does not require additional permissions at runtime, so the original process is less likely to be affected,

       -> `Risk`: If all are declared as `dataSync`, it can be modified with less effort in the short term and is less likely to affect the process, but it will be unrelated to the official documentation types.

       (The official documentation explains the responsibilities suitable for different types)

       It was found that `dataSync` is already noted by the official to be `deprecated` in the future, as shown in the image

       <img src="/images/android14/004.png" width="70%">

    b. For those requiring additional permissions at runtime, obtain the permissions from the user before executing startForeground in the original process

       For example: `mediaProjection` requires calling createScreenCaptureIntent() to obtain the mediaProjection permission before startForeground.

       Here is a demonstration

       Update your build sdk version

       <script src="https://gist.github.com/waitzShigoto/7c4a8ef7b18660749a8acec308992d2b.js"></script>
       Add the following permissions

       <script src="https://gist.github.com/waitzShigoto/1f396d04ca999787104f31dd735a4ae0.js"></script>
       Add the foreground service type according to your needs

       <script src="https://gist.github.com/waitzShigoto/333cca6030d4e727740f89ca74e529de.js"></script>
```

       -> `Actual Issues Encountered`: In the `Service` code I wrote earlier,

       I had already added `foregroundServiceType` (previously not mandatory),

       and this `service` has methods that operate actions within the class,

       such as startForegroundService.

       Therefore, according to the official documentation, in Android 14 and above,

       you need to call `createScreenCaptureIntent()` to obtain permission.

       Although adding the above sample can prevent crashes,

       the expected flow will differ from the `original plan`,

       requiring additional time to split logic, test, and modify the overall code, etc.

       Since each time you need to obtain the above permission for the foreground service,

       it means that products or solutions that previously used foreground services will need adjustments.

       - Note: 【Runtime】, here refers to the execution of `startForeground`.

       In practice, if you `do not follow the documentation` to obtain the corresponding permission `before execution`, it will cause an `exception` and `crash`.

       - Example of a crash is as follows:

       <img src="/images/android14/005.png" width="60%">

   c. Later, cross-tested several scenarios:

       - Declaring multiple foregroundServiceTypes in the `Manifest` using `|`.

       <img src="/images/android14/006.png" width="60%">

       And in the source code, providing `different types` of `foregroundServiceType` based on `different version checks`.

       <img src="/images/android14/007.png" width="60%">

       - Tried not adding `foregroundServiceType` in the source code,

       which would `crash` and show no `FOREGROUND_SERVICE_MICROPHONE` permission

       (in the case of declaring `multiple types`).

       <img class="zoomable" onclick="zoomImage(this)" src="/images/android14/008.png" width="60%">

         So, I went to test other Services,

         simply adding `dataSync` in the Manifest,

         even if no `foregroundServiceType` is entered in the source code, it will not `crash`.

         But mixing `microphone` with an empty `foregroundServiceType` will `crash`.

         (Left will `crash`, right runs normally, click to enlarge)

           <div style="display: flex;">
               <img src="/images/android14/009.png" width= "45%" style="margin-right: 10px;">
               <img src="/images/android14/010.png" width= "45%" >
           </div>
