---
layout: post
title: "[Android][Kotlin][CodingTest] Practice Record"
date: 2021-11-11 12:55:12 +0800
image: cover/android-photo.jpg
tags: [Coding]
categories: 其他筆記
---

Actually, this article is intended to record

the solutions to questions I was asked in previous interviews

mainly using Kotlin

including those I couldn't solve within the time limit

so I want to redeem myself by solving them later

<h1>Question 1</h1>
Given a string containing symbols like (,),{,},[,] etc., return true if the symbols are balanced, otherwise false:

First, here is my solution:

The main idea is to first get the median length of the string and convert the string into an array
```
      val strMedium = str.length / 2
      val strArray = str.toCharArray()
```

Then divide the string into front and back segments
similar to binary search
compare the corresponding positions to see if they have matching symbols

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

If not, return false
If all are correct,
execute the last line to return true

<h1>Question 2</h1>
Given a string, find the substring that repeats the most times,

e.g., abcdabcd -> abcd repeats 2 times 

abababab -> ab repeats 4 times

I thought about this question for a long time

but I couldn't come up with a quick solution

so I decided to use the brute force method

The idea is

to first traverse the entire string

and generate possible combinations

Then extract the substring that repeats the most

find the index, the number of repetitions, or the substring required by the question (I kind of forgot the exact result asked

but this might require 2~3 loops

which makes the time complexity O(n^3)

This feels very inefficient

so I later searched online

and found someone using the LPS algorithm to solve it

but I'm still studying it

I will add my explanation and understanding after I finish studying

Here is a reference link:
https://www.geeksforgeeks.org/find-given-string-can-represented-substring-iterating-substring-n-times/

