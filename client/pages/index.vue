<template>
  <div class="scan-container">
    <div class="scan-header">
      <h1>Fjord til Fjells</h1>
      <div class="scan-input-container">
        <input 
          type="text" 
          v-model="barcode" 
          @input="onBarcodeInput" 
          placeholder="Scan or enter barcode here..."
          class="scan-input"
          ref="barcodeInput"
        />
        <i class="scan-icon">📷</i>
      </div>
    </div>

    <div v-if="scannedObject" class="result-card">
      <h2 class="item-name">{{ scannedObject.name }}</h2>
      <div class="item-details">
        <div class="detail-row">
          <span class="label">Beskrivelse:</span>
          <p class="value">{{ scannedObject.description }}</p>
        </div>
        <div class="detail-row">
          <span class="label">Kategori:</span>
          <span class="value badge">{{ scannedObject.category }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Type:</span>
          <span class="value badge">{{ scannedObject.type }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Størrelse/lengde:</span>
          <span class="value badge">{{ scannedObject.size }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const barcode = ref('');
const scannedObject = ref(null);
const barcodeInput = ref(null);

const onBarcodeInput = async () => {
  if (barcode.value.length === 6) {
    try {
      const barcodeValue = barcode.value;
      barcode.value = '';
      const response = await axios.get(`http://localhost:5000/scan/${barcodeValue}`);
      scannedObject.value = response.data;
      barcodeInput.value.focus();
    } catch (error) {
      console.error('Error scanning barcode:', error);
      scannedObject.value = null;
      barcodeInput.value.focus();
    }
  }
};
</script>

<style scoped>
.scan-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.scan-header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
}

.scan-input-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.scan-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  font-size: 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.scan-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.scan-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #718096;
}

.result-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-name {
  color: #1a202c;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  padding: 0.5rem 0;
}

.label {
  min-width: 120px;
  font-weight: 600;
  color: #1a202c;
}

.value {
  flex: 1;
  color: #1a202c;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #ebf4ff;
  color: #2b6cb0;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

p.value {
  margin: 0;
  line-height: 1.5;
}
</style>
