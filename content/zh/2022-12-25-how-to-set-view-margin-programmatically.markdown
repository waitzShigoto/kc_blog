---
layout: post
title: 快速學會在Android App中調整元素間距 - 使用Kotlin extension程式碼設定間距
date: '2022-12-25 17:05:12 +0800'
image: cover/kotlin-clear-code-maring-layout-xml-constarint-layout-1.png
tags:
  - Android
  - Extension
  - Kotlin
permalink: /clear_use_extension_to_set_margin
categories: ProgrammingLang
excerpt: >-
  在Android App中，調整元素間距是一個常見的需求，而使用Kotlin
  extension程式碼設定間距可以快速且簡單地達成此目的。在這篇文章中，我們將一步一步地學習如何使用這個技巧，讓您的App看起來更加美觀和專業。
---

<h1 style="background-color:powderblue;">&nbsp;&nbsp;前言</h1>

今天要跟大家分享一個超簡單的小技巧，

讓你在設計 Android App 時可以用`程式碼`調整元素的間距。

這個方法用起來不僅方便，而且還可以讓你的設計更加美觀。

就算你是剛入門工程師，也可以輕鬆掌握！

跟著我一起來學吧！

<h1 style="background-color:powderblue;">&nbsp;&nbsp;基本的方法</h1>

在Android中調整元素間距有多種方法，本文將介紹使用Kotlin extension程式碼設定間距的方法。

在這之前我們先了解一下

在xml裡面設定view間距的話

最直接的僅需一行而已

`android:layout_marginLeft="30dp"`

有些情況下

當需求方要求你動態設定 Android View 元素間的間距時

通常可以用下面的的方法:

<script src="https://gist.github.com/waitzShigoto/60e47ade8cf051643f9075e8157c6ded.js"></script>

這個方法需要實例化一個 LayoutParams

並且需要設定上下左右間距後才能 set 到你的 View 上

但如果你需要在多個地方都使用這個設定間距的方法

那就會讓程式碼變得冗長且難以維護。

為了解決這個問題，

你可以使用 Kotlin Extension 去實作設定間距的方法，

這樣就能夠讓你的程式碼更簡潔且易於維護。

<h1 style="background-color:powderblue;">&nbsp;&nbsp;使用kotlin extension來完成</h1>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;step0. 這邊先展示一下完整的擴充function</h4>
<script src="https://gist.github.com/waitzShigoto/b884affe0c15221ec627ae3faa3c1dfa.js"></script>

<p class="table_container">
  這段程式碼已經可以直接使用了

  複製到你的專案內

  直接拿到你的view呼叫就行了！

  vb.btConfirmZero.margin(top = 0F)

  vb.btConfirmOne.margin(bottom = 30F,right = 2F)

  vb.btConfirmTwo.margin(bottom = 10F,left = 3F) 

  <a class="link" href="#step5" data-scroll>這邊都懂的話可以直接跳到step5.</a>
</p>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step1. 要如何實作呢？</h4>
<div class="c-border-content-title-4">
  首先先建立一個function如下
</div>

<script src="https://gist.github.com/waitzShigoto/9aec2350bcd7231a162da047508d76be.js"></script>

<div class="table_container">
  <p>上面程式碼解說</p>
  <ol class="rectangle-list">
    <li>
      <a href="https://kotlinlang.org/docs/lambdas.html#function-types" target="_blank">
        這邊我們傳入一個 function type 命名為block

        它其實就是一種Kotlin變數(可能別的語言也有 但是Java還沒支援)

          <b style="color:blue;">(Function type解釋可以參考:點此)</b>

          使用function type 可以讓你用lambda去操作(Java雖有lambda，不過目前並沒有function type)
      </a>
    </li>

    <li>
      <a href="javascript:void(0)">
        我們這邊使用泛型

        且用了型別轉換去轉換泛型

        有可能因為編譯時被認為是隱式型別強轉而產生錯誤

        因此如果在沒有明確類別

        直接強轉則可能遇到

        <b style="color:red;">`xxxxClass cannot be cast to zzzzClass` </b>這種的錯誤

        或是有些編譯器會直接提示你<b style="color:red;">`unchecked cast`</b>警告語

        當然你也可以 帶入clazz: Class之類的 來判斷實際的類是什麼

        但這樣code會變得更多

        當類別一多時就會寫更多的code、一直做重複的事...等等

        所以這邊用了`reified`來作為解決方法

        他是一種kotlin提供來解決這類問題的一個用法

        -> 使用reified必需帶`inline`

      </a>
    </li>
  </ol>
</div>

<div class="c-border-content-title-4">
    之後我們就可以這樣呼叫
</div>

<script src="https://gist.github.com/waitzShigoto/c5ef3ee7159011e92c8d17be233cf6a8.js"></script>
<div class="table_container">
  <p>上面程式碼解說</p>
  <span>
    這邊其實就是為了符合不同的 <b>ViewGroup.LayoutParams</b>

    讓未來如果有更多繼承 <b>ViewGroup.LayoutParams</b> 的實體類想進行操作

    可以更有彈性

  </span>
</div>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step2. 寫一個dp to px的method</h4>
<script src="https://gist.github.com/waitzShigoto/52153b7712fde5257aaeab83b3c2ce7f.js"></script>

  - 這邊很簡單
  主要是為了配合設定間距時使用的是pixel
  所以寫了個轉換方法

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step3. 透過擴充好的layoutParams去對layout的parameter做修改</h4>
<script src="https://gist.github.com/waitzShigoto/b64909a750c6a73306a1d1885f763f67.js"></script>
<div class="table_container">
  <p>上面程式碼解說</p>
  <span>
    這邊透過剛寫好的 <b>View.layoutParams</b> 去操作我們要設定的view

    以前在java要設定都一定要一次輸入上下左右四個parmater

    因此這邊我們用

    <b>left: Float? = null, top: Float? = null, right: Float? = null, bottom: Float? = null</b>

    來預設四個位置的間距都是null

    再使用kotlin null safe的特性去檢查，如

    <b>left?.run { leftMargin = convertDpToPixel(this) }</b>

    確定有值才會去設定margin間距值

    我們既不用擔心會null exception又能彈性的只輸入我們想改的位置就好

  </span>
</div>

<h4 id="step5" style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step5.最後輕鬆使用</h4>

  <script src="https://gist.github.com/waitzShigoto/6e721513ab6c92dc05ab2e61ef716c1f.js"></script>
