---
layout: post
title: "Android16 適配筆記"
date: 2025-02-12 09:29:10 +0800
image: cover/android-version-adaptation-16.png
tags: [Android]
permalink: /android-16-note
categories: SDK升級
excerpt: "Android16 適配筆記"
---

## Android 16 開發時程 (2024-2025)
* 預覽階段 (2024)
    - 11月: Dev Preview 1 - 基準版本
    - 12月: Dev Preview 2 - 功能更新

* Beta階段 (2025)
  - 1月: Beta 1
  - 2月: Beta 2
  - 3月: Beta 3
  - 4-5月: 最終版本測試
  - 最終發布

* 最終版本預計2025 Q2發布，截至今日2025/02/11官方已經發佈到Beta1
  - [詳細](https://developer.android.com/about/versions/16/overview?hl=zh-tw)

## 行為變更

### 所有應用程式：無論 `targetSdkVersion` 為何，下列行為變更將會套用至所有應用程式
#### JobScheduler配額最佳化 (JobScheduler quota optimizations)
* 現在系統對於JobScheduler會有進一步的執行時間限制，目的是進一步限制應用程式在後台執行任務的頻率和資源消耗，以提升系統的整體效能和電池壽命，開發者可能需對此有一定的預期。(這邊官方`沒提到詳細的執行時間`是多少，他是用`quota`這個單字，所以可能要針對下述情況`有預期`)
* 受影響的範圍
  - 系統對於 JobScheduler 的執行時間配額會根據`應用程式所在的待命值區（ app standby bucket）`來決定，對開發者來說，變得要預期在`不同standby bucket`時，被分配到的配額會有所不同，`可透過下方代碼去處理`
    ```kotlin
    val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    val bucket = usageStatsManager.appStandbyBucket

    when (bucket) {
        UsageStatsManager.STANDBY_BUCKET_ACTIVE -> {
            // 使用中：較寬裕的執行時間配額
        }
        UsageStatsManager.STANDBY_BUCKET_RARE -> {
            // 很少使用：較嚴格的執行時間配額
        }

        ... 詳細狀態可以再去API內看
    }
    ```
  - 即使這個 Job 是在應用程式可見時啟動的，當應用程式進入背景後，Job 也會受到執行時間的限制
    ```kotlin
    // 即使 Job 是在應用程式可見時啟動
    val jobInfo = JobInfo.Builder(...)
        .build()

    jobScheduler.schedule(jobInfo)
    // 當應用程式切到背景後
    // Job 會受到執行時間配額限制
    ```
  - 如果你同時有：
    1. 一個正在運行的 ForegroundService
    2. 一個透過 JobScheduler 排程的工作
       這兩個同時在執行時，JobScheduler 的工作會受到運行時間配額的限制。

* 上述`受影響的範圍`，會針對使用 `WorkManager`、`JobScheduler` 和 `DownloadManager` 進行排程的有所限制
  - 若要Debug Job停止的原因，官方建議透過呼叫 `WorkInfo.getStopReason()`（對於 JobScheduler，可以呼叫 `JobParameters.getStopReason()`）來查看停止的原因。
  - 或是可使用 `JobScheduler#getPendingJobReasonsHistory`來查看停止的原因

* 如何在開發測試時，透過 adb 指令來測試不同的 Job 配額限制情境？
    ```kotlin
    # 假設你的應用包名是 com.example.app

    # 1. 讓前台啟動的 Job 不受配額限制
    adb shell am compat enable OVERRIDE_QUOTA_ENFORCEMENT_TO_TOP_STARTED_JOBS com.example.app

    # 2. 與Foreground Service 同時執行的 Job 不受配額限制
    adb shell am compat enable OVERRIDE_QUOTA_ENFORCEMENT_TO_FGS_JOBS com.example.app

    # 3. 手動設定應用的待命值區
    adb shell am set-standby-bucket com.example.app active

    # 可選的值區：
    # - active
    # - working_set
    # - frequent
    # - rare
    # - restricted
    # 查詢應用當前的待命值區
    adb shell am get-standby-bucket com.example.app
    ```

#### 完全棄用 JobInfo#setImportantWhileForeground、JobInfo#isImportantWhileForeground()
* `setImportantWhileForeground`功能是：告訴系統這個 Job 在app前景運行時很重要
  希望在應用程式處於前景時優先執行這個 Job
  或當應用暫時不受背景限制時優先執行
    ```kotlin
    # Android 12時標記為棄用
    # Android 16完全棄用，就算用了系統直接忽略

    val jobInfo = JobInfo.Builder(jobId, componentName)
        .setImportantWhileForeground(true)
        .build()
    ```

#### `Ordered broadcast` priority scope no longer global
* 在廣播上設定順序的作法之後可能不再有效
* 以前的運作方式：
  - Android允許應用程式為廣播接收器（Broadcast Receivers）設定優先順序
    可以通過兩種方式設定：
    1. 在清單文件（Manifest）中使用android:priority屬性
    2. 使用程式碼IntentFilter#setPriority()來設定
  - 系統會按照優先順序從`高到低`依序發送廣播
* `Android 16`的改變：
  - 跨進程優先順序不再保證：
    1. 不同進程（process）之間的廣播接收順序將不再保證按照優先順序執行
    2. 優先順序只在`同一個應用的進程`內有效
  - 優先順序範圍限制：
    1. 優先順序值會被自動限制在`(SYSTEM_LOW_PRIORITY + 1, SYSTEM_HIGH_PRIORITY - 1)`之間
    2. 只有`系統元件`才能使用最高和最低系統優先順序

* `可能受影響的情況`：
  - 應用程式在`不同進程`中註冊了相同的`broadcast intent`，並且預期按特定順序接收
  - 應用程式需要與`其他process`互動，並且依賴於廣播接收的順序

#### ART 內部變更 (Android Runtime)

* 科普：https://source.android.com/docs/core/ota/modular-system?hl=zh-tw
  - Android 10 推出了 Mainline (模組化系統元件)：Mainline 可將部分 `Android 系統元件模組化`，並在 Android 的正常發布週期外更新這些元件
  - 所以現在Google play可以透過Mainline更新系統元件

* Android 16包含了最新的ART更新
  - 改善了執行效能
  - 提供更多Java功能支援
  - 這些改進透過`Google Play系統更新`提供給`Android 12`以上的裝置（超過十億台裝置）
  - [ART官方發的blog](https://android-developers.googleblog.com/2023/11/the-secret-to-androids-improved-memory-latest-android-runtime-update.html)

* `可能遇到的相容性問題`
  - 依賴ART程式庫的應用程式可能無法在Android 16正常運作
  - 這個問題也會影響到透過Google Play系統更新ART模組的`舊版Android`

* 對開發者的影響：
  - 需要測試是否因為更新ART後受到影響
  - 可以看官方版本資訊中的內容，查看是否有相關的相容性問題：[點擊](https://developer.android.com/about/versions/16/release-notes?hl=zh-tw#art-impacted-libraries)

#### 使用者體驗和系統使用者介面 調整
* [淘汰干擾性無障礙工具的公告](https://developer.android.com/about/versions/16/behavior-changes-all?hl=zh-tw#disruptive-a11y)
  - Android 16 已淘汰`無障礙公告`，這類公告的特色是使用 announceForAccessibility 或調度 TYPE_ANNOUNCEMENT
  - `對開發者的影響`： 主要是api上的調整，所以可以直接參考[文件](https://developer.android.com/reference/android/view/View#announceForAccessibility(java.lang.CharSequence))

* 支援 3-button navigation
  - `3-button navigation`：主要是指新增了`predictive back(預測導航)`功能。predictive back(預測導航)是當`長按`下導航欄的back按鈕後，使用者可以依照手勢移動到想要的導航位置。
    詳細請參考這個連結內的影片：https://developer.android.com/about/versions/16/behavior-changes-all#three-button-predictive-back
  - 不過他是說`Support`，所以`現階段`需要開發者有支援才有，也不確定是不是每個廠商的OTA都有支援，若有用到需確認下。
    (或者把targetSDK升到Android 16 就預設打開)
  - 實際在系統上的演變：
    1. Android 13（API 33）：
       需要在開發者選項中啟用「預測返回操作動畫」
       即使應用程式實作了相關功能，也需要開發者選項才能看到動畫效果
    2. Android 14（API 34）：
       可以在Manifest中application或activity選擇啟用/不啟用
        ```xml
        <manifest ...>
            <application . . .

                android:enableOnBackInvokedCallback="false">

                <activity
                    android:name=".MainActivity"
                    android:enableOnBackInvokedCallback="true"
                    ...
                </activity>
                <activity
                    android:name=".SecondActivity"
                    android:enableOnBackInvokedCallback="false"
                    ...
                </activity>
            </application>
        </manifest>
        ```
    需要`開發者選項`來測試動畫效果
    3. Android 15（API 35）以上：
       不再需要開發者選項
       只要應用程式有實作並啟用，就會直接顯示動畫效果

  - 對開發者的影響：
    1. 必需使用`AppCompat 1.6.0-alpha05 (AndroidX)`以上版本 API，才能實作上述功能
    2. 實際程式碼可參考[官方](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture?hl=zh-tw#migrate-app)
    3. 指定target SDK Android 16 以上的app需要處理相關事件，或是停用。

### 所有應用程式：指定 Android 16 以上版本的應用程式，才會受到影響
#### 使用者體驗和系統使用者介面 調整
* `開發者`必需遷移或選擇不採用預測返回功能
  - 因為前一個段落有提到Android 16 無論targetSDK的行為中，`開始支援`預測返回功能
  - 現在開發者需要Handle預測返回事件，或是選擇直接停用，這裡`系統預設開啟`。
    (可以參考上面段落的代碼或文章)
    1. Handle 就實作相關代碼
    2. 停用就去設置`android:enableOnBackInvokedCallback="false"`

#### scheduleAtFixedRate最佳化
* 舊版：應用程式返回有效生命週期時，所有錯過的執行作業會立即執行
* 新版：最多只會立即執行一次遺漏的執行作業
* API文件：https://developer.android.com/reference/java/util/concurrent/ScheduledExecutorService#scheduleAtFixedRate(java.lang.Runnable,%20long,%20long,%20java.util.concurrent.TimeUnit)

#### 大螢幕和板型規格 調整
* 大螢幕定義：`最小寬度`大於等於 600 dp 的螢幕上
* 官方表示，應將app製作成`自動調整式版面配置`，在當今的多裝置世界中，限制方向和可調整大小等模式過於嚴苛。
  (有著未來會逐步移除相關可設置參數的感覺XD，目前主要是針對大螢幕)
  ![Screenshot 2025-02-11 at 4.54.44 PM.png](/attachment/67ab1059ddf687cea7b2c219)

* targetSDK Android 16 上，最小寬度 ≥ 600dp 的螢幕上，系統會忽略：
  `螢幕方向限制`、`大小調整限制`、`顯示比例限制`
* 以下設置在大螢幕設備上會被忽略
    ```kotlin
    screenOrientation
    resizableActivity
    minAspectRatio
    maxAspectRatio
    setRequestedOrientation()
    getRequestedOrientation()
    ```
* 在大螢幕，系統會忽略下列 screenOrientation、setRequestedOrientation() 和 getRequestedOrientation() 的值：
    ```
    portrait
    reversePortrait
    sensorPortrait
    userPortrait
    landscape
    reverseLandscape
    sensorLandscape
    userLandscape
    ```

* 不過現階段，官方也有提供退出該行為的參數，讓你有個過渡期 (最多到API 37)
  ![Screenshot 2025-02-11 at 5.01.54 PM.png](/attachment/67ab1205ddf687cea7b2c371)

    ```xml
    ## 指定頁面退出該行為 (最多到API 37)
    <activity>
      <property 
        android:name="android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY" 
        android:value="true" />
    </activity>

    ## 全域退出該行為 (最多到API 37)
    <application ...>
      <property android:name="android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY" android:value="true" />
    </application>
    ```

#### 健康與健身權限

* `BODY_SENSORS 權限轉換為更細緻的權限`：先前需要 `BODY_SENSORS` 或 `BODY_SENSORS_BACKGROUND` 的任何 API，現在都需要對應的 `android.permissions.health` 權限
* 對開發者的影響：permission細化，需處裡。
* [文件](https://developer.android.com/about/versions/16/behavior-changes-16?hl=zh-tw#health-fitness-permissions)