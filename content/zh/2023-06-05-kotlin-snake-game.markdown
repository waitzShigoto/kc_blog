---
layout: post
title: Android Kotlin ：經典貪吃蛇遊戲重現，寫好到遊玩不用一天！
date: '2023-06-05 17:24:06 +0800'
image: snake_game/kotlin_snake_game_post.png
tags:
  - Android
  - Kotlin
permalink: /kotlin_snake_game
categories: AndroidDev
excerpt: >-
  在本教學中，我們將帶領您一步一步打造經典貪吃蛇遊戲，讓您在學習過程中充分體驗到遊戲開發的樂趣！無論您是初學者還是有經驗的開發者，都能藉由這個實作教學加深對Kotlin語言和遊戲開發的理解。讓我們一起重溫這款老少咸宜的遊戲，動手開創您自己的經典回憶吧！
---

## 前言
<div class="c-border-content-title-4">
    在本篇教學中
</div>
<p>
我們將學習如何使用 Android 的自定義 View 來實現經典的 Snake 遊戲。
<div class="c-border-content-title-4">
    以下是我們將要實現的功能
</div>
1.蛇的移動和轉向

2.隨機生成食物

3.蛇吃食物後增長

4.碰到邊界或自身時遊戲重置

<div align="center">
  <img src="/images/snake_game/snake_demo.gif" alt="Cover" width="20%"/>
</div>
</p>

## 實作貪食蛇的view
<div class="c-border-content-title-4">
    創建一個自定義 View 類

</div>
<p>

  <script src="https://gist.github.com/waitzShigoto/eb9fc1cf52e51c18c85160b9dec6b418.js"></script>
  <div class = "table_container">
    <p>程式碼解說</p>
      首先，創建一個名為 SnakeGameView 的自定義 View 類，並繼承自 View 類。

  </div>

</p>

<div class="c-border-content-title-4">
    定義變量和初始化

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/696e8b14f4b8fdd8e9a5ebc317105b80.js"></script>
  <div class = "table_container">
    <p>程式碼解說</p>
      在 SnakeGameView 類中，定義遊戲所需的變量，如蛇的位置、大小、方向等。

      以下概略解釋各項用途

      screenWidth:畫布寬(蛇可以跑的區域)

      screenHeight:畫布長(蛇可以跑的區域)

      snakeSize: 蛇的大小

      snake:整隻蛇座標存在LinkedList內

      food：食物座標

      foodPaint：食物樣式

      direction：蛇頭方向

      score：得分

      updateHandler：做一個間隔事件，讓貪食蛇持續更新畫面

      snakeHeadBitmap：蛇頭的bitmap圖

      snakeBodyBitmap：蛇身的bitmap圖

      borderColor：邊框顏色

      borderWidth：邊框寬度

      borderPaint：邊框樣式

      pendingDirection：即將轉向的方向

  </div>

</p>

<div class="c-border-content-title-4">
    設置遊戲畫面尺寸

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/9c426a1e42cdd7b27a04169083e01d2d.js"></script>
  <div class = "table_container">
    <p>程式碼解說</p>
    在 SnakeGameView 類中，

    我們需要覆寫 onMeasure 方法，

    以便根據蛇的大小調整遊戲畫面的尺寸。

    此範例展示了如何讓遊戲畫面自適應，

    使其能夠剛好能讓蛇完整走完。

    主要原因是不同廠牌手機的尺寸和密度各有差異，

    可能導致設定的畫面尺寸與蛇寬、高不同，

    從而影響遊戲效果。為了確保使用者體驗的一致性，採用了這種設計。

    開發者可以根據自己的需求進行相應的調整。
  </div>

</p>

<div class="c-border-content-title-4">
    繪製蛇和食物

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6d59bfaf552bade337814b0016fd0725.js"></script>
  <div class = "table_container">
    <p>程式碼解說</p>
    在 SnakeGameView ，

    onDraw 方法中，

    我們去繪製蛇和食物。

    這個範例我們用bitmap導入蛇頭、身體資源

    去客製化貪食蛇外觀

    另外，因為蛇會一直移動需要轉動方向

    所以使用Matrix() + rotationAngle 去設定旋轉角度

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
    也可以根據自己的需求進行相應的調整。

  </div>

</p>

<div class="c-border-content-title-4">
    遊戲邏輯

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/d3d6fa84b498999473e0ed041fcb48be.js"></script>
  <div class = "table_container">
    <p>程式碼解說</p>
    新增一個 updateGame 方法，實現遊戲的主要邏輯，如蛇的移動、碰撞檢測等。

    其中resetGame()可以自行定義當撞到牆或自己要進行什麼步驟

    如：跳出彈框、結束畫面...等等。

  </div>

</p>

<div class="c-border-content-title-4">
    生成食物

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3f8e352778a37d355b2afb2607013b23.js"></script>
  <div class = "table_container">
    <p>程式碼解說</p>
    新增一個generateFood 方法，實現隨機生成食物的功能。

    把隨機生成的x,y座標，指定給前面宣告好的food物件，

    這樣之後在onDraw時，

    就能實現隨機產生食物的效果。

  </div>

</p>

<div class="c-border-content-title-4">
    更新方向

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/f5880e17a1706da1c958ad3e1a7925ac.js"></script>
  <div class = "table_container">
    <p>程式碼解說</p>
    為了讓蛇能夠根據用戶的操作轉向，

    我們需要實現一個 updateDirection 方法。
  </div>

</p>

<div class="c-border-content-title-4">
    資源回收

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6dad33e94f9f62d5a3db492a8f2655f0.js"></script>
  <div class = "table_container">
    <p>程式碼解說</p>
    為了避免內存泄漏，我們需要實現一個回收使用的資源，如bitmap。
    讓之後接回activity or fragment 生命週期時可以釋放掉。
  </div>

</p>

<div class="c-border-content-title-4">
    接回fragment/activity 並設置按鈕事件

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3dfd240bbe8d1a9b1311d74fcffba44b.js"></script>
  <script src="https://gist.github.com/waitzShigoto/1bcd4c2bc5b927975a4c56f62afe3cb1.js"></script>
  <div class = "table_container">
    <p>程式碼解說</p>
    這是最後一步了，

    把前面實作的view接回fragment或activity

    再加上可以互動的按鈕就能實現與使用者互動的貪食蛇了！

    我這邊是使用自製的 joystickView 或者是你也可以使用四個按鈕去做上下左右的移動

  </div>

</p>
