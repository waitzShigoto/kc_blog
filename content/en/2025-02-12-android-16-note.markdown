---
layout: post
title: "Android 16 Adaptation Notes"
date: 2025-02-12 09:29:10 +0800
image: cover/android-version-adaptation-16.png
tags: [Android, SDK]
permalink: /android-16-note
categories: DebugAndOptimize
excerpt: "Android 16 Adaptation Notes"
---

## Android 16 Development Timeline (2024-2025)
* Preview Phase (2024)
    - November: Dev Preview 1 - Baseline version
    - December: Dev Preview 2 - Feature updates

* Beta Phase (2025)
  - January: Beta 1
  - February: Beta 2
  - March: Beta 3
  - April-May: Final version testing
  - Final release

* Final version expected in Q2 2025. As of today (February 11, 2025), Google has released up to Beta 1
  - [Details](https://developer.android.com/about/versions/16/overview)

## Behavior Changes

### All Applications: The following behavior changes apply to all applications regardless of `targetSdkVersion`
#### JobScheduler Quota Optimizations
* The system now has further execution time limits for JobScheduler, aimed at further restricting the frequency and resource consumption of background tasks to improve overall system performance and battery life. Developers should have certain expectations for this. (Google doesn't mention the exact execution time, using the word "quota", so you should prepare for the following situations)
* Affected areas:
  - The system's execution time quota for JobScheduler is determined by the app's standby bucket. Developers should expect different quotas when in different standby buckets. You can handle this with the code below:
    ```kotlin
    val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    val bucket = usageStatsManager.appStandbyBucket

    when (bucket) {
        UsageStatsManager.STANDBY_BUCKET_ACTIVE -> {
            // Active: More generous execution time quota
        }
        UsageStatsManager.STANDBY_BUCKET_RARE -> {
            // Rarely used: Stricter execution time quota
        }

        ... See API for more status details
    }
    ```
  - Even if a Job is started when the app is visible, it will be subject to execution time limits once the app goes into the background
    ```kotlin
    // Even if the Job is started when the app is visible
    val jobInfo = JobInfo.Builder(...)
        .build()

    jobScheduler.schedule(jobInfo)
    // When the app goes to the background
    // The Job will be subject to execution time quota restrictions
    ```
  - If you simultaneously have:
    1. A running ForegroundService
    2. A task scheduled through JobScheduler
       When both are running simultaneously, the JobScheduler task will be subject to runtime quota restrictions.

* The above "affected areas" will limit tasks scheduled using `WorkManager`, `JobScheduler`, and `DownloadManager`
  - To debug why a Job stopped, Google recommends calling `WorkInfo.getStopReason()` (for JobScheduler, call `JobParameters.getStopReason()`) to see the reason for stopping.
  - Or you can use `JobScheduler#getPendingJobReasonsHistory` to see the reason for stopping.

* How to test different Job quota restriction scenarios during development using adb commands?
    ```kotlin
    # Assuming your app package name is com.example.app

    # 1. Make foreground-launched Jobs not subject to quota restrictions
    adb shell am compat enable OVERRIDE_QUOTA_ENFORCEMENT_TO_TOP_STARTED_JOBS com.example.app

    # 2. Make Jobs running simultaneously with Foreground Services not subject to quota restrictions
    adb shell am compat enable OVERRIDE_QUOTA_ENFORCEMENT_TO_FGS_JOBS com.example.app

    # 3. Manually set the app's standby bucket
    adb shell am set-standby-bucket com.example.app active

    # Optional buckets:
    # - active
    # - working_set
    # - frequent
    # - rare
    # - restricted
    # Query the app's current standby bucket
    adb shell am get-standby-bucket com.example.app
    ```

#### Complete Deprecation of JobInfo#setImportantWhileForeground and JobInfo#isImportantWhileForeground()
* The function of `setImportantWhileForeground` is: telling the system that this Job is important while the app is in the foreground, hoping to prioritize this Job when the app is in the foreground or when the app is temporarily not restricted in the background
    ```kotlin
    # Marked as deprecated in Android 12
    # Completely deprecated in Android 16, the system will ignore it even if used

    val jobInfo = JobInfo.Builder(jobId, componentName)
        .setImportantWhileForeground(true)
        .build()
    ```

#### `Ordered broadcast` priority scope no longer global
* Setting order in broadcasts may no longer be effective
* Previous behavior:
  - Android allowed applications to set priorities for broadcast receivers
    This could be done in two ways:
    1. Using the android:priority attribute in the manifest file
    2. Using code IntentFilter#setPriority() to set it
  - The system would send broadcasts sequentially from `high to low` priority
* Changes in `Android 16`:
  - Cross-process priority is no longer guaranteed:
    1. The order of broadcast reception between different processes is no longer guaranteed to follow priority
    2. Priority is only effective within `the same application process`
  - Priority range limitation:
    1. Priority values will be automatically limited to the range `(SYSTEM_LOW_PRIORITY + 1, SYSTEM_HIGH_PRIORITY - 1)`
    2. Only `system components` can use the highest and lowest system priorities

* `Potentially affected situations`:
  - Applications that register the same `broadcast intent` in `different processes` and expect to receive them in a specific order
  - Applications that need to interact with `other processes` and rely on the order of broadcast reception

#### ART Internal Changes (Android Runtime)

* Background info: https://source.android.com/docs/core/ota/modular-system
  - Android 10 introduced Mainline (modular system components): Mainline modularizes certain `Android system components` and updates these components outside of Android's normal release cycle
  - So now Google Play can update system components via Mainline

* Android 16 includes the latest ART updates
  - Improved execution performance
  - More Java feature support
  - These improvements are available to devices running `Android 12` and above (over a billion devices) through `Google Play system updates`
  - [Official ART blog from Google](https://android-developers.googleblog.com/2023/11/the-secret-to-androids-improved-memory-latest-android-runtime-update.html)

* `Potential compatibility issues`
  - Applications depending on ART libraries may not function properly on Android 16
  - This issue also affects `older Android versions` where the ART module is updated via Google Play system updates

* Impact on developers:
  - Need to test if affected by ART updates
  - Check the official version information for related compatibility issues: [Click here](https://developer.android.com/about/versions/16/release-notes#art-impacted-libraries)

#### User Experience and System UI Adjustments
* [Announcement about deprecated disruptive accessibility tools](https://developer.android.com/about/versions/16/behavior-changes-all#disruptive-a11y)
  - Android 16 has deprecated `accessibility announcements` that use announceForAccessibility or dispatch TYPE_ANNOUNCEMENT
  - `Impact on developers`: Mainly API adjustments, so you can refer directly to the [documentation](https://developer.android.com/reference/android/view/View#announceForAccessibility(java.lang.CharSequence))

* Support for 3-button navigation
  - `3-button navigation`: Mainly refers to the addition of the `predictive back` feature. Predictive back is when the user `long presses` the back button in the navigation bar, allowing them to move to their desired navigation position based on gesture.
    See the video in this link for details: https://developer.android.com/about/versions/16/behavior-changes-all#three-button-predictive-back
  - However, it says `Support`, so `at this stage` developers need to support it for it to work, and it's not certain whether every manufacturer's OTA supports it. If you're using it, you should check.
    (Or targeting Android 16 SDK will enable it by default)
  - Actual system evolution:
    1. Android 13 (API 33):
       Need to enable "Predictive Back Animations" in developer options
       Even if the app implements the relevant functionality, developer options are required to see the animation effects
    2. Android 14 (API 34):
       Can choose to enable/disable in Manifest for application or activity
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
    Need `developer options` to test animation effects
    3. Android 15 (API 35) and above:
       No longer need developer options
       Animation effects will appear directly if the app has implemented and enabled the feature

  - Impact on developers:
    1. Must use `AppCompat 1.6.0-alpha05 (AndroidX)` or higher API to implement the above functionality
    2. Actual code can be referenced in the [official documentation](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#migrate-app)
    3. Apps targeting Android 16 and above need to handle related events or disable them.

### All Applications: Only apps targeting Android 16 and above will be affected
#### User Experience and System UI Adjustments
* `Developers` must migrate or opt out of predictive back functionality
  - Because the previous section mentioned that Android 16 behavior, regardless of targetSDK, `begins supporting` predictive back functionality
  - Now developers need to handle predictive back events or choose to disable them directly, with the `system enabling it by default`.
    (You can refer to the code or article in the section above)
    1. Handle by implementing relevant code
    2. Disable by setting `android:enableOnBackInvokedCallback="false"`

#### scheduleAtFixedRate Optimization
* Old version: When the app returns to an effective lifecycle, all missed execution jobs would execute immediately
* New version: Only one missed execution job will execute immediately at most
* API documentation: https://developer.android.com/reference/java/util/concurrent/ScheduledExecutorService#scheduleAtFixedRate(java.lang.Runnable,%20long,%20long,%20java.util.concurrent.TimeUnit)

#### Large Screen and Form Factor Specification Adjustments
* Large screen definition: Screens with a `minimum width` of 600 dp or greater
* Google says apps should be made with `adaptive layouts`, as limiting orientation and resizability is too restrictive in today's multi-device world.
  (It feels like they may gradually remove related configurable parameters in the future, but currently it mainly targets large screens)
  ![Screenshot 2025-02-11 at 4.54.44 PM.png](/attachment/67ab1059ddf687cea7b2c219)

* On targetSDK Android 16, on screens with minimum width ≥ 600dp, the system will ignore:
  `Screen orientation restrictions`, `Resize restrictions`, `Display ratio restrictions`
* The following settings will be ignored on large screen devices
    ```kotlin
    screenOrientation
    resizableActivity
    minAspectRatio
    maxAspectRatio
    setRequestedOrientation()
    getRequestedOrientation()
    ```
* On large screens, the system will ignore the following values for screenOrientation, setRequestedOrientation() and getRequestedOrientation():
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

* However, at this stage, Google also provides parameters to opt out of this behavior, giving you a transition period (up to API 37)
  ![Screenshot 2025-02-11 at 5.01.54 PM.png](/attachment/67ab1205ddf687cea7b2c371)

    ```xml
    ## Specify a page to opt out of this behavior (up to API 37)
    <activity>
      <property 
        android:name="android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY" 
        android:value="true" />
    </activity>

    ## Global opt-out of this behavior (up to API 37)
    <application ...>
      <property android:name="android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY" android:value="true" />
    </application>
    ```

#### 健康與健身權限

* `BODY_SENSORS 權限轉換為更細緻的權限`：先前需要 `BODY_SENSORS` 或 `BODY_SENSORS_BACKGROUND` 的任何 API，現在都需要對應的 `android.permissions.health` 權限
* 對開發者的影響：permission細化，需處裡。
* [文件](https://developer.android.com/about/versions/16/behavior-changes-16?hl=zh-tw#health-fitness-permissions)