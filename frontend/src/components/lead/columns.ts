import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import { h } from "vue";
import { LeadInterface } from "./Lead.vue";
import DataTableDropdown from "./data-table-dropdown.vue";

const statuses = [
  {
    value: "ПЕРЕГОВОРЫ",
    color: "bg-[#FFff99]",
  },
  {
    value: "ПЕРВИЧНЫЙ КОНТАКТ",
    color: "bg-[#99CCFF]",
  },
  {
    value: "ПРИНИМАЮТ РЕШЕНИЕ",
    color: "bg-[#FFCC66]",
  },
  {
    value: "СОГЛАСОВАНИЕ ДОГОВОРА",
    color: "bg-[#FFCCCC]",
  },
];

export const columns: ColumnDef<LeadInterface>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        "onUpdate:checked": (value: boolean) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: "Название",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-center font-medium" },
        row.getValue("name"),
      );
    },
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => {
  //     return h(
  //       Button,
  //       {
  //         variant: "ghost",
  //         onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
  //       },
  //       () => ["Email", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
  //     );
  //   },
  //   cell: ({ row }) => h("div", { class: "lowercase" }, row.getValue("email")),
  // },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Бюджет", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(amount);

      return h("div", { class: "text-center font-medium" }, formatted);
    },
  },
  {
    accessorKey: "status_name",
    header: "Статус",
    cell: ({ row }) => {
      const name: string = row.getValue("status_name");
      const status = statuses.find((s) => s.value === name.toUpperCase());

      if (!status) {
        return null;
      }

      return h(
        "div",
        { class: `${status.color} text-center font-medium` },
        name,
      );
    },
  },
  {
    accessorKey: "user",
    header: "Ответственный",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-center font-medium" },
        row.getValue("user"),
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Дата создания",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formatted = new Intl.DateTimeFormat("ru", {
        year: "2-digit",
        month: "2-digit",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);

      return h("div", { class: "text-center font-medium" }, formatted);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const lead = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DataTableDropdown, {
          lead,
        }),
      );
    },
  },
];
