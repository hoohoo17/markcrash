(function () {
  "use strict";

  /* =====================
     DOM 요소 가져오기 (가드)
  ===================== */
  const board = document.getElementById('board');
  const scoreDisplay = document.getElementById('score');
  const goalsDisplay = document.getElementById('goals');
  const levelDisplay = document.getElementById('level');
  const nextLevelBtn = document.getElementById('nextLevel');

  if (!board || !scoreDisplay || !goalsDisplay || !levelDisplay) {
    console.warn('[Game] 필수 DOM 없음 – 실행 중단');
    return;
  }

  /* =====================
     게임 설정
  ===================== */
  const blockTypes = ['💎', '🧨', '⛏️', '🟫', '🌳'];
  const goalTargets = [
    { diamond: 5, tnt: 3, pickaxe: 4, wood: 3 },
    { diamond: 8, tnt: 5, pickaxe: 6, wood: 5 },
    { diamond: 12, tnt: 8, pickaxe: 10, wood: 8 },
    { diamond: 15, tnt: 10, pickaxe: 15, wood: 12 },
    { diamond: 20, tnt: 15, pickaxe: 20, wood: 15 },
    { diamond: 25, tnt: 20, pickaxe: 25, wood: 20 }
  ];

  /* =====================
     게임 상태
  ===================== */
  let boardState = [];
  let selected = null;
  let score = 0;
  let level = 0;
  let goalProgress = { diamond: 0, tnt: 0, pickaxe: 0, wood: 0 };

  /* =====================
     유틸
  ===================== */
  function randomBlock() {
    return blockTypes[Math.floor(Math.random() * blockTypes.length)];
  }

  /* =====================
     보드 초기화
  ===================== */
  function initBoard() {
    board.innerHTML = '';
    boardState = [];
    selected = null;

    for (let i = 0; i < 64; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.textContent = randomBlock();
      cell.addEventListener('click', () => selectCell(i));
      board.appendChild(cell);
      boardState.push(cell.textContent);
    }

    updateGoals();
    checkMatchesSafe(); // 초기 보드 매치 제거
  }

  /* =====================
     셀 선택
  ===================== */
  function selectCell(index) {
    if (selected === null) {
      selected = index;
      board.children[index].style.border = '2px solid yellow';
      return;
    }

    board.children[selected].style.border = 'none';

    if (selected !== index && isAdjacent(selected, index)) {
      swapBlocks(selected, index);
    }

    selected = null;
  }

  /* =====================
     인접 체크
  ===================== */
  function isAdjacent(i1, i2) {
    const x1 = i1 % 8, y1 = Math.floor(i1 / 8);
    const x2 = i2 % 8, y2 = Math.floor(i2 / 8);
    return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
  }

  /* =====================
     블록 교환
  ===================== */
  function swapBlocks(i1, i2) {
    [boardState[i1], boardState[i2]] = [boardState[i2], boardState[i1]];
    renderBoard();
    checkMatchesSafe();
  }

  /* =====================
     렌더
  ===================== */
  function renderBoard() {
    for (let i = 0; i < board.children.length; i++) {
      board.children[i].textContent = boardState[i];
    }
  }

  /* =====================
     매치 탐색
  ===================== */
  function findMatches() {
    const matched = new Set();

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 6; x++) {
        const i = y * 8 + x;
        if (
          boardState[i] &&
          boardState[i] === boardState[i + 1] &&
          boardState[i] === boardState[i + 2]
        ) {
          matched.add(i).add(i + 1).add(i + 2);
        }
      }
    }

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 6; y++) {
        const i = y * 8 + x;
        if (
          boardState[i] &&
          boardState[i] === boardState[i + 8] &&
          boardState[i] === boardState[i + 16]
        ) {
          matched.add(i).add(i + 8).add(i + 16);
        }
      }
    }

    return matched;
  }

  /* =====================
     안전한 매치 처리
  ===================== */
  function checkMatchesSafe() {
    let guard = 0;

    while (guard < 10) {
      const matched = findMatches();
      if (matched.size === 0) break;

      matched.forEach(i => {
        updateGoalProgress(boardState[i]);
        boardState[i] = randomBlock();
        score += 5;
      });

      scoreDisplay.textContent = `점수: ${score}`;
      renderBoard();
      guard++;
    }
  }

  /* =====================
     목표 처리
  ===================== */
  function updateGoalProgress(block) {
    if (block === '💎') goalProgress.diamond++;
    if (block === '🧨') goalProgress.tnt++;
    if (block === '⛏️') goalProgress.pickaxe++;
    if (block === '🌳') goalProgress.wood++;
    updateGoals();
  }

  function updateGoals() {
    const goal = goalTargets[level];
    goalsDisplay.textContent =
      `목표: 다이아 ${goal.diamond} (${goalProgress.diamond}), ` +
      `TNT ${goal.tnt} (${goalProgress.tnt}), ` +
      `곡괭이 ${goal.pickaxe} (${goalProgress.pickaxe}), ` +
      `나무 ${goal.wood} (${goalProgress.wood})`;

    if (
      goalProgress.diamond >= goal.diamond &&
      goalProgress.tnt >= goal.tnt &&
      goalProgress.pickaxe >= goal.pickaxe &&
      goalProgress.wood >= goal.wood &&
      nextLevelBtn
    ) {
      nextLevelBtn.style.display = 'block';
    }
  }

  /* =====================
     다음 스테이지
  ===================== */
  function nextStage() {
    level++;
    if (level >= goalTargets.length) {
      alert('🎉 모든 스테이지 완료!');
      level = 0;
      score = 0;
    }

    goalProgress = { diamond: 0, tnt: 0, pickaxe: 0, wood: 0 };
    levelDisplay.textContent = `스테이지: ${level + 1}`;
    if (nextLevelBtn) nextLevelBtn.style.display = 'none';
    initBoard();
  }

  if (nextLevelBtn) {
    nextLevelBtn.addEventListener('click', nextStage);
  }

  /* =====================
     시작
  ===================== */
  document.addEventListener('DOMContentLoaded', initBoard);

})();
