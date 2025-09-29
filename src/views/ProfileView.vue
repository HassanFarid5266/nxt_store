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
              <img :src="profileImagePreview || user?.user_image || '@/assets/images/man.png'" class="image"
                :alt="`${user?.first_name || ''} ${user?.last_name || ''}`" />
              <label for="image" class="btn btn-light btn-circle btn-circle-lg bx bx-camera">
                <input type="file" id="image" ref="imageInput" @change="handleImageChange" accept="image/*" hidden />
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

        <!-- Profile Information Display Section -->
        <section>
          <div class="card">
            <div class="card-head">
              <h3 class="card-title">Profile Information</h3>
            </div>
            <div class="card-body">
              <div class="profile-info-grid">
                <div class="profile-info-item">
                  <label class="form-label">Name</label>
                  <span class="form-field">{{ user?.first_name }} {{ user?.last_name }}</span>
                </div>
                <div class="profile-info-item">
                  <label class="form-label">Email</label>
                  <span class="form-field">{{ user?.email || 'Not provided' }}</span>
                </div>
                <div class="profile-info-item">
                  <label class="form-label">Phone</label>
                  <span class="form-field">{{ user?.phone || 'Not provided' }}</span>
                </div>
                <div class="profile-info-item">
                  <label class="form-label">Country</label>
                  <span class="form-field">{{ user?.country || 'Not provided' }}</span>
                </div>
                <div class="profile-info-item">
                  <label class="form-label">State</label>
                  <span class="form-field">{{ user?.state || 'Not provided' }}</span>
                </div>
                <div class="profile-info-item">
                  <label class="form-label">City</label>
                  <span class="form-field">{{ user?.city || 'Not provided' }}</span>
                </div>
                <div class="profile-info-item">
                  <label class="form-label">Postal Code</label>
                  <span class="form-field">{{ user?.postal_code || 'Not provided' }}</span>
                </div>
                <div class="profile-info-item profile-info-item-full">
                  <label class="form-label">Address</label>
                  <span class="form-field">{{ user?.address || 'Not provided' }}</span>
                </div>
              </div>
            </div>
            <div class="card-foot center">
              <button class="btn btn-pill btn-primary" @click="openProfileModal" type="button">
                <i class="bx bx-edit-alt"></i>
                Edit Profile Information
              </button>
            </div>
          </div>

          <!-- Profile Edit Modal -->
          <ProfileEditModal :is-open="isModalOpen" :profile-data="profileForm" @close="closeProfileModal"
            @updated="handleProfileUpdated" />

          <!-- Reset Password Section -->
          <div class="card">
            <div class="card-head">
              <h3 class="card-title">Reset password</h3>
              <br><br>
              <button class="btn btn-pill btn-primary btn-block" @click="sendPasswordReset"
                :disabled="passwordResetLoading">
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
import ProfileEditModal from '@/components/ProfileEditModal.vue'

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

// Modal state
const isModalOpen = ref(false)

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

const openProfileModal = () => {
  isModalOpen.value = true
}

const closeProfileModal = () => {
  isModalOpen.value = false
}

const handleProfileUpdated = () => {
  // Profile data will be automatically updated via auth store
  // Modal will close itself after update
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
