<!-- Account/Profile Page View -->
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
      <section>
        <input type="hidden" id="id" name="id" :value="user?.name">
        <form @submit.prevent="uploadProfileImage" enctype="multipart/form-data">
          <div class="profile-avatar">
            <img 
              :src="imagePreview || user?.user_image || '/assets/nextash_store/images/man.png'" 
              class="image" 
              :alt="`${user?.first_name} ${user?.last_name}`"
            >
            <label for="image" class="btn btn-light btn-circle btn-circle-lg bx bx-camera">
              <input 
                type="file" 
                id="image" 
                name="image" 
                hidden 
                @change="handleImageChange"
                accept="image/*"
              />
            </label>
          </div>
          <div v-if="showImageButtons" class="center" id="profile-change-btns">
            <button type="button" class="btn btn-light btn-pill btn-sm" @click="cancelImageChange">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-pill btn-sm">Upload</button>
          </div>
        </form>
      </section>

      <section>
        <form @submit.prevent="updateProfile" class="card">
          <div class="card-head">
            <h3 class="card-title">General information</h3>
          </div>
          <div class="card-body">
            <div class="form-cols-2">
              <div class="form-group">
                <label for="first_name" class="form-label">First Name</label>
                <input 
                  type="text" 
                  class="form-field" 
                  id="first_name" 
                  name="first_name"
                  v-model="profileForm.first_name"
                />
              </div>
              <div class="form-group">
                <label for="last_name" class="form-label">Last Name</label>
                <input 
                  type="text" 
                  class="form-field" 
                  id="last_name" 
                  name="last_name"
                  v-model="profileForm.last_name"
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
                  name="email"
                  v-model="profileForm.email"
                />
              </div>
              <div class="form-group">
                <label for="phone" class="form-label">Phone Number</label>
                <input 
                  type="text" 
                  class="form-field" 
                  id="phone" 
                  name="phone"
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
                  name="country"
                  v-model="profileForm.country"
                />
              </div>
              <div class="form-group">
                <label for="state" class="form-label">State</label>
                <input 
                  type="text" 
                  class="form-field" 
                  id="state" 
                  name="state"
                  v-model="profileForm.state"
                />
              </div>
              <div class="form-group">
                <label for="city" class="form-label">City</label>
                <input 
                  type="text" 
                  class="form-field" 
                  id="city" 
                  name="city"
                  v-model="profileForm.city"
                />
              </div>
              <div class="form-group">
                <label for="postal_code" class="form-label">Postal Code</label>
                <input 
                  type="text" 
                  class="form-field" 
                  id="postal_code" 
                  name="postal_code"
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
                name="address"
                v-model="profileForm.address"
              />
            </div>
          </div>
          <div class="card-foot center">
            <button class="btn btn-pill btn-primary" type="submit" :disabled="loading">
              {{ loading ? 'Updating...' : 'Update' }}
            </button>
          </div>
        </form>

        <div class="card">
          <div class="card-head">
            <h3 class="card-title">Reset password</h3>
            <br><br>
            <button 
              class="btn btn-pill btn-primary btn-block" 
              @click="sendPasswordResetLink"
              :disabled="resetLoading"
            >
              {{ resetLoading ? 'Sending...' : 'Send Password Reset Link' }}
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ApiUrl, apiRequest } from '@/utils/api'
import { showMessage } from '@/utils/message'

const authStore = useAuthStore()
const user = ref(authStore.user)
const loading = ref(false)
const resetLoading = ref(false)
const imagePreview = ref('')
const showImageButtons = ref(false)

const profileForm = reactive({
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

const loadUserData = () => {
  if (user.value) {
    profileForm.first_name = user.value.first_name || ''
    profileForm.last_name = user.value.last_name || ''
    profileForm.email = user.value.email || ''
    profileForm.phone = user.value.phone || ''
    profileForm.country = user.value.country || ''
    profileForm.state = user.value.state || ''
    profileForm.city = user.value.city || ''
    profileForm.postal_code = user.value.postal_code || ''
    profileForm.address = user.value.address || ''
  }
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  
  if (file) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
      showImageButtons.value = true
    } else {
      showMessage('Please upload a valid image file.', 'error')
      event.target.value = ''
      showImageButtons.value = false
    }
  }
}

const cancelImageChange = () => {
  imagePreview.value = ''
  showImageButtons.value = false
  document.getElementById('image').value = ''
}

const uploadProfileImage = async (event) => {
  try {
    loading.value = true
    const formData = new FormData(event.target)
    
    const response = await apiRequest(ApiUrl('nextash_store.events.profile.upload_image'), {
      method: 'POST',
      body: formData
    })
    
    if (response.message) {
      showMessage('Profile image updated successfully!', 'success')
      await authStore.checkAuth() // Refresh user data
      user.value = authStore.user
      cancelImageChange()
    }
  } catch (error) {
    showMessage('Error uploading image: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  try {
    loading.value = true
    
    const response = await apiRequest(ApiUrl('nextash_store.events.profile.update'), {
      method: 'POST',
      body: JSON.stringify(profileForm)
    })
    
    if (response.message) {
      showMessage('Profile updated successfully!', 'success')
      await authStore.checkAuth() // Refresh user data
      user.value = authStore.user
    }
  } catch (error) {
    showMessage('Error updating profile: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const sendPasswordResetLink = async () => {
  try {
    resetLoading.value = true
    
    const response = await apiRequest(ApiUrl('nextash_store.events.auth.send_reset_link'), {
      method: 'POST',
      body: JSON.stringify({ email: user.value?.email })
    })
    
    if (response.message) {
      showMessage('Password reset link sent to your email!', 'success')
    }
  } catch (error) {
    showMessage('Error sending reset link: ' + error.message, 'error')
  } finally {
    resetLoading.value = false
  }
}

onMounted(() => {
  loadUserData()
})
</script>
