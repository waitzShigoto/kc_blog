---
layout: post
title: 用Cursor IDE 來輔助開發code
date: '2025-03-23 09:29:10 +0800'
image: cover/cursor-ide-cover.svg
tags:
  - cursor
permalink: /cursor-ai-note
categories: AI
excerpt: 什麼是 Cursor？
---

## 實際效果
* 透過IDE 中整合的AI聊天，實現完全`不用自己寫code`就能開發app
<img src="/images/cursor/001.gif" alt="flutter">

* 也可以只`針對片段`去跟AI聊聊，在`編輯器游標處`直接透過`cmd+k`即可使用。
<img src="/images/cursor/002.png" alt="flutter">

#### 目錄
* [特色](#feature)
* [使用步驟](#usage-steps)
* [成果](#results)
* [使用技巧](#tips)
* [Cursor IDE 個人配置分享](#personal-config)
* [心得](#thoughts)
* [好用的網站推薦](#useful-sites)

<a id="feature"></a>
## Cursor 特色
* Cursor 是基於vscode來製作的一個`IDE`
  - 內建AI聊天功能，可以請AI來開發程式並且`直接幫你修改檔案`
  - `聊天時，能指定檔案，給AI當Reference`，使得產出結果更精準
  <img src="/images/cursor/003.png" alt="flutter">

* Cursor 支持配置常見的LLM
   - 可以用自己熟悉的AI來開發

<img src="/images/cursor/004.png" alt="flutter">

   - 也可以用自己的API Key

<img src="/images/cursor/005.png" alt="flutter">

* `Cursor Tab`：當coding時IDE會根據你的code去提示你，類似其他IDE的Tab補全或建議。
    - `免費用戶` ：2000 條建議上限，無需付費。
    - `專業版和商業版用戶`：付費後，可獲得無限的Cursor Tab建議。
* `Cursor Composer`：可以直接在IDE內幫你寫程式碼並直接修改檔案，實現了`真正`用prompt就能寫code。
* `CmdK`：可以讓你直接在IDE edit code頁面中直接使用AI修改code，在游標處直接快捷鍵`cmd+k`即可使用
  <img src="/images/cursor/006.png" alt="flutter">

* `.cursorrules`：可以對AI設置一個`基本rule`，使得AI開發時會更精確、減少錯誤發生。
    - 可以在`根目錄`創一個`.cursorrules`檔，裡面配置相關prompt
    - 或者直接在`setting > General > Rule for AI` 中 設置全域rule
* `.cursorignore`：可以針對AI設置`忽略文件`。
* 聊天過程中，可以輸入`@`來帶入相關的Reference
  <img src="/images/cursor/007.png" alt="flutter">

<a id="usage-steps"></a>
## 使用步驟
* 先到官網`下載並安裝`cursor：https://www.cursor.com/
* open project
    - 點 open project 並開啟專案

      <img src="/images/cursor/008.png" alt="flutter">

* 點擊右上角<img src="/images/cursor/009.png" alt="flutter">
展開聊天視窗
  或可以用快捷鍵`CTRL / CMD + l`

  <img src="/images/cursor/010.png" alt="flutter">

* Cursor的特色是可以指定讓AI參考的檔案，點擊`+ Add context`即可選擇檔案

  <img src="/images/cursor/011.png" alt="flutter">

  <img src="/images/cursor/012.png" alt="flutter">

* 或者可以直接在對話框輸入`@codebase`，這樣cursor 就會把你整個codebase拿來當參考。

  <img src="/images/cursor/013.png" alt="flutter">

* 其他就跟一般常見AI Chat類似，切llm model、上傳圖片...等等

  <img src="/images/cursor/014.png" alt="flutter">

* 輸入你想要請AI幫忙的內容
    - 例如：大家常用的把圖片塞進AI加上prompt，請AI幫忙產

      <img src="/images/cursor/015.png" alt="flutter">

* 接著就是類似merge code的流程，去review他改的內容
    - 可以在聊天視窗中，直接點accept 或是 reject

      <img src="/images/cursor/016.png" alt="flutter">

    - 或是直接進到檔案去點

      <img src="/images/cursor/017.png" alt="flutter">

<a id="results"></a>
## 成果
* 用`claude-3.5.sonnet`產出的結果，還滿接近UI出的圖的
    - 後續要做的只需要根據`UI/UX設定的細節`去調整各元件的間距、大小、顏色、圖片資源、review code耦合度...即可

      <img src="/images/cursor/018.png" alt="flutter">

* 或是有新的string，這時候就先請AI幫你產出，後續再去細調，也滿方便的。

  <img src="/images/cursor/019.png" alt="flutter">

<a id="tips"></a>
## 使用技巧
#### 妥善利用`.cursorrules` 跟`.cursorignore`
* 設置`.cursorrules`
    - (Global) 在setting > General 中的 Rules for AI 可以設定cursor rule
      <img src="/images/cursor/020.png" alt="flutter">

    - (Only this project) 或者另一種方式 在專案下建立`.cursorrules`
      <img src="/images/cursor/021.png" alt="flutter">

    - Project rule （專案內特定規則）：Setting > Project Rule > +Add new rule > 直接輸入檔名後按下enter，會在專案底下`../.cursor/xxx.mdc`建立.mdc檔
      <img src="/images/cursor/022.png" alt="flutter">

* 設置`.cursorignore`
    - [文件](https://docs.cursor.com/context/ignore-files)
    - 在`根目錄`創建`.cursorignore`檔案，然後加入想忽略的檔案/資料夾

      <img src="/images/cursor/023.png" alt="flutter">

    - 規則類似.gitignore，設置後當cursorAI在`索引 （或掃描）`時`不會`把指定檔案放進去
        - 可優化掃描不需要的文件所浪費的時間
        - 也可以加入些敏感資料、檔案，避免敏感資訊外洩、或被上傳到AI provider的server.
        - 不過這邊官方也有提到目前是盡最大努力去達成忽略索引

          <img src="/images/cursor/024.png" alt="flutter">

          最大努力做到以下

          <img src="/images/cursor/025.png" alt="flutter">

    - 其基於.gitignore，若已經存在`.gitignore`會以其為基礎
    - 如果不知道位置在哪的話，可以透過IDE中`Cursor Setting > Feature > Codebase indexing > Ignore file > Configure ignored files`來找到

      <img src="/images/cursor/026.png" alt="flutter">

* `.cursorindexingignore`
    - 這個檔案會自動繼承.gitignore相關內容
        - 因為我們知道cursor會indexing相關codebase去參考，這個檔案的概念主要是讓你把一些大型檔案，或是開發用不到的二元檔案加入到此來排除，藉此提升整體chat效能。

          <img src="/images/cursor/027.png" alt="flutter">

    - 另外他也有預設一些不必要的檔案，不過內容過長，有需要再到[文件](https://docs.cursor.com/context/ignore-files)去看

      <img src="/images/cursor/028.png" alt="flutter">

* `.cursorignore` & `.cursorrules` 設定可從git下載參考
  http://192.168.201.72:8080/admin/repos/CursorConfig,general

#### AI Chat
* 若輸入太多東西，AI負荷不了，建議可以把內容切小、範圍縮小、把prompt寫的更明確。
* 在Cursor聊天視窗中，可以輸入`@`去把某些類型的內容，設定給AI當作Reference
    - 例如：`@Doc`，可以把一些文件加進來參考，像是有一些第三方API，就可以直接丟過來給他參考(@Doc目前只支援新增 URL 類型的文檔)

      <img src="/images/cursor/029.png" alt="flutter">

      <img src="/images/cursor/030.png" alt="flutter">

* 善用`git`：可以多多保存files change，因為cursor會直接幫你修改檔案，要是你accpet之後，若發現不符合你的需求，還能revert回前面的點。（`適合整筆`）
* 善用`Chat聊天室` 裡面的`restore`：可以恢復當前的對話修改結果。（`適合當次`）

  <img src="/images/cursor/031.png" alt="flutter">

#### Setting
* 在`Cursor setting > General > Private mode` 下拉式選單可以開啟 隱私模式

  <img src="/images/cursor/032.png" alt="flutter">

* 若有相關想讓Cursor參考的MCP Server 也可在`Cursor setting > feature > MCP Server`中添加

  <img src="/images/cursor/033.png" alt="flutter">

* `Cursor setting > feature > Docs` 可以添加對應的document，讓他變成AI聊天中預設的參考項目

  <img src="/images/cursor/034.png" alt="flutter">

#### Git

* Cursor IDE中有提供一個叫`source control`的git gui，可以直接透過點擊進行git操作

  <img src="/images/cursor/035.png" alt="flutter">

    - 其中在commit message欄位`最右邊`，有提供`generate commit message`的功能，他會根據你目前git graph中的commit message來產生

      <img src="/images/cursor/036.png" alt="flutter">

    - 不過目前實測產生不出我們專案預設的模板，且已在本地端git加入default的fotmat。
      `預期`：<img src="/images/cursor/037.png" alt="flutter">

      `實際`：<img src="/images/cursor/038.png" alt="flutter">

* 另一種方式是可以在`Chat`當中透過`@Commit generate commit message` 來產生指定格式，這個實測可以產生我們預設的模板

  <img src="/images/cursor/039.png" alt="flutter">

<a id="personal-config"></a>
## Cursor IDE 個人配置分享
* 把IDE左側改成`直行`
    - 快捷鍵`CTRL/CMD + Shift + P`， 打開Command功能
    - 輸入`Setting.json`，點擊`Preferences: Open User Settings (JSON)`

      <img src="/images/cursor/040.png" alt="flutter">

    - Json檔案中加入 key `workbench.activityBar.orientation` value `vertical`，並重啟Cursor

* `.cursorrules`
    - 根據個專案的需求去加入，這邊分享我常用的
      ```
      - Don't make assumptions. 
      - Don't silently fix errors
      - Use my existing theme for colors,typography and spacing. 
      - Ask questions when uncertain about my code or design. 
      - Provide a list of tasks for accomplishing an implementation.
      - always include a :) at the end of your response
      ```
      (這邊的 `include a :)` 是用來確認目前`.cursorrules`是否生效的做法)
    - 搭配網路上的:[cursoer字典](https://cursor.directory/)  來產生
* 安裝插件
    - cursor目前是基於vscode，本身沒有預設kotlin相關資源，若想要讓kotlin在cursor中能被辨認出來，
      可以去下載插件 (不過這不影響AI發揮，他只是讓IDE中能夠判別.kt檔案)
    - 找到`MARKPLACE`或`EXTENSION`，接著去搜尋就有
    - 根據自己需求安裝其他插件，例如：git、java...等

      <img src="/images/cursor/041.png" alt="flutter">

<a id="thoughts"></a>
## 心得
* Cursor IDE整合了多個功能，使得透過AI開發的流程更加簡化，像是AI提示內容直接套用在現有project內
    - 不過可惜的是他是`基於vscode`去延伸出來的IDE，所以沒有Android Studio中的Android相關功能
    - 看一下國外的大佬，變成用cursor產code，AS去build code、debug，如：[I Made an Android App in MINUTES with This AI Tool](https://www.youtube.com/watch?v=FbCA_qQSvYM)
* 今天假設`不是開發Android`，而換成一個專案是你第一次接觸的語言，`理論上`就能更快的知道要擺放檔案的位置，可以更快入門。或者`非相關工作者，也能快速學會開發`。
* 用AI產生，固然很方便，還是建議要了解他為什麼這樣寫，這樣你才能判斷是不是要接受他這樣幫你寫。
* [價格](https://www.cursor.com/cn/pricing)：有免費的次數能用，可以先試用看符不符合自己開發習慣，再決定是否購入。

  <img src="/images/cursor/042.png" alt="flutter">

* 我免費到期，發現`cursor composer`被鎖了，原本的AI模型也無法用了XD，
  ，不過他有提供一個完全免費的`chat` （只有chat可用），把模型設定成`cursor-small`，還是可以當免費仔。

  <img src="/images/cursor/043.png" alt="flutter">

<a id="useful-sites"></a>
## 好用的網站推薦
* [cursor使用文檔](https://cursor.document.top/tips/usage/basic-setting/)
* [cursoer字典](https://cursor.directory/) ：可查一些`.coursorrule`配置
* [cursoer list](https://cursorlist.com/) ：可查一些`.coursorrule`配置
* [cursor maker](https://cursorrules.agnt.one/chat)：透過Web 上的AI Chat幫你產生`.coursorrule`配置
* [Generate Cursor Project Rules](https://cursor.directory/generate)：透過Web 上的AI Chat幫你產生`.mdc`配置
* [網友整理cursor rule](https://github.com/PatrickJS/awesome-cursorrules)
