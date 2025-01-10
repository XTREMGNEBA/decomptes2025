<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  label?: string
}>()

const emit = defineEmits<{
  signed: [signature: string]
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const ctx = ref<CanvasRenderingContext2D | null>(null)

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    if (ctx.value) {
      ctx.value.strokeStyle = '#000'
      ctx.value.lineWidth = 2
    }
  }
})

function startDrawing(event: MouseEvent) {
  isDrawing.value = true
  draw(event)
}

function stopDrawing() {
  isDrawing.value = false
  ctx.value?.beginPath()
}

function draw(event: MouseEvent) {
  if (!isDrawing.value || !ctx.value || !canvas.value) return

  const rect = canvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  ctx.value.lineTo(x, y)
  ctx.value.stroke()
  ctx.value.beginPath()
  ctx.value.moveTo(x, y)
}

function clear() {
  if (ctx.value && canvas.value) {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  }
}

function save() {
  if (canvas.value) {
    const signature = canvas.value.toDataURL()
    emit('signed', signature)
  }
}
</script>

<template>
  <div class="space-y-4">
    <p v-if="label" class="font-medium text-gray-700">{{ label }}</p>
    <div class="border rounded-lg p-4">
      <canvas
        ref="canvas"
        width="400"
        height="200"
        class="border rounded cursor-crosshair bg-white"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      />
      <div class="mt-4 flex gap-4">
        <UButton
          color="gray"
          variant="soft"
          @click="clear"
        >
          Effacer
        </UButton>
        <UButton
          color="primary"
          @click="save"
        >
          Valider la signature
        </UButton>
      </div>
    </div>
  </div>
</template>