<!-- App Footer Component -->
<template>
  <footer class="footer">
    <div class="grid grid-footer boxed">
      <div>
        <router-link to="/" class="logo" role="img" aria-label="nextash">
          <img src="/assets/nextash_store/images/logos/logo.png" width="80" class="image" alt="Nextash Logo" />
        </router-link>
        <div class="social-group">
          <a href="#" class="bx bxl-facebook-circle social-link"></a>
          <a href="#" class="bx bxl-twitter social-link"></a>
          <a href="#" class="bx bxl-instagram social-link"></a>
          <a href="#" class="bx bxl-pinterest social-link"></a>
        </div>
      </div>
      <ul class="menu-list">
        <li class="list-item" role="listitem">
          <h3 class="list-title">Explore</h3>
        </li>
        <li class="list-item" role="listitem">
          <router-link to="/" class="list-link">Home</router-link>
        </li>
        <li class="list-item" role="listitem">
          <a target="_blank" href="https://nextash.com/about-us/" class="list-link">About</a>
        </li>
      </ul>
      <ul class="menu-list">
        <li class="list-item" role="listitem">
        </li>
        <li class="list-item" role="listitem">
          <a target="_blank" href="https://nextash.com/contact-us/" class="list-link">Contact</a>
        </li>
        <li class="list-item" role="listitem">
          <a target="_blank" href="https://nextash.com/faqs/" class="list-link">FAQs</a>
        </li>
      </ul>
      <ul class="menu-list">
        <li class="list-item" role="listitem">
          <h3 class="list-title">Legal</h3>
        </li>
        <li class="list-item" role="listitem">
          <router-link to="/terms-of-use" class="list-link">Terms of use</router-link>
        </li>
        <li class="list-item" role="listitem">
          <router-link to="/privacy-policy" class="list-link">Privacy</router-link>
        </li>
        <li class="list-item" role="listitem">
          <router-link to="/cookies-policy" class="list-link">Cookies</router-link>
        </li>
        <li class="list-item" role="listitem">
          <router-link to="/refunds-policy" class="list-link">Refunds</router-link>
        </li>
      </ul>
    </div>
    <p class="copyright">
      &copy; 2024
      <router-link to="/" class="link">Nextash</router-link>
    </p>
  </footer>

  <!-- Copyright Footer -->
  <footer class="footer">
    <p class="copyright" style="border-top: none">
      &copy; 2024
      This website is powered by NexTash (SMC-PVT) Ltd, and all right reserved to the
      <a href="https://nextash.com/" class="link" target="_blank" style="text-decoration: underline;">NexTash</a>.
      Please check parent site for other
      <a href="https://nextash.com/" target="_blank" class="link" style="text-decoration: underline;">terms of use and policies.</a>
    </p>
  </footer>
</template>

<script setup>
// Footer component logic if needed
</script>
