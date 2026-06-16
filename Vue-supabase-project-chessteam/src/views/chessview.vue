<template>
  <div class="chess-container">

    <div v-if="winner" class="winner-banner">
      {{ winner === 'white' ? 'White' : 'Black' }} wins!
      <button @click="resetGame">Play Again</button>
    </div>

    <div v-if="inCheck && !winner" class="check-banner">
      {{ turn === 'white' ? 'White' : 'Black' }} is in check!
    </div>

    <div class="board-wrapper">
      <div class="col-labels">
        <span v-for="l in ['a','b','c','d','e','f','g','h']" :key="l">{{ l }}</span>
      </div>

      <div class="board-and-rows">
        <div class="board">
          <div v-for="r in 8" :key="r" class="row">
            <div
              v-for="c in 8"
              :key="c"
              class="square"
              :class="squareClasses(r - 1, c - 1)"
              @click="handleClick(r - 1, c - 1)"
            >
              <span
                v-if="getPiece(r - 1, c - 1)"
                class="piece"
                :ref="el => setPieceRef(el, r - 1, c - 1)"
                :class="{ 'in-check': isKingInCheckSquare(r - 1, c - 1) }"
              >
                {{ getPiece(r - 1, c - 1) }}
              </span>
              <span v-if="isValidMoveSquare(r - 1, c - 1) && !getPiece(r - 1, c - 1)" class="move-dot" />
              <span v-if="isValidMoveSquare(r - 1, c - 1) && getPiece(r - 1, c - 1)" class="capture-ring" />
            </div>
          </div>
        </div>
      
        <div class="row-labels">
          <span v-for="n in [8,7,6,5,4,3,2,1]" :key="n">{{ n }}</span>
        </div>
      </div>
    </div>

    <div class="status">
      <div class="turn-indicator" :class="turn">
        <span class="turn-dot" />
        {{ turn === 'white' ? 'White' : 'Black' }}'s turn
      </div>
      <div class="captured">
        <span class="cap-label">Captured:</span>
        <span v-for="(p, i) in capturedByWhite" :key="'w'+i" class="cap-piece">{{ p }}</span>
        <span style="margin: 0 8px">|</span>
        <span v-for="(p, i) in capturedByBlack" :key="'b'+i" class="cap-piece">{{ p }}</span>
      </div>
    </div>

    <button class="reset-button" @click="resetGame">Reset Game</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gsap } from 'gsap'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()



const initialBoard = () => [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
]

const board       = ref(initialBoard())
const selected    = ref(null)
const turn        = ref('white')
const winner      = ref(null)
const validMoves  = ref([])
const pieceRefs   = ref({})
const capturedByWhite = ref([])   
const capturedByBlack = ref([])   


const WHITE_PIECES = new Set(['♙','♖','♘','♗','♕','♔'])
const BLACK_PIECES = new Set(['♟','♜','♞','♝','♛','♚'])

const isWhite  = p => p && WHITE_PIECES.has(p)
const isBlack  = p => p && BLACK_PIECES.has(p)
const getPiece = (r, c) => board.value[r]?.[c] || null
const isInside = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8
const isEnemy  = (p, t) => (isWhite(p) && isBlack(t)) || (isBlack(p) && isWhite(t))
const isFriend = (p, t) => (isWhite(p) && isWhite(t)) || (isBlack(p) && isBlack(t))

function setPieceRef(el, r, c) {
  if (el) pieceRefs.value[`${r}-${c}`] = el
  else delete pieceRefs.value[`${r}-${c}`]
}


function getRawMoves(piece, r, c, b) {
  const get = (nr, nc) => b[nr]?.[nc] || null
  const moves = []

  const sliding = (dirs) => {
    for (const [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc
      while (isInside(nr, nc)) {
        const t = get(nr, nc)
        if (!t) { moves.push({ r: nr, c: nc }); nr += dr; nc += dc }
        else { if (isEnemy(piece, t)) moves.push({ r: nr, c: nc }); break }
      }
    }
  }

  switch (piece) {
    case '♙': { 
      if (isInside(r-1,c) && !get(r-1,c))          moves.push({r:r-1,c})
      if (r===6 && !get(r-1,c) && !get(r-2,c))     moves.push({r:r-2,c})
      if (isInside(r-1,c-1) && isBlack(get(r-1,c-1))) moves.push({r:r-1,c:c-1})
      if (isInside(r-1,c+1) && isBlack(get(r-1,c+1))) moves.push({r:r-1,c:c+1})
      break
    }
    case '♟': { 
      if (isInside(r+1,c) && !get(r+1,c))          moves.push({r:r+1,c})
      if (r===1 && !get(r+1,c) && !get(r+2,c))     moves.push({r:r+2,c})
      if (isInside(r+1,c-1) && isWhite(get(r+1,c-1))) moves.push({r:r+1,c:c-1})
      if (isInside(r+1,c+1) && isWhite(get(r+1,c+1))) moves.push({r:r+1,c:c+1})
      break
    }
    case '♖': case '♜':
      sliding([[0,1],[0,-1],[1,0],[-1,0]])
      break
    case '♗': case '♝':
      sliding([[1,1],[1,-1],[-1,1],[-1,-1]])
      break
    case '♕': case '♛':
      sliding([[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]])
      break
    case '♘': case '♞': {
      for (const [dr,dc] of [[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]]) {
        const nr=r+dr, nc=c+dc
        if (isInside(nr,nc) && !isFriend(piece, get(nr,nc)))
          moves.push({r:nr,c:nc})
      }
      break
    }
    case '♔': case '♚': {
      for (const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
        const nr=r+dr, nc=c+dc
        if (isInside(nr,nc) && !isFriend(piece, get(nr,nc)))
          moves.push({r:nr,c:nc})
      }
      break
    }
  }
  return moves
}

function simulateMove(b, sr, sc, tr, tc) {
  const copy = b.map(row => [...row])
  copy[tr][tc] = copy[sr][sc]
  copy[sr][sc] = ''
  return copy
}

function findKing(b, color) {
  const king = color === 'white' ? '♔' : '♚'
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (b[r][c] === king) return { r, c }
  return null
}

function isAttackedBy(b, r, c, byColor) {
  for (let pr = 0; pr < 8; pr++) {
    for (let pc = 0; pc < 8; pc++) {
      const p = b[pr][pc]
      if (!p) continue
      if (byColor === 'white' && !isWhite(p)) continue
      if (byColor === 'black' && !isBlack(p)) continue
      const moves = getRawMoves(p, pr, pc, b)
      if (moves.some(m => m.r === r && m.c === c)) return true
    }
  }
  return false
}

function isInCheckOn(b, color) {
  const pos = findKing(b, color)
  if (!pos) return false
  const enemy = color === 'white' ? 'black' : 'white'
  return isAttackedBy(b, pos.r, pos.c, enemy)
}

function getLegalMoves(piece, r, c) {
  const raw = getRawMoves(piece, r, c, board.value.map(row => [...row]))
  return raw.filter(({ r: tr, c: tc }) => {
    const sim = simulateMove(board.value, r, c, tr, tc)
    return !isInCheckOn(sim, isWhite(piece) ? 'white' : 'black')
  })
}


const inCheck = computed(() => isInCheckOn(board.value, turn.value))

const isCheckmate = computed(() => {
  if (!inCheck.value) return false
  return !hasAnyLegalMove(turn.value)
})

function hasAnyLegalMove(color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board.value[r][c]
      if (!p) continue
      if (color === 'white' && !isWhite(p)) continue
      if (color === 'black' && !isBlack(p)) continue
      if (getLegalMoves(p, r, c).length > 0) return true
    }
  }
  return false
}


function isValidMoveSquare(r, c) {
  return validMoves.value.some(m => m.r === r && m.c === c)
}

function isKingInCheckSquare(r, c) {
  const p = getPiece(r, c)
  if (!p) return false
  if (p === '♔' && turn.value === 'white' && inCheck.value) return true
  if (p === '♚' && turn.value === 'black' && inCheck.value) return true
  return false
}

function squareClasses(r, c) {
  const classes = [(r + c) % 2 === 0 ? 'light' : 'dark']
  if (selected.value?.r === r && selected.value?.c === c) classes.push('selected')
  if (isValidMoveSquare(r, c)) classes.push('valid-move')
  return classes
}


function handleClick(r, c) {
  if (winner.value) return
  const piece = getPiece(r, c)

  if (!selected.value) {
    if (!piece) return
    if (turn.value === 'white' && !isWhite(piece)) return
    if (turn.value === 'black' && !isBlack(piece)) return
    selected.value = { r, c }
    validMoves.value = getLegalMoves(piece, r, c)
    return
  }

  if (selected.value.r === r && selected.value.c === c) {
    selected.value = null
    validMoves.value = []
    return
  }

  if (piece && !isEnemy(getPiece(selected.value.r, selected.value.c), piece)) {
    selected.value = { r, c }
    validMoves.value = getLegalMoves(piece, r, c)
    return
  }

  if (isValidMoveSquare(r, c)) {
    attemptMove(selected.value.r, selected.value.c, r, c)
  } else {
    selected.value = null
    validMoves.value = []
  }
}

function attemptMove(sr, sc, tr, tc) {
  const piece  = getPiece(sr, sc)
  const target = getPiece(tr, tc)

  const pieceRef = pieceRefs.value[`${sr}-${sc}`]
  if (!pieceRef) { finishMove(sr, sc, tr, tc, piece, target); return }

  const dx = (tc - sc) * 70
  const dy = (tr - sr) * 70

  gsap.to(pieceRef, {
    x: dx, y: dy,
    duration: 0.25,
    ease: 'power2.out',
    onComplete: () => {
      gsap.set(pieceRef, { x: 0, y: 0 })
      finishMove(sr, sc, tr, tc, piece, target)
    }
  })
}

function finishMove(sr, sc, tr, tc, piece, target) {
  if (target) {
    if (isBlack(target)) capturedByWhite.value.push(target)
    else capturedByBlack.value.push(target)
  }

  let movedPiece = piece
  if (piece === '♙' && tr === 0) movedPiece = '♕'
  if (piece === '♟' && tr === 7) movedPiece = '♛'

  board.value[tr][tc] = movedPiece
  board.value[sr][sc] = ''
  selected.value  = null
  validMoves.value = []

  const nextTurn = turn.value === 'white' ? 'black' : 'white'
  turn.value = nextTurn

  if (isCheckmate.value) {
    winner.value = turn.value === 'white' ? 'black' : 'white'
    saveGame(winner.value)   
  }
}

async function saveGame(winnerColor) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    console.warn('No session, skipping save')
    return
  }
  const { error } = await supabase.from('games').insert({
    games: Date.now(),
    white_player_id: session.user.id,
    black_player_id: session.user.id,
    winner_id: session.user.id,
    status: 'finished'
  })
  if (error) console.error('Failed to save game:', error.message)
}
function resetGame() {
  board.value         = initialBoard()
  selected.value      = null
  turn.value          = 'white'
  winner.value        = null
  validMoves.value    = []
  pieceRefs.value     = {}
  capturedByWhite.value = []
  capturedByBlack.value = []
}


</script>

<style scoped>
.chess-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  font-family: Arial, sans-serif;
}

.winner-banner,
.check-banner {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 12px;
}
.winner-banner {
  background: #ffd700;
  color: #333;
}
.winner-banner button {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #333;
  color: #fff;
  cursor: pointer;
}
.check-banner {
  background: #ff4444;
  color: #fff;
}

.board-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.col-labels {
  display: flex;
  margin-left: 4px;
  width: 560px;
}
.col-labels span {
  width: 70px;
  text-align: center;
  font-size: 12px;
  color: #555;
}
.board-and-rows {
  display: flex;
  align-items: stretch;
}
.row-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 6px;
}
.row-labels span {
  font-size: 12px;
  color: #555;
  height: 70px;
  display: flex;
  align-items: center;
}

.board {
  border: 3px solid #4a3728;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}
.row {
  display: flex;
}
.square {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: filter 0.1s;
}
.square:hover {
  filter: brightness(1.1);
}
.light { background: #f0d9b5; }
.dark  { background: #b58863; }

.selected {
  outline: 3px solid #f6f669;
  outline-offset: -3px;
  background: rgba(246, 246, 105, 0.45) !important;
}
.valid-move {
  background: inherit;
}

.piece {
  font-size: 42px;
  cursor: pointer;
  user-select: none;
  position: relative;
  z-index: 2;
  transition: transform 0.1s;
  line-height: 1;
}
.piece:hover {
  transform: scale(1.08);
}
.piece.in-check {
  filter: drop-shadow(0 0 6px #ff2222) drop-shadow(0 0 12px #ff0000);
}

.move-dot {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.22);
  pointer-events: none;
  z-index: 1;
}
.capture-ring {
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  border: 5px solid rgba(0, 0, 0, 0.22);
  pointer-events: none;
  z-index: 3;
}

.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.turn-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  padding: 6px 16px;
  border-radius: 20px;
  border: 2px solid #ccc;
}
.turn-indicator.white { background: #fff; color: #222; border-color: #999; }
.turn-indicator.black { background: #222; color: #fff; border-color: #555; }
.turn-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: currentColor;
}
.captured {
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
}
.cap-label { font-weight: bold; margin-right: 4px; }
.cap-piece { font-size: 18px; }

.reset-button {
  padding: 10px 28px;
  border: none;
  border-radius: 8px;
  background: #4a3728;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition:  0.2s;
}
.reset-button:hover { background: #6b4f39; }
</style>
