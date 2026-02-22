# MiriArt Mobile App - Sitemap (ASCII Format)

> AI-based Art/Design Work Evaluation & Mentoring Mobile App

---

## 1. App Flow (ASCII Diagram)

```
+------------------+
|     SPLASH       |
|   (2sec logo)    |
+--------+---------+
         |
         v
+--------+--------+------------------+
|  Onboarding     |  Login/Signup   |
|  (3 slides)     |  (token valid?)  |
+--------+--------+--------+---------+
         |                 |
    Skip | Complete        | token OK
         v                 v
+--------+--------+        +------------------+
|  Signup         |        |      HOME        |
|  -> First       |        |  (skip to D1)     |
|  Upload Tutorial|        +------------------+
+--------+--------+
         |
         v
+------------------+
|      HOME        |  <-- Bottom Tab (D1, L0)
|  - Hero CTA      |
|  - Recent List   |
|  - Quick FAB     |
+--------+---------+
         |
    +----+----+----+----+
    |    |    |    |    |
    v    v    v    v    v
+----+ +----+ +----+ +----+
|Home| |Arch| |Chat| |Prof|
+----+ +----+ +----+ +----+
```

---

## 2. Depth/Layer Matrix (ASCII Table)

```
+-------+-------+------------------+---------------------------+
| Depth | Layer | Screen Type      | Examples                  |
+-------+-------+------------------+---------------------------+
|  -1   |   -   | Pre-Auth         | Splash, Onboarding        |
|   1   |   0   | Bottom Tab       | Home, Archive, AI Chat    |
|   2   |   1   | Full Page Modal  | Upload Flow, Result Detail|
|   2   |   3   | Full Screen      | Chat Room                 |
|   3   |   2   | Bottom Sheet     | Grade Input, Subscription |
+-------+-------+------------------+---------------------------+
```

---

## 3. Navigation Flow (ASCII Tree)

```
Pre-Auth (L-1)
|
+-- Splash --> [Onboarding | Login-Signup]
|
+-- Onboarding --> [Skip: Login | Complete: Signup]
|
+-- Signup --> First Upload Tutorial --> Home
|
+-- Login --> Home

Auth (L0, Bottom Tabs)
|
+-- Home (D1)
|   +-- FAB / Recent Click --> Upload Flow --> Result Detail
|
+-- Archive (D1)
|   +-- Card Click --> Result Detail
|
+-- AI Chat (D1)
|   +-- Session Card --> Chat Room (D2)
|   +-- New Chat FAB --> Upload Flow
|
+-- Profile (D1)
    +-- Click --> Grade Input | Subscription (D3)

Chat Room (D2, L3)
|
+-- Hamburger --> Side GNB State 1 (80%)
+-- Analysis Thumb --> Result Detail
+-- Exit --> AI Chat | Result Detail

Side GNB (Overlay)
|
+-- State 1 (80%) <--> State 2 (100%)
+-- State 1 --> [Chat Room | State 2]
+-- State 2 --> AI Chat Tab Root
```

---

## 4. Screen Entry/Exit Matrix (ASCII)

```
+------------------+------------------------+------------------------+
| Screen           | ENTRY                  | EXIT                   |
+------------------+------------------------+------------------------+
| Splash           | App launch             | Onboarding / Login     |
+------------------+------------------------+------------------------+
| Home             | Login, Signup done     | Upload, Result Detail  |
+------------------+------------------------+------------------------+
| AI Chat          | GNB tab, Side GNB S2   | Chat Room, Upload      |
+------------------+------------------------+------------------------+
| Chat Room        | Session Card, AI CTA   | AI Chat, Result, GNB   |
+------------------+------------------------+------------------------+
| Upload Flow      | FAB, New Chat          | Result, Prev Step      |
+------------------+------------------------+------------------------+
| Result Detail    | Upload done, Archive   | Chat Room, Home        |
+------------------+------------------------+------------------------+
| Side GNB S1      | Chat Room hamburger   | Chat Room, S2          |
+------------------+------------------------+------------------------+
| Side GNB S2      | S1 full drag, GNB     | AI Chat Tab            |
+------------------+------------------------+------------------------+
```

---

## 5. Upload Flow Steps (ASCII)

```
+------+------------------+------------------------------------------+
| Step | Screen           | Content                                 |
+------+------------------+------------------------------------------+
|  1   | Full Page        | Image Picker (gallery/camera)            |
+------+------------------+------------------------------------------+
|  2   | Full Page        | Problem Text (500ch), Toggle             |
+------+------------------+------------------------------------------+
|  3   | Bottom Sheet     | Credit Confirm [OK] [Cancel]             |
+------+------------------+------------------------------------------+
|  4   | Full Page        | Lottie 8s -> Result Detail               |
+------+------------------+------------------------------------------+

Back: Step2->1 (keep data) | Step3 Cancel -> Step2
```

---

## 6. Chat Room Layout (ASCII Wireframe)

```
+--------------------------------------------------+
| [=]  Session Title                    [Thumb]    |  <- Header
+--------------------------------------------------+
| +----------------------------------------------+ |
| | Sticky Context Card (Max 120px / Min 44px)   | |
| | [Grade] [Score] [fixScope] [Radar]           | |
| +----------------------------------------------+ |
|                                                  |
|  [AI] Type A: Text Bubble                        |
|  [AI] Type B: Checklist | Gallery | Ref Link     |
|  [AI] Type C: Quick Reply Chips                  |
|       ...                                        |
|  [User] Type A: Text Bubble                      |
|       [Typing Indicator ...]                     |
|                                                  |
+--------------------------------------------------+
| [Ask][Plan][Critic][Inference]  [img][Send]     |  <- Interaction Bar
+--------------------------------------------------+
```

---

## 7. Side GNB States (ASCII)

```
State 1 (80% width)          State 2 (100% width)
+-------------------+        +---------------------------+
| [+ New Chat]      |        | Search | Filter           |
|-------------------|        |---------------------------|
| Recent History    |        | Full Session List         |
| [thumb][AI title] |        | ...                       |
| Filter: A/B/C     |        | [+ New Chat] FAB          |
| [Domain chips]    |        +---------------------------+
+-------------------+        | [Home][Arch][Chat][Prof]  |  <- GNB visible
     GNB: hidden             +---------------------------+

Snap: Spring(1, 100), Threshold 40%
Gesture: Left margin 20px
```

---

## 8. Bottom Tab Structure (ASCII)

```
+----------------------------------------------------------+
|                                                          |
|                    (Main Content Area)                    |
|                                                          |
+----------------------------------------------------------+
|  [Home]  [Archive]  [AI Chat]  [Profile]                 |  <- GNB (Layer 0)
+----------------------------------------------------------+
         ^
         |
    Thumb Zone (Bottom-Heavy)
```

---

## 9. Message Bubble Types (ASCII)

```
Type A (Text)          Type B (Widget)           Type C (Chips)
+----------------+     +----------------+        +------------------+
| AI/User text   |     | [Checklist]    |        | [Q1] [Q2] [Q3]   |
| content here   |     | [Gallery]      |        | Quick Reply      |
+----------------+     | [Ref Link]     |        +------------------+
                      +----------------+

User: right align     AI: left align
```

---

## 10. Design Tokens (ASCII Summary)

```
Typography:
  H1: 32px Extrabold/Semibold  (Onboarding, Title)
  H2: 22px Bold/Medium        (Section)
  H3: 18px Medium/Regular     (Card title)
  Body: 14px Medium/Light     (Chat message)

Color:
  Primary: #C2F970 (Lime)
  Surface Glass: rgba(255,255,255,0.7) + blur(20px)
  Critical: Red | Safe: Blue

Layout:
  Radius: Large 24px | Medium 12px
  Shadow: Y4 Blur12 Opacity 10%
  Grid: 4-col default | 5-col Archive
```

---

## Document Metadata

| Item   | Value   |
|--------|---------|
| Version| 1.0     |
| Source | .md v1.4|
| Format | ASCII   |
