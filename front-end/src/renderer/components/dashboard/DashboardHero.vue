<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title animate-bounce-in">
        Welcome back, {{ userName }}!
      </h1>
      <p class="hero-subtitle">
        Let's create something delicious today
      </p>
    </div>
    <div class="hero-decoration">
      <div class="bubble bubble--lg bubble--green animate-float"></div>
      <div class="bubble bubble--md bubble--yellow animate-float" style="animation-delay: 0.2s;"></div>
      <div class="bubble bubble--sm bubble--blue animate-float" style="animation-delay: 0.4s;"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  userName: string
}

defineProps<Props>()
</script>

<style scoped>
/* -------- Hero Section -------- */
.hero {
  position: relative;
  padding: var(--spacing-2) 0 var(--spacing-4);
  margin-bottom: var(--spacing-6);
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: var(--spacing-2);
  line-height: 1.2;
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--color-dark-gray);
  font-weight: 400;
}

.hero-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.bubble {
  position: absolute;
  border-radius: var(--radius-full);
  opacity: 0.1;
}

.bubble--lg {
  width: 200px;
  height: 200px;
  top: -50px;
  right: 10%;
}

.bubble--md {
  width: 120px;
  height: 120px;
  top: 50%;
  right: 30%;
}

.bubble--sm {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 50%;
}

.bubble--green {
  background-color: var(--color-fresh-green);
}

.bubble--yellow {
  background-color: var(--color-banana-yellow);
}

.bubble--blue {
  background-color: var(--color-sky-blue);
}

@media (max-width: 639px) {
  .hero-title {
    font-size: var(--text-xl);
    line-height: 1.3;
  }

  .hero-subtitle {
    font-size: var(--text-sm);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-bounce-in,
  .animate-float {
    animation: none;
  }
}
</style>
