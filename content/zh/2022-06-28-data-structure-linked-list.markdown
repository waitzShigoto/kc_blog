---
layout: post
title: 資料結構複習，Linked List 全攻略！
date: '2022-06-28 11:46:12 +0800'
image: cover/data-structure/cpu-linked-list.jpg
tags:
  - algorithm
  - data structure
categories: Others
excerpt: >-
  學習 Linked List 複習資料結構，包含優勢、缺點，以及 Kotlin 實作方式。完整攻略，助你了解 Linked List 的 Time
  Complexity 和操作方法。
---

## Linked list 特性
Linked List 是由不連續的記憶體位址組成，透過指標（pointer）互相連結元素（elements）的資料結構。

##  Linked list 優點
相較於 Array，Linked List 具有以下優點：

1.Linked List 大小彈性，不需要預先指定大小。

2.插入、刪除元素時的成本較低，只需要改變指標指向即可，不需要整個轉移。

3.不需要連續的記憶體空間，因此更加靈活。

##  Linked list 缺點
相較於 Array，Linked List 具有以下缺點：

1.隨機訪問效率較差，只能從第一個節點開始遍歷。

2.需要為每個節點指標提供額外的記憶體空間。

3.無法直接使用相對位址。因為array為連續位址，所以可以有相對位址，但linked list則沒有

## Linked list 組成
Linked List 中的每個節點包含以下兩個元素：

1.資料（Data）

2.指標（Pointer）<br
<div class="c-border-content-title-4">
   以下是 Kotlin 實現 Linked List 的程式碼
</div>
 <script src="https://gist.github.com/waitzShigoto/ad9e538b06afc720f0785a4471fd6145.js"></script>

<div class="c-border-content-title-4">
   以下是遍歷Traversal Linked List 的程式碼
</div>

<script src="https://gist.github.com/waitzShigoto/4e3fa3e7c237fe1f49a8f960ca4fcb44.js"></script>

<div class="c-border-content-title-4">
  除了上述的程式碼，你也可以使用 Kotlin 的 Data Class 實現 Linked List：
</div>
<script src="https://gist.github.com/waitzShigoto/9e2f8f142eaa6aab94864dcf7cb638b3.js"></script>

<div class="c-border-content-title-4">
  Linked List Complexity
</div>

<table class="rwd-table">
    <tr>
      <th>Time Complexity</th>
      <th>Worst Case</th>
      <th>Average Case</th>
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
