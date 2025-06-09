---
layout: post
title: "打造流暢Android App跳轉體驗！Navigation with Kotlin 一篇文章就能搞定你的APP跳轉問題！"
date: 2023-05-15 16:06:16 +0800
image: cover/navigation_with_kotlin-1.png
tags: [Kotlin,Navigation,Android]
permalink: /navigation_with_kotlin
categories: Android教學
excerpt: "「打造流暢Android App跳轉體驗！」使用 Jetpack Navigation with Kotlin，讓您的 APP 跳轉問題不再是問題。透過 Jetpack Navigation with Kotlin 的強大功能，您可以輕鬆管理 APP 中的各個畫面和操作流程，打造出更加順暢和易用的用戶體驗。"
---

## Navigation 簡介
<div class="c-border-content-title-4">
    Navigation 是一個強大的庫

</div>
<p>
    提供了一種簡單的方式來處理 Android 應用程序中不同fragment之間的導航。

    以下圖例

    是在專案中導入navigation

    並設置跳轉的例子

    我們看到當完成一個專案時

    可以一目瞭然整個轉案的跳轉邏輯

</p>

<div class="p-img-container-single">
  <img src="/images/navigation/01.png" alt="navigation">
</div>

## Navigation 導入開發
<div class="c-border-content-title-4">
    將 Navigation 庫添加到項目的 build.gradle 文件中

</div>
<p>
    添加相關library至build.gradle內

    <b>注意：「Navigation」 元件必須使用 Android Studio 3.3 或以上版本</b>
</p>
<img src="/images/navigation/02.png" alt="">

## Navigation 導入開發
<div class="c-border-content-title-4">0. 快速透過IDE建立</div>
<p>
  透過Android Studio

  <b>
    右鍵單擊項目目錄中的 res 文件夾 > New > Android Resource File來新增Navigation xml。
  </b>

  另外如果想純手動加入，也可以在res下建立 navigation folder 裡面新增nav_graph.xml

</p>

<div class="p-img-container">
  <img src="/images/navigation/03.png" alt="navigation_03">
  <img src="/images/navigation/04.png" alt="navigation_04">
</div>

<div class="c-border-content-title-4">1. 建立&lt;fragment&gt; 與 設定startDestination</div>

<div class ="table_container">
  <b>實際folder 結構</b>
</div>
<div class="p-img-container-single">
  <img src="/images/navigation/05.png" alt="navigation_05">
</div>

<p>加入 fragment

  id = 命名 

  name = fragment的path

  label = 標示訊息或類似tag

  tools:layout = 要預覽顯示的layout xml resource
</p>

<p>加入 startDestination

  <b>例如：app:startDestination="@id/landingFragment"</b>

</p>
<div class="p-img-container-single">
  <img src="/images/navigation/06.png" alt="navigation_06">
</div>

<div class="c-border-content-title-4">2. 在Activity的FragmentContainerView加入以下三行</div>
<p>android:name="androidx.navigation.fragment.NavHostFragment"

app:navGraph="@navigation/navigation_main" (選擇性，加了會在IDE預覽)

app:defaultNavHost="true" </p>
<div class="p-img-container-single">
  <img src="/images/navigation/07.png" alt="navigation_07">
</div>

<div class="c-border-content-title-4">3. 加入&lt;action&gt; 並設定目的地</div>
<p>
在fragment內 加入action 

加入後設定destination

如：app:destination="@id/signInFragment" 

(action 寫在外面也可全域跳轉)</p>
<div class="p-img-container-single">
  <img src="/images/navigation/08.png" alt="navigation_08">
</div>

<div class="c-border-content-title-4">4. 程式碼添加跳轉目的地即可跳轉</div>
<p>
  直接在要跳轉的地方加入

  findNavController().navigate(R.id.action_FirstFragment_to_SecondFragment)
</p>

<div class="p-img-container-single">
  <img src="/images/navigation/09.png" alt="navigation_09">
</div>

<div class="c-border-content-title-4">5. 要跳轉Activity則跟上面&lt;fragment&gt;類似，換成&lt;activity&gt;即可</div>

<div class="p-img-container-single">
  <img src="/images/navigation/010.png" alt="navigation_010">
</div>

<div class="c-border-content-title-4">6. 使用多張nav graph，可使用嵌套方式或 include</div>
<p></p>

<p>
  直接再加入一張navigation的方式：
</p>

<div class="p-img-container-single">
  <img src="/images/navigation/011.png" alt="navigation_011">
</div>

<p>
  新增一張 nav graph xml後

  使用include導入的方式：
</p>
<div class="p-img-container-single">
  <img src="/images/navigation/012.png" alt="navigation_012">
</div>

## Navigation 開發案例 - dialog fragment
<div class="c-border-content-title-4">從dialog fragment進入</div>
<p>
  跟上面一樣在nav graph 直接加入 dialog tag

  並導入你做好的DialogFragment就能用

  (id = 命名 , name = fragment的path,  label = 標示訊息或類似tag, tools:layout = 要顯示的layout xml resource)

</p>

<div class="p-img-container-single">
  <img src="/images/navigation/013.png" alt="navigation_013">
</div>

## Navigation 開發案例 - 傳遞變數
<div class="c-border-content-title-4">加入argument</div>
<p>
  一樣在nav graph 直接加入argument

  則可以預設帶入傳遞的變數
  (argType = 變數型態, defaultValue = 預設值 )

</p>

<div class="p-img-container-single">
  <img src="/images/navigation/014.png" alt="navigation_014">
</div>

<div class="c-border-content-title-4">程式碼傳遞變數</div>
a. 不使用上面xml的方式預設值

可以下方兩組程式碼直接傳遞變數

b. 如果是有用xml方式帶入預設值的 

則可以用下面收變數的程式碼直接接收

<script src="https://gist.github.com/waitzShigoto/ba53d799a44b2bf910a805eec4b6aa4e.js"></script>

<div class="c-border-content-title-4">navigation有支援的變數型態</div>
<div class="p-img-container-single">
  <img src="/images/navigation/020.png" alt="navigation_020">
</div>

## Navigation 開發案例 - 動畫

<div class="c-border-content-title-4">支援直接設定跳轉動畫</div>
帶入 enterAnim, exitAnim, popEnterAnim ,popExitAnim 則可以輕鬆預設跳轉動畫
<script src="https://gist.github.com/waitzShigoto/695048f8e71483c8671bacb0a8f71473.js"></script>

<div class="c-border-content-title-4">支援Activity 加上彈出動畫</div>
使用下方code 可以使用navigation內建的activity跳離動畫
<script src="https://gist.github.com/waitzShigoto/4934a5ee1a72f6164912d589ab9d5f8b.js"></script>

## Navigation 開發案例 - 支援 multiple back stacks

<div class="c-border-content-title-4">支援處理多個back stack 的方式</div>
透過 Navigation 提供的api讓相關view關聯 

便可處理多個back stack跳轉問題

例如setupWithNavController 與bottom navigation view關聯 

setupActionBarWithNavController 與action bar關聯 

<script src="https://gist.github.com/waitzShigoto/fe1ee57edeaed321729525d4346014bc.js"></script>

## Navigation 開發案例 - popUpTo 及 popUpToInclusive
<div class="c-border-content-title-4">透過 popUpTo 導向目的地頁面時，移除該頁面stack上的所有頁面</div>
<div class="c-border-content-title-4">透過 popUpToInclusive，把最上層相同的頁面移除</div>

<p>
  此圖，闡述了一般跳轉邏輯

</p>
<div class="p-img-container-single">
  <img src="/images/navigation/015.png" alt="navigation_015">
</div>

<p>
fragment依照順序跳轉 1 -> 2 -> 3 最後再從 3回到1 

且再次跳轉 1 -> 2 -> 3 再回到1 

此時眾fragment 在back stack內 順序為[1,2,3,1,2,3,1] 

<script src="https://gist.github.com/waitzShigoto/78e62e0684ea4f1ae46962bd13c67b1b.js"></script>
若是想要跳轉回1的時候在stack內不再有目的fragment以上的內容可以在xml的action內加入 

popUpTo 與 popUpToInclusive 

這邊便可以讓下次跳轉回目的地fragment 上方有個stack instance給清除掉

</p>

<div class="c-border-content-title-4">若以實際範例來看，加入前</div>

<video style="align-items: center;height: 100vh;" width="70%" controls>
  <source src="/images/navigation/016.mov" type="video/mp4">
</video>

<div class="c-border-content-title-4">若以實際範例來看，加入後</div>

<video style="align-items: center;height: 100vh;" width="70%" controls>
  <source src="/images/navigation/017.mov" type="video/mp4">
</video>

## Navigation 開發案例 - NavOptions 
<div class="c-border-content-title-4">透過 NavOptions 來設置NavController</div>

同樣navigation也提供對應builder讓你設置上面講到過的一些功能，NavOptions範例：

```
val options = NavOptions.Builder()
    .set....
    .build()
```

最後跳轉時帶入
```
findNavController().navigate(R.id.action_FirstFragment_to_SecondFragment,null, options)
```
<div class="c-border-content-title-4">可進行的設置項目有：</div>
<div class="p-img-container-single">
  <img src="/images/navigation/018.png" alt="navigation_018">
</div>

## Navigation 參考資料

<div class = "table_container">
  <a href="https://developer.android.com/guide/navigation?hl=zh-tw">官方文件</a>

  <a href="https://tome.app/kcchen/navigation-with-kotlin-clhh1vxwh02wk9w3ynag6cmat">投影片解說</a>
</div>

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">Navigation Sample code</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">
          <a href="https://github.com/KuanChunChen/NavigationGraphDemo">Github Source code</a>
        </div>
    </div>
</div>
