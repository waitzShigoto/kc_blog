---
layout: post
title: 【Android】Google MLKit & Android X Cameraを使用してAndroidの高速QRコードスキャンアプリを実装
date: 2024-05-23 15:22:54 +0800
image: cover/android-qrcode-scanner-with-mlkit.png
tags: [Android]
permalink: /android-qrcode-scanner-with-mlkit
categories: Android實作
excerpt: "QRコードスキャナーの性能を向上させる方法として、Google MLKit & CameraXを使用してAndroidの高速QRコードスキャンアプリを実装しました"
---

<div class="c-border-content-title-4">本記事のサンプルコード</div>

コードの書き方を直接見たい場合は：<a href="#tutorial">コード解析へ</a>

このプロジェクトでは、Kotlin、GoogleのMLKit、およびネイティブのAndroidXカメラを使用してQRスキャナーを実装しています

<div style="text-align: center">
	<a href="https://github.com/waitzShigoto/MLKit_qr_code_scanner_example" target="_blank" class="btn btn-primary" role="button">デモソースコード</a>
</div>

<div class="c-border-content-title-4">実装効果</div>

<img src="/images/mlkit/002.gif" width="30%">

<div class="c-border-content-title-4">前書き</div>
過去には、いくつかのサードパーティライブラリを使用してQRコードスキャナーを作成していました

例えばzxingやzbarなどです

過去のプロジェクトで、現在のQRコードスキャナーの精度がそれほど高くないというQAのフィードバックを受けました

そこで調査し、実際にテストを行った結果、なぜ`精度がそれほど高くない`のかがわかりました

実際の原因は：

プロジェクトで使用していたのは古い`android.hardware.Camera`カメラと`zbar`を組み合わせてQRコードを解析していたためです

QRコードからの距離が遠かったり、斜めの角度からスキャンしていたりしました

そのため、このようなQRコードスキャナーはiOSほど速く感じられませんでした

そこで今回は、Googleの`mlkit`を使用して実装してみることにしました

<div class="c-border-content-title-4">MLkitの違いは何ですか？</div>
  - このAPIは`Android API 21`以上が必要です
  - このAPIは2つのバージョンを提供しています

  一つはgmsから動的にモジュールをダウンロードするもの

  もう一つはライブラリに組み込まれたモジュールを使用するものです。以下の図のように：
    <img src="/images/mlkit/001.png" width="80%">

  - 私は新しいネイティブカメラライブラリ`androidx.camera`を使用して`ML Kit`と組み合わせて使用する例を参考にしました

	元のzbarと`android.hardware.Camera`を組み合わせて使用するプロジェクトと比較して：

	↪ どちらのカメラライブラリもAndroid API 21以上でサポートされています

	↪ zbarと`android.hardware.Camera`を組み合わせて使用するバージョンのコードには3つのワークアラウンドがあります

	これは元々このプロジェクトを書いた人や以前の例が、アクティビティ内でカメラの初期化問題を解決するために以下のような書き方を採用していたためだと推測されます：

    <img src="/images/mlkit/002.png" width="80%">

    <img src="/images/mlkit/003.png" width="80%">

    <img src="/images/mlkit/004.png" width="80%">

    ↪ 実際に見てみると、`android.hardware.Camera`はスレッドセーフではなく、後に@Deprecatedになっています
	<img src="/images/mlkit/005.png" width="50%">

	<img src="/images/mlkit/006.png" width="80%">

	↪ 一方、新しい`androidx.camera.core.Camera`はライフサイクルを持っており、カメラのライフサイクル問題を処理できます

	これにより、いくつかの奇妙なライフサイクル問題を回避できます

  ✅ したがって、新しい`androidx.camera.core.Camera`に切り替えることで、ライフサイクルの問題をより効果的に回避できると推測されます（自分で制御できるため）

  - 新しいandroidx.camera.core.Cameraはライフサイクルを持っており、カメラのライフサイクル問題を処理でき、いくつかの奇妙なライフサイクル問題を回避できます
  	<img src="/images/mlkit/007.png" width="80%">

  - スキャナーのデコードにはMLkitのBarcodeScannerOptionsを使用します

  これにより、解析可能なバーコードの種類が増えました

  サポートされているフォーマットについては<a href="https://developers.google.com/ml-kit/vision/barcode-scanning/android?hl=zh-tw#1.-configure-the-barcode-scanner">このURL</a>を参照してください。以下はスキャナーのデコードコードです：
	<img src="/images/mlkit/008.png" width="80%">

<div class="c-border-content-title-4">MLKitの実装後の実際のテスト</div>
  - `LG K520 Android 11`でテスト

  - `LG K520 Android 11`で実際にテストしたところ、カメラの全体的な動作時間に大きな差はありませんでした。

  実際には、`カメラの初期化`から`QRコードの解析`まで約1秒かかります。

  しかし、`ライフサイクルによるカメラのクラッシュリスク`を回避できます。
  - 実際のテストでは、元の方法よりも応答速度が少し速くなりました（良いスマホでは違いがわかりにくく、体感は小さいです）。

  例えば、`zbar`+ `android.hardware.Camera`は完全に`フォーカスが完了`してからQRコードの解析を開始しますが、

  `mlkit` + `androidx.camera.core.Camera`は`フォーカスが半分`完了した時点でQRコードの解析を開始できます。

  - 左の画像は`zbar`を使用、右の画像は`ML kit`を使用しています（このGIFは`0.25倍`に減速しています）。
  - `androidx.camera.core.Camera`はライフサイクルに関連する問題を処理できます。

  新しい方法では`0.25倍`に減速して見ると、体感的には`少し待ってからカメラが表示される`（右の画像）ようになります。
    <img src="/images/mlkit/001.gif" width="80%">

  - しかし、`より感じられる`のは、奇妙な角度やカメラが遠い場合でもスキャンしやすくなることです。

<div class="c-border-content-title-4">新しいカメラandroid.hardware.Cameraのアプリ内での調整</div>
- ImageAnalysisを作成する際に目標解像度設定を追加します`.setTargetResolution(Size(screenResolutionForCamera.x, screenResolutionForCamera.y))`
- ここで、screenResolutionForCameraは画面解像度を使用してカメラの目標解像度を設定します。

  カメラの目標解像度を設定するかどうかの違いは、`カメラが遠くからスキャンする成功率が高い`ことです。

- `補足`：このAPIのJavaドキュメントには以下のことが記載されています。
  1. 目標解像度を設定しない場合、カメラのデフォルト解像度は`640*480`です。
  2. 設定後も優先順位に従って実際の`解像度`が選択されます。
  3. ここでは概要を示します：設定に近く、かつ大きい目標解像度を優先的に選択します。次に、設定に近く、かつ小さい目標解像度を選択します。その際、解像度の比率は提供された`サイズ`によって優先的に決定されます。
  4. したがって、`ハードウェアの制約`により、各デバイスで解析できる`距離`の程度が異なる可能性があります。
	<img src="/images/mlkit/009.png" width="80%">

<div class="c-border-content-title-4">結果</div>    
 - 上記の調整と最適化を行った後、QAの同僚にテストを依頼しました。

 彼のフィードバックによると、以前提供したアプリよりも精度が向上したとのことです。

 詳細を尋ねると、`側面`や`遠くからのスキャン成功率`や`検出される確率`が確かに高くなったと言っていました。
 これで一つの問題が解決しましたXD

<section id="tutorial">
<div class="c-border-content-title-4">コード開発チュートリアル</div>

</section>
  - 上記の分析を読んでいただきありがとうございます。

  このページの最上部にソースコードを掲載しました。

  興味がある方は直接クローンして変更してみてください。

  - 以下では、主なQRコードスキャナーのコード解析を共有します。

  興味がある方は参考にしてください。
<div class="c-border-content-title-1">BaseCameraLifecycleObserver</div>    
<script src="https://gist.github.com/waitzShigoto/c99170df495f4c7352a9c81f54f63bb7.js"></script>
<div class = "table_container">
  <p>コード解説</p>
  BaseCameraLifecycleObserverクラスは、他のクラスが継承するための基本的なクラスです。

  基本的なカメラの初期化内容が含まれています。

  また、ライフサイクルに関連する内容も処理しています。

  （例：ライフサイクルに対応したカメラの処理）

  また、カメラを手動でオンまたはオフにするためのメソッドも公開しています。

  <p>cameraProviderDeferred</p>
  特筆すべきは、ここでcameraProviderDeferredを使用していることです。

  これはProcessCameraProviderを取得するためのものです。

  この操作は時間がかかるため、非同期操作を使用して柔軟に対応しています。

  （ただし、ProcessCameraProviderを直接インスタンス化することも試しました。

  ほとんどの場合、ANRやフリーズの問題は発生しませんが、

  古いデバイス（例：Android 5.0）では稀に1、2回発生することがあります。）

  ここでの概念は

  CompletableDeferredの中で.applyを使用していることです

  applyの範囲内でProcessCameraProviderを作成します

  必要な場所で`await()`を使用して待機します

  非同期操作を行いながら、実際に作成されるのを待って操作を行うことができます

  CompletableDeferredと一般的なDeferredの違いは

  complete()を使用して手動で完了のタイミングを制御できることです

  この例に適しています

  ProcessCameraProviderのリスナーが返されるのを待つ必要があります

  初期化が完了したことを知るためです

</div>

<div class="c-border-content-title-1">ScannerLifecycleObserver</div>    
<script src="https://gist.github.com/waitzShigoto/6bbc490b5ce7596a2218c9b2beadd6c9.js"></script>
<div class = "table_container">
  <p>コード解説</p>
  ScannerLifecycleObserverは比較的シンプルです

  BaseCameraLifecycleObserverを継承しています

  主にプロジェクトの要件に応じて必要な機能をいくつか記述しています

  例えば、いくつかの拡張内容

  <b>getCameraDisplayOrientation</b>のようなものです

  カメラがサポートする解像度を調整するために使用できます

  またはgetImageAnalysisでImageAnalysisを取得します

  ImageAnalysisは主にMLKitでどのバーコードタイプを解析できるかを設定するために使用されます

</div>

<div class="c-border-content-title-1">ScannerAnalyzer</div>    
<script src="https://gist.github.com/waitzShigoto/7c3d18a8025bb0959b1339f633120c99.js"></script>

<div class = "table_container">
   <p>コード解説</p>
  ScannerAnalyzerはバーコードを解析するための実装です

  BaseCameraLifecycleObserverを継承しています

  QRコードを解析するために<b>FORMAT_QR_CODE</b>を使用しています
</div>

