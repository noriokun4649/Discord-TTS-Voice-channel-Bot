# Discord-TTS-Voice-channel-Bot
Discordでテキストチャンネルのチャットをボイスチャンネルで読み上げしてくれるBotです。

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
  "Defalut": {
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
| apiType  |  デフォルトのAPIを指定 (利用できるAPIが1になってしまったので無意味)|
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
| voice  |  音声タイプを変更します |
| speed  |  音声の速度を変更します(0～200の数値) |
| pitch  |  音声の高さを変更します(0～200の数値) |
| reload  |  コンフィグを再読み込みします |

# ライセンス
MIT License
