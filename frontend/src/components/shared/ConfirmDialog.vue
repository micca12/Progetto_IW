<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-vue-next";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "Conferma",
  description: "Sei sicuro di voler procedere?",
  confirmLabel: "Conferma",
  cancelLabel: "Annulla",
  loading: false,
  destructive: false,
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

function handleConfirm() {
  emit("confirm");
}

function handleCancel() {
  emit("cancel");
  emit("update:open", false);
}
</script>

<template>
  <AlertDialog :open="open" @update:open="$emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="loading" @click="handleCancel">
          {{ cancelLabel }}
        </AlertDialogCancel>
        <AlertDialogAction
          :disabled="loading"
          :class="destructive ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''"
          @click="handleConfirm"
        >
          <Loader2 v-if="loading" class="mr-2 size-4 animate-spin" />
          {{ confirmLabel }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
