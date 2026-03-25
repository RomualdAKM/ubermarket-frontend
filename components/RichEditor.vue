<template>
  <div v-if="editor" class="rich-editor-container border border-neutral-200 rounded-xl overflow-hidden focus-within:border-primary transition-colors">
    <!-- Toolbar -->
    <div class="rich-editor-toolbar flex items-center gap-1 p-2 bg-neutral-50 border-b border-neutral-200 sticky top-0 z-10 overflow-x-auto">
      <button 
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'bg-neutral-200 text-neutral-900': editor.isActive('bold') }"
        class="p-2 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors"
        title="Gras"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
      </button>
      
      <button 
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'bg-neutral-200 text-neutral-900': editor.isActive('italic') }"
        class="p-2 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors"
        title="Italique"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
      </button>

      <div class="w-px h-6 bg-neutral-300 mx-1"></div>

      <button 
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-neutral-200 text-neutral-900': editor.isActive('bulletList') }"
        class="p-2 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors"
        title="Liste à puces"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </button>
      
      <button 
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-neutral-200 text-neutral-900': editor.isActive('orderedList') }"
        class="p-2 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors"
        title="Liste numérotée"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><polyline points="3 6 4 5 4 11"/><path d="M3 18h3"/><path d="M3 14c0-1.1.9-2 2-2s2 .9 2 2c0 1.1-.9 2-2 2H3"/></svg>
      </button>

      <div class="w-px h-6 bg-neutral-300 mx-1"></div>

      <button 
        type="button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
        class="p-2 rounded-lg hover:bg-neutral-200 text-neutral-500 disabled:opacity-30 transition-colors"
        title="Annuler"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
      </button>
      
      <button 
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
        class="p-2 rounded-lg hover:bg-neutral-200 text-neutral-500 disabled:opacity-30 transition-colors"
        title="Rétablir"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
      </button>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="rich-editor-content p-4 min-h-[150px] outline-none" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      code: false,
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        return props.placeholder || 'Décrivez votre produit ici...'
      },
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px]',
    },
  },
})

// Synchroniser modelValue -> editor
watch(() => props.modelValue, (newValue) => {
  const isSame = editor.value?.getHTML() === newValue
  if (isSame) return
  editor.value?.commands.setContent(newValue, false)
})
</script>

<style>
/* Styles de base pour l'éditeur Tiptap */
.rich-editor-content .tiptap {
  outline: none;
}

.rich-editor-content .tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

/* On s'assure que les listes sont visibles même dans l'éditeur */
.rich-editor-content ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.rich-editor-content ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.rich-editor-content li {
  margin-bottom: 0.25rem;
}

.rich-editor-content p {
  margin-bottom: 0.75rem;
}
</style>
