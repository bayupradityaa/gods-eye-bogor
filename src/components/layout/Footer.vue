<script setup lang="ts">
</script>

<template>
  <footer class="border-t border-white/[0.06] bg-[#0C1017]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="grid md:grid-cols-3 gap-12">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <span class="text-accent text-xs font-bold">BL</span>
            </div>
            <span class="text-sm font-medium text-white">Bogor Live</span>
          </div>
          <p class="text-sm text-text-secondary leading-relaxed max-w-xs">
            Real-time public CCTV viewer untuk memantau kondisi Kota Bogor secara langsung.
          </p>
        </div>
        <div class="space-y-4">
          <p class="text-[11px] tracking-[0.15em] uppercase text-text-muted font-medium">Data Source</p>
          <div class="space-y-2">
            <p class="text-sm text-text-secondary">BSW Kota Bogor</p>
            <a href="https://bsw.kotabogor.go.id/cctv" target="_blank" class="text-xs text-text-muted hover:text-accent transition-colors block">
              bsw.kotabogor.go.id →
            </a>
          </div>
        </div>
        <div class="space-y-4">
          <p class="text-[11px] tracking-[0.15em] uppercase text-text-muted font-medium">Keterangan</p>
          <p class="text-sm text-text-secondary leading-relaxed">
            Dibangun untuk keperluan monitoring pribadi. Tidak ada afiliasi resmi dengan pemerintah daerah.
          </p>
        </div>
      </div>
      <div class="mt-16 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-text-muted">Data sourced from BSW Kota Bogor</p>
        <p class="text-xs text-text-muted">&copy; 2026 Bogor Live</p>
      </div>
    </div>
  </footer>
</template>
