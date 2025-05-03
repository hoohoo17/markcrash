// DOM 요소 가져오기
const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score');
const goalsDisplay = document.getElementById('goals');
const levelDisplay = document.getElementById('level');
const nextLevelBtn = document.getElementById('nextLevel');

// 다음 스테이지 버튼 이벤트 리스너 추가
nextLevelBtn.addEventListener('click', nextStage);

// 게임 설정
const blockTypes = ['💎', '🧨', '⛏️', '🟫', '🌳'];
const goalTargets = [
    { diamond: 8, tnt: 5 },     // 스테이지 1
    { diamond: 12, tnt: 8 },    // 스테이지 2
    { diamond: 15, tnt: 12 },   // 스테이지 3
    { diamond: 20, tnt: 15 },   // 스테이지 4
    { diamond: 25, tnt: 20 },   // 스테이지 5
    { diamond: 30, tnt: 25 },   // 스테이지 6
    { diamond: 35, tnt: 30 },   // 스테이지 7
    { diamond: 40, tnt: 35 },   // 스테이지 8
    { diamond: 45, tnt: 40 },   // 스테이지 9
    { diamond: 50, tnt: 45 },   // 스테이지 10
    { diamond: 60, tnt: 50 },   // 스테이지 11
    { diamond: 70, tnt: 60 },   // 스테이지 12
    { diamond: 80, tnt: 70 },   // 스테이지 13
    { diamond: 90, tnt: 80 },   // 스테이지 14
    { diamond: 100, tnt: 90 },  // 스테이지 15
    { diamond: 120, tnt: 100 }  // 스테이지 16
];

// 게임 상태
let boardState = [];
let selected = null;
let score = 0;
let level = 0;
let goalProgress = { diamond: 0, tnt: 0 };

// 게임 보드 초기화
function initBoard() {
    console.log('게임 보드 초기화 시작');
    board.innerHTML = '';
    boardState = [];
    
    for (let i = 0; i < 8 * 8; i++) {
        const type = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = type;
        cell.dataset.index = i;
        cell.onclick = () => selectCell(i);
        board.appendChild(cell);
        boardState.push(type);
    }
    
    updateGoals();
    console.log('게임 보드 초기화 완료');
}

// 셀 선택 처리
function selectCell(index) {
    console.log('셀 선택:', index);
    if (selected === null) {
        selected = index;
        board.children[index].style.border = '2px solid yellow';
    } else {
        swapBlocks(selected, index);
        board.children[selected].style.border = 'none';
        selected = null;
    }
}

// 블록 교환
function swapBlocks(i1, i2) {
    console.log('블록 교환 시도:', i1, i2);
    if (!isAdjacent(i1, i2)) {
        console.log('인접하지 않은 블록');
        return;
    }
    
    [boardState[i1], boardState[i2]] = [boardState[i2], boardState[i1]];
    renderBoard();
    checkMatches();
}

// 인접 여부 확인
function isAdjacent(i1, i2) {
    const x1 = i1 % 8, y1 = Math.floor(i1 / 8);
    const x2 = i2 % 8, y2 = Math.floor(i2 / 8);
    return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

// 보드 렌더링
function renderBoard() {
    board.childNodes.forEach((cell, i) => {
        cell.textContent = boardState[i];
    });
}

// 매치 체크
function checkMatches() {
    console.log('매치 체크 시작');
    const matched = new Set();
    
    // 가로 매치 체크
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 6; x++) {
            const i = y * 8 + x;
            if (boardState[i] === boardState[i + 1] && boardState[i] === boardState[i + 2]) {
                matched.add(i).add(i + 1).add(i + 2);
            }
        }
    }
    
    // 세로 매치 체크
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 6; y++) {
            const i = y * 8 + x;
            if (boardState[i] === boardState[i + 8] && boardState[i] === boardState[i + 16]) {
                matched.add(i).add(i + 8).add(i + 16);
            }
        }
    }
    
    if (matched.size > 0) {
        console.log('매치 발견:', matched.size, '개');
        matched.forEach(i => {
            updateGoalProgress(boardState[i]);
            boardState[i] = blockTypes[Math.floor(Math.random() * blockTypes.length)];
            score += 5;
        });
        scoreDisplay.textContent = '점수: ' + score;
        renderBoard();
        checkMatches();
    }
}

// 목표 진행도 업데이트
function updateGoalProgress(block) {
    if (block === '💎') goalProgress.diamond++;
    if (block === '🧨') goalProgress.tnt++;
    updateGoals();
}

// 목표 표시 업데이트
function updateGoals() {
    const goal = goalTargets[level];
    goalsDisplay.textContent = `목표: 다이아몬드 ${goal.diamond}개 (${goalProgress.diamond}), TNT ${goal.tnt}개 (${goalProgress.tnt})`;
    if (goalProgress.diamond >= goal.diamond && goalProgress.tnt >= goal.tnt) {
        nextLevelBtn.style.display = 'block';
    }
}

// 다음 스테이지로
function nextStage() {
    console.log('다음 스테이지로 이동');
    level++;
    if (level >= goalTargets.length) {
        alert('축하합니다! 모든 스테이지를 완료했습니다!');
        level = 0;
        score = 0;
    }
    goalProgress = { diamond: 0, tnt: 0 };
    levelDisplay.textContent = '스테이지: ' + (level + 1);
    nextLevelBtn.style.display = 'none';
    initBoard();
}

// 게임 시작
console.log('게임 시작');
initBoard(); 