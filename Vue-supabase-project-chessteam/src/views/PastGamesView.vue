<template>
  <div class="past-games">
    <h2>Past Games</h2>
    <p>Total games played: {{ totalGames }}</p>

    <div v-for="game in games" :key="game.games">
      <strong>Status:</strong> {{ game.status }} |
      <strong>Winner ID:</strong> {{ game.winner_id }} |
      <strong>Date:</strong> {{ new Date(game.created_at).toLocaleDateString() }}
      <button @click="updateGame(game.games)">Mark Reviewed</button>
      <button @click="deleteGame(game.games)">Delete</button>
    </div>

    <hr />

    <h2>Supabase Aggregation</h2>
    <div class="result-box">
      <button @click="runAggregation">Log Sample Aggregation</button>
      <pre>{{ aggregationResult }}</pre>
    </div>

    <h2>Supabase Join</h2>
    <div class="result-box">
      <button @click="runJoin">Log Sample Join</button>
      <pre>{{ joinResult }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

const games = ref([])
const aggregationResult = ref('')
const joinResult = ref('')

onMounted(async () => {
  const { data, error } = await supabase
    .from('games')
    .select('games, status, created_at, winner_id, white_player_id')

  if (error) console.error('Failed to fetch games:', error.message)
  else games.value = data || []
})

const totalGames = computed(() => games.value.length)

async function runAggregation() {
  const { data, error } = await supabase
    .from('games')
    .select('status, games')

  if (error) {
    aggregationResult.value = error.message
  } else {
    const counts = {}
    data.forEach(g => {
      counts[g.status] = (counts[g.status] || 0) + 1
    })
    aggregationResult.value = JSON.stringify(
      Object.entries(counts).map(([status, total]) => ({ status, total })),
      null, 2
    )
  }
}

async function runJoin() {
  const { data, error } = await supabase
    .from('games')
    .select(`
      games,
      status,
      created_at,
      profiles!games_white_player_id_fkey(username, rating)
    `)

  if (error) {
    joinResult.value = error.message
  } else {
    joinResult.value = JSON.stringify(data, null, 2)
  }
}

async function updateGame(gameId) {
  const { error } = await supabase
}
</script> 