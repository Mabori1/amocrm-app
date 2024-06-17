<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { onMounted, ref, watch } from "vue";
import { columns } from "./columns.ts";
import DataTable from "./data-table.vue";
import axios from "axios";
import debounce from "lodash.debounce";

export interface LeadInterface {
  id: number;
  name: string;
  price: number;
  created_at: number;
  user: string;
  status_name: string;
  status_color: string;
  contacts: {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
  }[];
}

const querySearch = ref("");
const alert = ref(false);
const loading = ref(false);
const domen = "http://localhost:3010";

async function getLeads(query: string) {
  loading.value = true;
  try {
    let leads = await axios.get(`${domen}/api/leads`, {
      params: {
        query,
      },
    });
    return leads.data;
  } catch (e) {
    console.log("error getLeads: ", e);
  }
  loading.value = false;
}

const leads = ref<LeadInterface[]>([]);

onMounted(async () => {
  leads.value = await getLeads(querySearch.value);
});

watch(querySearch, (value: String) => {
  if (value.length < 4 && value.length != 0) {
    alert.value = true;
  } else {
    alert.value = false;
  }
});

const search = debounce(async () => {
  if (alert.value) return;
  leads.value = await getLeads(querySearch.value);
}, 800);
</script>

<template>
  <div class="text-gray-600 text-sm">
    <div class="relative w-80 max-w-sm items-center">
      <Input
        type="text"
        @input="search"
        placeholder="Найти"
        class="pl-10"
        v-model="querySearch"
      />
      <span
        class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
      >
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>
    <DataTable :columns="columns" :data="leads" :pagination="true" />
  </div>
</template>
