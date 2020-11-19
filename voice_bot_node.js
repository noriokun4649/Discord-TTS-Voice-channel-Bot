const Discord = require('discord.js');
const { VoiceText } = require('voice-text');
const { Readable } = require('stream');
const conf = require('config-reloadable');
let config = conf();

let discordToken;
let voiceTextApiKey;
let prefix;
let readMe;
let apiType;
let voiceType;
let blackList;

function readConfig(){
    discordToken = config.get('Api.discordToken');
    voiceTextApiKey = config.get('Api.voiceTextApiKey');
    prefix = config.get('Prefix');
    readMe = config.get('ReadMe');
    apiType = config.get('Defalut.apiType');
    voiceType = config.get('Defalut.voiceType');
    blackList = config.get('BlackLists');
    return true;
}

if (!readConfig()) throw new Error("Config load error!");

let conext;
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
}

let voice_patan_1 = voiceType; //初期時のよみあげ音声

let mode = apiType;

const client = new Discord.Client();

const voiceText = new VoiceText(voiceTextApiKey); //Voice Text API key

client.login(discordToken); //Discord login token

process.on('uncaughtException', function (err) {
    console.error(err);
    if (client.status != null) {
        client.user.send(err, { code: true });
    } else {
        console.error("NOT CONNECT");
    }

});

process.on('unhandledRejection', error => {
    console.error(error.name);
    console.error(error.message);
    console.error(error.code);
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
        if (message.member.voice.channel) {
            message.member.voice.channel.join()
                .then(connection => { // Connection is an instance of VoiceConnection
                    console.log("ボイスチャンネルへ接続しました。");
                    message.channel.send('ボイスチャンネルへ接続しました。', { code: true });
                    message.reply("\nチャットの読み上げ準備ができました。切断時は/killです。\n/mode で読み上げAPIを変更できます。\n /voiceでよみあげ音声を選択できます。\n 音声が読み上げられない場合は/reconnectを試してみてください。");
                    conext = connection;
                })
                .catch(err => console.log(err));
        } else {
            message.reply("まずあなたがボイスチャンネルへ接続している必要があります。");
        }
    }

    if (message.content === '/reconnect') {
        if (conext) {
            conext.disconnect();
            if (message.member.voice.channel) {
                message.member.voice.channel.join()
                    .then(connection => { // Connection is an instance of VoiceConnection
                        console.log("ボイスチャンネルへ再接続しました。");
                        message.channel.send('ボイスチャンネルへ再接続しました。', { code: true });
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
        message.channel.send(':dash:');
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
                message.reply("指定されたAPIが不正です。指定可能なAPIは/modeで見ることが可能です。");
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
            for (outdata in voice_lists_1) {
                outputs = outputs + outdata + "->" + voice_lists_1[outdata] + "\n";
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
                    voice_patan_1 = vo[1];
                    let mess_to = "読み上げ音声を" + vo[1] + " : " + voice_lists_1[vo[1]] + "に設定しました。";
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

    if (message.content === '/reload') {
        config = conf.reloadConfigs();
        if (readConfig()) message.channel.send("コンフィグを再読み込みしました。");
    }

    if (!(isBlackListsFromID(message.member.id) || isBlackListsFromPrefixes(message.content)) && isRead(message.member.id)) {
        if (conext) {
            try {
                yomiage({
                    msg: emoji_delete(url_delete(message.content + "。")),
                    cons: conext
                })
            } catch (err) {
                console.log(err.message);
                message.channel.send(err.message, { code: true });
            }
        } else {
            console.log("Botがボイスチャンネルへ接続してません。");
        }
    } else {
        console.log("読み上げ対象外のチャットです");
    }

    function isBlackListsFromPrefixes(cont) {
        let prefixes = blackList.get("prefixes");
        return prefixes.find(function (prefix) {
            return cont.indexOf(prefix) === 0;
        });
    }

    function isBlackListsFromID(menId) {
        let memberIds = blackList.get("memberIds");
        return memberIds.find(function (id) {
            return menId === id;
        });
    }

    function isRead(id) {
        return readMe === false ? id !== client.user.id : readMe;
    }

    function url_delete(str) {
        let pat = /(https?:\/\/[\x21-\x7e]+)/g;
        let return_val = str.replace(pat, " URL省略。");
        return return_val;
    }

    function emoji_delete(str){
        let pat = /(<\:\w*\:\d*>)/g;
        let return_val = str.replace(pat, "");
        return return_val;
    }
    
    function yomiage(obj) {
        mode_api(obj).then((buffer) => {
            obj.cons.play(bufferToStream(buffer)); //保存されたWAV再生
            console.log(obj.msg + 'の読み上げ完了');
        }).catch((error) => {
            console.log('error ->');
            console.error(error);
            message.channel.send(mode_list[mode]+"の呼び出しにエラーが発生しました。\nエラー内容:"+error.details[0].message, { code: true });
        });
    }

    function mode_api(obj) {
        let buffer_obj;
        if (mode == 1) {
            buffer_obj = voiceText.fetchBuffer(obj.msg, { format: 'wav', speaker: voice_patan_1 });
        } else {
            throw Error("不明なAPIが選択されています:" + mode);
        }
        return buffer_obj;
    }

    function bufferToStream(buffer) { 
        let stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
      }
});
