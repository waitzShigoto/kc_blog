---
layout: post
title: "[Android][Kotlin][CodingTest]刷題練習紀錄"
date: 2021-11-11 12:55:12 +0800
image: cover/android-photo.jpg
tags: [Coding]
categories: 其他筆記
---

其實這篇文章是想紀錄

之前面試被問到的題目的寫法

以kotlin為主

可能包含時間內沒寫出來

所以想雪恥之後再寫的

<h1>題目1</h1>
給定一個字串，內包含(,),{,},[,]等符號，如果符號有對稱到則返回true,反之false:

首先上我的解法：

主要是先取字串長度 中位數 並 轉 將字串換成array
```
      val strMedium = str.length / 2
      val strArray = str.toCharArray()
```

並將字串分成前後片段來看
類似二分法
分別比較對應的位置是否有對應的符號

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

沒有返回false
如果都正確
則執行最後一行true

<h1>題目2</h1>
給定一字串找出重複最多次的子字串，

如abcdabcd ->abcd 重複2次 

abababab ->ab重複4次

這題我想很久

不過我想不到快速的解法

所以就想說用暴力法破解

這個思路就是

先遍歷整個字串

塞出可能的組合

再把重複最多次的那個子字串抓出來

找出題目要的index或重複次數還是字串 （我有點忘記實際被問的是哪個結果

不過這樣可能就要用到2~3個迴圈

這樣時間複雜度就要O(n^3)了

這樣感覺很爛

所以我後來上網查

找到有人用LPS演算法去解

但我還在研究

之後會補上

我研究過後的解說跟理解

先放個參考網址：
https://www.geeksforgeeks.org/find-given-string-can-represented-substring-iterating-substring-n-times/
