---
layout: post
title: Android Kotlin カスタムUIのテクニック－左右切り替えビューとアニメーションのドロップダウンメニューのチュートリアル - 02
date: '2020-11-20 16:04:13 +0800'
image: cover/android-photo.jpg
permalink: /android_custom02
tags:
  - Android
categories: AndroidDev
excerpt: >-
  このチュートリアル記事では、Android
  Kotlinを使用してカスタムUIのテクニック、具体的には左右切り替えビューとアニメーションのドロップダウンメニューを実現する方法を学びます。
---

Hello, 皆さんこんにちは、Elegant AccessのKCです。

引き続き、カスタマイズ方法についてご覧いただきありがとうございます。

左右切り替えビューとアニメーションのドロップダウンメニューの実装編です。

次の段落では、このカスタムビューを一歩一歩完成させる方法を紹介します！

まず、カスタムビューを作成するために、クラスを作成する必要があります。例えば、ここでは HorizontalMoveView という名前にします：

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg05.png" alt="Cover" width="30%"/>
</div>

このクラスを作成し、使用したいレイアウトを継承します。ここでは、ビューにどのような特性を持たせたいかに応じて継承するものを調整できます。例えば、FrameLayoutを使用したい場合：

<script src="https://gist.github.com/waitzShigoto/99170edc18f10eb9786ed1ef5061a511.js"></script>

次に、このビューに含まれる要素を作成します。したがって、このビューの外観としてカスタムXMLを作成する必要があります。例えば、このビューにはwebview、image view、recycler viewなどのレイアウトが含まれます。必要に応じてカスタマイズできます。

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg06.png" alt="Cover" width="30%"/>
</div>

上記の画像のレイアウトの実際のコードは以下の通りです：
<script src="https://gist.github.com/waitzShigoto/2441aae9b1134270fc7cb0968693a4d4.js"></script>

このレイアウトは基本的なもので、特に難しい点はありません。主に読者のプロジェクトの要件に応じて、必要なレイアウトを定義します。必ずしも上記のものに従う必要はありませんが、ファイルが混在しないように分ける習慣があります。この時点で、先ほど作成した HorizontalMoveView にこのレイアウトを読み込むだけです。以下のように：

<script src="https://gist.github.com/waitzShigoto/30213ecc81d3372c620b05a488ac05e2.js"></script>

ここまでで、第一歩が完了です。カスタムビューを作成できましたが、注意が必要です。現在のところ、空の殻だけで、外観だけで、カスタムビューをサポートする機能はまだ書かれていません。したがって、カスタムビューを呼び出すことはできますが、機能はなく、画面に表示されるだけです。したがって、機能を追加する必要があります。
ここで、先ほど作成したビューを呼び出してみます。以下のように：

<script src="https://gist.github.com/waitzShigoto/ae59cabf7891e07eebd875cc2df612f1.js"></script>

カスタムビューを使用したい場所に追加します。カスタムビューがどこにあるかは、保存したパッケージによります。パッケージのパスにファイル名を追加するだけです。
ここまで書いたところで、おそらく空白のビューを呼び出すことができます。まだ機能を書いていないので、以下のように見えるかもしれません：

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg07.png" alt="Cover" width="30%"/>
</div>

今日はここまでにします。次回は、いくつかの機能を書いたり、recycler viewを定義したりして、ビュー全体を完成させる方法を紹介します。
次回もお楽しみに、左右にスワイプするrecycler viewの実装を続けます：

<div class="table_container">
  <a href="{{site.baseurl}}/2020/11/21/android-kotlin-custom-view-03/">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

```markdown
<a href="{{site.baseurl}}/android/custom03">Android Kotlin カスタムUIのテクニックを学ぶ - 左右切り替えビューとアニメーションのドロップダウンメニューのチュートリアル - 03</a>
</div>

前のセクションを見る：

<div class="table_container">
  <a href="{{site.baseurl}}/2020/11/14/android-kotlin-custom-view-01/">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

  <a href="{{site.baseurl}}/android/custom01">Android Kotlin カスタムUIのテクニックを学ぶ - 左右切り替えビューとアニメーションのドロップダウンメニューのチュートリアル - 01</a>
</div>

Elegant AccessのKCによって作成されました。

Copyright (c) 2024 All rights reserved.

Instagram  : https://www.instagram.com/eleg.aces.kc/

Github : https://github.com/waitzShigoto

```
