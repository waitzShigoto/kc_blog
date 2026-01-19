---
title: "LeetCode 509. Fibonacci Number"
date: "2025-10-08 15:53:06"
author: "WaitZ"
categories: ["Math"]
tags: ["leetcode", "fibonacci-number", "easy", "math"]
difficulty: "Easy"
leetcodeId: 509
problemTitle: "Fibonacci Number"
timeComplexity: "O(2ⁿ),O(n)"
spaceComplexity: "O(1)"
problemUrl: "https://leetcode.com/problems/fibonacci-number/"
relatedProblems: []
locale: "ja"
image: cover/generated/2025-10-08-509-fibonacci-number-cover.svg
---

## 問題情報

**問題番号**: 509  
**タイトル**: Fibonacci Number  
**難易度**: Easy  
**カテゴリー**: Math  
**問題リンク**: [https://leetcode.com/problems/fibonacci-number/](https://leetcode.com/problems/fibonacci-number/)

## 問題説明

フィボナッチ数列は、一般的に F(n) で表され、各数が前の2つの数の合計である数列を形成します。0 と 1 から始まります。つまり、

F(0) = 0, F(1) = 1<br>
F(n) = F(n - 1) + F(n - 2)、n > 1 の場合。<br>
n が与えられたとき、F(n) を計算してください。

### 例

**入力**：`n = 2`  
**出力**：`1`  
**説明**：`F(0) = 0, F(1) = 1`、
`F(n) = F(n - 1) + F(n - 2)、n > 1 の場合。`


## 解法アプローチ

### 核心的な考え方

再帰の概念を使用してこの問題を解決します。

### ステップバイステップ

1. 処理すべき基本ケースまたはエッジケースを覚えておく。
2. フィボナッチ数列の概念を使用して、最初の数と2番目の数を足すと3番目の数になる。
3. 結果を返す

## 実装

### 言語: Kotlin

```kotlin
class Solution {
    fun fib(n: Int): Int {
        if(n == 0 ) return 0
        if(n == 1 ) return 1

        return fib(n - 1) + fib (n - 2)

    }
}
```

## 計算量分析

**時間計算量**: O(2ⁿ)

このバージョンの解法は再帰コードを使用しているため、次のようになります：

```
fib(n)
 ├─ fib(n - 1)
 │   ├─ fib(n - 2)
 │   │   ├─ fib(n - 3)
 │   │   └─ fib(n - 4)
 │   └─ fib(n - 3)
 └─ fib(n - 2)
     ├─ fib(n - 3)
     └─ fib(n - 4)
```

`fib(n)` の各呼び出しは2つの再帰呼び出しを行います：
1つは `fib(n - 1)` に、もう1つは `fib(n - 2)` に。
そのため、呼び出し構造は二分木のようになります：

多くの部分問題（`fib(n - 2)`、`fib(n - 3)` など）が複数回計算されます。

呼び出しの総数は n が増えるたびにほぼ倍増するため、
時間計算量は指数関数的に増加します — O(2ⁿ)。

**空間計算量**: O(n)

再帰の深さ。

### 最適化アイデア

**より良い解法はありますか？時間または空間計算量をどのように改善できますか？**


このアプローチでは、**ループベースの方法**を使用して問題を解決します。  
`fib(0)` と `fib(1)` が `0` と `1` であることがわかっているので、`n <= 1` の場合は単純に `n` を返すことができます。

`n > 1` の場合、前の2つのフィボナッチ数を格納するために、2つの変数 `a` と `b` を宣言します。  
最初は、`a = 0` と `b = 1` で、これはフィボナッチ数列の最初と2番目の数を表します。

次に、`2..n`（つまり `fib(2)` から `fib(n)` まで）の `for` ループを使用します。  
ループ内で、`temp = a + b` を計算し、次の反復のために `a` と `b` を更新します：  
`a = b` を設定し、`b = temp` を設定します。  
ループが終了すると、`b` は `fib(n)` の値を保持します。

```kotlin
class Solution {
    fun fib(n: Int): Int {
        
        if(n <= 1 ) return n

        var a = 0 
        var b = 1 

        for (i in 2..n) {
            val temp =  a + b
            a = b
            b = temp
        }
        return b 
    }
}
```
