<template>
  <div class="weather-skeleton w-full max-w-lg rounded-2xl p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)] overflow-hidden relative">
    <!-- Shimmer effect -->
    <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent z-10"></div>
    
    <div class="flex items-center gap-2 mb-6 opacity-40">
      <div class="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"></div>
      <div class="h-3 w-24 bg-[var(--surface-muted)] rounded"></div>
    </div>
    
    <div class="flex items-start gap-4 mb-8 opacity-40">
      <div class="w-16 h-16 rounded-xl bg-[var(--surface-muted)]"></div>
      <div class="flex-1 pt-1">
        <div class="h-10 w-24 bg-[var(--surface-muted)] rounded-lg mb-2"></div>
        <div class="h-5 w-32 bg-[var(--surface-muted)] rounded mb-1"></div>
        <div class="h-4 w-40 bg-[var(--surface-muted)] rounded"></div>
      </div>
    </div>
    
    <div class="h-[1px] w-full bg-[var(--border)] mb-6 opacity-40"></div>
    
    <div class="grid grid-cols-2 gap-4 mb-8 opacity-40">
      <div>
        <div class="h-3 w-20 bg-[var(--surface-muted)] rounded mb-1.5"></div>
        <div class="h-4 w-16 bg-[var(--surface-muted)] rounded"></div>
      </div>
      <div>
        <div class="h-3 w-20 bg-[var(--surface-muted)] rounded mb-1.5"></div>
        <div class="h-4 w-16 bg-[var(--surface-muted)] rounded"></div>
      </div>
    </div>
    
    <div class="flex gap-4 opacity-40">
      <div v-for="i in 4" :key="i" class="flex-1 flex flex-col items-center">
        <div class="h-3 w-10 bg-[var(--surface-muted)] rounded mb-3"></div>
        <div class="h-8 w-8 rounded-full bg-[var(--surface-muted)] mb-3"></div>
        <div class="h-4 w-8 bg-[var(--surface-muted)] rounded"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
