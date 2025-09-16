# Spotiny

## これは何
曲名を入力すると曲情報を取ってきて「曲名+アーティスト名」で出力する Web アプリです。
なうぷれとかを投稿するときにコピペしやすいといいと思って作りました。

## 使い方
### with Docker
あらかじめ Spotify API の CLIENT_ID と CLIENT_SECRET を取得しておきます。
```
$ docker build -t spotiny .

$ cp .env.sample

## CLIENT_ID と CLIENT_SECRET を指定する
$ vi .env

## 先ほどビルドしたイメージを指定する
$ cp docker-compose.yml.sample docker-compose.yml

$ docker compose up -d
```
