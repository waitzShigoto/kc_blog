---
layout: post
title: '[Android][Kotlin][CodingTest]問題練習記録'
date: '2021-11-11 12:55:12 +0800'
image: cover/android-photo.jpg
tags:
  - Coding
categories: Others
---

実はこの記事は記録したいと思って

以前の面接で聞かれた問題の書き方を

Kotlinを中心に

時間内に書けなかったものも含まれるかもしれません

なので、後でリベンジして書きたいと思います

<h1>問題1</h1>
与えられた文字列に(,),{,},[,]などの記号が含まれている場合、記号が対称であればtrueを返し、そうでなければfalseを返します:

まずは私の解法を示します：

主に文字列の長さの中央値を取得し、文字列を配列に変換します
```
      val strMedium = str.length / 2
      val strArray = str.toCharArray()
```

そして文字列を前後に分割して見ます
二分法に似ています
それぞれの位置に対応する記号があるかどうかを比較します

```
    for (index in 0 until strMedium) {
           val prefixString = strArray[strMedium - index - 1].toString()
           val suffixString = strArray[strMedium + index].toString()

           when (prefixString) {
               "("->{ if (suffixString!=")")return false}
               "{"->{ if (suffixString!="}")return false}
               "["->{ if (suffixString!="]")return false}
           }
       }

```

対称でなければfalseを返します
すべて正しければ
最後にtrueを実行します

<h1>問題2</h1>
与えられた文字列から最も多く繰り返される部分文字列を見つけます、

例えばabcdabcd -> abcdが2回繰り返される 

abababab -> abが4回繰り返される

この問題は長い間考えました

しかし、迅速な解法が思いつきませんでした

なので、暴力法で解決しようと思いました

この考え方は

まず文字列全体を走査して

可能な組み合わせを出します

そして最も多く繰り返される部分文字列を見つけ出します

問題が求めるインデックスや繰り返し回数、または文字列を見つけます（実際に聞かれた結果がどれだったかは少し忘れましたが

しかし、これには2〜3個のループが必要になるかもしれません

そのため、時間計算量はO(n^3)になります

これでは非常に悪い感じがします

なので、後でインターネットで調べてみました

LPSアルゴリズムを使って解決する方法を見つけました

しかし、まだ研究中です

後で私の研究結果と理解を補足します

参考URLを先に置いておきます：
https://www.geeksforgeeks.org/find-given-string-can-represented-substring-iterating-substring-n-times/

