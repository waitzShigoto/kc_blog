---
layout: post
title: "流暢なAndroidアプリの遷移体験を実現！KotlinでNavigationを使って、アプリの遷移問題を一気に解決！"
date: 2023-05-15 16:06:16 +0800
image: cover/navigation_with_kotlin-1.png
tags: [Kotlin,Navigation,Android]
permalink: /navigation_with_kotlin
categories: Android教學
excerpt: "「流暢なAndroidアプリの遷移体験を実現！」Jetpack Navigation with Kotlinを使用して、アプリの遷移問題を解決します。Jetpack Navigation with Kotlinの強力な機能を活用することで、アプリ内の各画面や操作フローを簡単に管理し、よりスムーズで使いやすいユーザー体験を提供します。"
---

## Navigation の紹介
<div class="c-border-content-title-4">
    Navigation は強力なライブラリです

</div>
<p>
    Androidアプリケーション内の異なるフラグメント間のナビゲーションを簡単に処理する方法を提供します。

    以下の例は

    プロジェクトにnavigationを導入し

    遷移を設定する例です

    プロジェクトが完了したときに

    全体の遷移ロジックが一目でわかります

</p>

<div class="p-img-container-single">
  <img src="/images/navigation/01.png" alt="navigation">
</div>

## Navigation の導入開発
<div class="c-border-content-title-4">
    Navigation ライブラリをプロジェクトの build.gradle ファイルに追加します

</div>
<p>
    関連するライブラリをbuild.gradleに追加します

    <b>注意：「Navigation」コンポーネントはAndroid Studio 3.3以上のバージョンが必要です</b>
</p>
<img src="/images/navigation/02.png" alt="">

## Navigation の導入開発
<div class="c-border-content-title-4">0. IDEを使って素早く作成</div>
<p>
  Android Studioを使用して

  <b>
    プロジェクトディレクトリ内のresフォルダを右クリック > New > Android Resource FileでNavigation xmlを新規作成します。
  </b>

  また、手動で追加したい場合は、resフォルダ内にnavigationフォルダを作成し、その中にnav_graph.xmlを新規作成します

</p>

<div class="p-img-container">
  <img src="/images/navigation/03.png" alt="navigation_03">
  <img src="/images/navigation/04.png" alt="navigation_04">
</div>

<div class="c-border-content-title-4">1. &lt;fragment&gt; の作成とstartDestinationの設定</div>

<div class ="table_container">
  <b>実際のフォルダ構造</b>
</div>
<div class="p-img-container-single">
  <img src="/images/navigation/05.png" alt="navigation_05">
</div>

<p>フラグメントを追加

  id = 名前を指定 

  name = フラグメントのパス

  label = メッセージやタグのようなもの

  tools:layout = プレビュー表示するレイアウトのxmlリソース
</p>

<p>startDestinationを追加

  <b>例：app:startDestination="@id/landingFragment"</b>

</p>
<div class="p-img-container-single">
  <img src="/images/navigation/06.png" alt="navigation_06">
</div>

<div class="c-border-content-title-4">2. ActivityのFragmentContainerViewに以下の3行を追加</div>
<p>android:name="androidx.navigation.fragment.NavHostFragment"

app:navGraph="@navigation/navigation_main"（オプション、追加するとIDEでプレビュー可能）

app:defaultNavHost="true" </p>
<div class="p-img-container-single">
  <img src="/images/navigation/07.png" alt="navigation_07">
</div>

<div class="c-border-content-title-4">3. &lt;action&gt;を追加し、目的地を設定</div>
<p>
fragment内にactionを追加

追加後、destinationを設定

例：app:destination="@id/signInFragment" 

（actionを外に書くと全域での遷移も可能）</p>
<div class="p-img-container-single">
  <img src="/images/navigation/08.png" alt="navigation_08">
</div>

<div class="c-border-content-title-4">4. コードに目的地への遷移を追加</div>
<p>
  遷移したい場所に直接以下を追加

  findNavController().navigate(R.id.action_FirstFragment_to_SecondFragment)
</p>

<div class="p-img-container-single">
  <img src="/images/navigation/09.png" alt="navigation_09">
</div>

<div class="c-border-content-title-4">5. Activityへの遷移は上記の&lt;fragment&gt;と同様に、&lt;activity&gt;に変更</div>

<div class="p-img-container-single">
  <img src="/images/navigation/010.png" alt="navigation_010">
</div>

<div class="c-border-content-title-4">6. 複数のnav graphを使用する場合、ネストまたはincludeを使用</div>
<p></p>

<p>
  直接新しいnavigationを追加する方法：
</p>

<div class="p-img-container-single">
  <img src="/images/navigation/011.png" alt="navigation_011">
</div>

<p>
  新しいnav graph xmlを追加後

  includeを使用して導入する方法：
</p>
<div class="p-img-container-single">
  <img src="/images/navigation/012.png" alt="navigation_012">
</div>

## Navigation 開発事例 - dialog fragment
<div class="c-border-content-title-4">dialog fragmentからの遷移</div>
<p>
  上記と同様にnav graphに直接dialogタグを追加

  作成したDialogFragmentを導入すれば使用可能

  （id = 名前, name = fragmentのパス, label = 表示メッセージまたはタグ, tools:layout = 表示するlayout xmlリソース）

</p>

<div class="p-img-container-single">
  <img src="/images/navigation/013.png" alt="navigation_013">
</div>

## Navigation 開発事例 - 変数の受け渡し
<div class="c-border-content-title-4">argumentを追加</div>
<p>
  同様にnav graphに直接argumentを追加

  これにより、渡す変数をデフォルトで設定可能
  （argType = 変数の型, defaultValue = デフォルト値）

</p>

<div class="p-img-container-single">
  <img src="/images/navigation/014.png" alt="navigation_014">
</div>

<div class="c-border-content-title-4">コードで変数を渡す</div>
a. 上記のxml方式を使用せずにデフォルト値を設定する場合

以下の2つのコードで直接変数を渡すことができます

b. xml方式でデフォルト値を設定している場合

以下のコードで変数を直接受け取ることができます

<script src="https://gist.github.com/waitzShigoto/ba53d799a44b2bf910a805eec4b6aa4e.js"></script>

<div class="c-border-content-title-4">navigationがサポートする変数の型</div>
<div class="p-img-container-single">
  <img src="/images/navigation/020.png" alt="navigation_020">
</div>

## Navigation 開発事例 - アニメーション

<div class="c-border-content-title-4">直接設定できる遷移アニメーションのサポート</div>
enterAnim, exitAnim, popEnterAnim, popExitAnimを設定することで、簡単に遷移アニメーションをデフォルト設定できます
<script src="https://gist.github.com/waitzShigoto/695048f8e71483c8671bacb0a8f71473.js"></script>

<div class="c-border-content-title-4">Activityにポップアップアニメーションを追加するサポート</div>
以下のコードを使用すると、navigation内蔵のactivity離脱アニメーションを使用できます
<script src="https://gist.github.com/waitzShigoto/4934a5ee1a72f6164912d589ab9d5f8b.js"></script>

## Navigation 開発事例 - multiple back stacksのサポート

<div class="c-border-content-title-4">複数のback stackを処理する方法のサポート</div>
Navigationが提供するAPIを使用して関連するビューを関連付けることで

複数のback stackの遷移問題を処理できます

例えば、setupWithNavControllerとbottom navigation viewを関連付ける

setupActionBarWithNavControllerとaction barを関連付ける

<script src="https://gist.github.com/waitzShigoto/fe1ee57edeaed321729525d4346014bc.js"></script>

## Navigation 開発事例 - popUpToおよびpopUpToInclusive
<div class="c-border-content-title-4">popUpToを使用して目的地ページに遷移する際、そのページのstack上のすべてのページを削除する</div>
<div class="c-border-content-title-4">popUpToInclusiveを使用して、最上層の同じページを削除する</div>

<p>
  この図は、一般的な遷移ロジックを説明しています

</p>
<div class="p-img-container-single">
  <img src="/images/navigation/015.png" alt="navigation_015">
</div>

<p>
フラグメントは順番に遷移します 1 -> 2 -> 3 最後に3から1に戻ります 

そして再び 1 -> 2 -> 3 に遷移して1に戻ります 

この時、back stack内のフラグメントの順序は[1,2,3,1,2,3,1]です 

<script src="https://gist.github.com/waitzShigoto/78e62e0684ea4f1ae46962bd13c67b1b.js"></script>
目的のフラグメント以上の内容がstack内に残らないようにするには、xmlのaction内に

popUpToおよびpopUpToInclusiveを追加します

これにより、次回目的地のフラグメントに遷移する際に、その上のstackインスタンスがクリアされます

</p>

<div class="c-border-content-title-4">実際の例を見てみると、追加前</div>

<video style="align-items: center;height: 100vh;" width="70%" controls>
  <source src="/images/navigation/016.mov" type="video/mp4">
</video>

<div class="c-border-content-title-4">実際の例を見てみると、追加後</div>

<video style="align-items: center;height: 100vh;" width="70%" controls>
  <source src="/images/navigation/017.mov" type="video/mp4">
</video>

## Navigation 開発事例 - NavOptions 
<div class="c-border-content-title-4">NavOptions を使って NavController を設定する</div>

同様に、navigation も対応するビルダーを提供しており、上記の機能を設定できます。NavOptions の例：

```
val options = NavOptions.Builder()
    .set....
    .build()
```

最後に遷移時に渡す
```
findNavController().navigate(R.id.action_FirstFragment_to_SecondFragment,null, options)
```
<div class="c-border-content-title-4">設定可能な項目は以下の通りです：</div>
<div class="p-img-container-single">
  <img src="/images/navigation/018.png" alt="navigation_018">
</div>

## Navigation 参考資料

<div class = "table_container">
  <a href="https://developer.android.com/guide/navigation?hl=zh-tw">公式ドキュメント</a>

  <a href="https://tome.app/kcchen/navigation-with-kotlin-clhh1vxwh02wk9w3ynag6cmat">スライド解説</a>
</div>

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">Navigation Sample code</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">
          <a href="https://github.com/waitzShigoto/NavigationGraphDemo">Github Source code</a>
        </div>
    </div>
</div>
