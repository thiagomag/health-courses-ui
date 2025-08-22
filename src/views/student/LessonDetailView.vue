<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  course: Object,
})

const route = useRoute()
const moduleId = computed(() => parseInt(route.params.moduleId))
const lessonId = computed(() => parseInt(route.params.lessonId))

const currentLesson = computed(() => {
  if (!props.course) return null
  const module = props.course.modules.find((m) => m.id === moduleId.value)
  if (!module) return null
  return module.lessons.find((l) => l.id === lessonId.value)
})
</script>

<template>
  <div v-if="currentLesson" class="lesson-container">
    <header class="lesson-header">
      <h1>{{ currentLesson.title }}</h1>
    </header>

    <div class="video-wrapper">
      <iframe
        :src="currentLesson.video_url"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        :title="currentLesson.title"
      ></iframe>
    </div>

    <section class="lesson-details">
      <h3>Sobre esta aula</h3>
      <p class="lesson-description">{{ currentLesson.description }}</p>
    </section>
  </div>
  <div v-else class="not-found">
    <p>Lição não encontrada.</p>
  </div>
</template>

<style scoped>
.lesson-header {
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 2.2rem;
  color: #2c3e50;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.lesson-details {
  margin-top: 2.5rem;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.lesson-details h3 {
  margin-top: 0;
  font-size: 1.4rem;
  color: #333;
}

.lesson-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
}

.not-found {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #777;
}
</style>
