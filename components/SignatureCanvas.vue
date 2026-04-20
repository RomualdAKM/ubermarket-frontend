<template>
  <div class="signature-container">
    <p class="text-sm font-medium text-gray-700 mb-2">Signature du client</p>
    <p class="text-xs text-gray-400 mb-3">Demandez au client de signer ci-dessous avec le doigt</p>

    <div class="relative border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden" :class="{ 'border-primary': hasSigned }">
      <canvas
        ref="canvasRef"
        class="w-full touch-none cursor-crosshair"
        :style="{ height: canvasHeight + 'px' }"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="stopDrawing"
      />

      <!-- Placeholder text when empty -->
      <div
        v-if="!hasSigned"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <p class="text-gray-300 text-lg font-light select-none">Signez ici</p>
      </div>
    </div>

    <div class="flex gap-3 mt-4">
      <button
        type="button"
        @click="clearCanvas"
        class="flex-1 py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-h-[48px] flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/>
        </svg>
        Effacer
      </button>
      <button
        type="button"
        @click="confirmSignature"
        :disabled="!hasSigned"
        class="flex-1 py-3 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
        </svg>
        Valider
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const emit = defineEmits<{
  signed: [dataUrl: string]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const hasSigned = ref(false)
const canvasHeight = 200

let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0

const setupCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = canvasHeight * dpr

  ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.scale(dpr, dpr)
  ctx.strokeStyle = '#1a1a2e'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const getCanvasPoint = (clientX: number, clientY: number) => {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

const startDrawing = (e: MouseEvent) => {
  isDrawing.value = true
  const point = getCanvasPoint(e.clientX, e.clientY)
  lastX = point.x
  lastY = point.y
}

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !ctx) return
  const point = getCanvasPoint(e.clientX, e.clientY)

  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(point.x, point.y)
  ctx.stroke()

  lastX = point.x
  lastY = point.y
  hasSigned.value = true
}

const stopDrawing = () => {
  isDrawing.value = false
}

const onTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  isDrawing.value = true
  const point = getCanvasPoint(touch.clientX, touch.clientY)
  lastX = point.x
  lastY = point.y
}

const onTouchMove = (e: TouchEvent) => {
  if (!isDrawing.value || !ctx) return
  const touch = e.touches[0]
  const point = getCanvasPoint(touch.clientX, touch.clientY)

  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(point.x, point.y)
  ctx.stroke()

  lastX = point.x
  lastY = point.y
  hasSigned.value = true
}

const clearCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const dpr = window.devicePixelRatio || 1
  ctx.clearRect(0, 0, canvas.width / dpr, canvasHeight)
  hasSigned.value = false
}

const confirmSignature = () => {
  const canvas = canvasRef.value
  if (!canvas || !hasSigned.value) return
  const dataUrl = canvas.toDataURL('image/png')
  emit('signed', dataUrl)
}

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  setupCanvas()

  if (canvasRef.value) {
    resizeObserver = new ResizeObserver(() => {
      // Save current drawing state
      const canvas = canvasRef.value
      if (!canvas) return
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext('2d')
      if (tempCtx) tempCtx.drawImage(canvas, 0, 0)

      setupCanvas()

      // Restore drawing
      if (ctx && hasSigned.value) {
        const dpr = window.devicePixelRatio || 1
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height)
        ctx.restore()
        ctx.strokeStyle = '#1a1a2e'
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    })
    resizeObserver.observe(canvasRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>
