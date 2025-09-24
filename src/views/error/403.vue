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
