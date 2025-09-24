<template>
  <div>
    <!-- Page Head -->
    <section class="page-head boxed">
      <h1 class="page-title">Downloads</h1>
      <ul class="breadcrumb" role="navigation" aria-label="Breadcrumb">
        <li class="page-item">
          <router-link to="/" class="page-link" aria-label="Home">Home</router-link>
        </li>
        <li class="page-item active">Downloads</li>
      </ul>
    </section>

    <!-- Main Content -->
    <main class="boxed">
      <section class="section-meta">
        <h4 class="section-title">Products <span class="count">({{ totalCount }})</span></h4>
        <div class="select">
          <label for="sort">Sort</label>
          <select v-model="sortOrder" @change="fetchDownloads">
            <option value="desc">Recents</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </section>

      <section class="grid grid-downloads">
        <div v-if="loading" class="loading">Loading downloads...</div>
        <div v-else-if="downloads.length === 0" class="no-records">No downloads available!</div>
        <div v-else v-for="download in downloads" :key="download.name" class="card card-download">
          <div class="card-image">
            <img :src="download.image" class="image" :alt="download.title" />
          </div>
          <div class="card-body">
            <h3 class="card-title text-ellipsis">{{ download.title }}</h3>
            <p class="card-subtitle text-ellipsis-2">{{ download.description }}</p>
            <div class="download-meta">
              <span class="download-size">{{ download.file_size }}</span>
              <span class="download-type">{{ download.file_type }}</span>
            </div>
          </div>
          <div class="card-foot">
            <a :href="download.download_url" :download="download.filename" class="btn btn-primary btn-sm btn-pill"
              @click="trackDownload(download)">
              <i class="bx bx-download"></i> Download
            </a>
          </div>
        </div>
      </section>

      <section v-if="hasMore" class="pagination">
        <button class="btn btn-primary btn-sm btn-pill" @click="loadMore" :disabled="loading">
          {{ loading ? 'Loading...' : 'Load more' }}
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ApiUrl, apiRequest, searchParams } from '@/utils/api'
import { showMessage } from '@/utils/message'

const downloads = ref([])
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const hasMore = ref(false)
const sortOrder = ref('desc')

const fetchDownloads = async (page = 1, append = false) => {
  loading.value = true

  try {
    const params = {
      limit: 12,
      page: page,
      sort: sortOrder.value
    }

    const queryString = searchParams(params)
    const response = await apiRequest(ApiUrl(`nextash_store.events.downloads.listing?${queryString}`))
    const data = response.message

    if (data.count === 0) {
      totalCount.value = 0
      downloads.value = []
    } else {
      totalCount.value = data.count
      if (append) {
        downloads.value = [...downloads.value, ...data.results]
      } else {
        downloads.value = data.results
      }
    }

    hasMore.value = !!data.next
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching downloads:', error)
    showMessage('Failed to load downloads', 'error')
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (hasMore.value) {
    fetchDownloads(currentPage.value + 1, true)
  }
}

const trackDownload = async (download) => {
  try {
    await apiRequest(ApiUrl('nextash_store.events.downloads.track'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': document.getElementById('csrf_token')?.value
      },
      body: JSON.stringify({
        download_name: download.name
      })
    })
  } catch (error) {
    console.error('Error tracking download:', error)
  }
}

onMounted(() => {
  fetchDownloads()
})
</script>
