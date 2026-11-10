<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAppDialog } from '@/composables/useAppDialog'

const { state, confirmAction, cancelAction, setOpen } = useAppDialog()
</script>

<template>
  <Dialog :open="state.open" @update:open="setOpen">
    <DialogContent class="sm:max-w-md" :show-close-button="false" @escape-key-down.prevent @pointer-down-outside.prevent>
      <DialogHeader>
        <DialogTitle class="font-display text-xl">
          {{ state.title }}
        </DialogTitle>
        <DialogDescription class="text-sm text-foreground/80 whitespace-pre-wrap pt-1">
          {{ state.message }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter class="gap-2 sm:gap-2">
        <Button
          v-if="state.kind === 'confirm'"
          variant="outline"
          @click="cancelAction"
        >
          {{ state.cancelText }}
        </Button>
        <Button @click="confirmAction">
          {{ state.confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
