<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ref } from "vue";
import Lead from "./components/lead/Lead.vue";

const isDark = ref(false);
const btnText = ref("Dark");

const toggleDarkMode = () => {
  if (isDark.value) {
    document.body.classList.remove("dark");
    isDark.value = false;
  } else {
    isDark.value = true;
    document.body.classList.add("dark");
  }
  btnText.value = isDark ? "Light" : "Dark";
};
</script>

<template>
  <div class="w-10/12 mx-auto">
    <div class="flex justify-between py-2 align-center">
      <Button @click="toggleDarkMode()">{{ btnText }}</Button>
    </div>
    <Lead />
  </div>
</template>
