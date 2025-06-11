---
layout: post
title: "Android Kotlin カスタムUIのテクニック－左右スワイプビューとアニメーションのドロップダウンバーのチュートリアル - 01"
date: 2020-11-14 15:30:18 +0800
image: cover/android-photo.jpg
permalink: /android_custom01
tags: [Android]
categories: Android實作
excerpt: "このチュートリアル記事では、Android Kotlinを使用してカスタムUIを作成するテクニック、具体的には左右スワイプビューとアニメーションのドロップダウンバーを実現する方法を学びます。"
---

<h1 class="c-border-main-title-2">実際の効果</h1>

まず最も理解しやすい方法は、直接ビデオを見せることです。効果はビデオの通りです：

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-git01.gif" alt="Cover" width="30%"/>
</div>

<p> </p>
<p> </p>
このデモで見られるものは以下の通りです：

<div class="table_container">
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">ドロップダウンボトムシート</a></li>
    <li><a href="javascript:void(0)">Recycler view 左右スワイプ</a></li>
    <li><a href="javascript:void(0)">Recycler view 内の各アイテムをクリックして切り替え</a></li>
    <li><a href="javascript:void(0)">Recycler view 初期化時に中央に配置</a></li>
    <li><a href="javascript:void(0)">Recycler view 内のアイテムのマージン設定</a></li>
    <li><a href="javascript:void(0)">WebView からアプリケーションへの遷移</a></li>
  </ol>
</div>

また、以下のクラス（主に使用したクラスのみ）を継承しました：

<div class="table_container">
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">LinearLayoutManager</a></li>
    <li><a href="javascript:void(0)">BottomSheetBehavior</a></li>
    <li><a href="javascript:void(0)">ItemDecoration</a></li>
    <li><a href="javascript:void(0)">OnScrollListener …など、
その他のクラスは一つ一つ列挙しません。</a></li>
  </ol>
</div>

本記事では、このデモのいくつかの特徴を紹介します。例えば、スワイプに応じて中央のimageViewがフェードイン、フェードアウトする効果です。

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg01.jpeg" alt="Cover" width="30%" >
  <img src="/images/kt-demo-custom/kt-demo-jpg02.jpeg" alt="Cover" width="30%" >
</div>

次に、左右にスワイプできるカスタムRecycler viewを作成します。具体的には：

<div class="table_container">
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">カスタムRecycler view とその詳細な調整</a></li>
    <li><a href="javascript:void(0)">間隔の設定</a></li>
    <li><a href="javascript:void(0)">スワイプ時のアニメーション（フォントの色変更、グラデーション、ビューの変更など）</a></li>
  </ol>
</div>

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg03.jpeg" alt="Cover" width="30%" >
  <img src="/images/kt-demo-custom/kt-demo-jpg04.jpeg" alt="Cover" width="30%" >
</div>

最後に、よくあるパラメータ調整、

色コードの設定、

その他のビューの設定などについて説明します。

興味があれば、続きをご覧ください！

参考にしてください：

<div class="table_container">
  <a href="{{site.baseurl}}/2020/11/20/android-kotlin-custom-view-02/">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

  <a href="{{site.baseurl}}/android/custom02">Android KotlinでカスタムUIを学ぶ－左右切り替えビューとアニメーションのドロップダウンメニューのチュートリアル - 02</a>
</div>

