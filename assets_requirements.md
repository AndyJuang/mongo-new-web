# 安平記憶地圖：素材準備清單

為了讓遊戲體驗完整，請準備以下素材檔案。建議建立一個 `assets` 資料夾來存放這些檔案。

## 1. 360 度全景影片 (Panoramic Videos)
這些影片將投影在 3D 球體上，作為每個關卡的主場景。
*格式建議*：MP4, H.264 編碼, 建議解析度 4K (3840x2160) 以獲得較佳畫質。

| 建議檔名 (Filename) | 對應地點 (Location) | 說明 (Note) |
| :--- | :--- | :--- |
| `pano_fort.mp4` | 海山館周遭 (fort) | 充滿歷史感的紅磚牆或建築內部 |
| `pano_street.mp4` | 文朱殿刑場 (street) | 廟宇前方或街道視角 |
| `pano_treehouse.mp4` | 考古埕 (treehouse) | 樹屋交錯的景觀 |
| `pano_tait.mp4` | 義行劍獅 (tait) | 帶有劍獅元素的建築或牆面 |
| `pano_sunset.mp4` | 妙壽宮 (sunset) | 夕陽下的廟宇或運河景觀 |

## 2. 語音導覽音檔 (Audio Guides)
每個地點的雙語解說音檔。
*格式建議*：MP3 或 AAC。

| 中文音檔 (ZH) | 英文音檔 (EN) | 對應地點 | 內容建議 |
| :--- | :--- | :--- | :--- |
| `voice_fort_zh.mp3` | `voice_fort_en.mp3` | 海山館周遭 | 介紹荷蘭時期的歷史背景 |
| `voice_street_zh.mp3` | `voice_street_en.mp3` | 文朱殿刑場 | 講述關於審判或廟宇的故事 |
| `voice_treehouse_zh.mp3` | `voice_treehouse_en.mp3` | 考古埕 | 描述自然與人文共生的景象 |
| `voice_tait_zh.mp3` | `voice_tait_en.mp3` | 義行劍獅 | 解釋劍獅的由來與象徵 |
| `voice_sunset_zh.mp3` | `voice_sunset_en.mp3` | 妙壽宮 | 總結旅程，關於傳承與記憶 |

## 3. 介面與小遊戲圖片 (UI & Mini-game Images)
用於小遊戲互動或地圖選單的圖片。

| 建議檔名 | 用途 | 說明 |
| :--- | :--- | :--- |
| `compass_bg.png` | 羅盤小遊戲 | 羅盤的底圖 (目前使用網路素材) |
| `scratch_cover.jpg` | 刮刮樂小遊戲 | 刮刮樂還沒刮開前的圖案 (例如寫著「刮開看結局」) |
| `thumb_fort.jpg` | 地圖選單 | 海山館的預覽縮圖 (彩色或黑白皆可，程式會處理濾鏡) |
| `thumb_street.jpg` | 地圖選單 | 文朱殿的預覽縮圖 |
| `thumb_treehouse.jpg` | 地圖選單 | 考古埕的預覽縮圖 |
| `thumb_tait.jpg` | 地圖選單 | 劍獅的預覽縮圖 |
| `thumb_sunset.jpg` | 地圖選單 | 妙壽宮的預覽縮圖 |

## 4. 背景音樂 (Background Music) - 選用
如果希望整個網頁有背景氛圍。

| 建議檔名 | 用途 | 說明 |
| :--- | :--- | :--- |
| `bg_ambience.mp3` | 全局背景音 | 建議使用風聲、海浪聲或輕柔的歷史感配樂 |

---

### 如何套用？
準備好檔案後，請將它們放入專案資料夾中 (例如開一個 `assets` 資料夾)，然後我們需要修改 `index.html` 中的程式碼路徑。

**範例修改：**
```javascript
const LOCATIONS = {
    fort: {
        // ...
        video: 'assets/pano_fort.mp4',
        audio_zh: 'assets/voice_fort_zh.mp3',
        // ...
    }
}
```
