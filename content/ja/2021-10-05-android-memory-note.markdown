---
layout: post
title: '[Android][Memory]記憶体最適化+GC管理関連概念の共有'
date: '2021-10-05 17:42:21 +0800'
image: cover/ea-website-android-memory.png
tags:
  - Android
  - Kotlin
categories: AndroidDev
---

今日のこの投稿

メモを書く方法を通じて

私が理解しているAndroidのメモリ管理について記録しようと思います

ここでは同じメモに継続的に更新する予定です

もしもっとAndroidのメモリ管理知識を読んだら

それを一つの投稿に集中させたいと思います

<h2>Android Memory Note</h2>

heap：

Android仮想マシンはheap内のメモリ割り当てを継続的に追跡します

heapはシステムが割り当てたjava/kotlinオブジェクトを格納するためのメモリ領域です

garbage collection(gc):

 その目的は以下を達成するためです：

* 使用されていないオブジェクトを探す
* これらのオブジェクトが使用しているメモリを回収し、heapに返す

マルチタスク環境では

Androidは各heapのサイズを制限します

このサイズはAndroidデバイスの利用可能なRAMの量に基づいて決定されます

さらに

heap容量がいっぱいになると

システムがまだメモリを割り当てようとすると

OutOfMemoryErrorが発生する可能性があります

<h2>Frequent Garbage Collection</h2>

以前、海外の記事でGCをmemory churnとも呼んでいました

言い換えれば

GCは通常、短時間でメモリが必要なときに発生します

heap空間が不足しているため

アプリにheapを割り当てる必要があると同時に

heap空間を解放して不足を補う必要があります

したがって、頻繁にGCが発生するとメモリ関連の問題が発生する可能性があります

例を挙げると：

同時に

アプリが大量のメモリ空間をオブジェクトの作成に割り当てる必要がある場合

しかしheap空間が不足しているため

GCがトリガーされてheap空間を回収します

しかし、この繰り返しの過程で

アプリがフリーズすることがあります

この時点では通常、oomは表示されません

しかし、フリーズやクラッシュが発生し

ユーザー体験が悪化します

コード付きの例を挙げると：

<script src="https://gist.github.com/waitzShigoto/5654e03a5aa77334bf536c298fe0df88.js"></script>

これは一般的なRecyclerViewの実装アダプタです

その中のbind()は新しいデータが生成されるときのロジックを実現するためのものです

```
val demoBitmap = BitmapFactory.decodeResource(itemView.context.resources, R.drawable.bg_demo_photo)
```
このbind()内には固定の画像をitemに読み込むコードがあります

ここに置くと

bindされるたびにitemが再度bitmap画像を読み込むことになります

少量の画像や小規模なプロジェクトでは違いを感じないかもしれませんが

大量に繰り返し読み込む場合や

itemが100個、1000個ある場合

それぞれが繰り返し読み込むと

heap容量の消費が非常に大きくなります

したがって、最も簡単な方法は固定のものを一度だけ読み込むように変更することです

<script src="https://gist.github.com/waitzShigoto/baac7167d917ce9633f7d9346b3244ed.js"></script>

または、サードパーティのライブラリを使用して画像をキャッシュに保存し

読み込み回数を減らすこともできます

もちろん、キャッシュを使用するとOOMが発生する可能性もあるため

特定の条件下でキャッシュをクリアする必要があります

プロジェクトで遭遇する問題に応じて最適化できます

<h2>Android Memory Leak</h2>

gcが解放できないオブジェクトの参照漏れ

それはどこかでこの参照がまだ必要だと考えているためです

このような状況は通常、メモリリークと呼ばれます

Inner Classes : 内部クラスと外部クラスが参照を持つと、メモリリークが発生する可能性があります

例：
<script src="https://gist.github.com/waitzShigoto/f7cf2cefdda47552aef1ea21ac0f1e37.js"></script>
上記のコードのように

内部クラスが外部のshowResultを参照しているため

AsyncTaskがバックグラウンドで実行されると

activityが終了しても

AsyncTaskがまだ実行されている可能性があり

そのためメモリリークが発生する可能性があります

問題を解決するためのアプローチ

外部クラスのメソッド呼び出しを削除する

または他の方法で外部クラスにアクセスする

例えば弱参照を使用する

<script src="https://gist.github.com/waitzShigoto/14c2eb371a77d2a2425180dd865a2ebe.js"></script>

弱参照を使用しても外部クラスにアクセスできます

しかし、強参照のように強力ではないため、メモリ内に持続的に保持されることはありません

ガベージコレクタがオブジェクトの強参照を見つけられない場合、それを探してnullに設定します

匿名クラス: 一部の匿名クラスは外部クラスよりも長く生存することがあります

これがメモリリークを引き起こします

静的変数: companion objectやstaticを使用してクラスを修飾すると

オブジェクトが最初からロードされ

その後解放されない

これがメモリリークを引き起こします

例えば static activity
