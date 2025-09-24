<!-- 403 Forbidden Page -->
<template>
  <div class="error-page">
    <div class="error-container boxed">
      <div class="error-content">
        <h1 class="error-code">403</h1>
        <h2 class="error-title">Access Forbidden</h2>
        <p class="error-message">
          You don't have permission to access this resource. 
          Please contact the administrator if you believe this is an error.
        </p>
        <div class="error-actions">
          <router-link to="/" class="btn btn-primary btn-lg">
            <i class="bx bx-home"></i> Go Home
          </router-link>
          <router-link to="/login" class="btn btn-secondary btn-lg">
            <i class="bx bx-user"></i> Login
          </router-link>
        </div>
      </div>
      <div class="error-illustration">
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="150" r="100" fill="var(--danger)" opacity="0.1"/>
          <text x="200" y="150" text-anchor="middle" dy="0.3em" 
                font-size="60" font-weight="bold" fill="var(--danger)">403</text>
          <text x="200" y="200" text-anchor="middle" dy="0.3em" 
                font-size="16" fill="var(--text)" opacity="0.7">Forbidden</text>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.error-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.error-content {
  text-align: left;
}

.error-code {
  font-size: 6rem;
  font-weight: 900;
  color: var(--danger);
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 1rem 0;
}

.error-message {
  font-size: 1.1rem;
  color: var(--text);
  opacity: 0.8;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.error-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-illustration svg {
  width: 100%;
  max-width: 300px;
  height: auto;
}

@media (max-width: 768px) {
  .error-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .error-content {
    text-align: center;
  }
  
  .error-code {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-actions {
    justify-content: center;
  }
}
</style>
