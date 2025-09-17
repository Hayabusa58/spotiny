import fs from 'fs';
import path from 'path';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit'
import log4js from 'log4js';

dotenv.config();
const app = express();
const PORT = 3000;

let accessToken: string = '';

const accessLogStream = fs.createWriteStream(
  path.join('./log', 'access.log'), { flags: 'a' }
);

// アプリケーションのロギング設定
const logger = log4js.getLogger();
logger.level = "info"

// Web サーバのアクセスログ収集
// 標準出力
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'))
// ファイル書き出し
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
                 { stream: accessLogStream }))

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

async function getAccessToken(): Promise<void> {
  logger.info('Refreshing Spotify access token...');
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  accessToken = response.data.access_token;
  logger.info('Refreshed Spotify access token.');
}

// /search にたいするレートリミット設定
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 60,             // 最大60回/分
  message: {
    error: 'Error: Too many requests. Please try again in a minute.'
  },
  standardHeaders: true, 
  legacyHeaders: false   
});

// 楽曲検索エンドポイント
app.post('/search', searchLimiter, async (req, res) => {
  const trackName: string = req.body.track;
  try {
    if (!accessToken) await getAccessToken();
    const result = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        q: trackName,
        type: 'track',
        limit: 30
      }
    });
    const tracks = result.data.tracks.items.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      url: `https://open.spotify.com/${track.uri.split(':')[1]}/${track.uri.split(':')[2]}`
    }));

    res.json({ tracks });
  } catch (err) {
    res.status(500).json({ error: 'Error while searching spotify.' });
    logger.error('Failed to search track infomation from spotify: ', err)
  }
});

app.listen(PORT, () => {
  logger.info(`Listening on: http://localhost:${PORT}`);
  getAccessToken();
  setInterval(() => {
    logger.info('Starting refresh spotify access token...')
    getAccessToken().then(() => {
    }).catch(err => {
      logger.error('Failed to refresh Spotify access token:', err);
    });
  }, 30 * 60 * 1000); // 30分ごとに refresh する
});
