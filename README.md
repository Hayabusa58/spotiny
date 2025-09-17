# Spotiny

## これは何

曲名を入力すると曲情報を取ってきて「曲名+アーティスト名」で出力する Web アプリです。
なうぷれとかを投稿するときにコピペしやすいといいと思って作りました。

## 使い方

* あらかじめ Spotify API の CLIENT_ID と CLIENT_SECRET を取得しておきます。

### with Docker

```shell
# CLIENT_ID と CLIENT_SECRET を指定する
$ cp .env.sample .env
$ vi .env

# アプリケーションを起動する
$ docker compose up -d
```
