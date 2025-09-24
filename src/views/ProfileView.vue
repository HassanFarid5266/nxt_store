<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Profile</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Profile</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="layout-profile boxed">
      <div v-if="loading" class="loading">Loading profile...</div>
      
      <template v-else>
        <!-- Profile Avatar Section -->
        <section>
          <form @submit.prevent="uploadProfileImage" class="profile-image-form" enctype="multipart/form-data">
            <div class="profile-avatar">
              <img 
                :src="profileImagePreview || user?.user_image || '@/assets/images/man.png'" 
                class="image" 
                :alt="`${user?.first_name || ''} ${user?.last_name || ''}`"
              />
              <label for="image" class="btn btn-light btn-circle btn-circle-lg bx bx-camera">
                <input 
                  type="file" 
                  id="image" 
                  ref="imageInput"
                  @change="handleImageChange" 
                  accept="image/*"
                  hidden 
                />
              </label>
            </div>
            <div v-if="showImageButtons" class="center profile-change-btns">
              <button type="button" class="btn btn-light btn-pill btn-sm" @click="cancelImageChange">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary btn-pill btn-sm" :disabled="imageUploading">
                {{ imageUploading ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
          </form>
        </section>

        <!-- General Information Section -->
        <section>
          <form @submit.prevent="updateProfile" class="card">
            <div class="card-head">
              <h3 class="card-title">General information</h3>
            </div>
            <div class="card-body">
              <div v-if="profileErrorMessage" class="alert alert-error">
                {{ profileErrorMessage }}
              </div>
              <div v-if="profileSuccessMessage" class="alert alert-success">
                {{ profileSuccessMessage }}
              </div>
              
              <div class="form-cols-2">
                <div class="form-group">
                  <label for="first_name" class="form-label">First Name</label>
                  <input 
                    type="text" 
                    class="form-field" 
                    id="first_name" 
                    v-model="profileForm.first_name"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="last_name" class="form-label">Last Name</label>
                  <input 
                    type="text" 
                    class="form-field" 
                    id="last_name" 
                    v-model="profileForm.last_name"
                    required
                  />
                </div>
              </div>
              <div class="form-cols-2">
                <div class="form-group">
                  <label for="email" class="form-label">Email Address</label>
                  <input 
                    type="email" 
                    class="form-field" 
                    id="email" 
                    v-model="profileForm.email"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="phone" class="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    class="form-field" 
                    id="phone" 
                    v-model="profileForm.phone"
                  />
                </div>
              </div>
              <div class="form-cols-2">
                <div class="form-group">
                  <label for="country" class="form-label">Country</label>
                  <input 
                    type="text" 
                    class="form-field" 
                    id="country" 
                    v-model="profileForm.country"
                  />
                </div>
                <div class="form-group">
                  <label for="state" class="form-label">State</label>
                  <input 
                    type="text" 
                    class="form-field" 
                    id="state" 
                    v-model="profileForm.state"
                  />
                </div>
                <div class="form-group">
                  <label for="city" class="form-label">City</label>
                  <input 
                    type="text" 
                    class="form-field" 
                    id="city" 
                    v-model="profileForm.city"
                  />
                </div>
                <div class="form-group">
                  <label for="postal_code" class="form-label">Postal Code</label>
                  <input 
                    type="text" 
                    class="form-field" 
                    id="postal_code" 
                    v-model="profileForm.postal_code"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="address" class="form-label">Address</label>
                <input 
                  type="text" 
                  class="form-field" 
                  id="address" 
                  v-model="profileForm.address"
                />
              </div>
            </div>
            <div class="card-foot center">
              <button class="btn btn-pill btn-primary" type="submit" :disabled="profileUpdating">
                {{ profileUpdating ? 'Updating...' : 'Update' }}
              </button>
            </div>
          </form>

          <!-- Reset Password Section -->
          <div class="card">
            <div class="card-head">
              <h3 class="card-title">Reset password</h3>
              <br><br>
              <button 
                class="btn btn-pill btn-primary btn-block" 
                @click="sendPasswordReset"
                :disabled="passwordResetLoading"
              >
                {{ passwordResetLoading ? 'Sending...' : 'Send Password Reset Link' }}
              </button>
            </div>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ApiUrl, apiRequest } from '@/utils/api'
import { showMessage } from '@/utils/message'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
const loading = ref(true)

// Profile form
const profileForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  country: '',
  state: '',
  city: '',
  postal_code: '',
  address: ''
})

const profileUpdating = ref(false)
const profileErrorMessage = ref('')
const profileSuccessMessage = ref('')

// Image upload
const imageInput = ref(null)
const profileImagePreview = ref('')
const showImageButtons = ref(false)
const imageUploading = ref(false)

// Password reset
const passwordResetLoading = ref(false)

const loadUserProfile = async () => {
  try {
    await authStore.checkAuth()
    if (user.value) {
      profileForm.value = {
        first_name: user.value.first_name || '',
        last_name: user.value.last_name || '',
        email: user.value.email || '',
        phone: user.value.phone || '',
        country: user.value.country || '',
        state: user.value.state || '',
        city: user.value.city || '',
        postal_code: user.value.postal_code || '',
        address: user.value.address || ''
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  } finally {
    loading.value = false
  }
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  
  if (file) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        profileImagePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
      showImageButtons.value = true
    } else {
      alert('Please upload a valid image file.')
      imageInput.value.value = ''
      showImageButtons.value = false
    }
  }
}

const cancelImageChange = () => {
  profileImagePreview.value = ''
  showImageButtons.value = false
  imageInput.value.value = ''
}

const uploadProfileImage = async () => {
  const file = imageInput.value.files[0]
  if (!file) return

  imageUploading.value = true

  try {
    const formData = new FormData()
    formData.append('image', file)

    await apiRequest(ApiUrl('nextash_store.events.profile.upload_image'), {
      method: 'POST',
      headers: {
        'X-Frappe-CSRF-Token': document.getElementById('csrf_token')?.value
      },
      body: formData
    })

    await authStore.checkAuth() // Refresh user data
    showMessage('Profile image updated successfully!', 'success')
    cancelImageChange()
  } catch (error) {
    console.error('Error uploading image:', error)
    showMessage('Failed to upload image', 'error')
  } finally {
    imageUploading.value = false
  }
}

const updateProfile = async () => {
  profileUpdating.value = true
  profileErrorMessage.value = ''
  profileSuccessMessage.value = ''

  try {
    await apiRequest(ApiUrl('nextash_store.events.profile.update'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': document.getElementById('csrf_token')?.value
      },
      body: JSON.stringify(profileForm.value)
    })

    await authStore.checkAuth() // Refresh user data
    profileSuccessMessage.value = 'Profile updated successfully!'
    showMessage('Profile updated successfully!', 'success')
  } catch (error) {
    profileErrorMessage.value = error.message || 'Failed to update profile'
  } finally {
    profileUpdating.value = false
  }
}

const sendPasswordReset = async () => {
  passwordResetLoading.value = true

  try {
    await authStore.forgotPassword(user.value.email)
    showMessage('Password reset link sent to your email!', 'success')
  } catch (error) {
    showMessage('Failed to send password reset link', 'error')
  } finally {
    passwordResetLoading.value = false
  }
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
.page-head {
  background: var(--dark);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text);
}

.breadcrumb {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0.5rem;
}

.page-item {
  display: flex;
  align-items: center;
}

.page-item:not(:last-child)::after {
  content: '/';
  margin-left: 0.5rem;
  color: var(--muted);
}

.page-item.active {
  color: var(--muted);
}

.page-link {
  color: var(--primary);
  text-decoration: none;
}

.page-link:hover {
  text-decoration: underline;
}

.layout-profile {
  display: grid;
  gap: 2rem;
  padding: 2rem 0;
}

.profile-avatar {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.profile-avatar .image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--border);
}

.btn-circle {
  position: absolute;
  bottom: 0;
  right: calc(50% - 80px);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-circle-lg {
  width: 48px;
  height: 48px;
}

.profile-change-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.center {
  text-align: center;
}

.card {
  background: var(--dark);
  border-radius: var(--rounded);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.card-head {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}

.card-body {
  padding: 1.5rem;
}

.card-foot {
  padding: 1.5rem;
  border-top: 1px solid var(--border);
}

.form-cols-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text);
}

.form-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--rounded);
  background: var(--body);
  color: var(--text);
  font-size: 1rem;
}

.form-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.1);
}

.btn-pill {
  border-radius: 50px;
}

.btn-block {
  width: 100%;
}

.btn-light {
  background: var(--light);
  color: var(--text);
}

.alert {
  padding: 0.75rem;
  border-radius: var(--rounded);
  margin-bottom: 1rem;
}

.alert-error {
  background: var(--danger-subtle);
  color: var(--danger);
  border: 1px solid var(--danger);
}

.alert-success {
  background: var(--success-subtle);
  color: var(--success);
  border: 1px solid var(--success);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--muted);
}

@media (max-width: 768px) {
  .form-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .profile-change-btns {
    flex-direction: column;
  }
}
</style>
