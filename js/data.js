// --- Data Configuration ---
// 定義預期會用到的檔案路徑
export const LOCATIONS = {
    fort: {
        id: 'fort', title: '海山館周遭',
        video: 'assets/pano_fort.mp4',
        audio_zh: 'assets/voice_fort_zh.mp3',
        audio_en: 'assets/voice_fort_en.mp3',
        thumb: 'assets/thumb_fort.jpg',
        puzzle: {
            zh: "散落的文書中，必須拼湊出原本的模樣。",
            en: "Piece together the scattered documents.",
            answer: "1624",
            successMsg: "文書拼湊完成，歷史的開端是 1624。"
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
        id: 'sunset', title: '妙壽宮',
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
