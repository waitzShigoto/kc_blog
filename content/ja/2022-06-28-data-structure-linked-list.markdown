---
layout: post
title: "資料構造復習、Linked List 全攻略！"
date: 2022-06-28 11:46:12 +0800
image: cover/data-structure/cpu-linked-list.jpg
tags: [data structure, algorithm]
categories: 其他筆記
excerpt: "Linked List を学び、資料構造を復習します。利点、欠点、Kotlin の実装方法を含む完全攻略。Linked List の時間計算量と操作方法を理解するのに役立ちます。"

---

## Linked list の特性
Linked List は不連続のメモリアドレスで構成され、ポインタ（pointer）を通じて要素（elements）を相互にリンクするデータ構造です。

##  Linked list の利点
Array と比較して、Linked List には以下の利点があります：

1.Linked List はサイズが柔軟で、事前にサイズを指定する必要がありません。

2.要素の挿入や削除のコストが低く、ポインタの指向を変更するだけで済み、全体を移動する必要がありません。

3.連続したメモリ空間を必要としないため、より柔軟です。

##  Linked list の欠点
Array と比較して、Linked List には以下の欠点があります：

1.ランダムアクセスの効率が悪く、最初のノードから順に走査する必要があります。

2.各ノードのポインタに追加のメモリ空間が必要です。

3.相対アドレスを直接使用できません。Array は連続アドレスのため相対アドレスが使用できますが、Linked List では使用できません。

## Linked list の構成
Linked List の各ノードは以下の2つの要素を含みます：

1.データ（Data）

2.ポインタ（Pointer）

<div class="c-border-content-title-4">
   以下は Kotlin で Linked List を実装するコードです
</div>
 <script src="https://gist.github.com/waitzShigoto/ad9e538b06afc720f0785a4471fd6145.js"></script>

<div class="c-border-content-title-4">
   以下は Linked List を走査するコードです
</div>

<script src="https://gist.github.com/waitzShigoto/4e3fa3e7c237fe1f49a8f960ca4fcb44.js"></script>

<div class="c-border-content-title-4">
  上記のコードに加えて、Kotlin の Data Class を使用して Linked List を実装することもできます：
</div>
<script src="https://gist.github.com/waitzShigoto/9e2f8f142eaa6aab94864dcf7cb638b3.js"></script>

<div class="c-border-content-title-4">
  Linked List の複雑度
</div>

<table class="rwd-table">
    <tr>
      <th>時間計算量</th>
      <th>最悪の場合</th>
      <th>平均の場合</th>
    </tr>
    <tr>
      <td>Search</td>
      <td>O(n)</td>
      <td>O(n)</td>
    </tr>
    <tr>
      <td>Insert</td>
      <td>O(1)</td>
      <td>O(1)</td>
    </tr>
    <tr>
      <td>Deletion</td>
      <td>O(1)</td>
      <td>O(1)</td>
    </tr>
  </table>
