<template>
  <div class="form-container">
    <form @submit.prevent="handleSubmit" class="p-4">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="form.name" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea v-model="form.description" class="form-control" rows="3"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Category</label>
        <select v-model="form.category" class="form-select">
          <option value="">Select category</option>
          <option value="ski">Ski Equipment</option>
          <option value="wildlife">Wildlife Equipment</option>
          <option value="biking">Biking Equipment</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Equipment Type</label>
        <select v-model="form.type" class="form-select">
          <option value="">Select type</option>
          <option v-if="form.category === 'ski'" value="skis">Skis</option>
          <option v-if="form.category === 'ski'" value="poles">Poles</option>
          <option v-if="form.category === 'ski'" value="boots">Boots</option>
          <option v-if="form.category === 'wildlife'" value="binoculars">Binoculars</option>
          <option v-if="form.category === 'wildlife'" value="camera">Camera</option>
          <option v-if="form.category === 'wildlife'" value="spotting_scope">Spotting Scope</option>
          <option v-if="form.category === 'biking'" value="bike">Bike</option>
          <option v-if="form.category === 'biking'" value="helmet">Helmet</option>
          <option v-if="form.category === 'biking'" value="accessories">Accessories</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Tags</label>
        <input v-model="form.tags" type="text" class="form-control" placeholder="Separate tags with commas" />
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Size</label>
          <input v-model="form.size" type="text" class="form-control" />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

    <div v-if="barcodeImage" class="mt-4">
      <h3>Generated Barcode</h3>
      <img :src="barcodeImage" alt="Generated Barcode" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import bwipjs from 'bwip-js';
import axios from 'axios';

const form = ref({
  name: '',
  description: '',
  category: '',
  type: '',
  tags: '',
  size: '',
});

const barcodeImage = ref(null);

const handleSubmit = async () => {
  try {
    const barcodeId = generateBarcodeId();
    form.value.barcodeId = barcodeId;
    generateBarcode(barcodeId);

    // Send form data to backend using axios
    const response = await axios.post('http://localhost:5000/create', form.value);
    console.log('Server response:', response.data);
    alert('Object created successfully');
  } catch (error) {
    console.error('Error:', error);
    alert('Error creating object');
  }
};

const generateBarcodeId = () => {
  return Math.random().toString(36).substring(7);
};

const generateBarcode = (barcodeId) => {
  try {
    const canvas = document.createElement('canvas');
    bwipjs.toCanvas(canvas, {
      bcid: 'code128',
      text: barcodeId,
      scale: 3,
      height: 10,
      includetext: true,
    });

    barcodeImage.value = canvas.toDataURL();
  } catch (error) {
    console.error('Error generating barcode:', error);
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
