<template>
  <div>
    <nav>
      <h1>Chess Game</h1>
      <RouterLink to="/past-games" class="nav-link">Past Games</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}
.nav-link {
  text-decoration: none;
  color: #4a3728;
  font-weight: bold;
  border: 2px solid #4a3728;
  padding: 6px 16px;
  border-radius: 8px;
}
</style>