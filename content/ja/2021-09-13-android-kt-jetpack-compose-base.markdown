---
layout: post
title: Android Jetpack Compose 基本アプリケーションチュートリアル
date: '2021-09-13 16:00:48 +0800'
image: cover/ea-website-base-cover-photo-new-1.png
tags:
  - Android
  - Compose
  - Kotlin
categories: UIFramework
permalink: /android-kt-jetpack-compose-base
excerpt: >-
  Android Jetpack Compose 基本アプリケーションチュートリアルへようこそ！このチュートリアルでは、Jetpack Compose
  の世界に入り、ステップバイステップのガイドを通じて Compose の基本概念とスキルを習得します。
---

## 前書き
2021/7/28に

Google公式がついにJetpack Compose 安定版1.0をリリースしました 

公式発表文を見たい方は <a href = "https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html">こちら</a> をご覧ください 

今日は、Jetpack Compose を使って Android アプリに使用するコンポーネントを作成する基本的な方法を共有したいと思います。

Jetpack Compose は完全に Kotlin コードを使用して 

従来の .xml ファイルで記述されたビューやレイアウトを置き換えます 

生成されるのは .kt ファイルのみです 

大部分の .xml ファイルを削減します。 

<div class="c-border-content-title-4">Jetpack Compose には Kotlin 独自の特徴が多く使用されています</div>

<div class="table_container">
  <p>Kotlin の基本概念</p>
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">ラムダ式</a></li>
    <li><a href="javascript:void(0)">関数型</a></li>
    <li><a href="javascript:void(0)">拡張関数</a></li>
    <li><a href="javascript:void(0)">名前付き引数</a></li>
  </ol>
</div>

したがって、上記の Kotlin 概念に既に精通している場合、

Jetpack Compose の学習に大きな利点があります。

迅速に習得できると予想されます。

<div class="c-border-content-title-4">まず、両者の違いを見てみましょう</div>

例えば、これは xml を使用してシンプルなツールバーを作成する方法です：

<script src="https://gist.github.com/waitzShigoto/46bbdced14c9e3c26023854bed33c60d.js"></script>

そして、こちらは Jetpack Compose を使用してツールバーを作成する方法です

<script src="https://gist.github.com/waitzShigoto/80743e79901a8c98b87655ff8f020193.js"></script>

このような変更により、完全にコードでビューを制御できるようになります。

同時に、

関数型の変数を使用することがより便利になり、

ビューの実現に必要な機能を制御できます。

純粋な Kotlin コードを使用して実装するため、

条件式を使用してビューの表示を制御することがより柔軟になります。

これにより、アプリケーションの設計時により大きな柔軟性が得られます。

## 具体的な方法

ここでは、

いくつかの基本的なウィジェットを作成しました。

実際に Activity や Fragment で使用する際には、

必要に応じて再利用できます。

これにより、アプリケーションの開発と管理がより効率的になります。

このモジュール化された設計方法により、機能豊富で再利用可能なインターフェース要素を迅速に構築でき、

開発時間を大幅に節約し、コードの保守性を向上させます。

最後に、IDEでのプレビューはこのようになるかもしれません

左側にコードを書き、右側にプレビュー画面が表示されます

<div align="center">
    <img src="/images/jetpack_compose/jc01.png" alt="Cover" width="100%" >  
</div>

<div class="c-border-content-title-4">前期準備作業</div>

Android StudioをArctic Foxバージョンに更新する必要があります

そうすることでIDEを通じてComposableコンポーネントをプレビューできます

公式ダウンロード場所：
<a href="https://developer.android.com/studio?hl=zh-cn" class="btn btn-primary" role="button">Android Studio Arctic Foxをダウンロード</a>

<div class="c-border-content-title-4">第一歩</div>
まず関連libをgradle dependenciesに追加します:

<script src="https://gist.github.com/waitzShigoto/c18119da90591482e2f6f5b6cb67bdec.js"></script>

<div class="c-border-content-title-4">第二歩</div>
@Composableを追加して、このfunがJetpack Composeのコンポーネントであることを示します

<script src="https://gist.github.com/waitzShigoto/d8ecd7b8977a5d2e11cb89e00b1e2d04.js"></script>

ここでの

```
Modifier
```
これはJetpack Composeでよく使用されるインターフェースで、

コンポーネントの属性を拡張するために使用されます。

ここでは、

変数を関数の引数として使用する形式で、

AppBarコンポーネントを呼び出すときにModifierをカスタマイズでき、

そのコンポーネントの背景色、アニメーション、フォントなどの属性を設定できます。

<h6>(使用する公式コンポーネントに応じて、そのコンポーネントのModifier実装方法に従って異なる内容を設定します。) </h6>

<div class="c-border-content-title-4"><font color="green">選択肢（オプション）</font></div>

Columnを使用してJetpack Composeで作成したビューを並べ替えることができます。

ColumnはLinearLayoutに似た垂直配置方法を提供し、

複数のコンポーネントを追加する際に非常に便利です。

Columnを使用することで、複数のコンポーネントを垂直に簡単に並べることができ、

インターフェースのレイアウトがより構造化され、管理しやすくなります。

<script src="https://gist.github.com/waitzShigoto/203f5c350db588cc6b3730f9b326710c.js"></script>
---

公式libに内蔵されている関数を使って、すぐにツールバーを作成し始めます

例えばTopAppBar

<script src="https://gist.github.com/waitzShigoto/66d842982f99a753c786594e918abe16.js"></script>

ここでいくつかの

```Kotlin
modifier = ... ,
backgroundColor = ...,
elevation = ...,
contentColor = ...,
```

これは実際にはktの特性であるNamed argumentやfunction typeなどを利用して、

funを使用する際にコードをより効果的に拡張できるようにするものです

さらに、ここではfunction type変数<font color="red">
content: @Composable RowScope.() -> Unit</font>
を利用して、TopAppBarの左側にImageを追加します:

（ここでcmd+左クリックを押してTopAppBarのソースコードを見て、RowScopeが何をしているかを確認できます）

<script src="https://gist.github.com/waitzShigoto/049c22e6449d00c4aa529c33fc6cb76f.js"></script>

ここまでで、拡張性が高く、再利用可能なシンプルなウィジェットが迅速に完成しました。

<div class="c-border-content-title-4">第三歩</div>
プレビューを開始するにはどうすればよいですか？
もう一つfunを書いて@Previewを追加するだけで、refreshを押すとIDEの右側に先ほど作成したビューが表示されます
（表示されない場合は、右側のDesignまたはsplitをクリックしてプレビュー画面を開いてください）

<script src="https://gist.github.com/waitzShigoto/eac588083154d8faf5c8f15fff868798.js"></script>

<div class="c-border-content-title-4">第四步</div>
実際の応用では

contentとして包んで呼び出すことができます

こうすることで、画面を細かく分けることができ

将来的なメンテナンスがより効率的になります

このようにして、完全なロジックのレイアウトを包むことができます

将来レイアウトの見た目を変更したい場合は、ここから変更できます

基本的なコンポーネントのいくつかの機能を特に変更する必要はありません

<script src="https://gist.github.com/waitzShigoto/34565f4c1e1394cb2e5b1d50ded7093b.js"></script>

実際に作成したもの：
<div align="center">
    <img src="/images/jetpack_compose/jc02.png" alt="Cover" width="100%" >  
</div>

<div class="c-border-content-title-4">最後のステップ</div>

上記のステップを完了すると

fragmentやactivityでレイアウトを設定できます

非常にシンプルです

<script src="https://gist.github.com/waitzShigoto/d697201a60570da069cd3cc4f0ce425c.js"></script>
