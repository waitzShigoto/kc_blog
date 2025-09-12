---
layout: post
title: '透過atlassian mcp 抓取jira issue 來快速解決問題'
date: '2025-09-12 18:31:48 +0800'
image: cover/default-cover.jpg
tags:
  - AI
  - MCP
permalink: /use-atlassian-mcp-to-solve-jira-problem
categories: AI
excerpt: >-
  新產品開發期間的 Jira Issue 解題挑戰，在新產品開發階段，通常會進入多方協作的測試週期，透過這個mcp來協助抓取jira issue 然後協助解題
---

## 前言

* 新產品開發期間的 Jira Issue 解題挑戰
  - 在新產品開發階段，通常會進入多方協作的測試週期，如：測試、產品、BOSS、UI、前端、後端、移動端...等
  - 持續迭代調整：針對需求規格和發現的問題進行反覆修正
  - 多角度驗證：不同角色從各自專業角度提出回饋和問題
  - 集中爆發期：特定時間段內 issue 數量可能會急劇增加

* 所以後來找到這個mcp
來協助抓取jira issue 然後協助解題
https://github.com/sooperset/mcp-atlassian


## mcp 配置
* 設定中加入 mcp-atlassian  (主要是要輸入 JIRA_USERNAME 跟 JIRA_API_TOKEN的部分）
```json
{
    "mcpServers": {
        "mcp-atlassian": {
            "command": "docker",
            "args": [
            "run", "-i", "--rm",
            "-e", "JIRA_URL", "-e", "JIRA_USERNAME", "-e", "JIRA_API_TOKEN",
            "ghcr.io/sooperset/mcp-atlassian:latest"
            ],
            "env": {
            "JIRA_URL": "http://your-jira_url/",
            "JIRA_USERNAME": "Your user name",
            "JIRA_API_TOKEN": "Your token or password"
            }
        }
    }
}
```


* 其中因為他是使用到docker
使用指令
```
docker run -it --rm \
  -e JIRA_URL=http://192.168.40.37:8080 \
  -e JIRA_USERNAME=bot \
  -e JIRA_API_TOKEN=xmtb.2025 \
  ghcr.io/sooperset/mcp-atlassian:latest
```
在mac的話還需要打開docker應用
<img src="/images/mcp/001.png" alt="mcp">
windows不確定是不是只要指令打開(大家再自己試一下)

* 接著上面帳號密碼打對的話
就會看到mcp已啟用
<img src="/images/mcp/002.png" alt="mcp">

## 心得分享
#### 起始詞條參考

* 基本搜索
project = ABC AND assignee = "Your assignee"

* 多狀態搜索
status IN ("待處理", "處理中", "重新打開")

* 優先級搜索
priority = High

* 時間範圍搜索
created >= "2025-01-01"
updated >= -7d

* 組合搜索
project = ABC AND assignee = "Your assignee" AND status IN ("待處理", "處理中", "重新打開") AND priority = High

* 使用例子  (在專案下使用下面prompt)：
    ```
    幫忙jira_get_project_issues 抓取 這個專案的
    重新打开, 处理中, 待处理由  Your assignee 負責的issue
    project = ABC AND assignee = "Your assignee" AND status IN ("重新打開", "處理中", "待處理")

    項目: project = ABC
    負責人: assignee = "Your assignee"
    狀態: status IN ("待處理", "處理中", "重新打開")
    優先級: priority = High
    時間範圍: created >= "2025-01-01"

    分析所有jira issue後整理成table 其中包含issue編號、問題描述、對應class...等 
    並且製成 .md檔
    ```
#### 建立成markdown後，稍微思考一下要怎麼用這份.md

* 透過上面分享的、或者用自己想的類似的prompt產生出類似這樣的內容：
```markdown
### **【主要功能】相關Issue**
| Issue編號 | 問題描述 | 對應Android類 | 相關文件 |
|-----------|----------|---------------|----------|
| ABC-1 | 分組名稱較長，列表分組名稱顯示不全 | `PublishedChatScreen.kt` | `ui/drawer/` |
| ABC-2 | 成員登錄，進入聊天歷史模塊，沒有[全部] | `ConversationScreen.kt` | `ui/conversation/` |
| ABC-3 | 機器人/工作流，都收不到消息推送 | `ConversationViewModel.kt`<br/>`PushNotificationViewModel.kt` | `ui/conversation/`<br/>`ui/push/` |
| ABC-4 | 一級分組"聊天機器人"下有二級分組，但安卓都顯示在主頁面 | `ConversationViewModel.kt` | `ui/conversation/` |
| ABC-5 | 搜索框placeholder顯示搜索名稱、備註、創建者，實際只能搜索名稱 | `ConversationScreen.kt` | `ui/conversation/` |
| ABC-6 | 進入新會話問答後，AI回答後才返回會話主頁，手動刷新，會話出現在會話歷史中，顯示紅點 | `ConversationViewModel.kt` | `ui/conversation/` |
| ABC-7 | 會話歷史最後一個字符沒有正常顯示 | `ConversationScreen.kt` | `ui/conversation/` |
| ABC-8 | 聊天歷史為空，顯示暫無機器人 | `ConversationScreen.kt`<br/>`EmptyState.kt` | `ui/conversation/`<br/>`ui/
```

* 接下來需要驗證 AI 生成的表格內容是否與專案實際架構相符。根據實際經驗：
    - `高準確度部分`：透過 API 抓取的 issue 和 問題描述 通常能正確對應
    - `需要驗證部分`：對應的 class 名稱準確率不會達到 100%
    - `可能原因`：LLM 主要依據問題描述和 class 命名規則進行推測性對應，難免存在偏差

* 人工審查的必要，生成結果後仍需進行人工審查，因為實務開發中存在多種影響因素：
     - 常見影響因素：
        - 語言差異：測試描述可能使用中文，與程式碼的英文命名不一致
        - 用語習慣：測試人員的描述用語與開發者的 class 命名邏輯可能存在差異
        - 抽象層級：問題描述的抽象程度與實際程式碼結構可能不匹配

* 分享我的一些實際行為，AI輔助表格以及人工優化：
    - `問題分析`
    開始處理 issue 時，先檢查 LLM 生成的對應表格
    驗證表格中的 class 映射是否正確
    - `經驗判斷`
    `基於你對專案的熟悉程度`，快速瀏覽測試描述
    憑藉開發經驗，初步判斷正確的映射 class 範圍
    - `驗證與修正`
    如果 AI 生成的內容正確 → 直接採用
    如果存在錯誤 → 手動將正確的 class 資訊更新到對應表格中
    - `持續優化循環`
    在反覆處理 issue 的過程中，逐步修正 AI 生成的表格
    讓表格內容越來越接近專案的實際架構，提升後續開發效率
    - `優化問題描述`
    因為我們知道，問題描述是透過AI初步先撰寫，實際跟我們code可能有落差，
    這邊也可以手動稍微調整，但如果不確定也能先讓ai跑跑看 

* 因此在你解題過程中，這表格會愈來愈準確，後續只要讓AI @xxxx.md 這份文檔，
就可以讓AI更精準地幫你解題

#### 其他可以選擇性做的事

* 甚至我也會讓AI分析下目前專案的架構
如：`請幫我分析我的專案架構的導航結構`
經驗上，AI也不見得會產生正確，一樣可以依照上面修正table的邏輯來慢慢修正ai產生的內容<br>

* 另外，`個人感覺`，通常架構愈有跡可循、耦合度低，AI分析出來的.md品質會比較高，如果剛好遇到比較老舊的寫法，
可以先人工或請AI大概整理一下後，再分析，可能會比較好。

#### 實際使用

* 透過這種方式，讓AI自動去解題，
```
根據 @Issue_Android_Class_Mapping.md 
了解我專案的架構
並且了解ABC-2的問題內容、預期結果

根據 問題內容、預期結果 幫我解決該問題

```


