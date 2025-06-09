---
layout: post
title: "Android Kotlin: Recreating the Classic Snake Game, Playable in Less Than a Day!"
date: 2023-06-05 17:24:06 +0800
image: snake_game/kotlin_snake_game_post.png
tags: [Kotlin,Android]
permalink: /kotlin_snake_game
categories: Android實作
excerpt: "In this tutorial, we will guide you step-by-step to create the classic Snake game, allowing you to fully experience the fun of game development during the learning process! Whether you are a beginner or an experienced developer, this hands-on tutorial will deepen your understanding of the Kotlin language and game development. Let's revisit this timeless game and create your own classic memories!"
---

## Introduction
<div class="c-border-content-title-4">
    In this tutorial
</div>
<p>
We will learn how to use Android's custom View to implement the classic Snake game.
<div class="c-border-content-title-4">
    Here are the features we will implement
</div>
1. Snake movement and turning

2. Random food generation

3. Snake growth after eating food

4. Game reset upon hitting the boundary or itself

<div align="center">
  <img src="/images/snake_game/snake_demo.gif" alt="Cover" width="20%"/>
</div>
</p>

## Implementing the Snake Game View
<div class="c-border-content-title-4">
    Create a custom View class

</div>
<p>

  <script src="https://gist.github.com/waitzShigoto/eb9fc1cf52e51c18c85160b9dec6b418.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
      First, create a custom View class named SnakeGameView, inheriting from the View class.

  </div>

</p>

<div class="c-border-content-title-4">
    Define variables and initialize

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/696e8b14f4b8fdd8e9a5ebc317105b80.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
      In the SnakeGameView class, define the variables needed for the game, such as the snake's position, size, direction, etc.

      Below is a brief explanation of each variable's purpose

      screenWidth: Canvas width (area where the snake can move)

      screenHeight: Canvas height (area where the snake can move)

      snakeSize: Size of the snake

      snake: Coordinates of the entire snake stored in a LinkedList

      food: Coordinates of the food

      foodPaint: Style of the food

      direction: Direction of the snake's head

      score: Score

      updateHandler: An interval event to continuously update the snake game screen

      snakeHeadBitmap: Bitmap image of the snake's head

      snakeBodyBitmap: Bitmap image of the snake's body

      borderColor: Border color

      borderWidth: Border width

      borderPaint: Style of the border

      pendingDirection: The direction the snake is about to turn

  </div>

</p>

<div class="c-border-content-title-4">
    Set game screen size

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/9c426a1e42cdd7b27a04169083e01d2d.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    In the SnakeGameView class,

    we need to override the onMeasure method,

    to adjust the game screen size based on the snake's size.

    This example demonstrates how to make the game screen adaptive,

    so that the snake can fully traverse it.

    The main reason is that different brands of phones have varying sizes and densities,

    which may cause the set screen size to differ from the snake's width and height,

    affecting the game experience. To ensure a consistent user experience, this design is adopted.

    Developers can make adjustments according to their own needs.
  </div>

</p>

<div class="c-border-content-title-4">
    Drawing the Snake and Food

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6d59bfaf552bade337814b0016fd0725.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    In SnakeGameView,

    in the onDraw method,

    we draw the snake and food.

    In this example, we use bitmaps to import the snake head and body resources

    to customize the appearance of the snake.

    Additionally, since the snake will keep moving and needs to change direction,

    we use Matrix() + rotationAngle to set the rotation angle.

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
    You can also make adjustments according to your needs.

  </div>

</p>

<div class="c-border-content-title-4">
    Game Logic

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/d3d6fa84b498999473e0ed041fcb48be.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    Add an updateGame method to implement the main game logic, such as snake movement and collision detection.

    The resetGame() method can be defined to specify what steps to take when the snake hits a wall or itself,

    such as displaying a popup, ending the game screen, etc.
  </div>

</p>

<div class="c-border-content-title-4">
    Generating Food

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3f8e352778a37d355b2afb2607013b23.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    Add a generateFood method to implement the functionality of randomly generating food.

    Assign the randomly generated x and y coordinates to the previously declared food object.

    This way, during onDraw,

    the effect of randomly generating food can be achieved.

  </div>

</p>

<div class="c-border-content-title-4">
    Updating Direction

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/f5880e17a1706da1c958ad3e1a7925ac.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    To allow the snake to change direction based on user input,

    we need to implement an updateDirection method.
  </div>

</p>

<div class="c-border-content-title-4">
    Resource Cleanup

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6dad33e94f9f62d5a3db492a8f2655f0.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    To avoid memory leaks, we need to implement a method to clean up used resources, such as bitmaps.

    This allows the resources to be released when the activity or fragment lifecycle is resumed.
  </div>

</p>

<div class="c-border-content-title-4">
    Connect back to fragment/activity and set button events

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3dfd240bbe8d1a9b1311d74fcffba44b.js"></script>
  <script src="https://gist.github.com/waitzShigoto/1bcd4c2bc5b927975a4c56f62afe3cb1.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    This is the final step,

    Connect the previously implemented view back to the fragment or activity

    Adding interactive buttons will allow you to create an interactive Snake game with the user!

    Here, I am using a custom joystickView, or you can use four buttons to move up, down, left, and right

  </div>

</p>
