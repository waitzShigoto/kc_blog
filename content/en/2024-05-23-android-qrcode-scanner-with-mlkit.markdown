---
layout: post
title: 【Android】Using Google MLKit & Android X Camera to Implement a Fast QR Code Scanner on Android
date: 2024-05-23 15:22:54 +0800
image: cover/android-qrcode-scanner-with-mlkit.png
tags: [Android]
permalink: /android-qrcode-scanner-with-mlkit
categories: Android實作
excerpt: "How to improve the performance of a QR code scanner. I used Google MLKit & CameraX to implement a fast QR code scanner on Android."
---

<div class="c-border-content-title-4">Sample Code in This Post</div>

If you want to see how the code is written directly, you can: <a href="#tutorial">Go to Code Analysis</a>

In this project, Kotlin, Google's MLKit, and the native AndroidX camera are used to implement the QR scanner.

<div style="text-align: center">
	<a href="https://github.com/waitzShigoto/MLKit_qr_code_scanner_example" target="_blank" class="btn btn-primary" role="button">Demo source code</a>
</div>

<div class="c-border-content-title-4">Implementation Effect</div>

<img src="/images/mlkit/002.gif" width="30%">

<div class="c-border-content-title-4">Introduction</div>
In the past, we used some third-party libraries to create QR code scanners

such as zxing, zbar, etc.

Recently, in a project, QA feedback indicated that the current QR code scanner's accuracy was not very high.

So I looked into it and tested it, and finally understood why the `accuracy was not very high`.

In fact, it was because:

The project used the old `android.hardware.Camera` with `zbar` to parse QR codes

and scanned from a side angle or from a distance.

This made the QR code scanner feel slower compared to iOS.

So I decided to try implementing it using Google's `MLKit`.

<div class="c-border-content-title-4">What's Different About MLKit?</div>
  - This API requires `Android API 21` or above.
  - The API provides two versions

  One can dynamically download the module from gms

  One uses the module that comes with the library, as shown:
    <img src="/images/mlkit/001.png" width="80%">

  - I referred to examples and used the new native camera library `androidx.camera` with `ML Kit`.

	Compared to the original project using `zbar` with `android.hardware.Camera`:

	↪ Both camera libraries are supported from Android API 21 and above.

	↪ The version using `zbar` with `android.hardware.Camera` had three workarounds.

	I suspect the original project or previous examples used this approach to solve camera initialization issues in the activity.

	So they wrote it like this:

    <img src="/images/mlkit/002.png" width="80%">

    <img src="/images/mlkit/003.png" width="80%">

    <img src="/images/mlkit/004.png" width="80%">

    ↪ After looking into it, `android.hardware.Camera` is not thread-safe and has been @Deprecated.
	<img src="/images/mlkit/005.png" width="50%">

	<img src="/images/mlkit/006.png" width="80%">

	↪ On the other hand, the new `androidx.camera.core.Camera` comes with lifecycle management to handle camera lifecycle issues.

	This can avoid some strange lifecycle problems.

  ✅ So I speculate that switching to the new `androidx.camera.core.Camera` can more effectively avoid lifecycle issues (because you can control it yourself).

  - The new androidx.camera.core.Camera comes with lifecycle management to handle camera lifecycle issues, avoiding some strange lifecycle problems.
  	<img src="/images/mlkit/007.png" width="80%">

  - The scanner decoding uses MLKit's BarcodeScannerOptions.

  It enhances the types of barcodes that can be parsed.

  You can refer to <a href="https://developers.google.com/ml-kit/vision/barcode-scanning/android?hl=zh-tw#1.-configure-the-barcode-scanner">this link</a> for the supported formats. Below is the scanner decoding code:
	<img src="/images/mlkit/008.png" width="80%">

<div class="c-border-content-title-4">Implementing MLKit and Actual Testing</div>
  - Tested on `LG K520 Android 11`

  - The overall runtime of the camera on `LG K520 Android 11` did not differ much

  In practice, from `init camera` to `parsing QR code` takes about 1 second 

  However, it can avoid the `camera crash risk caused by lifecycle`
  - The actual test shows a slightly faster response speed compared to the original solution (not noticeable on better phones, minimal difference)

  For example, `zbar` + `android.hardware.Camera` will completely `focus` before starting to decode the QR code

  `mlkit` + `androidx.camera.core.Camera` can start decoding the QR code `halfway through focusing`

  - The image on the left uses `zbar`, and the right uses `ML kit` (this gif is slowed down to `0.25x`)
  - `androidx.camera.core.Camera` can handle lifecycle-related issues

  Slowing down the new solution to `0.25x` makes it feel like: `waiting for a while before displaying the camera` (right image)
    <img src="/images/mlkit/001.gif" width="80%">

  - However, the noticeable improvement is that it is easier to scan when using odd angles or when the camera is farther away

<div class="c-border-content-title-4">Adjusting the New Camera android.hardware.Camera in the App</div>
- Add target resolution setting when creating ImageAnalysis `.setTargetResolution(Size(screenResolutionForCamera.x, screenResolutionForCamera.y))`
- The screenResolutionForCamera is set using the screen resolution to set the camera target resolution

  The difference between setting the camera target resolution or not is `higher success rate of scanning from a distance`

- `Additionally`: the API Java doc mentions
  1. The default resolution of the camera without TargetResolution set is `640*480`
  2. After setting, there will be a priority to choose the actual `Resolution`
  3. Here is the outline: Priority is given to resolutions close to and greater than the Target Resolution > Priority is given to resolutions close to and smaller than the Target Resolution > The ratio of the resolution will be primarily determined by the provided `Size`
  4. Therefore, it is speculated that due to `hardware limitations`, the `distance` that can be resolved may vary for each device
	<img src="/images/mlkit/009.png" width="80%">

<div class="c-border-content-title-4">Results</div>    
 - After the above adjustments and optimizations, when asking QA colleagues to help test

 They reported that the accuracy of the app has indeed improved compared to the previous version

 Upon further inquiry, they said the `success rate of scanning from the side` or `from a farther distance` or `being detected` has indeed increased
 Thus... a problem was solved XD

<section id="tutorial">
<div class="c-border-content-title-4">Code Development Tutorial</div>

</section>
  - Thank you all for reading the above analysis

  I have placed the source code at the top of this article

  If interested, you can clone it directly and modify it

  - Below I will share the main code analysis of the QR code scanner

  Feel free to refer to it if interested
<div class="c-border-content-title-1">BaseCameraLifecycleObserver</div>    
<script src="https://gist.github.com/waitzShigoto/c99170df495f4c7352a9c81f54f63bb7.js"></script>
<div class = "table_container">
  <p>Code Explanation</p>
  The BaseCameraLifecycleObserver class is mainly used for inheritance by others

  It contains some basic camera initialization content

  It also handles some lifecycle-related content

  (e.g., handling the camera according to the lifecycle)

  It also provides external methods to manually turn the camera on or off

  <p>cameraProviderDeferred</p>
  Worth mentioning is the use of cameraProviderDeferred here

  It is used to obtain ProcessCameraProvider

  Since this operation is time-consuming, asynchronous operation is used for more flexibility

  (However, I have also tried directly instantiating ProcessCameraProvider

  In most cases, it is not easy to encounter ANR or stuck situations

  Only occasionally 1 or 2 times on older models, such as Android 5.0)

  The concept here is

  CompletableDeferred uses .apply

  Within the apply scope, it creates ProcessCameraProvider

  Use `await()` to wait where needed

  Achieving asynchronous operations while waiting for the actual creation before proceeding

  The difference between completableDeferred and regular Deferred is

  It can be manually controlled to complete using complete()

  Which is suitable for this example

  Need to wait for the ProcessCameraProvider listener to return

  To know that initialization is complete

</div>

<div class="c-border-content-title-1">ScannerLifecycleObserver</div>    
<script src="https://gist.github.com/waitzShigoto/6bbc490b5ce7596a2218c9b2beadd6c9.js"></script>
<div class = "table_container">
  <p>Code Explanation</p>
  ScannerLifecycleObserver is relatively simple

  Inherits from BaseCameraLifecycleObserver

  Mainly writes features that might be needed based on project requirements

  Such as some extended content

  Like <b>getCameraDisplayOrientation</b>

  Can be used to adjust the supported resolution of the camera

  Or getImageAnalysis to get ImageAnalysis

  ImageAnalysis is mainly used in MLKit to set which barcode types can be parsed

</div>

<div class="c-border-content-title-1">ScannerAnalyzer</div>    
<script src="https://gist.github.com/waitzShigoto/7c3d18a8025bb0959b1339f633120c99.js"></script>

<div class = "table_container">
   <p>Code Explanation</p>
  ScannerAnalyzer is used to implement barcode parsing

  Inherits from BaseCameraLifecycleObserver

  Since we are parsing QR codes, we use <b>FORMAT_QR_CODE</b>
</div>

