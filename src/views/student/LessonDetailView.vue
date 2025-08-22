<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  course: Object,
})

const route = useRoute()
const moduleId = computed(() => parseInt(route.params.moduleId))
const lessonId = computed(() => parseInt(route.params.lessonId))

// Encontra a lição atual para exibir o vídeo
const currentLesson = computed(() => {
  if (!props.course) return null
  const module = props.course.modules.find((m) => m.id === moduleId.value)
  if (!module) return null
  return module.lessons.find((l) => l.id === lessonId.value)
})
</script>

<template>
  <div v-if="currentLesson">
    <h2>{{ currentLesson.title }}</h2>
    <div class="video-wrapper">
      <iframe
        :src="currentLesson.video_url"
        width="100%"
        height="100%"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        :title="currentLesson.title"
      ></iframe>
    </div>
    <p class="lesson-description">{{ currentLesson.description }}</p>
  </div>
  <div v-else>
    <p>Lição não encontrada.</p>
  </div>
</template>

<style scoped>
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
}
.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.lesson-description {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.7;
}
</style>
