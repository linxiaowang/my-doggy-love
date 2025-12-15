<template>
  <Popover v-slot="{ close }">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal transition-all duration-200',
          'hover:border-primary/50 hover:shadow-sm',
          !date && 'text-muted-foreground',
          date && 'text-foreground'
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4 shrink-0" />
        <span class="truncate">
          {{ date ? df.format(date.toDate(getLocalTimeZone())) : placeholder }}
        </span>
        <svg v-if="date" class="ml-auto h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0 shadow-lg border-border/50" align="start">
      <Calendar
        v-model="date"
        :default-placeholder="defaultPlaceholder"
        layout="month-and-year"
        initial-focus
        @update:model-value="close"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar/index'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Props {
  modelValue?: DateValue
  placeholder?: string
  defaultPlaceholder?: DateValue
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '选择日期',
  defaultPlaceholder: () => today(getLocalTimeZone()),
})

const emit = defineEmits<{
  'update:modelValue': [value: DateValue | undefined]
}>()

const date = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const df = new DateFormatter('zh-CN', {
  dateStyle: 'long',
})
</script>
