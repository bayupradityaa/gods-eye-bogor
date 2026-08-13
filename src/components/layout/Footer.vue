<script setup lang="ts">

</script>

<template>
  <footer class="border-t" style="background: var(--footer-bg); border-color: var(--footer-border);">
    <div class="layout-container py-12 sm:py-16">
      <div class="grid md:grid-cols-2 gap-12 items-start">
        <!-- Left: Brand -->
        <div class="space-y-4">
          <div class="flex flex-col">
            <h2 class="text-xl font-bold tracking-tighter" style="color: var(--text);">
              BOGOR LIVE<span style="color: var(--accent);">.</span>
            </h2>
            <p class="text-xs tracking-[0.2em] uppercase font-medium mt-1" style="color: var(--text-muted);">
              A digital window into Kota Bogor
            </p>
          </div>
          <p class="text-sm max-w-xs leading-relaxed" style="color: var(--text-secondary);">
            Pantau kondisi kota secara real-time melalui jaringan kamera publik terintegrasi.
          </p>
        </div>

        <!-- Right: Links -->
        <div class="flex flex-wrap gap-x-12 gap-y-8 md:justify-end">
          <div class="space-y-4">
            <p class="text-[10px] tracking-widest uppercase font-semibold" style="color: var(--text-muted);">Platform</p>
            <ul class="space-y-3">
              <li><a href="#explorer" class="footer-link text-sm">Cameras</a></li>
              <li><a href="#map" class="footer-link text-sm">Interactive Map</a></li>
              <li><a href="#" class="footer-link text-sm">My Monitoring</a></li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <p class="text-[10px] tracking-widest uppercase font-semibold" style="color: var(--text-muted);">Data Source</p>
            <ul class="space-y-3">
              <li><span class="text-sm" style="color: var(--text-secondary);">Diskominfo Bogor</span></li>
              <li><span class="text-sm" style="color: var(--text-secondary);">Jasa Marga</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4" style="border-color: var(--border);">
        <p class="text-[11px] tracking-wider uppercase font-medium" style="color: var(--text-muted);">
          &copy; {{ new Date().getFullYear() }} Bogor Live. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  color: var(--text-secondary);
  transition: color 200ms ease;
  font-weight: 500;
}
.footer-link:hover {
  color: var(--text);
}

.footer-social {
  color: var(--text-muted);
  transition: color 200ms ease;
}
.footer-social:hover {
  color: var(--text);
}
</style>
