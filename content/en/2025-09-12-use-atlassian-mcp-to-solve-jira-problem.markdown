---
layout: post
title: 'Using Atlassian MCP to Fetch Jira Issues for Quick Problem Solving'
date: '2025-09-12 18:31:48 +0800'
image: cover/generated/2025-09-12-use-atlassian-mcp-to-solve-jira-problem-cover.svg
tags:
  - AI
  - Mcp
permalink: /use-atlassian-mcp-to-solve-jira-problem
categories: AI
excerpt: >-
  Jira Issue solving challenges during new product development. During the new product development phase, we usually enter a multi-party collaborative testing cycle. Use this MCP to help fetch Jira issues and assist in problem solving.
---

## Preface

* Jira Issue Solving Challenges During New Product Development
  - During the new product development phase, we usually enter a multi-party collaborative testing cycle, such as: testing, product, BOSS, UI, frontend, backend, mobile...etc
  - Continuous iterative adjustments: Repeatedly revising requirements specifications and discovered issues
  - Multi-angle verification: Different roles provide feedback and issues from their professional perspectives
  - Concentrated outbreak period: The number of issues may increase dramatically within specific time periods

* So I later found this MCP
to help fetch Jira issues and assist in problem solving
https://github.com/sooperset/mcp-atlassian


## MCP Configuration
* Add mcp-atlassian to settings (mainly need to input JIRA_USERNAME and JIRA_API_TOKEN)
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


* Since it uses Docker
Use the command
```
docker run -it --rm \
  -e JIRA_URL=http://192.168.40.37:8080 \
  -e JIRA_USERNAME=bot \
  -e JIRA_API_TOKEN=xmtb.2025 \
  ghcr.io/sooperset/mcp-atlassian:latest
```
On Mac, you also need to open the Docker application
<img src="/images/mcp/001.png" alt="mcp">
For Windows, I'm not sure if you just need to use commands (everyone can try it themselves)

* If the username and password above are correct
You will see that MCP is enabled
<img src="/images/mcp/002.png" alt="mcp">

## Experience Sharing
#### Starting Query Reference

* Basic Search
project = ABC AND assignee = "Your assignee"

* Multi-Status Search
status IN ("待处理", "处理中", "重新打开")

* Priority Search
priority = High

* Time Range Search
created >= "2025-01-01"
updated >= -7d

* Combined Search
project = ABC AND assignee = "Your assignee" AND status IN ("待處理", "處理中", "重新打開") AND priority = High

* Usage Example (use the following prompt in the project):
    ```
    Help jira_get_project_issues fetch issues in the `Your` project
    重新打开, 处理中, 待处理 assigned to Your assignee
    project = ABC AND assignee = "Your assignee" AND status IN ("重新打開", "處理中", "待處理")


    Project: project = ABC
    Assignee: assignee = "Your assignee"
    Status: status IN ("待处理", "处理中", "重新打开")
    Priority: priority = High
    Time Range: created >= "2025-01-01"

    After analyzing all Jira issues, organize them into a table including issue number, problem description, corresponding class...etc
    and create a .md file
    ```
#### After creating the markdown, think about how to use this .md

* Through the sharing above, or using similar prompts you think of, generate content like this:
```markdown
### **【Main Features】Related Issues**
| Issue Number | Problem Description | Corresponding Android Class | Related Files |
|--------------|---------------------|----------------------------|---------------|
| ABC-1 | Group name is too long, list group name display is incomplete | `PublishedChatScreen.kt` | `ui/drawer/` |
| ABC-2 | Member login, enter chat history module, no [All] | `ConversationScreen.kt` | `ui/conversation/` |
| ABC-3 | Bot/workflow, cannot receive message push | `ConversationViewModel.kt`<br/>`PushNotificationViewModel.kt` | `ui/conversation/`<br/>`ui/push/` |
| ABC-4 | First-level group "Chat Bot" has second-level groups, but Android displays all on main page | `ConversationViewModel.kt` | `ui/conversation/` |
| ABC-5 | Search box placeholder shows search name, remarks, creator, but actually can only search name | `ConversationScreen.kt` | `ui/conversation/` |
| ABC-6 | After entering new conversation Q&A, AI answers then returns to conversation main page, manual refresh, conversation appears in conversation history, shows red dot | `ConversationViewModel.kt` | `ui/conversation/` |
| ABC-7 | Last character in conversation history not displayed properly | `ConversationScreen.kt` | `ui/conversation/` |
| ABC-8 | Chat history is empty, shows no bots available | `ConversationScreen.kt`<br/>`EmptyState.kt` | `ui/conversation/`<br/>`ui/
```

* Next, we need to verify whether the AI-generated table content matches the actual project architecture. Based on actual experience:
    - `High Accuracy Part`: Issues and problem descriptions fetched through API can usually be correctly matched
    - `Need Verification Part`: Corresponding class name accuracy won't reach 100%
    - `Possible Reasons`: LLM mainly relies on problem descriptions and class naming rules for speculative matching, inevitably having deviations

* Necessity of Manual Review: Manual review is still needed after generation, because there are multiple influencing factors in practical development:
     - Common Influencing Factors:
        - Language Differences: Test descriptions may use Chinese, inconsistent with English naming in code
        - Usage Habits: Test personnel's description terminology may differ from developers' class naming logic
        - Abstraction Level: The abstraction level of problem descriptions may not match actual code structure

* Sharing some of my actual behaviors, AI-assisted tables and manual optimization:
    - `Problem Analysis`
    When starting to handle issues, first check the corresponding table generated by LLM
    Verify whether the class mapping in the table is correct
    - `Experience Judgment`
    `Based on your familiarity with the project`, quickly browse test descriptions
    Based on development experience, preliminarily judge the correct mapping class range
    - `Verification and Correction`
    If AI-generated content is correct → Use directly
    If there are errors → Manually update correct class information to corresponding table
    - `Continuous Optimization Loop`
    In the process of repeatedly handling issues, gradually correct AI-generated tables
    Make table content closer to actual project architecture, improving subsequent development efficiency
    - `Optimize Problem Descriptions`
    Because we know that problem descriptions are initially written through AI, there may be gaps with our actual code,
    Here we can also manually adjust slightly, but if uncertain, we can let AI try first

* Therefore, during your problem-solving process, this table will become more and more accurate. Later, you just need to let AI @xxxx.md this document,
and AI can help you solve problems more precisely

#### Other Optional Things to Do

* I even let AI analyze the current project architecture
Such as: `Please help me analyze the navigation structure of my project architecture`
From experience, AI may not always produce correct results, you can still follow the logic above for correcting tables to gradually correct AI-generated content<br>

* Additionally, `personal feeling`, usually the more traceable the architecture and lower coupling, the higher quality .md AI analyzes. If you encounter older coding practices,
you can first manually or ask AI to roughly organize it, then analyze, which might be better.

#### Actual Usage

* Through this method, let AI automatically solve problems,
```
Based on @Issue_Android_Class_Mapping.md
Understand my project architecture
And understand the problem content and expected results of ABC-2

Based on problem content and expected results, help me solve this problem

```
