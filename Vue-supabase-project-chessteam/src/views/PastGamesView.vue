<template>
  <div class="past-games">
    <h2>Past Games</h2>
    <p>Total games played: {{ totalGames }}</p>

    <div v-for="game in games" :key="game.games">
  <strong>Status:</strong> {{ game.status }} |
  <strong>Player:</strong> {{ game.profiles?.username || 'Unknown' }} |
  <strong>Date:</strong> {{ new Date(game.created_at).toLocaleDateString() }}
  <button @click="updateGame(game.games)">Mark Reviewed</button>
  <button @click="deleteGame(game.games)">Delete</button>
</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

const games = ref([])
onMounted(async () => {
  const { data, error } = await supabase
    .from('games')
    .select(`
      games,
      status,
      created_at,
      winner_id,
      white_player_id,
      profiles!games_white_player_id_fkey(username, rating)
    `)

  if (error) console.error('Failed to fetch games:', error.message)
  else games.value = data || []
})

const totalGames = computed(() => games.value.length)

async function updateGame(gameId) {
  const { error } = await supabase
    .from('games')
    .update({ status: 'reviewed' })
    .eq('games', gameId)
  if (error) console.error(error.message)
  else {
    const game = games.value.find(g => g.games === gameId)
    if (game) game.status = 'reviewed'
  }
}

async function deleteGame(gameId) {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('games', gameId)
  if (error) console.error(error.message)
  else games.value = games.value.filter(g => g.games !== gameId)
}
</script>

<style scoped>
.past-games {
  padding: 24px;
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

div div {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

button:first-of-type {
  background: #4a3728;
  color: white;
}

button:last-of-type {
  background: #cc3333;
  color: white;
}
</style>