// --- Data Configuration ---
// 定義預期會用到的檔案路徑
export const LOCATIONS = {
    fort: {
        id: 'fort', title: '何斌的住家',
        video: 'assets/pano_fort.mp4',
        audio_zh: 'assets/voice_fort_zh.mp3',
        audio_en: 'assets/voice_fort_en.mp3',
        thumb: 'assets/thumb_fort.jpg',
        puzzle: {
            zh: `你依照地圖的指引，來到安平老街的一處老屋。
羅盤微微震動，空氣像是被拉開了一道縫隙。

你看到一名穿著異樣服飾的男子正匆忙地在屋內翻找物品。
他神情緊張，動作急促，
不時望向門口，彷彿在躲避什麼人。

你聽見他低聲咒罵：
「他們不可能放過我……，看來只能趕快投靠國姓爺了……」

你正在思考時，這個人快速的與你擦身而過。你們對望一眼，他沒做過多停留就離開了。`,
            en: `Following the map's guidance, you arrive at an old house on Anping Old Street.
The compass vibrates slightly, as if a rift has opened in the air.

You see a man in strange attire hurriedly rummaging through the house.
He looks nervous, moving frantically, glancing at the door as if evading someone.

You hear him curse under his breath:
"They won't let me go... I must seek refuge with Koxinga at once..."

Lost in thought, the man brushes past you. You lock eyes for a second, but he leaves without hesitation.`,
            answer: "1624",
            successMsg: "文書拼湊完成，歷史的開端是 1624。"
        },
        successStory: {
            zh: `你大概拼湊出發生了什麼事。

這個突然出現在你眼前的男人，叫做 何斌。
他是安平一帶的重要通譯，負責在不同族群之間傳話、協調事情，原本應該是個很難被忽視的人。
但現在，他正在逃。

從屋內散落的書信與告示來看，盯上他的可不是什麼私人糾紛，而是 荷蘭東印度公司(VOC)那個在當時掌控港口、貿易，甚至能左右一個人命運的龐大勢力。
你回想起歷史課本，何斌當時正在幫荷蘭東印度公司，後來好像因為有債務問題所以反目，看起來好像是這件事情。

但奇怪的是，他明明不是這個時代的人，卻真的出現在你眼前，而且正往市鎮外的方向離開。
你心裡浮現一個念頭：如果就這樣放他走，也許你永遠不會知道事情的真相。

於是，你決定跟上去看看。`,
            en: `You roughly piece together what has happened.

The man who appeared suddenly before you is named He Bin.
He was a key interpreter in the Anping area, responsible for communicating and mediating between different groups—someone who would normally be hard to ignore.
But now, he is on the run.

Judging from the scattered letters and notices in the room, it is not a private dispute chasing him, but the Dutch East India Company (VOC)—the massive power that controlled the port, trade, and could even dictate a person's fate at the time.
You recall from history textbooks that He Bin worked for the VOC but later fell out with them, partly over debt issues. It seems this is exactly that event.

But strangely, he clearly does not belong to this era, yet he appeared right in front of your eyes and is heading away from the town.
A thought crosses your mind: If you let him go now, you might never know the truth.

So, you decide to follow him.`
        },
        minigameType: 'dragdrop'
    },
    street: {
        id: 'street', title: '文朱殿刑場',
        video: 'assets/pano_street.mp4',
        audio_zh: 'assets/voice_street_zh.mp3',
        audio_en: 'assets/voice_street_en.mp3',
        thumb: 'assets/thumb_street.jpg',
        themeColor: 0xDAA520,
        puzzle: {
            zh: "依照牆上的順序，依序點擊符號。",
            en: "Click the symbols in the order shown on the wall.",
            answer: "RGB",
            successMsg: "符號正確，獲得代碼：RGB"
        },
        minigameType: 'sequence'
    },
    treehouse: {
        id: 'treehouse', title: '考古埕',
        video: 'assets/pano_treehouse.mp4',
        audio_zh: 'assets/voice_treehouse_zh.mp3',
        audio_en: 'assets/voice_treehouse_en.mp3',
        thumb: 'assets/thumb_treehouse.jpg',
        themeColor: 0x2E8B57,
        puzzle: {
            zh: "調整羅盤，指向真正的北方。",
            en: "Align the compass to true North.",
            answer: "NORTH",
            successMsg: "羅盤歸位，方位確認：NORTH"
        },
        minigameType: 'rotate'
    },
    tait: {
        id: 'tait', title: '義行劍獅',
        video: 'assets/pano_tait.mp4',
        audio_zh: 'assets/voice_tait_zh.mp3',
        audio_en: 'assets/voice_tait_en.mp3',
        thumb: 'assets/thumb_tait.jpg',
        themeColor: 0xE0FFFF,
        puzzle: {
            zh: "調整頻率，監聽市集的對話。",
            en: "Tune the frequency to listen to the market.",
            answer: "95",
            successMsg: "頻率鎖定 95.0，訊息已截獲。"
        },
        minigameType: 'slider'
    },
    sunset: {
        id: 'sunset', title: '市鎮醫院',
        video: 'assets/pano_sunset.mp4',
        audio_zh: 'assets/voice_sunset_zh.mp3',
        audio_en: 'assets/voice_sunset_en.mp3',
        thumb: 'assets/thumb_sunset.jpg',
        themeColor: 0xFF4500,
        puzzle: {
            zh: "清除石碑上的髒污，看見最後的結局。",
            en: "Clean the dirt on the tablet to see the ending.",
            answer: "END",
            successMsg: "結局已現：END"
        },
        minigameType: 'scratch'
    }
};
