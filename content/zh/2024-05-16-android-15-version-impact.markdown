---
layout: post
title: Android 15 Beta版本釋出!開發者如何應對新的版本限制？
date: '2024-05-16 13:59:07 +0800'
image: cover/android-version-adaptation-15.png
tags:
  - Android
categories: DebugAndOptimize
excerpt: 本文將介紹 Android 15 版本升級帶來的開發挑戰以及解決方案。
---

<div class="c-border-content-title-4">前言</div>

Android 15 於近日發布了 Beta版

新版本稱作 `VanillaIceCream 香草冰淇淋`

<img src="/images/android15/002.png" width="80%">

以下是roadmap:

<img src="/images/android15/001.png" width="80%">

其中詳細日程可參考：<a href="https://developer.android.com/about/versions/15/overview?hl=zh-cn">官網</a>

<div class="c-border-content-title-4">Android 15上所有應用會影響</div>

<div class="c-border-content-title-1">軟體包行為修改</div>
* 在class `ApplicationInfo` 中

過去存在一個名為`FLAG_STOPPED`的標籤

其行為是指目前是否app為`停止狀態`

過去`停止狀態`的判定為 用戶強制停止應用程式時被設定，應用程式會保持此狀態。

* 另一方便要讓系統判定app離開`停止狀態`的話

過去可以透過`使用者點擊開啟app`、或一些互動視窗打開app可以改變狀態

  &#x21AA; 這邊是官方`原文`：

  `directly launching the app or indirectly interacting with the app.`

  `(through the sharesheet or a widget, selecting the app as live wallpaper, etc.)`

  指出android14可透過`使用者點擊開啟app`與`一些互動視窗間接打開`

  其中舉的例子有`sharesheet`、`widget`、`選擇當作壁紙等等`

* 對比最新`Android 15` 系統中的 `FLAG_STOPPED` 有以下修改與擴充。

  1. 現在當系統判定為 `FLAG_STOPPED`時會停止所有`pending intents`的操作

  2. 當系統發現`離開` FLSG_STOPPED時 會發送`ACTION_BOOT_COMPLETED`廣播

     官方指出可讓開發者透過此廣播恢復pending intent.

  &#x21AA; 這邊是官方`原文`說明15對`FLAG_STOPPED`判定的調整：

`Apps should only be removed from the stopped state through direct or indirect user action.`

  也就是說只有 直接或非直接的動作 會改變被系統判定為`停止狀態`

* 從上述可以理解出對此狀態判定更嚴格了

  &#x21AA; 不過上述原文看起來沒有明確指出何謂`indirect user action.`

  後續有遇到可參考

* 另外可以透過 `Application StartInfo.wasForceStopped() `方法判斷上述狀態。

<div class="c-border-content-title-1">支援16 KB page sizes</div>

* 官方針對RAM運用的策略做優化

過去android只支援`4 KB memory page sizes`

現在提升到`16 KB page sizes`

並預計`明年`上到Google Play（15上已有，但不確定是不是到時候會強制16KB編譯的app &#x2728;)
	
將page size提升主要是為了優化`ram密集型的工作`，使其用起來更有效率

不過這是針對軟體的優化

主要是針對未來`製造商陸續研發出更大、更高效能的ram`時app能順利運行且具有兼容性

 ✅  `page size` 是用來表示記憶體裡面的操作單位，通常是2的次方，如：2KB、4KB、8KB等。

* 對`app開發者`影響：

  &#x21AA; 若有使用Ndk編譯、直接或間接使用到SDK編譯可能會需要重新配置`16 KB page sizes`的app

<img src="/images/android15/004.png" width="80%">

  &#x21AA; `短期`內專案應該不太受影響

  &#x21AA; `未來`等正式上線Google play 可能會遇到`16 KB page sizes` 相關問題

<img src="/images/android15/006.png" width="80%">

 ✅   遇到`兼容問題`可以參考<a href="https://developer.android.com/guide/practices/page-sizes#build">官網</a>調整編譯方式

* 判別是不是會受到影響可透過`android studio`內`APK Analyzer`來判斷編譯的是否用到native code(或`指令反編譯`去看)

  &#x21AA; 把apk拖到android studio 內

  &#x21AA; 查看lib資料夾是否出現`任意`.so檔(全稱shared object)

若出現則表示你的app`有`native code編譯出來的

若`沒出lib 或 .so `則代表可能`非`native code

<img src="/images/android15/005.png" width="80%">

✅ 官方指出`有用到native code`則需要`rebuild app` to 16KB device.

這邊有幾種初判斷參考：

↪ 使用到任何C/C++ (native) code，通常是加入NDK相關，或JNI等等。

↪ 使用的任何第三方庫用到任意native labraries。

↪ 使用任意第三方的builder若使用任意native libraries。

* 下圖是`16 KB page sizes`這項功能優化後

對系統效能的提升

<img src="/images/android15/007.png" width="80%">

<div class="c-border-content-title-1">新增 Private space功能</div>
此功能為新增一個隱藏app的空間或類似應用鎖

需輸入密碼才能打開存取應用

不過`官方目前上面提示有bug`

<img src="/images/android15/008.png" width="80%">

實測模擬器也找不到該功能

不過官方有提到該功能會限制app可見性

`Because apps in the private space have restricted visibility,`

後面可以用的時候可再看看自己的app放進去會不會有問題

如：不確定像是QueryAllPackagesPermission`的功能會不會跟預期不同

到時候可再試試

<div class="c-border-content-title-1">最小Target SDK 改為 24</div>
* 跟上版android 14類似，一樣是為了避免用太舊的api鑽一些漏洞

在`android 15`上 target`需要`大於24才能安裝

裝不了會顯示`INSTALL_FAILED_DEPRECATED_SDK_VERSION`

一樣可以用下列指令 安裝不符合規定的apk

  ```
  adb install --bypass-low-target-sdk-block FILENAME.apk
  ```

#### UI/UX調整
<div class="c-border-content-title-1">UI/UX調整</div>
* 移除開發者選項中的`predictive back animations`

並且讓開發者可在app中設置

  ```
  <application
      ...
      android:enableOnBackInvokedCallback="true"
      ... >
  ...
  </application>
  ```
  ✅ 看看`predictive back animations`是什麼 ：<a href="https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture">參考</a>

<div class="c-border-content-title-1">棄用</div>
日常淘汰部份api：
<a href="https://developer.android.com/about/versions/15/deprecations">參考api棄用</a>

<div class="c-border-content-title-4">以Android 15為目標的應用會影響</div>
<div class="c-border-content-title-1">foreground services相關調整</div>
* 禁止在BOOT_COMPLETED廣播時啟動以下foreground service
   - dataSync
   - camera
   - mediaPlayback
   - phoneCall
   - mediaProjection
   - microphone
 
&#x21AA; 若強行啟動會拋`ForegroundServiceStartNotAllowedException`

* 針對`dataSync`的終極審判

   &#x21AA; dataSync的service現在每24hr內只能跑6hr，時間到了系統會呼叫`Service.onTimeout(int, int)`

   此時必需在收到timeout幾秒內呼叫`Service.stopSelf()`

   &#x21AA; 若時間到了沒有呼叫`stopSelf`，則出現錯誤

  `A foreground service of ##fgs_type  did not stop within its timeout: ##component_name.`

   &#x21AA; 當系統呼叫`Service.onTimeout(int, int)`則該service不再被認為是foreground service

   &#x21AA; 在目前beta2版本拋出的錯誤視為`ANR`，但在後續會改成`exception`.

   &#x21AA; 上述限制為所有dataSync service共同遵守，如：24hr內已經執行4hr dataSync，則接下來其他dataSync只能執行2hr
   &#x21AA; 或者官方推薦遷移成其他方式：<a href="https://developer.android.com/about/versions/15/changes/datasync-migration">替代方案</a>

* 新增forground service type：<a href="https://developer.android.com/about/versions/15/behavior-changes-15#mediaprocessing-fgs-type">mediaProcessing</a>

  &#x21AA; 此type跟上面dataSync有相同的規則

  &#x21AA; `mediaProcessing`的service現在每24hr內只能跑6hr，時間到了系統會呼叫`Service.onTimeout(int, int)`

  此時必需在收到timeout幾秒內呼叫`Service.stopSelf()`

  &#x21AA; 當系統呼叫`Service.onTimeout(int, int)`則該service不再被認為是foreground service

  &#x21AA; 官方提供的替代方案與上方dataSync不同：<a href="https://developer.android.com/develop/background-work/services/foreground-services#purpose-built-apis">替代方案</a>

* 上述type要reset timer 文件中是提到

用戶把app移到前景才會reset
   
<img src="/images/android15/004.png" width="80%">

* 也可嘗試使用special case 

   - <a href="https://developer.android.com/about/versions/14/changes/fgs-types-required?authuser=7&hl=zh-tw#special-use">點此查看</a>
   - 不過官方會需要提供說明並經過審核才能上架
<div class="c-border-content-title-1">限制透過持有SYSTEM_ALERT_WINDOW來啟動foreground service的限制</div>
* 之前透過SYSTEM_ALERT_WINDOW來啟動foreground service 即使app是在背景也可以work

  現在需加一個步驟：需透過`TYPE_APPLICATION_OVERLAY`起動一個overlay window且需要是可見的

↪ 若未達成上述新需求則拋`ForegroundServiceStartNotAllowedException.`

<div class="c-border-content-title-1">勿擾模式行為變更</div>

* Target sdk Android 15 以上的app不再支援設置`勿擾模式Do Not Disturb (DND)`的 `global state`或 `policy`

↪ 影響到之前透過`setInterruptionFilter(INTERRUPTION_FILTER_ALL)`做設置的app

<div class="c-border-content-title-1">針對OpenJDK 17的改變</div>

* Android 15針對此調整了api使用方式，有用到可以再注意

使用以下function format 字串時新增exception

  - String.format(String, Object[])
  - String.format(Locale, String, Object[])
  - Formatter.format(String, Object[])
  - Formatter.format(Locale, String, Object[])

↪ 當誤用`$0`的時候會拋出
  `IllegalFormatArgumentIndexException`: Illegal format argument index = 0

  ```kotlin
  //work
  val formattedString = String.format("Name: %1$s, Age: %2$d", name, age);
  //exception
  val formattedString = String.format("Name: %0$s, Age: %1$d", name, age);
  ```

* 針對此<a herf="https://bugs.openjdk.org/browse/JDK-8301574">issue</a>
調整`Random` class
現在`Random.ints()`不會返回跟`Random.nextInt()`相同的值
所以現在`不應該`預期兩者是`==`的
  - Random.ints(long)
  - Random.ints(long, int, int)
  - Random.ints(int, int)
  - Random.ints()

<div class="c-border-content-title-1">更安全的後台啟動Activity</div>
* 從 Android 10 起後台 activity 啟動就受到限制，而 `Android 15 透過添加其他控制`，來`防止惡意後台應用程式`將其他應用程式帶到前台。
* 現在新增一種flag能設定，背景activity無法打開另一個app的activity

  ```
  <application android:allowCrossUidActivitySwitchFromBelow="false" >
  ```

  實際修改為：要打開的activity跟stack最上層 app `UID不匹配`的話則無法打開
  ↪ 用來防止app打開另一個不同的app

* 其他針對後台啟動activity的限縮
   - 現在`PendingIntent`預設`關掉背景啟動activity`(block background activity launches)

<div class="c-border-content-title-1">使用者體驗UI改善</div>
* 此調整針對使用者體驗調整，此處大概描述下：
  - `Edge-to-edge enforcement`：邊到邊強制執行，android 15上會對畫面直邊緣強制內縮
  不過有提到使用`material 3`不會受此影響，實測`使用material 3的app`確實與原本UI一至

  <img src="/images/android15/011.png" width="80%">

  其他UI如有可能受影響可注意

  <img src="/images/android15/010.png" width="80%">

  &#x21AA; 上方第三個圖為使用windowInsets.getInsets之類的去做調整後

  或者可以使用material 3

  
  - `elegantTextHeight attribute defaults to true`：預設elegantTextHeight屬性為`true`

  <img src="/images/android15/012.png" width="80%">

  - `Stable configuration`：針對configuration相關的行為調整，可能影響螢幕轉向、system bar尺寸的判斷相關

	<a href="https://developer.android.com/about/versions/15/behavior-changes-15#stable-configuration">直接點此看</a>
  - `Locale-aware default line height for EditText`：根據不同語言來調整edittext的高度可能變不同

  	<img src="/images/android15/013.png" width="80%">

  	✅ 可再看看如果變動後是否可接受

  如要取消可以直接把 `useLocalePreferredLineHeightForMinimum` attribute 設為 false
  - `TextView width changes for complex letter shapes`：預設文字的寬度指派規則有所調整

  使得複雜的文字有更多空間

  ✅ 若想`停用/啟用`可直接設定attribute `setShiftDrawingOffsetForStartOverhang`

 
* 其他UI/UX細節直接參考這邊比較完整:<a href="https://developer.android.com/about/versions/15/behavior-changes-15#ux">點此</a>

<div class="c-border-content-title-1">Camera and media新增限制</div>
* 若要請求`音頻焦點 (audio focus)`現在必需是`top app` 或是`audio-related foreground service`否則返回
  AUDIOFOCUS_REQUEST_FAILED
* 目前會被判定是`audio-related foreground service`有：
   -  mediaPlayback
   -  camera
   -  microphone
   -  phoneCall
   

   ✅ 學習音頻焦點 (audio focus) <a href="https://developer.android.com/media/optimize/audio-focus">直接點此看</a>

<div class="c-border-content-title-1">Updated non-SDK restrictions</div>
* 日常版本更新都有的：<a href="https://developer.android.com/guide/app-compatibility/restrictions-non-sdk-interfaces#list-names">直接點此看</a>

 	✅  `非SDK`：涵蓋範圍內的 Java 的方法。此類介面是 SDK 的內部實作細節，可能隨時會被修改，且不對開發者另行通知。

