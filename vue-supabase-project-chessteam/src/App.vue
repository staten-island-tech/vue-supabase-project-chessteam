<template>
  <div class="chess-container">
    

    <div class="board">
      
      
      <div 
        v-for="(row, r) in 8" 
        :key="r" 
        class="row"
      >
        
       
        <div
          v-for="(col, c) in 8"
          :key="c"
          class="square"
          :class="(r + c) % 2 === 0 ? 'light' : 'dark'"
        >
        </div>

      </div>

    </div>

  
    <div class="status">
      <p>Current Turn: White</p>
      <p>Game Status: Active</p>
    </div>

  </div>
</template>

<style scoped>
/* Layout */
.chess-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  height: 100vh;
  background-color: #222;
  color: white;
  font-family: Arial, sans-serif;
}

/* Board */
.board {
  display: flex;
  flex-direction: column;
  border: 4px solid #444;
}

/* Row */
.row {
  display: flex;
}

/* Square */
.square {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  cursor: pointer;
  transition: 0.2s;
}

/* Colors */
.light {
  background-color: #f0d9b5;
}

.dark {
  background-color: #b58863;
}

/* Hover */
.square:hover {
  transform: scale(1.05);
}

/* Highlight (for later JS) */
.highlight {
  background-color: yellow !important;
}

/* Selected piece */
.selected {
  outline: 3px solid red;
}

/* Side panel */
.status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 18px;
}
</style>