<template>
    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="p-4">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input v-model="form.name" type="text" class="form-control" required>
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
          <input v-model="form.tags" type="text" class="form-control" placeholder="Separate tags with commas">
        </div>
  
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Size</label>
            <input v-model="form.size" type="text" class="form-control">
          </div>
        </div>
  
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        form: {
          barId: '',
          name: '',
          description: '',
          category: '',
          type: '',
          tags: '',
          size: ''
        }
      }
    },
    methods: {
      generateBarId() {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString()
      },
      async handleSubmit() {
        try {
          this.form.barId = this.generateBarId()
          console.log('Submitting form data:', this.form)
          const response = await axios.post('http://localhost:5000/make_object', this.form)
          console.log('Server response:', response.data)
        } catch (error) {
          console.error('Error submitting form:', error)
        }
      }
    }
  }
  </script>
  