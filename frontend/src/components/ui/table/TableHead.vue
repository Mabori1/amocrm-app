<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <th
    :class="
      cn(
        'h-6  text-center items-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:mx-auto',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>
