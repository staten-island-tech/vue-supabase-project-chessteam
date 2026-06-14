<template>
  <div class="chess-container">
    <div class="board">
      <div v-for="(row, r) in 8" :key="r" class="row">
        <div
          v-for="(col, c) in 8"
          :key="c"
          class="square"
          :class="[
            (r + c) % 2 === 0 ? 'light' : 'dark',
            selected && selected.r === r && selected.c === c ? 'selected' : ''
          ]"
          @click="handleClick(r, c)"
        >
          <span class="piece">
            {{ getPiece(r, c) }}
          </span>
        </div>
      </div>
    </div>

    <div class="status">
      <p>Current Turn: {{ turn }}</p>
      <p>Game Status: {{ gameStatus }}</p>
    </div>

    <div v-if="winner" class="winner-popup">
      <p>{{ winner }} has won!</p>
      <button @click="resetGame">Reset Game</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

// initial board
const initialBoard = () => ([
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"],
])

const board = ref(initialBoard())
const selected = ref(null)
const turn = ref("white")
const winner = ref(null)
const gameStatus = ref("Active")

const isWhite = (p) => p && "♙♖♘♗♕♔".includes(p)
const isBlack = (p) => p && "♟♜♞♝♛♚".includes(p)

const getPiece = (r, c) => board.value[r][c]

function handleClick(r, c) {
  if (winner.value) return

  const piece = getPiece(r, c)

  if (!selected.value) {
    if (!piece) return
    if (turn.value === "white" && !isWhite(piece)) return
    if (turn.value === "black" && !isBlack(piece)) return
    selected.value = { r, c }
    return
  }

  if (selected.value.r === r && selected.value.c === c) {
    selected.value = null
    return
  }

  attemptMove(selected.value.r, selected.value.c, r, c)
}

function attemptMove(sr, sc, tr, tc) {
  const piece = getPiece(sr, sc)
  const target = getPiece(tr, tc)

  // Don't allow kings to be captured
  if (target === "♔" || target === "♚") return

  if (isWhite(piece) && isWhite(target)) return
  if (isBlack(piece) && isBlack(target)) return

  if (!canPieceMove(piece, sr, sc, tr, tc)) {
    selected.value = null
    return
  }

  const oldTarget = target
  board.value[tr][tc] = piece
  board.value[sr][sc] = ""

  const enemy = turn.value === "white" ? "black" : "white"
  const kingPos = findKing(turn.value)

  const inCheckAfterMove = isSquareAttacked(kingPos.r, kingPos.c, enemy)

  if (inCheckAfterMove) {
    board.value[sr][sc] = piece
    board.value[tr][tc] = oldTarget
    selected.value = null
    return
  }

selected.value = null

turn.value = enemy

const newKingPos = findKing(turn.value)
const newEnemy = turn.value === "white" ? "black" : "white"

const inCheck = isSquareAttacked(
  newKingPos.r,
  newKingPos.c,
  newEnemy
)

const hasMove = hasAnyLegalMove(turn.value)

if (inCheck) {
  if (!hasMove) {
    winner.value = newEnemy
    gameStatus.value = "Checkmate!"
    return
  }

  gameStatus.value = "Check!"
} else {
  gameStatus.value = "Active"
}

} // <-- closes attemptMove()

function canPieceMove(piece, sr, sc, tr, tc) {
  const dr = tr - sr
  const dc = tc - sc
  const target = board.value[tr][tc]

  if (piece === "♙") {
    if (dc === 0 && dr === -1 && target === "") return true
    if (dc === 0 && dr === -2 && sr === 6 && target === "" && board.value[5][sc] === "") return true
    if (dr === -1 && Math.abs(dc) === 1 && isBlack(target)) return true
    return false
  }

  if (piece === "♟") {
    if (dc === 0 && dr === 1 && target === "") return true
    if (dc === 0 && dr === 2 && sr === 1 && target === "" && board.value[2][sc] === "") return true
    if (dr === 1 && Math.abs(dc) === 1 && isWhite(target)) return true
    return false
  }

  if ("♖♜".includes(piece)) {
    if (sr !== tr && sc !== tc) return false
    return pathClear(sr, sc, tr, tc)
  }

  if ("♗♝".includes(piece)) {
    if (Math.abs(dr) !== Math.abs(dc)) return false
    return pathClear(sr, sc, tr, tc)
  }

  if ("♕♛".includes(piece)) {
    if (sr === tr || sc === tc || Math.abs(dr) === Math.abs(dc)) {
      return pathClear(sr, sc, tr, tc)
    }
    return false
  }

  if ("♘♞".includes(piece)) {
    return (
      (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
      (Math.abs(dr) === 1 && Math.abs(dc) === 2)
    )
  }

  if ("♔♚".includes(piece)) {
    return Math.abs(dr) <= 1 && Math.abs(dc) <= 1
  }

  return false
}

function pathClear(sr, sc, tr, tc) {
  const dr = Math.sign(tr - sr)
  const dc = Math.sign(tc - sc)

  let r = sr + dr
  let c = sc + dc

  while (r !== tr || c !== tc) {
    if (board.value[r][c] !== "") return false
    r += dr
    c += dc
  }

  return true
}

function findKing(color) {
  const king = color === "white" ? "♔" : "♚"
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board.value[r][c] === king) return { r, c }
    }
  }
  return null
}

function isSquareAttacked(r, c, byColor) {
  const enemyPieces = byColor === "white" ? isWhite : isBlack

  for (let rr = 0; rr < 8; rr++) {
    for (let cc = 0; cc < 8; cc++) {
      const piece = board.value[rr][cc]

      if (!enemyPieces(piece)) continue

      const dr = r - rr
      const dc = c - cc
      if ("♖♜♕♛".includes(piece)) {
        if (rr === r || cc === c) {
          if (pathClear(rr, cc, r, c)) return true
        }
      }
      if ("♗♝♕♛".includes(piece)) {
        if (Math.abs(dr) === Math.abs(dc)) {
          if (pathClear(rr, cc, r, c)) return true
        }
      }
      if ("♘♞".includes(piece)) {
        if (
          (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
          (Math.abs(dr) === 1 && Math.abs(dc) === 2)
        ) {
          return true
        }
      }
      if (piece === "♟") {
        if (rr + 1 === r && Math.abs(cc - c) === 1) {
          return true
        }
      }
      if (piece === "♙") {
        if (rr - 1 === r && Math.abs(cc - c) === 1) {
          return true
        }
      }
      if ("♔♚".includes(piece)) {
        if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) {
          return true
        }
      }
    }
  }

  return false
}

function hasAnyLegalMove(color) {
  const enemy = color === "white" ? "black" : "white"

  for (let sr = 0; sr < 8; sr++) {
    for (let sc = 0; sc < 8; sc++) {
      const piece = board.value[sr][sc]
      if (!piece) continue
      if (color === "white" && !isWhite(piece)) continue
      if (color === "black" && !isBlack(piece)) continue

      for (let tr = 0; tr < 8; tr++) {
        for (let tc = 0; tc < 8; tc++) {
          const target = board.value[tr][tc]
          if (color === "white" && isWhite(target)) continue
          if (color === "black" && isBlack(target)) continue

          if (!canPieceMove(piece, sr, sc, tr, tc)) continue

          const oldPiece = piece
          const oldTarget = target
          board.value[tr][tc] = oldPiece
          board.value[sr][sc] = ""

          const kingPos = findKing(color)
          const inCheck = isSquareAttacked(
            kingPos.r,
            kingPos.c,
            enemy
          )

          board.value[sr][sc] = oldPiece
          board.value[tr][tc] = oldTarget

          if (!inCheck) return true
        }
      }
    }
  }

  return false
}

function resetGame() {
  board.value = initialBoard()
  turn.value = "white"
  winner.value = null
  gameStatus.value = "Active"
  selected.value = null
}
</script>

<style scoped>
.chess-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}

.board {
  border: 4px solid #333;
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
}

.light {
  background-color: #f0d9b5;
}

.dark {
  background-color: #b58863;
}

.piece {
  font-size: 42px;
  cursor: pointer;
  user-select: none;
}

.status {
  text-align: center;
  font-size: 18px;
}

.selected {
  outline: 3px solid yellow;
}

.winner-popup {
  margin-top: 20px;
  padding: 15px;
  background: #222;
  color: #fff;
  border-radius: 8px;
  text-align: center;
}

.winner-popup button {
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  background: #4caf50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>


