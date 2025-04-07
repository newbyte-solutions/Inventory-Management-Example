<template>
  <div class="container">
    <h1>Barcode Scanner</h1>
    
    <div class="input-container">
      <input 
        type="text" 
        v-model="scannerInput"
        @change="handleScannerInput"
        placeholder="Scan barcode here"
        class="scanner-input"
      >
      <input type="file" accept="image/*" @change="scanBarcode" class="file-input">
    </div>

    <div v-if="scannedResult" class="document-container">
      <h2>Scanned Barcode:</h2>
      <p>{{ scannedResult }}</p>
    </div>

    <div v-if="document" class="document-container">
      <h2>Document Details:</h2>
      <pre>{{ document }}</pre>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { BrowserBarcodeReader } from '@zxing/library';

const document = ref(null)
const error = ref('')
const scannedResult = ref('')
const scannerInput = ref('')
let codeReader: BrowserBarcodeReader | null = null

const handleScannerInput = () => {
  if (scannerInput.value) {
    console.log('USB Scanner input received:', scannerInput.value)
    scannedResult.value = scannerInput.value
    handleDecode(scannerInput.value)
    scannerInput.value = '' // Clear the input after processing
  }
}

const scanBarcode = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) {
    console.log('No file selected for barcode scanning')
    return
  }

  try {
    console.log('Initializing barcode reader')
    codeReader = new BrowserBarcodeReader()
    console.log('Attempting to decode barcode from file:', file.name)
    const result = await codeReader.decodeFromImageFile(file)
    if (result) {
      const text = result.getText()
      console.log('Successfully decoded barcode:', text)
      scannedResult.value = text
      console.log('Scanned Result:', scannedResult.value)
      handleDecode(text)
    }
  } catch (err) {
    error.value = 'Failed to scan barcode'
    console.error('Barcode scanning error:', err)
  }
}

const handleDecode = async (decodedText: string) => {
  try {
    console.log('Sending request to server with barId:', decodedText.trim())
    const res = await axios.post('http://localhost:5000/get_object', {
      barId: decodedText.trim()
    })
    console.log('Server response received:', res.data)
    document.value = res.data
    error.value = ''
  } catch (err) {
    error.value = 'Document not found or request failed.'
    document.value = null
    console.error('API request error:', err)
  }
}

onMounted(() => {
  console.log('Component mounted, initializing barcode reader')
  codeReader = new BrowserBarcodeReader()
})

onBeforeUnmount(() => {
  console.log('Component unmounting, resetting barcode reader')
  if (codeReader) {
    codeReader.reset()
  }
})
</script>

<style scoped>
.container {
  padding: 1rem;
  min-height: 100vh;
  background-color: #f3f4f6;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.input-container {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scanner-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
  width: 300px;
}

.file-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
}

.document-container {
  margin-top: 1.5rem;
  background-color: white;
  padding: 1rem;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.document-container h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #ef4444;
  margin-top: 1rem;
}
</style>