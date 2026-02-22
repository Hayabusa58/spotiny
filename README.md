# Spotiny

## これは何

曲名を入力して検索すると Spotify から曲情報を取得し、「曲名+アーティスト名」の文章をコピーできる Web アプリです。
「なうぷれ」の投稿時に便利なフォーマットをワンクリックでコピーできるようにしています。

さまざまな謎の書式オプションについては気にしないでください。

## 使い方

* あらかじめ Spotify API の `CLIENT_ID` と `CLIENT_SECRET` を取得しておきます。

### with Docker

```shell
# CLIENT_ID と CLIENT_SECRET を指定する
$ cp .env.sample .env
$ vi .env

# アプリケーションを起動する
$ docker compose up -d
```
