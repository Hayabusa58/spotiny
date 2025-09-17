interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const trackName = trackInput.value;
    const res = await fetch('/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ track: trackName })
    });

    const data = await res.json();

    trackSelect.innerHTML = '<option value="">-- 検索結果から選択 --</option>';

    if (data.tracks && data.tracks.length > 0) {
      data.tracks.forEach((track: Track) => {
        const option = document.createElement('option');
        option.value = JSON.stringify(track);
        option.textContent = `${track.title} - ${track.artist}`;
        trackSelect.appendChild(option);
      });

      resultArea.value = '候補が見つかりました。';
    } else {
      resultArea.value = '曲が見つかりませんでした。';
    }
  });

  trackSelect.addEventListener('change', () => {
    const selected = trackSelect.value;
    if (!selected) {
      resultArea.value = '';
      return;
    }
    const parsed: Track = JSON.parse(selected);
    // console.log(parsed)
    const hasUrl = hasUrlCheckBox.checked;
    const isKyushoku = isKyushokuCheckBox.checked;
    resultArea.value = `${parsed.title} - ${parsed.artist}`; 
    if (hasUrl) {
        resultArea.value = resultArea.value + `\n${parsed.url}`;
    }
    if (isKyushoku) {
        resultArea.value = "給食の時間のリクエスト\n\n" + resultArea.value;
    }
  });

  copyInputButton.addEventListener('click', () => {
    navigator.clipboard.writeText(resultArea.value)
    copyResult.innerHTML = "クリップボードにコピーしました。"
  })
});