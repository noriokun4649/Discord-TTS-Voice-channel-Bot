# Discord-TTS-Voice-channel-Bot
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/noriokun4649/Discord-TTS-Voice-channel-Bot/@discordjs/opus) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/noriokun4649/Discord-TTS-Voice-channel-Bot/config) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/noriokun4649/Discord-TTS-Voice-channel-Bot/config-reloadable) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/noriokun4649/Discord-TTS-Voice-channel-Bot/discord.js) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/noriokun4649/Discord-TTS-Voice-channel-Bot/ffmpeg-static) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/noriokun4649/Discord-TTS-Voice-channel-Bot/voice-text)  
![GitHub](https://img.shields.io/github/license/noriokun4649/Discord-TTS-Voice-channel-Bot)  
Discordでテキストチャンネルのチャットをボイスチャンネルで読み上げしてくれるBotです。  
[5e1d411](https://github.com/noriokun4649/Discord-TTS-Voice-channel-Bot/commit/5e1d4119eb6f0392218ee48a34d0abce73598dc7)コミット以降では、HOYA VoiceTextAPIの上限だった200文字以上の読み上げに対応してます。

# Docker版
Docker版をGitHubのリポジトリにアップロードしたので下記コマンドで直接使えます。  
```
docker pull ghcr.io/noriokun4649/discord-tts-bot
```

# 必要なもの
Node.js v12.19.0以降

# Bot実行の準備
Node.jsで使うパッケージを準備  
```
npm install
```  
※package.jsonがあるディレクトリで実行  

# Bot実行
```
npm start
```  

# Configについて
configフォルダ内のdefault.jsonがコンフィグファイルです。
```json
{
  "Api": {
    "discordToken": "",
    "voiceTextApiKey": ""
  },
  "Prefix": "/",
  "AutoRestart": true,
  "ReadMe": false,
  "AllTextChannelRead": false,
  "AutoMessageRemove": false,
  "UrlReplaceText": "URL省略",
  "Default": {
    "apiType": 1,
    "voiceType": "hikari"
  },
  "BlackLists": {
    "memberIds": [
      "381054450451742720"
    ],
    "prefixes": [
      "!",
      "/"
    ],
    "bots": true
  }
}
```

| 項目 | 内容・説明  |
| ------------ | ------------ |
| discordToken  |  Discordのトークンを記入 |
| voiceTextApiKey | VoiceTextのAPIキーを記入  |
| Prefix  |  コマンドの接頭語を決めます |
| AutoRestart  |  予期せぬエラー時に自動でボイスチャンネルへ再接続すかどうか |
| ReadMe  |  このBotが送るメッセージを読み上げるかどうか |
| AllTextChannelRead  |  すべてのテキストチャンネルを読み上げるかどうか |
|  |  ※falseの場合、join・reconnectコマンドを実行したテキストチャンネルのみ読み上げます |
| AutoMessageRemove  |  読み上げたメッセージを自動削除するかどうか |
| UrlReplaceText  |  URL読み上げ時に使われる読み上げテキスト |
| apiType  |  デフォルトのAPIを指定 |
| voiceType  |  デフォルトのボイスを指定 |
| memberIds  |  読み上げから除外するユーザーのユーザーID |
| prefixes  |  読み上げから除外する接頭語  |
| bots  |  Botを読み上げから除外する  |

# Botのコマンドリスト

| 接頭語+α | 内容・説明  |
| ------------ | ------------ |
| join  |  ボイスチャンネルにBotを呼びます |
| reconnect  |  ボイスチャンネルへ再接続します |
| kill  |  ボイスチャンネルから切断します |
| mode  |  読み上げに利用するTTSのAPIを変更します |
| type  |  APIで利用可能な音声タイプを一覧表示します |
| voice  |  音声タイプを変更します　※このコマンドを打った人のチャットのみが変更対象 |
| speed  |  音声の速度を変更します(50～200の数値) |
| pitch  |  音声の高さを変更します(50～200の数値) |
| reload  |  コンフィグを再読み込みします |

# ライセンス
MIT License
