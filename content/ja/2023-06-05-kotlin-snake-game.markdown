---
layout: post
title: Android Kotlin：クラシックなスネークゲームの再現、1日で作って遊べる！
date: '2023-06-05 17:24:06 +0800'
image: snake_game/kotlin_snake_game_post.png
tags:
  - Android
  - Kotlin
permalink: /kotlin_snake_game
categories: AndroidDev
excerpt: >-
  このチュートリアルでは、クラシックなスネークゲームを一歩一歩作成し、ゲーム開発の楽しさを存分に体験していただきます！初心者から経験豊富な開発者まで、この実践的なチュートリアルを通じてKotlin言語とゲーム開発の理解を深めることができます。一緒にこの老若男女に愛されるゲームを再現し、自分だけのクラシックな思い出を作りましょう！
---

## 前書き
<div class="c-border-content-title-4">
    このチュートリアルでは
</div>
<p>
AndroidのカスタムViewを使用してクラシックなスネークゲームを実現する方法を学びます。
<div class="c-border-content-title-4">
    以下は実現する機能です
</div>
1.蛇の移動と方向転換

2.ランダムに食べ物を生成

3.蛇が食べ物を食べると成長

4.境界または自身に衝突したときにゲームをリセット

<div align="center">
  <img src="/images/snake_game/snake_demo.gif" alt="Cover" width="20%"/>
</div>
</p>

## スネークゲームのViewの実装
<div class="c-border-content-title-4">
    カスタムViewクラスの作成

</div>
<p>

  <script src="https://gist.github.com/waitzShigoto/eb9fc1cf52e51c18c85160b9dec6b418.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
      まず、SnakeGameViewという名前のカスタムViewクラスを作成し、Viewクラスを継承します。

  </div>

</p>

<div class="c-border-content-title-4">
    変数の定義と初期化

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/696e8b14f4b8fdd8e9a5ebc317105b80.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
      SnakeGameViewクラス内で、蛇の位置、サイズ、方向など、ゲームに必要な変数を定義します。

      以下は各項目の用途の概要です

      screenWidth:キャンバスの幅（蛇が走れる領域）

      screenHeight:キャンバスの高さ（蛇が走れる領域）

      snakeSize: 蛇のサイズ

      snake:蛇全体の座標をLinkedListに格納

      food：食べ物の座標

      foodPaint：食べ物のスタイル

      direction：蛇の頭の方向

      score：スコア

      updateHandler：スネークゲームの画面を継続的に更新するための間隔イベント

      snakeHeadBitmap：蛇の頭のビットマップ画像

      snakeBodyBitmap：蛇の体のビットマップ画像

      borderColor：境界線の色

      borderWidth：境界線の幅

      borderPaint：境界線のスタイル

      pendingDirection：次に向かう方向

  </div>

</p>

<div class="c-border-content-title-4">
    ゲーム画面のサイズ設定

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/9c426a1e42cdd7b27a04169083e01d2d.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    SnakeGameViewクラス内で、

    onMeasureメソッドをオーバーライドして、

    蛇のサイズに基づいてゲーム画面のサイズを調整する必要があります。

    この例では、ゲーム画面が自動的に適応し、

    蛇が完全に移動できるようにする方法を示しています。

    主な理由は、異なるメーカーのスマートフォンのサイズと密度が異なるため、

    設定された画面サイズと蛇の幅、高さが異なる可能性があり、

    ゲームの効果に影響を与える可能性があるためです。

    ユーザー体験の一貫性を確保するために、この設計が採用されています。

    開発者は自分のニーズに応じて適切に調整できます。
  </div>

</p>

<div class="c-border-content-title-4">
    蛇と食べ物の描画

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6d59bfaf552bade337814b0016fd0725.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    SnakeGameView の

    onDraw メソッドで、

    蛇と食べ物を描画します。

    この例では、ビットマップを使用して蛇の頭と体のリソースを導入し、

    貪食蛇の外観をカスタマイズします。

    また、蛇は常に移動し方向を変える必要があるため、

    Matrix() + rotationAngle を使用して回転角度を設定します。

    <pre>
    val rotationAngle = when (direction) {
      Direction.UP -> 180f
      Direction.DOWN -> 0f
      Direction.LEFT -> 90f
      Direction.RIGHT -> -90f
    }</pre>

    <pre> val matrix = Matrix()
          matrix.postRotate(rotationAngle, bodyBitmap.width / 2f, bodyBitmap.height / 2f)
          matrix.postTranslate(part.x.toFloat(), part.y.toFloat())
          canvas.drawBitmap(bodyBitmap, matrix, null)</pre>
    自分のニーズに応じて適切に調整することもできます。

  </div>

</p>

<div class="c-border-content-title-4">
    ゲームロジック

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/d3d6fa84b498999473e0ed041fcb48be.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    ゲームの主要なロジック（蛇の移動、衝突検出など）を実装するために、updateGame メソッドを追加します。

    resetGame() では、壁や自分に衝突したときに実行する手順を定義できます。

    例：ポップアップを表示、終了画面など。
  </div>

</p>

<div class="c-border-content-title-4">
    食べ物の生成

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3f8e352778a37d355b2afb2607013b23.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    ランダムに食べ物を生成するために、generateFood メソッドを追加します。

    ランダムに生成された x, y 座標を前に宣言した food オブジェクトに指定します。

    これにより、onDraw 時にランダムに食べ物を生成する効果が実現できます。

  </div>

</p>

<div class="c-border-content-title-4">
    方向の更新

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/f5880e17a1706da1c958ad3e1a7925ac.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    蛇がユーザーの操作に応じて方向を変えるために、

    updateDirection メソッドを実装する必要があります。
  </div>

</p>

<div class="c-border-content-title-4">
    リソースの解放

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6dad33e94f9f62d5a3db492a8f2655f0.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    メモリリークを避けるために、ビットマップなどの使用済みリソースを解放するメソッドを実装する必要があります。

    これにより、後でアクティビティやフラグメントのライフサイクルに戻ったときにリソースを解放できます。
  </div>

</p>

<div class="c-border-content-title-4">
    フラグメント/アクティビティを接続し、ボタンイベントを設定する

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3dfd240bbe8d1a9b1311d74fcffba44b.js"></script>
  <script src="https://gist.github.com/waitzShigoto/1bcd4c2bc5b927975a4c56f62afe3cb1.js"></script>
  <div class = "table_container">
    <p>コードの説明</p>
    これが最後のステップです。

    前に実装したビューをフラグメントまたはアクティビティに接続し、

    インタラクティブなボタンを追加することで、ユーザーと対話できるスネークゲームが実現します！

    ここでは自作のジョイスティックビューを使用していますが、上下左右の移動には4つのボタンを使用することもできます。

  </div>

</p>
