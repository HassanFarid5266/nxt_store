<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="card modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Edit Profile Information</h3>
        <button type="button" class="modal-close-button" @click="closeModal" aria-label="Close modal">
          <i class="bx bx-x"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div class="form-cols-2">
          <div class="form-group">
            <label for="modal_first_name" class="form-label">First Name</label>
            <input type="text" class="form-field" id="modal_first_name" v-model="localForm.first_name" required />
          </div>
          <div class="form-group">
            <label for="modal_last_name" class="form-label">Last Name</label>
            <input type="text" class="form-field" id="modal_last_name" v-model="localForm.last_name" required />
          </div>
        </div>

        <div class="form-cols-2">
          <div class="form-group">
            <label for="modal_email" class="form-label">Email Address</label>
            <input type="email" class="form-field" id="modal_email" v-model="localForm.email" required />
          </div>
          <div class="form-group">
            <label for="modal_phone" class="form-label">Phone Number</label>
            <input type="tel" class="form-field" id="modal_phone" v-model="localForm.phone" />
          </div>
        </div>

        <div class="form-cols-2">
          <div class="form-group">
            <label for="modal_country" class="form-label">Country</label>
            <input type="text" class="form-field" id="modal_country" v-model="localForm.country" />
          </div>
          <div class="form-group">
            <label for="modal_state" class="form-label">State</label>
            <input type="text" class="form-field" id="modal_state" v-model="localForm.state" />
          </div>
        </div>

        <div class="form-cols-2">
          <div class="form-group">
            <label for="modal_city" class="form-label">City</label>
            <input type="text" class="form-field" id="modal_city" v-model="localForm.city" />
          </div>
          <div class="form-group">
            <label for="modal_postal_code" class="form-label">Postal Code</label>
            <input type="text" class="form-field" id="modal_postal_code" v-model="localForm.postal_code" />
          </div>
        </div>

        <div class="form-group">
          <label for="modal_address" class="form-label">Address</label>
          <input type="text" class="form-field" id="modal_address" v-model="localForm.address" />
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="btn btn-pill btn-light" @click="closeModal">
          Cancel
        </button>
        <button type="submit" class="btn btn-pill btn-primary" @click="handleSubmit" :disabled="isUpdating">
          {{ isUpdating ? 'Updating...' : 'Update Profile' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { showMessage } from '@/utils/message'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  profileData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'updated'])

const localForm = ref({
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

const isUpdating = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Watch for profile data changes and update local form
watch(() => props.profileData, (newData) => {
  if (newData) {
    localForm.value = {
      first_name: newData.first_name || '',
      last_name: newData.last_name || '',
      email: newData.email || '',
      phone: newData.phone || '',
      country: newData.country || '',
      state: newData.state || '',
      city: newData.city || '',
      postal_code: newData.postal_code || '',
      address: newData.address || ''
    }
  }
}, { immediate: true })

// Reset messages when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    errorMessage.value = ''
    successMessage.value = ''
  }
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = async (event) => {
  event.preventDefault()

  isUpdating.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Save to localStorage
    const currentUser = JSON.parse(localStorage.getItem('user_profile') || '{}')
    const updatedUser = { ...currentUser, ...localForm.value }
    localStorage.setItem('user_profile', JSON.stringify(updatedUser))

    successMessage.value = 'Profile updated successfully!'
    showMessage('Profile updated successfully!', 'success')

    // Emit updated event to parent with new data
    emit('updated', updatedUser)

    // Close modal after a short delay to show success message
    setTimeout(() => {
      closeModal()
    }, 1500)
  } catch (error) {
    errorMessage.value = error.message || 'Failed to update profile'
  } finally {
    isUpdating.value = false
  }
}
</script>
