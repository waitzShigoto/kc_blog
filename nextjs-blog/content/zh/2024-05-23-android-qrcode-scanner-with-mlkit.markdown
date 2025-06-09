---
layout: post
title: 【Android】用Google MLKit & Android X Camera 實作Android快速的QR code掃描應用
date: 2024-05-23 15:22:54 +0800
image: cover/android-qrcode-scanner-with-mlkit.png
tags: [Android]
permalink: /android-qrcode-scanner-with-mlkit
categories: Android實作
excerpt: "如何提升Qr Code掃描器的效能，我使用Google MLKit & CameraX 實作Android快速的QR code掃描應用"
---

<div class="c-border-content-title-4">本篇示範程式碼</div>

若想直接看程式碼怎麼寫可以：<a href="#tutorial">前往程式碼解析</a>

這個專案中使用了Kotlin、Google的MLKit跟native的AndroidX camera搭配來實作QR掃瞄器

<div style="text-align: center">
	<a href="https://github.com/KuanChunChen/MLKit_qr_code_scanner_example" target="_blank" class="btn btn-primary" role="button">Demo source code</a>
</div>

<div class="c-border-content-title-4">實作效果</div>

<img src="/images/mlkit/002.gif" width="30%">

<div class="c-border-content-title-4">前言</div>
過去我們都會使用一些第三方套件做qrcode掃瞄器

像是zxing、zbar之類的

剛好過去在專案中遇到QA反饋說目前的qrcode掃描器準確性沒那麼高

所以我去了解下並實際測試，終於知道了為何`準確性沒那麼高`

實際上是因為：

專案上用的是舊`android.hardware.Camera`相機搭配`zbar`去解析QR code

並以側邊的角度去或離QRcode距離較遠

導致這種的qr code scanner好像沒有ios快的感覺

所以這篇決定實做看看用google的`mlkit`來實作

<div class="c-border-content-title-4">MLkit有什麼差異呢？</div>
  - 這個 API 需要 `Android API 21` 以上
  - 該API提供兩種版本

  一個可以從gms動態下載module

  一個使用library自帶module，如圖：
    <img src="/images/mlkit/001.png" width="80%">

  - 我參考範例，使用新的原生相機library `androidx.camera`搭配使用`ML Kit`

	與原本zbar搭配使用`android.hardware.Camera`的專案比較：

	↪ 兩個相機library都是從Android API 21以上支援

	↪ zbar搭配使用`android.hardware.Camera`的版本代碼有三處workaround

	我推測是原本寫這個專案或以前範例為了在activity中去解決初始化相機問題

	所以採用下面這樣的寫法：

    <img src="/images/mlkit/002.png" width="80%">

    <img src="/images/mlkit/003.png" width="80%">

    <img src="/images/mlkit/004.png" width="80%">

    ↪ 實際看了`android.hardware.Camera`不是thread-safe，且後面已經被@Deprecated
	<img src="/images/mlkit/005.png" width="50%">

	<img src="/images/mlkit/006.png" width="80%">

	↪ 另一方面，新的 `androidx.camera.core.Camera` 自帶生命週期可以去處理相機週期問題

	可以避免一些奇怪的生命週期問題

  ✅ 所以推測換成新的`androidx.camera.core.Camera`可以讓自己更有效的避免生命週期的問題(因為可以自己控制)

  - 新的 androidx.camera.core.Camera 自帶生命週期可以去處理相機週期問題，可以避免一些奇怪生命週期的問題
  	<img src="/images/mlkit/007.png" width="80%">

  - 掃描器解碼使用MLkit的BarcodeScannerOptions

  有提升多種可解析條碼類型

  可以參考<a href="https://developers.google.com/ml-kit/vision/barcode-scanning/android?hl=zh-tw#1.-configure-the-barcode-scanner">這個網址</a>裡面有提到可支援的格式，下面為掃瞄器解碼代碼：
	<img src="/images/mlkit/008.png" width="80%">

<div class="c-border-content-title-4">實作MLKit後實際測試</div>
  - 在`LG K520 Android 11`上測試

  - 在`LG K520 Android 11`上實測相機整體運行時間都沒有差太多

  實際上`init相機`到`解析qr code`都約1s秒 

  但是可避免`生命週期導致的相機crash風險`
  - 實測會比原本的方案，響應速度有快一點 （手機好一點的才話看不出來，體感較小）

  例如`zbar`+ `android.hardware.Camera` 會完全`對焦完`才開始解qr code

  `mlkit` + `androidx.camera.core.Camera` `對焦到一半`就能開始解qr code

  - 圖片左邊為使用`zbar` ，右邊為使用 `ML kit` （此gif 降速`0.25倍`）
  - `androidx.camera.core.Camera` 可以處理生命週期相關問題

  新方案放慢`0.25倍`看，體感上會變成：`先等一陣子才顯示相機`(圖右)
    <img src="/images/mlkit/001.gif" width="80%">

  - 不過提升`比較有感`的是，當你用奇怪的角度 或是 相機距離比較遠 會比較容易掃描到

<div class="c-border-content-title-4">對新版相機android.hardware.Camera在app中進行調教</div>
- 建立ImageAnalysis時加入目標解析度設置`.setTargetResolution(Size(screenResolutionForCamera.x, screenResolutionForCamera.y))`
- 其中 screenResolutionForCamera 是拿螢幕解析度去設置相機目標解析度

  有設置相機目標解析度與否的差異在 `相機在離得遠的掃成功機率較高`

- `另外補充`：其中該api java doc文件有提到
  1. `沒`設定TargetResolution的相機預設解析度是`640*480`
  2. 設定後也會有優先順序去選擇實際的`Resolution`
  3. 這邊是大綱：優先選擇接近設定且大於的的Target Resolution的 > 優先選擇接近設定且小於的Target Resolution 的>其中分辨率的比例會由提供的`Size`優先決定
  4. 因此推測，有可能因為`硬體限制`導致每台能解析的`遠近`程度有所差異
	<img src="/images/mlkit/009.png" width="80%">

<div class="c-border-content-title-4">結果</div>    
 - 經過上面的這些調整與優化，再請QA同仁幫忙測試的時候

 他反饋跟以前提供的app的準確度確實提升了

 細問之後他說確實從`側邊`或`離比較遠的地方掃描成功率`或`被偵測到的機率更高`了
 至此...解決了一個問題XD

<section id="tutorial">
<div class="c-border-content-title-4">程式碼開發教學</div>

</section>
  - 感謝大家看完上面的分析

  我在本篇最上面放了source code

  有興趣的可以直接clone下來去改

  - 下面我將分享主要的QR code掃瞄器的程式碼解析

  有興趣的可以參考
<div class="c-border-content-title-1">BaseCameraLifecycleObserver</div>    
<script src="https://gist.github.com/waitzShigoto/c99170df495f4c7352a9c81f54f63bb7.js"></script>
<div class = "table_container">
  <p>程式碼解說</p>
  BaseCameraLifecycleObserver這個類主要是用來讓其他繼承

  有些基本的相機init的內容

  也處理了一些生命週期相關的內容

  (e.g.對應週期相機的處理)

  也開放了對外method可以手動開啟或關閉相機

  <p>cameraProviderDeferred</p>
  比較值得一提的是，這邊用了一個cameraProviderDeferred

  用來取得ProcessCameraProvider

  因為該行為較為耗時 所以使用異步操作來做較為靈活

  (不過我也有試過直接實例化ProcessCameraProvider

  大多數情況不容易遇到一些ANR或卡住的情況

  只有偶發1、2次在比較舊的機型，如Android 5.0)

  這邊的概念就是

  CompletableDeferred其中用了.apply

  在apply範圍內會去創建ProcessCameraProvider

  在需要使用的地方使用`await()`去等待

  同時達成了異步操作也能等待實際創建了再去操作

  其中completableDeferred跟一般Deferred的差異在於

  他可以用complete()去手動控制完成時機

  剛好適用本例

  需要等待ProcessCameraProvider listener返回

  才能得知初始化完成

</div>

<div class="c-border-content-title-1">ScannerLifecycleObserver</div>    
<script src="https://gist.github.com/waitzShigoto/6bbc490b5ce7596a2218c9b2beadd6c9.js"></script>
<div class = "table_container">
  <p>程式碼解說</p>
  ScannerLifecycleObserver就比較單純了

  繼承了BaseCameraLifecycleObserver

  主要是寫一些可能根據專案需求才需要的feature

  像是一些擴充的內容

  如<b>getCameraDisplayOrientation</b>

  可以用來調整相機支援的解析度

  或getImageAnalysis拿到ImageAnalysis

  ImageAnalysis主要是MLKit中用來設定可以解析哪些條碼類型

</div>

<div class="c-border-content-title-1">ScannerAnalyzer</div>    
<script src="https://gist.github.com/waitzShigoto/7c3d18a8025bb0959b1339f633120c99.js"></script>

<div class = "table_container">
   <p>程式碼解說</p>
  ScannerAnalyzer則是拿來針對條碼做解析的實作

  繼承了BaseCameraLifecycleObserver

  因為我們是要解QR code所以用了<b>FORMAT_QR_CODE</b>
</div>

