<template>
  <div id="app">
    <h1>{{ status }}</h1>
    <input
      @change="handleFile"
      type="file"
      name="imgInput"
      id="imgInput"
      accept="image/gif, image/jpeg, image/png"
    />
    <div v-if="previewImg" class="preview">
      <img :src="previewImg" />
    </div>
    <button v-if="previewImg" @click="scan" class="scan">開始辨識</button>
    <div class="result">
      {{ result }}
    </div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  name: "App",
  data() {
    return {
      status: "請上傳需要辨識的圖片",
      previewImg: "",
      result: "",
    };
  },
  methods: {
    async scan() {
      axios
        .post("http://localhost:3000/ocr", this.previewImg.split(",")[1])
        .then((res) => {
          if (res.data.status == "success") {
            this.result = res.data.result;
          } else {
            this.result = "辨識失敗";
          }
        })
        .catch(function (error) {
          this.result = "辨識失敗";
          console.log(error)
        });
    },
    handleFile(e) {
      const files = e.target.files;

      if (files.length) {
        const image = files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
          this.previewImg = reader.result;
        };
        reader.readAsDataURL(image);
      } else {
        alert("圖片選取失敗");
      }
    },
  },
};
</script>

<style>
#app {
  width: 100%;
}
.preview {
  width: 100%;
  max-width: 960px;
}
.preview img {
  width: 100%;
}
</style>
