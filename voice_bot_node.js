const Discord = require('discord.js');
const {VoiceText} = require('voice-text');
const {Readable} = require('stream');
const conf = require('config-reloadable');
const client = new Discord.Client();

let config = conf();
let voice_lists_1 = {
    hikari: 'ひかり（女性）',
    haruka: 'はるか（女性）',
    takeru: 'たける（男性）',
    santa: 'サンタ',
    bear: '凶暴なクマ',
    show: 'ショウ（男性）'
};
let mode_list = {
    1: 'HOYA VoiceText API'
};
let conext;
let discordToken = null;
let voiceTextApiKey = null;
let prefix = "/";
let autoRestart = true;
let readMe = false;
let apiType = 1;
let voiceType = "haruka";
let blackList;
let channelHistory;

function readConfig() {
    discordToken = config.get('Api.discordToken');
    voiceTextApiKey = config.get('Api.voiceTextApiKey');
    prefix = config.get('Prefix');
    autoRestart = config.get('AutoRestart');
    if (typeof autoRestart !== 'boolean') throw new Error("Require a boolean type.");
    readMe = config.get('ReadMe');
    if (typeof readMe !== 'boolean') throw new Error("Require a boolean type.");
    apiType = config.get('Defalut.apiType');
    if (!mode_list[apiType]) throw new Error("Unknown api.");
    voiceType = config.get('Defalut.voiceType');
    if (!voice_lists_1[voiceType]) throw new Error("Unknown voice.");
    blackList = config.get('BlackLists');
    return true;
}

function autoRestartFunc() {
    console.log("再接続処理開始");
    discordLogin();
    console.log("5秒後にボイスチャンネルへの接続を試行");
    setTimeout(() => {
        if (channelHistory && voiceChanelJoin(channelHistory)) console.log("ボイスチャンネルへ再接続成功");
    }, 5000);
}

function voiceChanelJoin(chanelId) {
    channelHistory = chanelId;
    chanelId.join()
        .then(connection => { // Connection is an instance of VoiceConnection
            conext = connection;
        })
        .catch(err => {
            console.log(err)
            return false
        });
    return true
}

function onErrorListen(error) {
    if (conext && conext.status !== 4) conext.disconnect();
    client.destroy();
    console.error(error.name);
    console.error(error.message);
    console.error(error.code);
    console.error(error);
    if (client.status != null) {
        client.user.send(error, {code: true});
    } else {
        console.error("NOT CONNECT");
        if (autoRestart) autoRestartFunc();
    }
}

function discordLogin() {
    client.login(discordToken); //Discord login token
    console.log("DiscordBotログイン処理を実行")
}

readConfig();
let voice_patan_1 = voiceType; //初期時のよみあげ音声
let mode = apiType;
const voiceText = new VoiceText(voiceTextApiKey); //Voice Text API key

discordLogin();

process.on('uncaughtException', onErrorListen);

process.on('unhandledRejection', onErrorListen);

client.on('ready', () => {
    console.log("Bot準備完了");
});

client.on('message', message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    if (message.content === prefix + 'join') {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            if (conext && conext.status !== 4) conext.disconnect();
            if (voiceChanelJoin(message.member.voice.channel)) {
                console.log("ボイスチャンネルへ接続しました。");
                message.channel.send('ボイスチャンネルへ接続しました。', {code: true});
                message.reply("\nチャットの読み上げ準備ができました。切断時は" + prefix + "killです。\n" +
                    prefix + "mode で読み上げAPIを変更できます。\n " + prefix +
                    "voiceでよみあげ音声を選択できます。\n 音声が読み上げられない場合は" + prefix + "reconnectを試してみてください。");
            }
        } else {
            message.reply("まずあなたがボイスチャンネルへ接続している必要があります。");
        }
    }

    if (message.content === prefix + 'reconnect') {
        if (conext && conext.status !== 4) {
            conext.disconnect();
            if (message.member.voice.channel) {
                if (voiceChanelJoin(message.member.voice.channel)) {
                    console.log("ボイスチャンネルへ再接続しました。");
                    message.channel.send('ボイスチャンネルへ再接続しました。', {code: true});
                }
            } else {
                message.reply("まずあなたがボイスチャンネルへ接続している必要があります。");
            }
        } else {
            message.reply("Botはボイスチャンネルに接続していないようです。");
        }
    }

    if (message.content === prefix + 'kill') {
        if (conext && conext.status !== 4) {
            conext.disconnect();
            message.channel.send(':dash:');
        } else {
            message.reply('Botはボイスチャンネルに接続していないようです。');
        }
    }

    if (message.content.indexOf(prefix + 'mode') === 0) {
        let mode_type = message.content.split(' ');
        if (1 < mode_type.length) {
            if (mode_list[mode_type[1]] != null) {
                mode = Number(mode_type[1]);
                let mode_to = "読み上げAPIを" + mode_type[1] + " : " + mode_list[mode_type[1]] + "に設定しました。";
                message.reply(mode_to);
                yomiage({
                    msg: mode_to,
                    cons: conext
                })
            } else {
                mode = Number(mode_type[1]);
                message.reply("指定されたAPIが不正です。指定可能なAPIは" + prefix + "modeで見ることが可能です。");
            }
        } else {
            let mode_names = "\n以下のAPIに切り替え可能です。 指定時の例：" + prefix + "mode 1\n";
            for (indexs in mode_list) {
                mode_names = mode_names + indexs + " -> " + mode_list[indexs] + "\n";
            }
            message.reply(mode_names);
        }

    }

    if (message.content === prefix + 'type') {
        let outputs = "\n音声タイプ -> その説明\n";
        if (mode === 1) {
            for (outdata in voice_lists_1) {
                outputs = outputs + outdata + "->" + voice_lists_1[outdata] + "\n";
            }
        } else {
            outputs = outputs + "APIが不正です";
        }
        message.reply(outputs);
    }

    if (message.content.indexOf(prefix + 'voice') === 0) {
        let vo = message.content.split(' ');
        if (mode === 1) {
            if (1 < vo.length) {
                if (voice_lists_1[vo[1]] != null) {
                    voice_patan_1 = vo[1];
                    let mess_to = "読み上げ音声を" + vo[1] + " : " + voice_lists_1[vo[1]] + "に設定しました。";
                    message.reply(mess_to);
                    yomiage({
                        msg: mess_to,
                        cons: conext
                    });
                } else {
                    message.reply("指定された読み上げ音声タイプが不正です。指定可能な音声タイプは" + prefix + "typeで見ることが可能です。");
                }
            } else {
                message.reply("読み上げ音声タイプを指定する必要があります。例：" + prefix + "voice hikari 指定可能な音声タイプは" + prefix + "typeで見ることが可能です。");
            }
        }
    }

    if (message.content === prefix + 'reload') {
        config = conf.reloadConfigs();
        if (readConfig()) message.channel.send("コンフィグを再読み込みしました。");
    }

    if (!(isBlackListsFromID(message.member.id) || isBlackListsFromPrefixes(message.content)) && isRead(message.member.id)) {
        try {
            yomiage({
                msg: mention_replace(emoji_delete(url_delete(message.content + "。"))),
                cons: conext
            })
        } catch (err) {
            console.log(err.message);
            message.channel.send(err.message, {code: true});
        }
    } else {
        console.log("読み上げ対象外のチャットです");
    }

    function isBlackListsFromPrefixes(cont) {
        let prefixes = blackList.get("prefixes");
        return prefixes.find(prefix => {
            return cont.indexOf(prefix) === 0;
        });
    }

    function isBlackListsFromID(menId) {
        let memberIds = blackList.get("memberIds");
        return memberIds.find(id => {
            return menId === id;
        });
    }

    function isRead(id) {
        return readMe === false ? id !== client.user.id : readMe;
    }

    function url_delete(str) {
        let pat = /(https?:\/\/[\x21-\x7e]+)/g;
        return str.replace(pat, " URL省略。");
    }

    function emoji_delete(str) {
        let pat = /(<:\w*:\d*>)/g;
        return str.replace(pat, "");
    }

    function mention_replace(str) {
        let pat = /<@!(\d*)>/g;
        let [match_val] = str.matchAll(pat);
        if (match_val === undefined) return str;
        return str.replace(pat, client.users.resolve(match_val[1]).username);
    }

    function yomiage(obj) {
        if (obj.cons && obj.cons.status === 0 && (message.guild.id === conext.channel.guild.id)) {
            mode_api(obj).then((buffer) => {
                obj.cons.play(bufferToStream(buffer)); //保存されたWAV再生
                console.log(obj.msg + 'の読み上げ完了');
            }).catch((error) => {
                console.log('error ->');
                console.error(error);
                message.channel.send(mode_list[mode] + "の呼び出しにエラーが発生しました。\nエラー内容:" + error.details[0].message, {code: true});
            });
        } else {
            console.log("Botがボイスチャンネルへ接続してません。");
        }
    }

    function mode_api(obj) {
        if (mode === 1) {
            return voiceText.fetchBuffer(obj.msg, {format: 'wav', speaker: voice_patan_1});
        } else {
            throw Error("不明なAPIが選択されています:" + mode);
        }
    }

    function bufferToStream(buffer) {
        let stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
});
