<!-- <template>
  <div class="chess-container">
    <div class="board">
      <div v-for="(row, r) in 8" :key="r" class="row">
        <div
          v-for="(col, c) in 8"
          :key="c"
          class="square"
          :class="(r + c) % 2 === 0 ? 'light' : 'dark'"
        >
          <span class="piece">
            {{ getPiece(r, c) }}
          </span>
        </div>
      </div>
    </div>

    <div class="status">
      <p>Current Turn: White</p>
      <p>Game Status: Active</p>
    </div>
  </div>
</template>

<script setup>
const board = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
]

const getPiece = (r, c) => board[r][c]
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
</style> -->
<template>
  <div>
<h2>TEST</h2>
<RouterView/>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>