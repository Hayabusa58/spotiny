interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  album?: string;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm') as HTMLFormElement;
  const trackSelect = document.getElementById('trackSelect') as HTMLSelectElement;
  const resultArea = document.getElementById('resultArea') as HTMLTextAreaElement;
  const trackInput = document.getElementById('trackInput') as HTMLInputElement;
  const hasUrlCheckBox = document.getElementById('hasUrl') as HTMLInputElement;
  const copyInputButton = document.getElementById('copyButton') as HTMLInputElement;
  const copyResult = document.getElementById('copyResult') as HTMLDivElement;
  const isKyushokuCheckBox = document.getElementById('isKyushoku') as HTMLInputElement;
  const isOyatsuCheckBox = document.getElementById('isOyatsu') as HTMLInputElement;
  const isDinnerCheckBox = document.getElementById('isDinner') as HTMLInputElement;
  const isAlbumCheckBox = document.getElementById('isAlbum') as HTMLInputElement;

  form.addEventListener('submit', async (e) => {
    trackSelect.innerHTML = '';
    e.preventDefault();

    const errorMessages: Record<string, string> = {
      SPOTIFY_AUTH_ERROR: '⚠️ Spotify API の認証に失敗しました。',
      SPOTIFY_RATE_LIMIT: '⚠️ Spotify API のリクエスト制限に達しました。しばらく待ってから再試行してください。',
      SPOTIFY_SERVER_ERROR: '⚠️ Spotify API に問題が発生している可能性があります。',
      UNKNOWN_ERROR: '⚠️ 曲情報検索中に予期しないエラーが発生しました。',
    };

    const trackName = trackInput.value;
    const lang = navigator.language || "ja";

    let res: Response;
    try {
      res = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ track: trackName, lang })
      });
    } catch (e) {
      resultArea.value = '⚠️ サーバーへの接続に失敗しました。ネットワーク接続を確認してください。';
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      const code = data.errorCode || 'UNKNOWN_ERROR';
      resultArea.value = errorMessages[code] || errorMessages.UNKNOWN_ERROR;
      return;
    }

    if (data.tracks && data.tracks.length > 0) {
      // ヒット数に応じて trackselect.Size を変えるが、30を超えないようにする
      if (data.tracks.length > 30 ) {
        trackSelect.size = 30;
      } else {
        trackSelect.size = data.tracks.length;
      }

      data.tracks.forEach((track: Track) => {
        const option = document.createElement('option');
        option.value = JSON.stringify(track);
        option.textContent = `${track.title} - ${track.artist} (${track.album})`;
        trackSelect.appendChild(option);
      });

      resultArea.value = '候補が見つかりました。';
    } else {
      resultArea.value = '曲が見つかりませんでした。';
    }
  });

  trackSelect.addEventListener('change', () => {
    applyResultArea();
  });

  copyInputButton.addEventListener('click', () => {
    navigator.clipboard.writeText(resultArea.value)
    copyResult.innerHTML = "クリップボードにコピーしました。"
  })

  hasUrlCheckBox.addEventListener('change', () => {
    applyResultArea();
  })

  isKyushokuCheckBox.addEventListener('change', () => {
    applyResultArea();
  } )

  isOyatsuCheckBox.addEventListener('change', () => {
    applyResultArea();
  })

  isDinnerCheckBox.addEventListener('change', () => {
    applyResultArea();
  })

  isAlbumCheckBox.addEventListener('change', () => {
    applyResultArea();
  })

  function applyResultArea () {
    const selected = trackSelect.value;
    if (!selected) {
      resultArea.value = '';
      return;
    }
    const parsed: Track = JSON.parse(selected);
    // console.log(parsed)
    const hasUrl = hasUrlCheckBox.checked;
    const isKyushoku = isKyushokuCheckBox.checked;
    const isDinner = isDinnerCheckBox.checked;
    const isOyatsu = isOyatsuCheckBox.checked;
    const isAlbum = isAlbumCheckBox.checked;
    let result = `${parsed.title} - ${parsed.artist}`;
    let request = '';
    if (isAlbum) {
      result = result + ` (${parsed.album})`;
    }
    if (hasUrl) {
      result = result + `\n${parsed.url}`;
    }
    if (isKyushoku) {
      request = "給食の時間のリクエスト\n\n";
    }
    if (isOyatsu) {
      request = "おやつの時間のリクエスト\n\n";
    }
    if (isDinner) {
      request = "夕食の時間のリクエスト\n\n"
    }
    resultArea.value = request + result;
  }
});
