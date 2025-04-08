<template>
  <div>
    <h1>Scan a Barcode</h1>
    <input type="text" v-model="barcode" @input="onBarcodeScan" placeholder="Scan barcode" />
    <div v-if="scannedObject">
      <h3>{{ scannedObject.name }}</h3>
      <p>{{ scannedObject.description }}</p>
      <p><strong>Category:</strong> {{ scannedObject.category }}</p>
      <p><strong>Type:</strong> {{ scannedObject.type }}</p>
      <p><strong>Size:</strong> {{ scannedObject.size }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const barcode = ref('');
const scannedObject = ref(null);

const onBarcodeScan = async () => {
  if (barcode.value.length > 0) {
    try {
      const response = await axios.get(`http://localhost:5000/scan/${barcode.value}`);
      scannedObject.value = response.data;
    } catch (error) {
      console.error('Error scanning barcode:', error);
      scannedObject.value = null;
    }
  }
};
</script>

<style scoped>
/* Add custom CSS styling here */
input {
  margin-bottom: 20px;
  padding: 10px;
  font-size: 1.2em;
}
</style>
