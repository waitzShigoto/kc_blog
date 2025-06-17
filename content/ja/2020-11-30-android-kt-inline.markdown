---
layout: post
title: 【Android/Kotlin】極速掌握 inline / noinline / crossinline 三大キーワードの教え！
date: '2020-11-30 21:01:43 +0800'
image: cover/android-kt-inline-1.png
tags:
  - Android
categories: ProgrammingLang
excerpt: >-
  Kotlinプログラミングでは、inline、noinline、crossinlineは一般的なキーワードです。これらのキーワードは関数宣言で使用でき、関数の動作を変更し、コードの実行方法やパフォーマンスに影響を与えることができます。
---

## 前書き

Kotlinプログラミングでは、inline、noinline、crossinlineは一般的なキーワードです。

これらのキーワードは関数宣言で使用でき、

関数の動作を変更し、

コードの実行方法やパフォーマンスに影響を与えることができます。

この記事では、これら3つのキーワードの使用方法と違いについて詳しく説明し、

関連するコード例と実際の使用シーンを提供します。

<div class="c-border-content-title-4">inline</div>

inlineの実際の効果は、

コンパイル時にinlineを使用した関数の内容を実行箇所に直接コピーすることです。

オブジェクトを直接インスタンス化するのではなく、

inlineを使用してオブジェクトのインスタンス化を減らし、パフォーマンスを向上させます。

簡単に言うと、関数を書くときは以下のように書きます：

<script src="https://gist.github.com/waitzShigoto/626f82a8e911cb4ab227f0bffc4220b9.js"></script>

しかし、一般的な変数を持つ関数に直接inlineを追加すると、

一部のIDEはこのように直接使用しても、

パフォーマンスが向上しないと警告するかもしれません。

以下の例のように、

一般的な変数を持つ関数にinlineを使用すると、

コンパイラは黄色の背景で警告を表示し、

関数型変数を渡すことでパフォーマンスが向上することを示します。

<div align="center">
  <img src="/images/inline/inline-02.png" alt="Cover" width="1000%"/>
</div>

そこで、関数型変数を持つ関数を作成し、

同じ関数にinlineを追加してみます：

<script src="https://gist.github.com/waitzShigoto/0b924c1634435c157fba4a73f3c4afc9.js"></script>

これらを実行すると、結果は同じであることがわかりますが、

実際には、

このコードを逆コンパイルしてみると（以下のように）、

inlineを使用しない場合、

プログラムはlambda関数の新しいインスタンスを作成します。

つまり、新しいオブジェクトをインスタンス化します。

コードの一部がこの関数を繰り返し使用する必要がある場合、

オブジェクトを繰り返し作成することになります。

そのため、lambda関数を処理するためにより多くのパフォーマンスを消費する可能性があります。

inlineを使用すると、このパフォーマンスの消費を減らすことができます。

<script src="https://gist.github.com/waitzShigoto/0edf38ee27045d23b0b490ca4381f286.js"></script>

ヒント：**(Function1）null.INSTANCE**は、逆コンパイラが等価なJavaクラスを見つけられないことを示しています。

上記の例から、lambda関数を使用する際に、

inlineを使用すると処理のパフォーマンスが向上することがわかります。

しかし、実際に使用するタイミングはいつでしょうか？例を挙げて説明します。

例えば、lambdaを持つ関数を繰り返し呼び出す必要がある状況があるとします。経験の浅い人は次のように書くかもしれません：

<script src="https://gist.github.com/waitzShigoto/6f5a374bee3a35b754d5f551b170f969.js"></script>

逆コンパイルすると、

10回の繰り返し実行を達成していることがわかりますが、

同時に同じオブジェクトを10回作成していることもわかります。

経験を積むと、次のようにできます：

**1. lambda関数をループの外部で作成する**

これによりパフォーマンスが向上しますが、Kotlinを使用しているので、inlineを使用することもできます。

<script src="https://gist.github.com/waitzShigoto/c7535ba99806202c354e571447b99c68.js"></script>

**2.使用inline來創建：**

<script src="https://gist.github.com/waitzShigoto/ad7d6e31cce3d9badd7cc9b2fa36b57a.js"></script>

このように、inlineを使用する利点がわかります。

さて、次にnoinlineとcrossinlineの違いについて説明します。

実際、残りの2つのキーワードは、

inlineを補助するためのものだと感じます。

inlineのようにfunの前に付けるのではなく、

function type（またはlambda function）を設定するためのものです。

<div class="c-border-content-title-4">noinline</div>
noinlineの概念は、実際にはもっと簡単です。

inlineを理解すれば、なぜこれら2つが補助的なものかがわかります。

この用途は、

1つのinline function内に複数のfunction typeが含まれている場合に、

どのlambdaにinlineを使用するかを制御するためのものです。例えば：

<script src="https://gist.github.com/waitzShigoto/b6f489a19d880c3a6f89e53d90521dd5.js"></script>

したがって、必要に応じてinlineを使用するかどうかを選択できます。

<div class="c-border-content-title-4">crossinline</div>
まず前提概念として：

lambda functionを使用する際に、

宣言されたlambda function内にreturnを追加すると、

呼び出し時にlambda functionを使用している場所から直接returnされます。

<script src="https://gist.github.com/waitzShigoto/e9fdbb9fc2aefe4841853b23d1db8714.js"></script>

この時、inline function全体から抜け出したくない場合、

上記のコードのように、元のreturnをreturn@getMinutesWithInlineに変更することで、

宣言されたlambda functionからのみ抜け出すことができます。

または、crossinlineキーワードを使用することもできます。

これもlambda functionを修飾するためのもので、

inlineを補助するためのものです。

効果としては、returnがある場合に直接外部のプログラムフローに影響を与えないようにすることができます。

<script src="https://gist.github.com/waitzShigoto/940839c5f5bbaf854a0c243748192758.js"></script>

## 結論
inlineを使用することで、

プログラムがlambda functionを呼び出す際にインスタンス化を繰り返すことを減らし、

効率を向上させることができます。

inlineを使用することで、過剰なインスタンス化オブジェクトの作成を避けることができます。

noinlineを使用することで、lambdaがinlineを使用しないようにすることができます。

crossinlineを使用することで、lambda内のreturnが外部のプログラムフローに影響を与えるのを防ぐことができます。

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">inline / noinline / crossinlineのサンプルコード</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">
          <a href="https://github.com/waitzShigoto/KC_InlineDemo/blob/master/app/src/main/java/k/c/horialtal/move/sheet/kc_inlinedemo/InlineUtil.kt">
サンプルコード</a>
        </div>
    </div>
</div>
