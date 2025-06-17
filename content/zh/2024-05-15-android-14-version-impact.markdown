---
layout: post
title: 如何應對 Android 14 開發中的版本差異？Android 14快速適配指南！
date: '2024-05-15 10:33:18 +0800'
image: cover/android-version-adaptation-14.png
tags:
  - Android
categories: DebugAndOptimize
excerpt: 本文將介紹 Android 14 版本升級帶來的開發挑戰以及解決方案。
---
<div class="c-border-content-title-4">Android 14 平台的一些重要變更細節摘要，所有應用在該平台上行為改變</div>
<div class="c-border-content-title-1">核心功能</div>

* 系統不再預設授予精確鬧鐘的權限，需要應用自行申請。
   - Android 14 不再預設對target SDK >= 33 的app同意權限`SCHEDULE_EXACT_ALARM `

   （預設情況下，設定為`拒絕`）
   - 這個是之前android 12(之前的<a href="{{site.baseurl}}/2022/08/24/android-12-version-impact/">筆記</a>)新增的權限

   當時只需要在AndroidManifest.xml宣告即可
   現在需`請求權限`
   - `請求權限`步驟：
     1. 使用`AlarmManager.canScheduleExactAlarms()` 檢查有無權限
     2. 在 `onResume()`中調用含有`ACTION_REQUEST_SCHEDULE_EXACT_ALARM`的 intent
     3. 範例：
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
   - 官方也有建議如果不是必要使用精確鬧鐘，也可以移除：[點此](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms?authuser=7&hl=zh-cn#use-cases)

  * 當應用進入`緩存狀態(cached state)`時，context 註冊的廣播會被加入queue中。
    - 此時收到的廣播會進入queue中，下次app返回`前台`或離開`緩存狀態`時，會再依序返回給app。
    - 緩存狀態(cached state)：簡單理解就是在後台的 App，目前不在前台的進程，因此，如果系統其他地方需要內存，系統可以根據需要自由地終止這些進程。
    - 只有context註冊的會，`靜態註冊不會`，如：AndroidManifest.xml加入boardcast.

<div class="c-border-content-title-1">應用管理</div>

   * app只能終止自己的後台進程，無法影響其他應用。
     - target SDK 34 後，無法再使用`killBackgroundProcesses`去關閉其他app
     - 若您的app中有使用該方法去關閉其他app background process，以後可能失效
   * 第一個請求 MTU 的 GATT 客戶端的 MTU 設置為 `517` byte，並`忽略`針對該 ACL 連線的所有後續 MTU 請求。
       - 簡單來說是指 app中的 GATT 客戶端創建並連線後(BluetoothGatt#connect)後

       第一次使用API `BluetoothGatt#requestMtu(int)` 設定MTU時，系統設成517 byte

       - 相關科普：
       `MTU（Maximum Transmission Unit` : 可以在單一封包中發送的最大資料量

       `藍芽核心規範 5.2 版`：官方有這個改動主要為了個嚴格遵守此規範。[點擊查看規範](https://www.bluetooth.com/wp-content/uploads/2020/01/Bluetooth_5.2_Feature_Overview.pdf)
       - 如未來有要實作Gatt連接`藍芽裝置`並設置mtu可參考：[此篇教學](https://blog.csdn.net/qq_38436214/article/details/132334688)
       - `若您的產品有實際與藍芽裝置傳輸資料`，

       因為MTU的限制，可能會遇到很多情況，需要適配。

       例如：gatt設置 MTU，但目標藍芽裝置不支援，可能需有配套方案

       或是 藍芽裝置因android 14調整，fireware需跟著調整等等...

<div class="c-border-content-title-1">用戶體驗</div>

* 新的權限讓User去選哪些是要被存取的`照片`和`影片`。
    - Android 14 新增 `照片選擇`權限`READ_MEDIA_VISUAL_USER_SELECTED`
    - 使用`READ_MEDIA_VISUAL_USER_SELECTED`可以讓用戶`選擇`哪些要被存取的`照片`、`影片`

    或是選擇`全部`同意被取用，如下圖，會出現兩種選項讓使用者選：

    <img src="/images/android14/001.png" width="35%">

    - `Android 13` 那時候已經有細化一次權限，

    使用`READ_MEDIA_VIDEO`、`READ_MEDIA_IMAGES`來一次存取`所有`圖片、影片：<a href="{{site.baseurl}}/2022/08/25/android-13-version-impact/">之前的android 13筆記</a>
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
    - 以上方式均可以根據需求去調配，但是
    Android 14若未使用`READ_MEDIA_VISUAL_USER_SELECTED`，會走[compatibility mode](https://developer.android.com/about/versions/14/changes/partial-photo-video-access?authuser=7&hl=zh-cn#compatibility-mode)

    - compatibility mode （兼容模式）：每次都會跳一次讓使用者選擇要授權哪些照片、影片可以被app使用。
    - 官方說法是為了提升`用戶隱私`的一種方式。

    - 實際例子：
      ```kotlin
       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
           requestPermissions.launch(arrayOf(READ_MEDIA_IMAGES, READ_MEDIA_VIDEO, READ_MEDIA_VISUAL_USER_SELECTED))
       } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
           requestPermissions.launch(arrayOf(READ_MEDIA_IMAGES, READ_MEDIA_VIDEO))
       } else {
           requestPermissions.launch(arrayOf(READ_EXTERNAL_STORAGE))
       }
      ```
      或看官方取得權限範例:[點此](https://developer.android.com/about/versions/14/changes/partial-photo-video-access?authuser=7&hl=zh-cn#permissions)
  * 新行為：`不可關閉`通知變更成`可以`被用戶關閉。[官方文件](https://developer.android.com/about/versions/14/behavior-changes-all?hl=zh-tw&authuser=7#non-dismissable-notifications)
    - Android 14 已更改此行為，允許使用者關閉此類通知
    - 簡單來說：目前使用 `Notification.Builder#setOngoing(true)`、`NotificationCompat.Builder#setOngoing(true)`
    來設定 Notification.FLAG_ONGOING_EVENT 阻止使用者關閉前台通知`將會失效`
    - 實測效果會變這樣(左邊：Android 14, 右邊:Android 11)：

      <img src="/images/android14/002.gif" width="35%">
    - 不過以下兩種情況，還未禁止：
      1. 手機處於鎖定
      2. 用戶選擇`清除所有`通知時
    - 然後以下類型，目前也不影響：
      1. CallStyle 通知：簡單說就是`電話類`通知
      如：
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

      2. 成為 企業設備政策控制器 (DPC) 和支援軟體包

<div class="c-border-content-title-1">無障礙功能</div>

* 非線性字體放大至 200%。
   - 指Android 調整 系統支援`文本字體`放大高達 200%

     尚未適配前，可能會發生字體放大後排版不如預期。
   - 可以用以下方法來適配
     1. a. 始終使用`sp`來設置文本字體大小
     2. b. 也可用程式碼方式設置
     使用 `TypedValue.applyDimension()`：sp 轉pixel
     `TypedValue.deriveDimension()`：pixel轉sp
     3. c. (optional) 對 `lineHeight` 使用 sp 單位：若使用 dp 或 px 为单位

     在此情況下文本無法縮放或讓文字看起來變狹宰

     同時在textSize 和 lineHeight使用sp設置

     系統或隨著設定調整行高跟字體大小。
     (`主要自己的產品有沒有需要設置行高`)
     4. d. [官方文件](https://developer.android.com/about/versions/14/features?authuser=7&hl=zh-cn#sp-units)
   - 測試方法：
     開啟`設定`>`無障礙` > `顯示大小和文字`
     在字號選項中，點選加號 (+) 圖標，調整成最大倍率。
   - 對`編譯`上沒什麼影響，主要是遇到可能需要再額外適配一下，
   在比較舊的寫法會看到字體設置用dp，或是一些代碼`用dp轉pixel`，
   所以若遇到可以順手改下，或是養成習慣用官方推薦的解法

<div class="c-border-content-title-1">安全性</div>
* `targetSdkVersion` API 級別的最低安裝要求提升至 `23`。
  - 主要是`Android 14`之後只能安裝 targetSdkVersion `>= 23` 的 app

  - 不過如果開發時單純要測試可以用以下adb 指令：

  `adb install --bypass-low-target-sdk-block 檔案名稱.apk`

  - 官方主要用意是`遏止惡意軟題`用舊版本繞過新版本對安全性的約束條件，

  例如：利用targetSDK 22，繞過`Android 6.0 Marshmallo (API 23)`對權限的請求限制。

 * Google play上顯示的數據安全資訊有調整：主要根據提供的訊息去顯示，

實際對app不會有編譯上影響，主要是上架後頁面上顯示的資訊，

這邊就看大家自己的app或產品是否接受或是否需要調整，可參考這個網址：[點此](https://support.google.com/googleplay/android-developer/answer/10787469?authuser=7&hl=zh-Hans#zippy=%2C%E5%A6%82%E6%9E%9C%E6%82%A8%E7%9A%84%E5%BA%94%E7%94%A8%E4%BC%9A%E5%88%86%E4%BA%AB%E7%94%A8%E6%88%B7%E6%95%B0%E6%8D%AE%E7%94%A8%E6%88%B7%E4%BC%9A%E7%9C%8B%E5%88%B0%E4%BB%80%E4%B9%88%E4%BF%A1%E6%81%AF)

* 系統通知：現在若app有分享位置給第三方lib，則會通知用戶 30天內哪些app有分享位置給第三方。

  <img src="/images/android14/003.png" width="60%">
* 您可以使用媒體儲存區查詢列有儲存特定媒體檔案應用程式的 OWNER_PACKAGE_NAME 資料欄

自 Android 14 版本起，除非符合下列至少一項條件，否則系統將遮蓋此值：
  - 儲存媒體檔案的應用程式會具備一律可由其他應用程式瀏覽的套件名稱。
  - 查詢媒體儲存區的應用程式會要求 QUERY_ALL_PACKAGES 權限。

<div class="c-border-content-title-4">以Android 14 為目標的app，行為改變</div>

* 對於以 Android 14（API 等級 34）或更高版本為目標平台的應用

Android 14 會在呼叫 BluetoothAdapter#getProfileConnectionState() 方法時強制執行 `BLUETOOTH_CONNECT` 權限。

  - 若有使用到需要在 `AndroidManifest.xml` 新增該權限
  - 使用前檢查是否已授予權限

* JobScheduler 如果使用`setRequiredNetworkType`或`setRequiredNetwork`，

  現在需要聲明`ACCESS_NETWORK_STATE`權限

  否則Android 14 或更高版本時，會導致SecurityException。

* 對`隱式` intent 和待處理 intent 的限制：Android 14新增對implicit intent使用上的限制
  - implicit intent現在只能使用已經exported的組件上，可以設定定成`exported = true`，或是使用`explicit intent`

  e.g. 使用 `explicit intent` 或是 `exported = true`

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

  - 使用 `mutable` pending intent時未指定軟體包名時，可能拋出異常

  有exception例子，使用`FLAG_MUTABLE`的pending intent：

  ```
  Intent intent = new Intent(Intent.ACTION_VIEW);
  PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_MUTABLE);
  ```
  加入package name 避免exception：

  ```
   Intent intent = new Intent(Intent.ACTION_VIEW);
   intent.setPackage("com.example.myapp");
   PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_MUTABLE);
  ```
* 現在需要在context註冊的Boardcast receiver中加入flag

  `RECEIVER_EXPORTED` 或 `RECEIVER_NOT_EXPORTED`，用以保護應用程式免受安全漏洞的影響

  ```
   val receiverFlags = if (listenToBroadcastsFromOtherApps) {
      ContextCompat.RECEIVER_EXPORTED
   } else {
      ContextCompat.RECEIVER_NOT_EXPORTED
   }
   ContextCompat.registerReceiver(context, br, filter, receiverFlags)
  ```

* 現在使用動態代碼加載的檔案必需要設定成`read only`

否則會exception

因官方考慮其[安全性](https://developer.android.com/privacy-and-security/security-tips?authuser=7&hl=zh-cn#DynamicCode)
  - 官方對於已存在加載文件的[建議](https://developer.android.com/about/versions/14/behavior-changes-14?authuser=7&hl=zh-cn#handle-existing-files)
  - 如果必須動態載入程式碼，請使用以下方法

  在動態檔案（例如 DEX、JAR 或 APK 檔案）開啟並寫入任何內容之前立即將其設為read only ：

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

* 為防止zip遍歷的漏洞

現在使用ZipInputStream.getNextEntry()時，路徑中包含`..`、`/`會拋出`ZipException`

  - 如果想要退出此驗證步驟，可以直接呼叫`dalvik.system.ZipPathValidator.clearCallback().`

* `USE_FULL_SCREEN_INTENT`：android11以上會用來顯示全屏通知

  但在Android 14 上，僅能在`通話`和`鬧鐘`類型的app上使用

  在`2024/05/31`後google play會撤銷其他使用到該權限的app。

  - 目前可以用 API `NotificationManager#canUseFullScreenIntent()`檢查是否可以用全屏通知。
  - 若沒有權限，可以請求`ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT`權限。

* 現在使用foregroundService一定要宣告`android:foregroundServiceType`屬性
  - 此屬性是在Android10導入，現在Android14變成一定要宣告，否則會跳錯誤。
  - 其中官方提供`13`種type，讓開發者宣告，參考[文件](https://developer.android.com/about/versions/14/changes/fgs-types-required?hl=zh-tw&authuser=7)
  - 官方建議，`若與上述type無關`，可以把邏輯遷移到 `WorkManager` 或`使用者啟動的資料移轉作業`。
  - 若使用上面type宣告，每種type需宣告的權限不盡相同，例如：我方專案常用到的`mediaProjection`，需完成以下步驟：

    a. 在AndroidManifest.xml中宣告`android:foregroundServiceType
mediaProjection`

    b. 除了原本的ForegroundService權限，還要宣告`FOREGROUND_SERVICE_MEDIA_PROJECTION`權限

    c. 在執行startForeground前需要使用`createScreenCaptureIntent()` 方法，向使用者確認權限，才能啟動foreground service。

    d. 呼叫startForeground時，需加入`FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION`

    ```kotlin
     startForeground(
         AIRSOS_ID,
         notification,
         ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION)
    ```

  - 其他type觀念類似，但需宣告的權限或加入的ServiceInfo，會根據不同type有不同的值，請參考上面提到的文件。
  - 除上述，目前使用`AirDroid Remote Supprt`來調整看看，有幾個方向可以修正此問題
    a. 使用`dataSync`這個type來繞過此問題。

       `dataSync`他在`執行階段`沒有額外要求要取得其他權限，所以原本流程較不會被影響到，

       -> `風險`：若全部都宣告`dataSync`，短期可以修改量少，且不太會影響到流程，但會跟官方文件上的type無相關。

       (官方有在每個type下說明，不同type適合的職責)

       發現`dataSync`，官方已經備註日後會`淘汰`此type，如圖

       <img src="/images/android14/004.png" width="70%">

    b. 在`執行階段`需額外取得權限的，在原本流程中執行到startForeground前，去向使用者取得權限

       例如：`mediaProjection`在startForeground前，要求要先呼叫createScreenCaptureIntent() 去取得mediaProjection的權限。

       這裡嘗試去做了個示範

       更新你的build sdk version

       <script src="https://gist.github.com/waitzShigoto/7c4a8ef7b18660749a8acec308992d2b.js"></script>
       加入以下權限

       <script src="https://gist.github.com/waitzShigoto/1f396d04ca999787104f31dd735a4ae0.js"></script>
       根據你的需求加入 foreground service type

       <script src="https://gist.github.com/waitzShigoto/333cca6030d4e727740f89ca74e529de.js"></script>

       -> `實際可能遇到的問題分享`：我在先前寫過的`Service`代碼裡，

       已經有加入過`foregroundServiceType` (之前是非強制)，

       這個`service`中有method會去操作class內的action，

       例如 startForegroundService

       所以根據官方文件，在android14以上，

       需呼叫`createScreenCaptureIntent()`取得權限，

       雖說上面加入上述的sample，可以避免crash產生，

       但是原本預期的流程就會跟`原本方案`不一樣，

       需再花時間拆分邏輯，測試、修改整體代碼...等。

       因為每次都需要針對forground service取得上述權限

       代表以前做的產品或方案有用到forground service都需要做調整

       - 備註：【執行階段】，這邊指的是，執行`startForeground`時。

       實測上，若`沒有照文件`在`執行前`去取得對應的權限，則會產生`exception`並`crash`
       - Crash實例如下

       <img src="/images/android14/005.png" width="60%">

   c. 後來交叉測試了幾種情況

       -  `Manifest`中用 `|` 宣告多種foregroundServiceType

       <img src="/images/android14/006.png" width="60%">

       並在原始碼中搭配`不同版本的判斷`給予`不同類型`的`foregroundServiceType`

       <img src="/images/android14/007.png" width="60%">

       - 其中有嘗試若原始碼中不加`foregroundServiceType`，

       會`crash`並顯示沒有`FOREGROUND_SERVICE_MICROPHONE`權限

       （宣告`多種type`的情況下）

       <img class="zoomable" onclick="zoomImage(this)" src="/images/android14/008.png" width="60%">

         所以又跑去測試其他Service，

         Manifest中單純只加入`dataSync`的，

         就算原始碼中不輸入任何`foregroundServiceType`也不會`crash`

         但混用`microphone`的用空的`foregroundServiceType`卻會`crash`

         （左邊會`crash`，右邊正常運行，可點擊放大）

           <div style="display: flex;">
               <img src="/images/android14/009.png" width= "45%" style="margin-right: 10px;">
               <img src="/images/android14/010.png" width= "45%" >
           </div>
