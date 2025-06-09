---
layout: post
title: "【Android/Kotlin】極速掌握 inline / noinline / crossinline 三大關鍵字教學！"
date: 2020-11-30 21:01:43 +0800
image: cover/android-kt-inline-1.png
tags: [Android]
categories: Kotlin
excerpt: "在 Kotlin 編程中，inline、noinline 和 crossinline 是常見的關鍵字。這些關鍵字可以在函數聲明中使用，它們可以對函數進行不同的行為修改，進而影響代碼的運行方式和性能。"
---

## 前言

在 Kotlin 編程中，inline、noinline 和 crossinline 是常見的關鍵字。

這些關鍵字可以在函數聲明中使用，

它們可以對函數進行不同的行為修改，

進而影響代碼的運行方式和性能。

本篇文章將詳細介紹這三個關鍵字的使用方式和區別，

並提供相關的代碼示例和實際應用場景。

<div class="c-border-content-title-4">inline</div>

inline 實際上的作用，

就是會在編譯的時候把你有使用inline的function內容直接複製到執行處，

而不是直接實例化一個物件，

藉由inline來減少實例化物件來提升效能

先簡單的說，我們寫一個funcion會寫成像下方這樣：

<script src="https://gist.github.com/waitzShigoto/626f82a8e911cb4ab227f0bffc4220b9.js"></script>

然而，如果帶入一般變數的function直接加上inline，

某些IDE可能會提醒你這樣直接使用，

並不會增加效能表現。
像是下面這邊示範，

只有帶入一般變數並使用inline，

則編譯器跳黃底提醒，

說明了預期要帶入function type 變數才能有效提升效能表現。

<div align="center">
  <img src="/images/inline/inline-02.png" alt="Cover" width="1000%"/>
</div>

所以，我們試著寫出一個帶入function type的function，

並寫一個一樣的function帶有inline，就像這樣：

<script src="https://gist.github.com/waitzShigoto/0b924c1634435c157fba4a73f3c4afc9.js"></script>

這兩個執行後你會發現返回的結果一樣，

但是實際上，

如果你反編譯這段code出來看的話(如下)，

你會發現，沒有用inline，

程式在跑的時候，

會針對你的lambda function創建一個新的instance，

也就是會實例化一個新的物件，

如果你剛好有一段code需要重複運用到這個function，

他就會重複創建物件，

因此可能會花比較多效能去處理這個lambda function，

所以如果使用inline 就可以降低這方面效能的消耗。

<script src="https://gist.github.com/waitzShigoto/0edf38ee27045d23b0b490ca4381f286.js"></script>

提示：**(Function1）null.INSTANCE**，是反編譯器找不到等效的Java 類的顯示。

從上面的例子可以單看出，使用lambda function的當下，

如果用inline，可以提升處理的效能，

但實際上，我們會使用的時機呢？這邊我舉個例子

假設你有個情境，是需要重複呼叫某個帶有lambda 的function，比較沒經驗的可能會直接這樣寫：

<script src="https://gist.github.com/waitzShigoto/6f5a374bee3a35b754d5f551b170f969.js"></script>

可以看到，在你反編譯後，

你會看到你雖然達成了你用的重複執行10次，

但同時，你也重複創建了10次同樣的物件，

所以當你比較有經驗後，你可以：

**1.把lambda function在迴圈外部創建**

這樣同樣能提升效能，但既然都使用kotlin了，那就使用inline也可以。

<script src="https://gist.github.com/waitzShigoto/c7535ba99806202c354e571447b99c68.js"></script>

**2.使用inline來創建：**

<script src="https://gist.github.com/waitzShigoto/ad7d6e31cce3d9badd7cc9b2fa36b57a.js"></script>

這樣的話，你就能看出，使用inline的優勢，

好了，接下來說說noinline 跟crossinline有什麼差別嗎，

其實剩下這兩個關鍵字，

我感覺是用來輔助inline的，

他不像inline一樣，是加在fun前面，

他反而是用來設定function type(or lambda function)的。

<div class="c-border-content-title-4">noinline</div>
noinline的概念，其實更簡單了，

當你了解inline，就會明白為何我說這兩個是輔助了，

這個的用途，

是當你一個inline function內含有多個function type時，

你可以去控制，哪個lambda 要使用inline，例如：

<script src="https://gist.github.com/waitzShigoto/b6f489a19d880c3a6f89e53d90521dd5.js"></script>

因此，你也能依照需求，去選擇要不要用inline

<div class="c-border-content-title-4">crossinline</div>
先來個前導概念：

當你在使用lambda function時，

如果在宣告的lambda function 裡面加入return ，

會導致呼叫時，使用lambda function的地方直接return出該function：

<script src="https://gist.github.com/waitzShigoto/e9fdbb9fc2aefe4841853b23d1db8714.js"></script>

這時候，你不想要跳出整個inline function ，

你可以用像上方code提到的，直接將原本的return改成 return@getMinutesWithInline 這樣，

他就只會跳出宣告的lambda function。

或是你也能使用crossinline的關鍵字，

他也是用來修飾lambda function的，

也是輔助inline使用的，

功效是可以避免有return時，直接被return出去！

<script src="https://gist.github.com/waitzShigoto/940839c5f5bbaf854a0c243748192758.js"></script>

## 結論
使用 inline

能夠降低程式呼叫lambda function時重複創建實例化

藉此提升效率

使用 inline 能避免建立過多的實例化物件

使用 noinline 可以讓lambda 不使用inline

使用 crossinline 可以避免lambda 中的 return 影響外部程式流程

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">inline / noinline / crossinline範例程式碼</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">
          <a href="https://github.com/KuanChunChen/KC_InlineDemo/blob/master/app/src/main/java/k/c/horialtal/move/sheet/kc_inlinedemo/InlineUtil.kt">
Sample Code</a>
        </div>
    </div>
</div>
