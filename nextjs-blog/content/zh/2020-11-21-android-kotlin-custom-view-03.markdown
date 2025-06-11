---
layout: post
title: "學習Android Kotlin 客製UI的技巧－左右切換view與動畫的下拉欄教學 - 03"
date: 2020-11-21 15:44:20 +0800
image: cover/android-photo.jpg
permalink: /android_custom03
tags: [Android]
categories: Android實作
excerpt: "在這篇教學文章中，你將學習如何使用Android Kotlin客製UI的技巧，具體來說是如何實現左右切換view和動畫的下拉欄。"
---
Hello,大家好,這裡是Elegant Access的 KC，

歡迎大家繼續回來看如何客製化的實作篇，

今天的內容會提到怎樣實作一個左右滑動的recycler view，並且提到如何調整，

讓它滑動起來有pager的滑動感以及讓item間有間距的調整，好吧，廢話不多說，接著看下去吧！

效果圖：

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg08.png" alt="Cover" width="30%"/>
</div>

首先第一步，很簡單，要先定義一個recycler view用的adapter，那這邊我習慣，先做其中的item的xml，所以如下：

<script src="https://gist.github.com/waitzShigoto/b1a45501587bf59e8008b261c8439f72.js"></script>

接著，開始定義你的adapter，並讓adapter load進你剛剛創建的item：

因為我習慣使用自定義的BaseListAdapter，

在這個類裡面我習慣會用泛型來寫，

去代替之後可能會丟進adapter的data，

然後會在我的adapter裡面創建一個屬於這個adatper的viewholder，

一樣也用了泛型，去取代未來可能會重複寫到類似code的地方，

所以會看起來像下面這樣：

<script src="https://gist.github.com/waitzShigoto/8718aaf48a1806a57d97471fb5b9c7b0.js"></script>
在上面這個adapter裡面，

我的code變得很少，

因為我先寫好了一個抽象類，

另外我的base adapter會長這樣，

主要是抽象了一些方法：

<script src="https://gist.github.com/waitzShigoto/9e90e3f602e0f4029205fe3d3b3b1155.js"></script>

這裡主要講一些我抽象的方法
我要求實作 ItemView

```kotlin
@LayoutRes protected abstract int getItemViewLayout();
```
用意是讓我丟入，我寫好的item的xml的

這樣下次我就不用重複寫

接著我定義了一個ViewHolder，

去繼承我BaseListAdapter裡面的BaseViewHolder，

目的也是讓我之後可以不用再重寫一些基本的viewholder內容

另外這個base adapter 我也寫了一些其他通用功能
如果有需要再看就好
有些沒照著寫也是可以用

結論是
我只要override像上方code的幾個function就好了，

就能實現一個recycler view adapter的功能了！

我在我的BaseListAdapter類別裡面繼承了RecyclerView.Adapter，

並實作了recycler view adapter需要繼承的 :

*   getItemViewType(position: Int)
*   onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int)
*   getItemViewType(position: Int)
*   getItemCount()
*   onCreateViewHolder(parent: ViewGroup, viewType: Int)...等function，

這些都是在創造recycler view會需要繼承的地方，

因為考量到可能會很常用到recycler view，並且又很懶XDD，

想說未來在其他地方，

甚至是到別的專案的時候，

可能會用到類似的，

所以會習慣寫一個未來擴充性也夠的抽象類出來，

讓我日後在寫使用時也能方便取用，

想改可以直接在父類改，

並且直接繼承就能用，

真的是省時又能節省重複的code！

目前已經完成了一個基本的recycler view的建構了 ，

只要呼叫下方code，

就能有基本的recycler view了:

<script src="https://gist.github.com/waitzShigoto/16987a5a8f9039f913b3e490da226e76.js"></script>

那這邊的switchRecyclerView是上一篇
  <a href="{{site.baseurl}}/2020/11/20/android-kotlin-custom-view-02/">[Custom View]客製UI心得分享（1）：實作篇</a>
有提到的customer view，忘記的可以看看

接著，我們為了要讓recycler view達到以下效果：

<ol>
  <li>滑到最邊邊的時候，recycler view能離開最旁邊並看起來滑動到最中間</li>
  <li>每個item之間有固定的間隔距離</li>
</ol>

所以我們需要繼承RecyclerView.ItemDecoration()，如下:

<script src="https://gist.github.com/waitzShigoto/3df59c6aec3f5e11f983b8f0ac811cf3.js"></script>

這邊為了達到每個item之間有間隔，

設定了mSpace變數，

用來指定item之間的間隔，

所以只要在 override getItemOffsets之後，

取用裡面的Rect，來設定每個item間格，如：

```
outRect.left = mSpace
```

但因為我們要達到滑到最左或最右拿讓該item看起來滑動到中間，

所以我們定義了一個 sideVisibleWidth 變數，

這個變數的算法是：

```
(螢幕範圍width的pixel - 每個item的pixel)/2 - 預期間隔最左/右邊距離的pixel
```

上面這個算法雖然有點難理解，

但其實只要稍微想過，也是能想通的，

這邊切細一點來說，recycler view 一開始會從螢幕最左邊或最上面起始，

在我這個例子是橫向，所以是最左邊：那思路是這樣的，

我希望我滑到最左/右邊的時候會間隔最左邊一定距離，

並且讓該recycler view的item是在正中間，

所以我需要取得範圍內螢幕width的長度的一半，

又需要讓item只移動一半，所以取得item的長度的一半，所以是 ：

```
螢幕範圍width的pixel/2 - 每個item的pixel/2
```

這個意思也就代表，計算半個螢幕並算滑動半個item的距離，

使得他看起來就會在中間，但是因為我們在最左或最右時，

還需要額外定義的間距，所以必需再去減掉指定的pixel，

所以合併以後會變成最一開始給的算式：

```
(螢幕範圍width的pixel - 每個item的pixel)/2 - 預期間隔最左/右邊距離的pixel
```

所以換成code就是：

```
var sideVisibleWidth =      
//整個螢幕width的pixel  
(context.resources.displayMetrics.widthPixels
//每個item的一半
- ScreenUtil().convertDpToPixel(70F, context).roundToInt()) / 2
//預期間隔多少的pixel
- ScreenUtil().convertDpToPixel(28F, context) .roundToInt()
```

接著，只需要在指定條件下，去指定我們的item間隔即可，如下：

<script src="https://gist.github.com/waitzShigoto/9a7c2bdeb1a7fc034079711d70b64e2a.js"></script>

所以我上面的code，就是在第一個item的時候間隔我的sideVisibleWidth與每個他的右邊間隔mSpace的pixel

到這裡間距的設定就都完成了，再來就是需要進入算出每個移動距離並做出相對應動作的步驟了

接著我們繼承 RecyclerView.OnScrollListener()來計算滑動時的監聽器:

<script src="https://gist.github.com/waitzShigoto/9e98788c170b119d4da62124eb7523f3.js"></script>

這邊說難不難，說簡單也有點花時間，但只要釐清他要做的事情，你就會有股茅塞頓開的感覺，

在這個類裡，我們要記錄我的item目前滑動到的位置，

以及我們每個recycler view item的pixel大小，

因為我們要紀錄目前滑動位置，並且透過計算滑動量去算與每個item的比例，

來算出我們移動了幾個item的位置，所以我們一開始在建構子裡傳入：

```
SwitchRecyclerScrollerListener(private var mPosition: Int, private val itemWith: Int)
```

接著override onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int)，去取得左右橫移時的滑動量，

<script src="https://gist.github.com/waitzShigoto/f9f16c1c8ac7c55e4c32ffc841b07430.js"></script>

我們在onscroll裡面取得dx，他代表左右橫移的滑動量，

他是當你滑動都會觸發一次，所以在滑動期間，紀錄並累加該值，

之後使用onScrollStateChanged，當滑動停止時，

也就是SCROLL_STATE_IDLE，會去算出總移動量並算出移動的比例：

```
val offset = scrolledWidth.toFloat() / itemWith.toFloat()
```

算出的比例就是我移動了幾個item，用這個值去觸發我每移動了要做什麼事，

例如我這邊，就是如果移動的item數不是0，我就設定文字顏色變化，如：

```
if (moveTotalCount != 0) {        
   mPosition += moveTotalCount     
   scrolledWidth -= itemWith * moveTotalCount
   setItemAnim(recyclerView, mPosition)      
}
```

這樣在滑動時，看起來就會是你在滑動時，文字的顏色會轉換的動畫了！

那這邊動畫的code我就不寫出來了，

有興趣的可以去我分享的source code，裡面有詳細的寫法，

當然你也可以依照你的需求，自己去寫！

最後，你只要把你剛剛寫的那些繼承的類，拿出來用，

就可以得到一個左右滑動的recycler view了，這邊是我實際使用時的範例：

<script src="https://gist.github.com/waitzShigoto/13e2e64e8a59b8be7a9c3dcddde81d2e.js"></script>

