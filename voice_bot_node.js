const CorevoTTS = require('node-corevo-tts');
const Discord = require('discord.js');
const { VoiceText } = require('voice-text');
const { writeFileSync } = require('fs');


let conext;
let voice_lists_1 = {
    yui: '000-00-0-001',
    hana: '000-00-0-002',
    aoi: '000-00-0-004',
    himari: '000-00-0-005',
    akemi: '000-00-0-110',
    mayu: '000-00-0-111',
    megumi: '000-00-0-113',
    hazuki: '000-00-0-500',
    airi: '000-00-0-501',
    asahi: '000-00-0-503',
    kumiko: '000-00-0-508',
    sakura: '000-00-0-519',
    saki: '000-00-0-520',
    yua: '000-00-0-522',
    riko: '000-00-0-529',
    emiko: '000-00-0-535',
    tie: '000-00-0-565',
    ren: '000-00-1-001',
    shiniti: '000-00-1-002',
    tatuya: '000-00-1-004',
    sadakazu: '000-00-1-102',
    akihiro: '000-00-1-112',
    taketo: '000-00-1-114',
    kazyhiro: '000-00-1-700',
    tuyosi: '000-00-1-701',
    daisuke: '000-00-1-705',
    shirou: '000-00-1-728',
    kouki: '000-00-1-739',
    takuma: '000-00-1-754',
    keisuke: '000-00-1-762',
    hitosi: '000-00-2-001'
};

let voice_infos_1 = {
    yui: "ゆい（女性）",
    hana: "はな（お婆さん）",
    aoi: "あおい（お姉さん）",
    himari: "ひまり（女児）",
    akemi: "あけみ（ナレーター）",
    mayu: "まゆ（読み聞かせ）",
    megumi: "めぐみ（ナレーター）",
    hazuki: "はづき（落ち着いた女性）",
    airi: "あいり（女の子）",
    asahi: "あさひ（ハスキーな女性）",
    kumiko: "くみこ（中年女性）",
    sakura: "さくら（ハスキーな女性）",
    saki: "さき（落ち着いた女性）",
    yua: "ゆあ（お姉さん）",
    riko: "りこ（女の子）",
    emiko: "えみこ（声の低い女性）",
    tie: "ちえ（早口な女性）",
    ren: "れん（お兄さん）",
    shiniti: "しんいち（男の子）",
    tatuya: "たつや（渋い男性）",
    sadakazu: "さだかず（ニュース）",
    akihiro: "あきひろ（緊迫感）",
    taketo: "たけと（男性標準）",
    kazyhiro: "かずひろ（落ち着いた男性）",
    tuyosi: "つよし（優しいお兄さん）",
    daisuke: "だいすけ（落ち着いた男性）",
    shirou: "しろう（堅い男性）",
    kouki: "こうき（男性）",
    takuma: "たくま（早口な男性）",
    keisuke: "けいすけ（お兄さん）",
    hitosi: "ひとし（中性）"
};
let voice_lists_2 = {
    hikari: 'ひかり（女性）',
    haruka: 'はるか（女性）',
    takeru: 'たける（男性）',
    santa: 'サンタ',
    bear: '凶暴なクマ',
    show: 'ショウ（男性）'
};

let mode_list = {
    1: 'NTT Corevo TTS API',
    2: 'HOYA VoiceText API'
}

let voice_patan_1 = voice_lists_1.yui; //初期時のよみあげ音声
let voice_patan_2 = 'hikari'; //初期時のよみあげ音声

let mode = 1;

const client = new Discord.Client();

const tts = new CorevoTTS({
    apikey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' //NTT CorevoTTS API key
});
const voiceText = new VoiceText('xxxxxxxxxxxxxxxxxx'); //Voice Text API key

client.login('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'); //Discord login token

process.on('uncaughtException', function(err) {
    console.error(err);
    if (client.status != null) {
        client.user.sendMessage(err, { code: true });
    } else {
        console.error("NOT CONNECT");
    }

});

client.on('ready', () => {
    console.log("Bot準備完了");
});

client.on('message', message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    if (message.content === '/join') {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => { // Connection is an instance of VoiceConnection
                    console.log("ボイスチャンネルへ接続しました。");
                    message.channel.sendMessage('ボイスチャンネルへ接続しました。', { code: true });
                    message.reply("\nチャットの読み上げ準備ができました。切断時は/killです。\n/mode で読み上げAPIを変更できます。\n /voiceでよみあげ音声を選択できます。\n 音声が読み上げられない場合は/reconnectを試してみてください。");
                    conext = connection;
                    yomiage({
                        msg: 'ボイスチャンネルへ接続しました。チャットを受信時には自動で読み上げを開始します',
                        cons: connection
                    })
                })
                .catch(err => console.log(err));
        } else {
            message.reply("まずあなたがボイスチャンネルへ接続している必要があります。");
        }
    }

    if (message.content === '/reconnect') {
        if (conext) {
            conext.disconnect();
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join()
                    .then(connection => { // Connection is an instance of VoiceConnection
                        console.log("ボイスチャンネルへ再接続しました。");
                        message.channel.sendMessage('ボイスチャンネルへ再接続しました。', { code: true });
                        conext = connection;
                    })
                    .catch(err => console.log(err));
            } else {
                message.reply("まずあなたがボイスチャンネルへ接続している必要があります。");
            }
        } else {
            message.reply("Botがボイスチャンネルへ接続してません。");
        }
    }
    if (message.content === '/kill') {
        message.channel.sendMessage(':dash:');
        conext.disconnect();
    }

    if (message.content.indexOf('/mode') == 0) {
        let mode_type = message.content.split(' ');
        if (1 < mode_type.length) {
            if (mode_list[mode_type[1]] != null) {
                mode = mode_type[1];
                let mode_to = "読み上げAPIを" + mode_type[1] + " : " + mode_list[mode_type[1]] + "に設定しました。";
                message.reply(mode_to);
                yomiage({
                    msg: mode_to,
                    cons: conext
                })
            } else {
                mode = mode_type[1];
                message.reply("指定された読み上げ音声タイプが不正です。指定可能な音声タイプは/typeで見ることが可能です。");
            }
        } else {
            let mode_names = "\n以下のAPIに切り替え可能です。 指定時の例：/mode 1\n";
            for (indexs in mode_list) {
                mode_names = mode_names + indexs + " -> " + mode_list[indexs] + "\n";
            }
            message.reply(mode_names);
        }

    }

    if (message.content === '/type') {
        let outputs = "\n音声タイプ -> その説明\n";
        if (mode == 1) {
            for (outdata in voice_infos_1) {
                outputs = outputs + outdata + "->" + voice_infos_1[outdata] + "\n";
            }
        } else if (mode == 2) {
            for (outdata in voice_lists_2) {
                outputs = outputs + outdata + "->" + voice_lists_2[outdata] + "\n";
            }
        } else {
            outputs = outputs + "APIが不正です";
        }
        message.reply(outputs);
    }

    if (message.content.indexOf('/voice') == 0) {
        let vo = message.content.split(' ');
        if (mode == 1) {
            if (1 < vo.length) {
                if (voice_lists_1[vo[1]] != null) {
                    voice_patan_1 = voice_lists_1[vo[1]];
                    let mess_to = "読み上げ音声を" + vo[1] + " : " + voice_infos_1[vo[1]] + "に設定しました。";
                    message.reply(mess_to);
                    yomiage({
                        msg: mess_to,
                        cons: conext
                    });
                } else {
                    message.reply("指定された読み上げ音声タイプが不正です。指定可能な音声タイプは/typeで見ることが可能です。");
                }
            } else {
                message.reply("読み上げ音声タイプを指定する必要があります。例：/voice yui 指定可能な音声タイプは/typeで見ることが可能です。");
            }
        } else if (mode == 2) {
            if (1 < vo.length) {
                if (voice_lists_2[vo[1]] != null) {
                    voice_patan_2 = vo[1];
                    let mess_to = "読み上げ音声を" + vo[1] + " : " + voice_lists_2[vo[1]] + "に設定しました。";
                    message.reply(mess_to);
                    yomiage({
                        msg: mess_to,
                        cons: conext
                    });
                } else {
                    message.reply("指定された読み上げ音声タイプが不正です。指定可能な音声タイプは/typeで見ることが可能です。");
                }
            } else {
                message.reply("読み上げ音声タイプを指定する必要があります。例：/voice hikari 指定可能な音声タイプは/typeで見ることが可能です。");
            }
        }
    }

    if (!((message.content.indexOf('!') == 0) || (message.content.indexOf('/') == 0)) && (message.member.id != 381054450451742720) && (message.member.id !== client.user.id)) {
        if (conext) {
            try {
                yomiage({
                    msg: url_delete(message.content),
                    cons: conext
                })
            } catch (err) {
                console.log(err.message);
                message.channel.sendMessage(err.message, { code: true });
            }
        } else {
            console.log("Botがボイスチャンネルへ接続してません。");
        }
    } else {
        console.log("読み上げ対象外のチャットです");
    }

    function url_delete(str) {
        var pat = /(https?:\/\/[\x21-\x7e]+)/g;
        var patan = str.match(pat);
        var return_val = str.replace(patan, " URL省略 ");
        return return_val;
    }

    function yomiage(obj) {
        mode_api(obj).then((buffer) => {
            writeFileSync('voice.wav', buffer);
            obj.cons.playFile("./voice.wav"); //保存されたWAV再生
            console.log(obj.msg + 'の読み上げ完了');
        }).catch((error) => {
            console.log('error ->');
            console.error(error);
            message.channel.sendMessage(error, { code: true });
        });
    }

    function mode_api(obj) {
        let buffer_obj;
        if (mode == 1) {
            buffer_obj = tts.request({
                output: 'file',
                path: "./speech.wav", //チャット内容をTTSにて音声WAVに変換後特定のディレクトリに保存する。
                autoPlay: false,
                SpeakerID: voice_patan_1,
                TextData: obj.msg,
            });
        } else if (mode == 2) {
            buffer_obj = voiceText.fetchBuffer(obj.msg, { format: 'wav', speaker: voice_patan_2 });
        } else {
            throw Error("不明なAPIが選択されています:" + mode);
            console.log("ERRR");
        }
        return buffer_obj;
    }
});