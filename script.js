/* ============================================
   시저 암호 변환기 - 애플리케이션 로직
   ============================================ */

(function () {
  'use strict';

  // --- DOM 참조 ---
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const shiftSlider = document.getElementById('shift-slider');
  const shiftDisplay = document.getElementById('shift-display');
  const shiftDec = document.getElementById('shift-dec');
  const shiftInc = document.getElementById('shift-inc');
  const btnEncrypt = document.getElementById('btn-encrypt');
  const btnDecrypt = document.getElementById('btn-decrypt');
  const modeIndicator = document.getElementById('mode-indicator');
  const clearInput = document.getElementById('clear-input');
  const copyOutput = document.getElementById('copy-output');
  const copyText = document.getElementById('copy-text');
  const swapBtn = document.getElementById('swap-btn');
  const inputCount = document.getElementById('input-count');
  const outputCount = document.getElementById('output-count');
  const alphabetMap = document.getElementById('alphabet-map');
  const bruteToggle = document.getElementById('brute-toggle');
  const bruteResults = document.getElementById('brute-results');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const bgCanvas = document.getElementById('bg-canvas');
  const caesarWheel = document.getElementById('caesar-wheel');

  // 추가 기능 DOM 참조
  const btnRot13 = document.getElementById('btn-rot13');

  const freqToggle = document.getElementById('freq-toggle');
  const freqResults = document.getElementById('freq-results');
  const freqChart = document.getElementById('freq-chart');
  const freqStats = document.getElementById('freq-stats');
  const infoToggle = document.getElementById('info-toggle');
  const infoContent = document.getElementById('info-content');
  const historyClear = document.getElementById('history-clear');
  const historyList = document.getElementById('history-list');
  const historyEmpty = document.getElementById('history-empty');
  const autodecodeSection = document.getElementById('autodecode-section');
  const autodecodeBody = document.getElementById('autodecode-body');

  // --- 상태 ---
  let currentShift = 3;
  let currentMode = 'encrypt'; // 'encrypt' 또는 'decrypt'
  let bruteOpen = false;
  let freqOpen = false;
  let infoOpen = false;
  let history = [];

  // --- 자동 해독용 영어 단어 사전 ---
  const COMMON_WORDS = new Set([
    'THE', 'BE', 'TO', 'OF', 'AND', 'A', 'IN', 'THAT', 'HAVE', 'I',
    'IT', 'FOR', 'NOT', 'ON', 'WITH', 'HE', 'AS', 'YOU', 'DO', 'AT',
    'THIS', 'BUT', 'HIS', 'BY', 'FROM', 'THEY', 'WE', 'SAY', 'HER',
    'SHE', 'OR', 'AN', 'WILL', 'MY', 'ONE', 'ALL', 'WOULD', 'THERE',
    'THEIR', 'WHAT', 'SO', 'UP', 'OUT', 'IF', 'ABOUT', 'WHO', 'GET',
    'WHICH', 'GO', 'ME', 'WHEN', 'MAKE', 'CAN', 'LIKE', 'TIME', 'NO',
    'JUST', 'HIM', 'KNOW', 'TAKE', 'PEOPLE', 'INTO', 'YEAR', 'YOUR',
    'GOOD', 'SOME', 'COULD', 'THEM', 'SEE', 'OTHER', 'THAN', 'THEN',
    'NOW', 'LOOK', 'ONLY', 'COME', 'ITS', 'OVER', 'THINK', 'ALSO',
    'BACK', 'AFTER', 'USE', 'TWO', 'HOW', 'OUR', 'WORK', 'FIRST',
    'WELL', 'WAY', 'EVEN', 'NEW', 'WANT', 'BECAUSE', 'ANY', 'THESE',
    'GIVE', 'DAY', 'MOST', 'US', 'IS', 'ARE', 'WAS', 'WERE', 'BEEN',
    'HAS', 'HAD', 'DID', 'DOES', 'DONE', 'SAID', 'EACH', 'TELL',
    'MAY', 'MUCH', 'ASK', 'OWN', 'TOO', 'HERE', 'TRY', 'MANY',
    'HELLO', 'WORLD', 'ATTACK', 'DAWN', 'SECRET', 'MESSAGE',
    'CIPHER', 'CODE', 'COMPUTER', 'SCIENCE', 'LOVE', 'LIFE',
    'NIGHT', 'MEET', 'SEND', 'HELP', 'STOP', 'ENEMY', 'FRIEND',
    'KING', 'QUEEN', 'ARMY', 'WAR', 'PEACE', 'POWER', 'GREAT',
    'NORTH', 'SOUTH', 'EAST', 'WEST', 'RIVER', 'MOUNTAIN',
    'CAESAR', 'ROME', 'EMPIRE', 'SOLDIER', 'GENERAL', 'VICTORY',
    'INFORMATION', 'ENCRYPTION', 'DECRYPTION', 'ALGORITHM',
    'SECURITY', 'PASSWORD', 'SYSTEM', 'DATA', 'PROGRAM',
    'NETWORK', 'DIGITAL', 'BINARY', 'LANGUAGE', 'FUNCTION',
    'WHILE', 'BEFORE', 'SHOULD', 'BETWEEN', 'STILL', 'NEVER',
    'EVERY', 'THOSE', 'VERY', 'MIGHT', 'WHERE', 'BEING',
    'MAN', 'WOMAN', 'CHILD', 'HAND', 'HIGH', 'OLD', 'LONG'
  ]);



  // --- 시저 암호 핵심 로직 ---
  function caesarCipher(text, shift, encrypt = true) {
    const effectiveShift = encrypt ? shift : (26 - shift) % 26;
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);

      // 대문자 A-Z
      if (code >= 65 && code <= 90) {
        result += String.fromCharCode(((code - 65 + effectiveShift) % 26) + 65);
      }
      // 소문자 a-z
      else if (code >= 97 && code <= 122) {
        result += String.fromCharCode(((code - 97 + effectiveShift) % 26) + 97);
      }
      // 알파벳이 아닌 문자는 그대로 통과
      else {
        result += char;
      }
    }
    return result;
  }

  // --- 출력 업데이트 ---
  function updateOutput() {
    const text = inputText.value;
    const isEncrypt = currentMode === 'encrypt';
    const result = caesarCipher(text, currentShift, isEncrypt);
    outputText.textContent = result;

    inputCount.textContent = `${text.length} 글자`;
    outputCount.textContent = `${result.length} 글자`;

    updateBruteForce();
    highlightActiveLetters();
    updateFrequencyAnalysis();
    updateAutoDecodeRecommendation();
  }

  // --- 시프트 조절 ---
  function setShift(value) {
    currentShift = Math.max(0, Math.min(25, value));
    shiftSlider.value = currentShift;
    shiftDisplay.textContent = currentShift;
    updateAlphabetMap();
    drawWheel();
    updateOutput();
  }

  shiftSlider.addEventListener('input', () => {
    setShift(parseInt(shiftSlider.value));
  });

  shiftDec.addEventListener('click', () => setShift(currentShift - 1));
  shiftInc.addEventListener('click', () => setShift(currentShift + 1));

  // --- 모드 전환 ---
  function setMode(mode) {
    currentMode = mode;
    btnEncrypt.classList.toggle('active', mode === 'encrypt');
    btnDecrypt.classList.toggle('active', mode === 'decrypt');
    modeIndicator.classList.toggle('decrypt', mode === 'decrypt');
    updateOutput();
  }

  btnEncrypt.addEventListener('click', () => setMode('encrypt'));
  btnDecrypt.addEventListener('click', () => setMode('decrypt'));

  // --- 텍스트 입력 ---
  inputText.addEventListener('input', updateOutput);

  // --- 지우기 ---
  clearInput.addEventListener('click', () => {
    inputText.value = '';
    updateOutput();
    inputText.focus();
  });

  // --- 복사 ---
  copyOutput.addEventListener('click', async () => {
    const text = outputText.textContent;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showToast('복사되었습니다!');
      copyText.textContent = '완료!';
      setTimeout(() => {
        copyText.textContent = '복사';
      }, 1500);
    } catch {
      showToast('복사에 실패했습니다');
    }
  });

  // --- 입출력 교환 ---
  swapBtn.addEventListener('click', () => {
    const outputVal = outputText.textContent;
    if (!outputVal) return;
    inputText.value = outputVal;
    // 모드 전환
    setMode(currentMode === 'encrypt' ? 'decrypt' : 'encrypt');
  });

  // --- 토스트 알림 ---
  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  // ============================
  // 1. ROT13 빠른 변환 버튼
  // ============================
  btnRot13.addEventListener('click', () => {
    setShift(13);
    setMode('encrypt');
    showToast('ROT13 적용! (Shift 13)');
  });


  // ============================
  // 3. 변환 히스토리
  // ============================
  const HISTORY_KEY = 'caesar-cipher-history';
  const MAX_HISTORY = 20;

  function loadHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      history = stored ? JSON.parse(stored) : [];
    } catch {
      history = [];
    }
    renderHistory();
  }

  function saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch { /* ignore */ }
  }

  function addToHistory(input, output, shift, mode) {
    if (!input.trim() || !output.trim()) return;

    // 가장 최근 항목과 중복이면 추가하지 않음
    if (history.length > 0) {
      const last = history[0];
      if (last.input === input && last.shift === shift && last.mode === mode) return;
    }

    history.unshift({
      input: input.substring(0, 100),
      output: output.substring(0, 100),
      shift,
      mode,
      time: Date.now()
    });

    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }

    saveHistory();
    renderHistory();
  }

  function renderHistory() {
    if (history.length === 0) {
      historyEmpty.style.display = '';
      // 모든 히스토리 항목 제거
      historyList.querySelectorAll('.history-item').forEach(el => el.remove());
      return;
    }

    historyEmpty.style.display = 'none';
    // 기존 항목 제거
    historyList.querySelectorAll('.history-item').forEach(el => el.remove());

    history.forEach((entry, idx) => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const modeLabel = entry.mode === 'encrypt' ? '암호화' : '복호화';
      const timeStr = formatTime(entry.time);

      item.innerHTML = `
        <div class="history-meta">
          <div class="history-texts">
            ${escapeHtml(entry.input)}<span class="arrow">→</span>${escapeHtml(entry.output)}
          </div>
          <div class="history-info">
            <span class="history-badge">Shift ${entry.shift} · ${modeLabel}</span>
            <span class="history-time">${timeStr}</span>
          </div>
        </div>
        <button class="history-delete" data-idx="${idx}" aria-label="삭제">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      // 클릭 시 복원
      item.querySelector('.history-meta').addEventListener('click', () => {
        inputText.value = entry.input;
        setShift(entry.shift);
        setMode(entry.mode);
        showToast('히스토리에서 불러왔습니다!');
      });

      // 개별 항목 삭제
      item.querySelector('.history-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        history.splice(idx, 1);
        saveHistory();
        renderHistory();
      });

      historyList.appendChild(item);
    });
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  historyClear.addEventListener('click', () => {
    if (history.length === 0) return;
    history = [];
    saveHistory();
    renderHistory();
    showToast('히스토리가 삭제되었습니다');
  });

  // 의미 있는 변환 시 히스토리에 저장 (디바운스 적용)
  let historyTimer = null;
  inputText.addEventListener('input', () => {
    clearTimeout(historyTimer);
    historyTimer = setTimeout(() => {
      const inp = inputText.value.trim();
      const out = outputText.textContent.trim();
      if (inp.length >= 2) {
        addToHistory(inp, out, currentShift, currentMode);
      }
    }, 1500);
  });

  // ============================
  // 4. 빈도 분석
  // ============================
  freqToggle.addEventListener('click', () => {
    freqOpen = !freqOpen;
    freqToggle.classList.toggle('open', freqOpen);
    freqResults.classList.toggle('open', freqOpen);
    if (freqOpen) updateFrequencyAnalysis();
  });

  function updateFrequencyAnalysis() {
    if (!freqOpen) return;

    const text = outputText.textContent.toUpperCase();
    const letters = text.replace(/[^A-Z]/g, '');

    if (letters.length === 0) {
      freqChart.innerHTML = '';
      freqStats.innerHTML = '';
      freqChart.parentElement.innerHTML = '<div class="freq-empty">텍스트를 입력하면 알파벳 빈도 분석을 볼 수 있습니다.</div>';
      // 파괴된 요소가 있으면 재생성
      if (!document.getElementById('freq-chart')) {
        const container = document.getElementById('freq-results');
        container.innerHTML = '<div class="freq-chart" id="freq-chart"></div><div class="freq-stats" id="freq-stats"></div>';
      }
      return;
    }

    // freq-chart와 freq-stats 요소 존재 확인
    let chartEl = document.getElementById('freq-chart');
    let statsEl = document.getElementById('freq-stats');
    if (!chartEl || !statsEl) {
      const container = document.getElementById('freq-results');
      container.innerHTML = '<div class="freq-chart" id="freq-chart"></div><div class="freq-stats" id="freq-stats"></div>';
      chartEl = document.getElementById('freq-chart');
      statsEl = document.getElementById('freq-stats');
    }

    // 빈도 계산
    const freq = {};
    for (let i = 0; i < 26; i++) {
      freq[String.fromCharCode(65 + i)] = 0;
    }
    for (const ch of letters) {
      freq[ch]++;
    }

    const maxCount = Math.max(...Object.values(freq), 1);
    const totalLetters = letters.length;

    // 상위 3개 글자 찾기
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3).filter(e => e[1] > 0);

    // 바 차트 생성
    let chartHtml = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const letter of alphabet) {
      const count = freq[letter];
      const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
      const isTop = top3.some(t => t[0] === letter);

      chartHtml += `
        <div class="freq-bar-wrapper">
          <span class="freq-bar-count">${count > 0 ? count : ''}</span>
          <div class="freq-bar${isTop ? ' top-letter' : ''}" style="height: ${Math.max(heightPercent, 1.5)}%"></div>
          <span class="freq-bar-label">${letter}</span>
        </div>
      `;
    }
    chartEl.innerHTML = chartHtml;

    // 통계
    let statsHtml = '';
    if (top3.length > 0) {
      statsHtml += '<div class="freq-stat-item"><span class="freq-stat-dot top"></span><span class="freq-stat-label">최다 출현:</span>';
      statsHtml += top3.map(([letter, count]) =>
        `<span class="freq-stat-value">${letter}(${count}회, ${(count / totalLetters * 100).toFixed(1)}%)</span>`
      ).join(' ');
      statsHtml += '</div>';
    }
    statsHtml += `<div class="freq-stat-item"><span class="freq-stat-dot normal"></span><span class="freq-stat-label">총 알파벳:</span><span class="freq-stat-value">${totalLetters}개</span></div>`;
    statsEl.innerHTML = statsHtml;
  }

  // ============================
  // 5. 자동 해독 추천
  // ============================
  function updateAutoDecodeRecommendation() {
    const text = inputText.value.trim();
    if (text.length < 3 || currentMode !== 'decrypt') {
      autodecodeSection.style.display = 'none';
      return;
    }

    // 각 시프트별로 인식된 영어 단어 수를 기반으로 점수 매기기
    let bestShift = -1;
    let bestScore = 0;
    let bestWords = [];
    let bestResult = '';

    for (let s = 0; s < 26; s++) {
      const decoded = caesarCipher(text, s, false);
      const words = decoded.toUpperCase().replace(/[^A-Z\s]/g, '').split(/\s+/).filter(w => w.length > 0);
      const matchedWords = words.filter(w => COMMON_WORDS.has(w));
      const score = matchedWords.reduce((sum, w) => sum + w.length, 0); // 단어 길이로 가중치 부여

      if (score > bestScore) {
        bestScore = score;
        bestShift = s;
        bestWords = [...new Set(matchedWords)]; // 중복 제거
        bestResult = decoded;
      }
    }

    if (bestScore >= 2 && bestShift !== 0) {
      autodecodeSection.style.display = '';

      const wordsHtml = bestWords.slice(0, 8).map(w =>
        `<span class="autodecode-word">${w}</span>`
      ).join('');

      autodecodeBody.innerHTML = `
        <div class="autodecode-result">
          <div class="autodecode-shift">
            <span class="autodecode-badge">Shift ${bestShift}</span>
          </div>
          <div class="autodecode-decoded">${escapeHtml(bestResult)}</div>
          <div class="autodecode-reason">
            <strong>감지된 영어 단어:</strong>
            <div class="autodecode-words">${wordsHtml}</div>
          </div>
        </div>
      `;
    } else {
      autodecodeSection.style.display = 'none';
    }
  }

  // ============================
  // 6. 암호 강도 정보 토글
  // ============================
  infoToggle.addEventListener('click', () => {
    infoOpen = !infoOpen;
    infoToggle.classList.toggle('open', infoOpen);
    infoContent.classList.toggle('open', infoOpen);
  });

  // --- 알파벳 매핑 ---
  function updateAlphabetMap() {
    alphabetMap.innerHTML = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < 26; i++) {
      const original = alphabet[i];
      const shiftedIndex = (i + currentShift) % 26;
      const shifted = alphabet[shiftedIndex];

      const item = document.createElement('div');
      item.className = 'map-item';
      item.dataset.letter = original;
      item.innerHTML = `
        <span class="map-original">${original}</span>
        <span class="map-arrow">↓</span>
        <span class="map-shifted">${shifted}</span>
      `;
      alphabetMap.appendChild(item);
    }
  }

  function highlightActiveLetters() {
    const text = inputText.value.toUpperCase();
    const uniqueLetters = new Set(text.replace(/[^A-Z]/g, '').split(''));

    document.querySelectorAll('.map-item').forEach(item => {
      item.classList.toggle('highlight', uniqueLetters.has(item.dataset.letter));
    });
  }

  // --- 브루트 포스 ---
  bruteToggle.addEventListener('click', () => {
    bruteOpen = !bruteOpen;
    bruteToggle.classList.toggle('open', bruteOpen);
    bruteResults.classList.toggle('open', bruteOpen);
    if (bruteOpen) updateBruteForce();
  });

  function updateBruteForce() {
    if (!bruteOpen) return;
    const text = inputText.value;
    if (!text) {
      bruteResults.innerHTML = '<div style="text-align:center;color:var(--text-tertiary);padding:20px;font-size:0.85rem;">텍스트를 입력하면 모든 시프트 결과를 볼 수 있습니다.</div>';
      return;
    }

    let html = '';
    for (let s = 0; s < 26; s++) {
      const result = caesarCipher(text, s, currentMode === 'encrypt');
      const isCurrent = s === currentShift;
      html += `
        <div class="brute-item${isCurrent ? ' current' : ''}" data-shift="${s}">
          <span class="brute-shift">+${String(s).padStart(2, '0')}</span>
          <span class="brute-text">${escapeHtml(result)}</span>
        </div>
      `;
    }
    bruteResults.innerHTML = html;

    // 클릭 시 해당 시프트 적용
    bruteResults.querySelectorAll('.brute-item').forEach(item => {
      item.addEventListener('click', () => {
        setShift(parseInt(item.dataset.shift));
      });
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- 시저 휠 그리기 ---
  function drawWheel() {
    const canvas = caesarWheel;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = parseInt(getComputedStyle(canvas).width) || 280;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 8;
    const innerR = outerR - 28;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    ctx.clearRect(0, 0, size, size);

    // 외부 링 배경
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, outerR - 26, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(167, 139, 250, 0.06)';
    ctx.fill();

    // 내부 링 배경
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR - 26, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.06)';
    ctx.fill();

    // 외부 링 테두리
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 26, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.1)';
    ctx.stroke();

    // 내부 링 테두리
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, innerR - 26, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.stroke();

    // 글자 그리기
    for (let i = 0; i < 26; i++) {
      const angle = (i / 26) * Math.PI * 2 - Math.PI / 2;

      // 외부 링 글자 (원본)
      const ox = cx + (outerR - 13) * Math.cos(angle);
      const oy = cy + (outerR - 13) * Math.sin(angle);

      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(angle + Math.PI / 2);
      ctx.font = '600 10px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(167, 139, 250, 0.7)';
      ctx.fillText(alphabet[i], 0, 0);
      ctx.restore();

      // 내부 링 글자 (시프트됨)
      const shiftedAngle = angle;
      const shiftedIdx = (i + currentShift) % 26;
      const ix = cx + (innerR - 13) * Math.cos(shiftedAngle);
      const iy = cy + (innerR - 13) * Math.sin(shiftedAngle);

      ctx.save();
      ctx.translate(ix, iy);
      ctx.rotate(shiftedAngle + Math.PI / 2);
      ctx.font = '700 10px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.fillText(alphabet[shiftedIdx], 0, 0);
      ctx.restore();

      // 연결 눈금선
      const tickStart = outerR - 26;
      const tickEnd = innerR;
      const tx1 = cx + tickStart * Math.cos(angle);
      const ty1 = cy + tickStart * Math.sin(angle);
      const tx2 = cx + tickEnd * Math.cos(angle);
      const ty2 = cy + tickEnd * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(tx1, ty1);
      ctx.lineTo(tx2, ty2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // 상단 하이라이트 마커
    const markerAngle = -Math.PI / 2;
    ctx.beginPath();
    ctx.arc(
      cx + outerR * Math.cos(markerAngle),
      cy + outerR * Math.sin(markerAngle),
      3,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#a78bfa';
    ctx.fill();
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // --- 배경 파티클 ---
  function initParticles() {
    const ctx = bgCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let w, h;
    const particles = [];
    const PARTICLE_COUNT = 50;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      bgCanvas.width = w * dpr;
      bgCanvas.height = h * dpr;
      bgCanvas.style.width = w + 'px';
      bgCanvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
    }

    function createParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
        color: Math.random() > 0.5 ? '167, 139, 250' : '6, 182, 212',
      };
    }

    resize();
    window.addEventListener('resize', () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      }

      // 연결선 그리기
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // --- 키보드 단축키 ---
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + E = 암호화 모드
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      setMode('encrypt');
    }
    // Ctrl/Cmd + Shift + D = 복호화 모드
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      setMode('decrypt');
    }
  });

  // --- 초기화 ---
  function init() {
    setShift(3);
    updateAlphabetMap();
    drawWheel();
    updateOutput();
    initParticles();
    loadHistory();
  }

  init();
})();
