---
layout: post
title: Jetpack Composeでスプラッシュページにアニメーションを追加しよう！
date: '2021-09-17 15:02:11 +0800'
image: cover/ea-website-splash-cover-photo-new-1.png
tags:
  - Android
  - Compose
  - Kotlin
categories: UIFramework
permalink: /android-kt-jetpack-compose-splash
excerpt: >-
  Jetpack Composeを使えば、アプリケーションに動的で生き生きとしたスプラッシュページを簡単に追加できます。 この記事では、Jetpack
  Composeを使ってアニメーションページを作成する方法をステップバイステップで学びます。
---

## 目標
この記事の目標は、

シンプルなスプラッシュページを作成することです。

最終的に達成する目標は以下の通りです：

<div align="center">
  <img src="/mov/jetpack/ea_splash_app.gif" width="60%"/>
</div>

## 前書き
現在、多くのアプリケーションには、

ユーザーが現在使用しているアプリケーションや会社のロゴを明確に識別できるようにするためのスプラッシュ画面が設計されています。

この記事では、

シンプルな遷移機能を実現し、

簡単な水平拡張アニメーションを組み合わせて、

今日の目標を達成する方法に焦点を当てます。

Jetpack Composeの基礎にまだ慣れていない場合は、

以下の記事を参考にして理解を深めてください：

<div align="start">
  <a href="{{site.baseurl}}/android-kt-jetpack-compose-base">
    <img src="/images/cover/ea-website-base-cover-photo-new-1.png" alt="Cover" width="20%" >
  </a>

  <a href="{{site.baseurl}}/android-kt-jetpack-compose-base">Android Jetpack Compose 基本応用チュートリアル</a>
</div>

<div class="c-border-content-title-4">この記事は基本概念を理解していることを前提としていますので、まだ理解していない場合は上記の記事を参考にしてください。</div>

----
<div class="c-border-content-title-4">第一歩：ページ構造を考える</div>
まず、

このページの全体的な構造を考える必要があります。

通常、最終的な画面のイメージを先に考えます。

そのため、異なるレイヤーの概念を区別するためにBoxコンポーネントを使用します。

<script src="https://gist.github.com/waitzShigoto/4862edcea54d85e0b3afec37c02f78fa.js"></script>

<div class="c-border-content-title-4">第二歩：スプラッシュページのロゴアニメーションを実装する</div>
このステップでは、関数型のパラメータ <font color="red"> event:()->Unit = {} </font> を渡します。

これにより、後で外部呼び出しをトリガーして実行するアクションを設定できます。

同時に、

アニメーションの入場と退場の時間、

およびアクションを実行する前の遅延時間をデフォルトで設定できます。

これらのパラメータは必要に応じて調整できますが、

理解を容易にするために、関数内部に記述します。

<script src="https://gist.github.com/waitzShigoto/b61eb400f593a0bd389d1b129f7dc9c5.js"></script>

具体的な状況に応じて、

ロゴをページの中央に配置し、少し上にずらしたいと思います。

そのため、Columnコンポーネントを追加し、Modifierを使用して位置を調整します。

以下のコードの<font color="red">#23~#34行</font>を参考にして位置を調整してください。

<script src="https://gist.github.com/waitzShigoto/65f06da7ebceb4e93d08b6fe1aad7629.js"></script>

<div class="c-border-content-title-4">第三歩：この記事のメインイベント</div>

現在私たちはアニメーションの重要な部分に入ります、

Jetpack Compose の AnimatedVisibility を使用します。

このクラスは多くの組み込みメソッドを提供しており、

基本的なアニメーション効果を迅速に実現することができます。

この部分では、

まず前に定義した val 変数 state を見てみましょう。

これは Jetpack Compose でよく使われる概念の一つです。

なぜなら、単独で Composable を使用してコードを書くとき、

XML で自動的に更新されることはないからです。

<font color="red">state を通じて composable に更新を通知する必要があります</font>

```Kotlin
val state = remember {

    MutableTransitionState(false).apply {
        ...
    }
}
```

ここでは <font color="red">remember</font> を使って MutableTransitionState オブジェクトを記憶（保存）します。

ここで重要なのは MutableTransitionState です。

これは二つの状態を含む、状態を観察可能な項目です。

その中には <font color="red">currentState</font> と <font color="red">targetState</font> が含まれます。

公式の説明によると、

観察可能な state の状態が変わると、

システムが compose を再構成するようにトリガーされます。

したがって、この特性を利用して、

リアルタイムで compose コンポーネントの内容を変更することができます。

例えば、ここでの例は：

1. まず、初期状態が false の staus を宣言します。

2. AnimatedVisibility を使用して、その visibleState を先ほど宣言した staus に設定します。

3. 先ほど宣言した val staus の場所に apply を追加します。

その概念は、

kotlin の extension 概念 apply を利用して scope 内のコードを実行します。

apply は親クラス内の特性を取得できるため、

MutableTransitionState 内の targetState を true に設定します。

<font color="red">この動作により MutableTransitionState が変化します。
</font>
したがって、この staus を使用するものは、上記の特性をトリガーします。

これにより、開発時に compose を変更するタイミングを判断する根拠が得られます。

```kotlin
val state = remember {

        MutableTransitionState(false).apply {
            // Start the animation immediately.
            targetState = true

            ...

        }
    }
```

つまり、

上記の方法でアニメーションをトリガーし、

トリガー後に Handler を同時にトリガーしてジャンプ動作を実行します：

```kotlin
val state = remember {
        MutableTransitionState(false).apply {
            // Start the animation immediately.
            targetState = true

            Handler(Looper.getMainLooper()).postDelayed({
                event.invoke()
            }, delayMillis)

        }
    }
```

次に、

アニメーションの作成を開始します。

ここでも Jetpack Compose のライブラリを使用します。

具体的には AnimatedVisibility を使用します。

この関数では、以下の変数を使用します：

1. visibleState：これはアニメーションの表示状態を制御する変数です。

前述の remember と MutableTransitionState を通じて、

このライブラリのアニメーション効果をトリガーできます。

言い換えれば、この状態が変わると、この関数が再度実行されます。

2. enter：これはアニメーションの入場効果を定義する変数です。

3. exit：これはアニメーションの退場効果を定義する変数です。

これらの変数を設定することで、

アニメーションの出現と消失を制御し、

驚くべき視覚効果を生み出すことができます。

上記を理解した後、公式が提供するいくつかの組み込みアニメーションを適用できます。

入場には `expandHorizontally` を使用し、

退場には `fadeOut` を使用します。

つまり、enter と exit にそれぞれ必要なアニメーションを次のように設定します：

```kotlin
AnimatedVisibility(
          visibleState = state,
          enter = expandHorizontally(
              animationSpec = tween(
                  durationMillis = startDurationMillis,
                  easing = LinearEasing
              ),
          ),
          exit = fadeOut(
              animationSpec = tween(
                  durationMillis = exitDurationMillis,
                  easing = LinearEasing
              ),
          )
      ){
        ...
      }
```

次に、

AnimatedVisibilityScope の関数型範囲内で、

表示したいコンポーネントを追加できます。

これでアニメーション効果を表示できます。

## 最終成品、サンプルコード
<script src="https://gist.github.com/waitzShigoto/5953666a7808fbdfb4de564d07a6314e.js"></script>
