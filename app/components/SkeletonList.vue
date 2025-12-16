<template>
  <div class="space-y-4">
    <Card v-for="i in count" :key="i" class="animate-pulse">
      <CardContent class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="h-4 w-24 bg-muted rounded"></div>
          <div class="ml-auto h-3 w-16 bg-muted/60 rounded"></div>
        </div>
        <div class="space-y-2">
          <div class="h-4 w-full bg-muted rounded"></div>
          <div class="h-4 w-4/5 bg-muted rounded"></div>
          <div class="h-4 w-3/5 bg-muted rounded"></div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="aspect-square bg-muted rounded-lg"></div>
          <div class="aspect-square bg-muted rounded-lg"></div>
          <div class="aspect-square bg-muted rounded-lg"></div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'

withDefaults(defineProps<{ count?: number }>(), { count: 3 })
</script>


