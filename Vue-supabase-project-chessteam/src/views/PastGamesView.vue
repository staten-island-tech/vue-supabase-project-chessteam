<template>
  <div class="past-games">
    <h2>Past Games</h2>
    <p>Total games played: {{ totalGames }}</p>

    <div v-for="game in games" :key="game.games">
  <strong>Status:</strong> {{ game.status }} |
  <strong>Player:</strong> {{ game.profiles?.username }} |
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