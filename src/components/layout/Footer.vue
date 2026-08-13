<script setup lang="ts">

</script>

<template>
  <footer class="bg-[#1479A6] dark:bg-[#106288] transition-colors duration-300">
    <!-- Wave SVG Divider -->
    <div class="w-full overflow-hidden leading-none transform">
      <svg class="relative block w-full h-[40px] sm:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="fill-[var(--bg)] transition-colors duration-300"></path>
      </svg>
    </div>

    <div class="layout-container pb-12 sm:pb-16 pt-6 sm:pt-8">
      <div class="grid md:grid-cols-2 gap-12 items-start">
        <!-- Left: Brand -->
        <div class="space-y-4">
          <div class="flex flex-col">
            <h2 class="text-xl font-[900] tracking-tighter text-white font-['Plus_Jakarta_Sans']">
              BOGOR LIVE<span style="color: var(--accent);">.</span>
            </h2>
            <p class="text-xs tracking-[0.2em] uppercase font-medium mt-1 text-white/70">
              Jendela digital menuju Kota Bogor
            </p>
          </div>
          <p class="text-sm max-w-xs leading-relaxed text-white/90">
            Pantau kondisi kota secara real-time melalui jaringan kamera publik terintegrasi.
          </p>
        </div>

        <!-- Right: Links -->
        <div class="flex flex-wrap gap-x-12 gap-y-8 md:justify-end">
          <div class="space-y-4">
            <p class="text-[10px] tracking-widest uppercase font-semibold text-white/60">Platform</p>
            <ul class="space-y-3">
              <li><a href="#explorer" class="footer-link text-sm">Kamera</a></li>
              <li><a href="#map" class="footer-link text-sm">Peta Interaktif</a></li>
              <li><a href="#" class="footer-link text-sm">Pantauan Saya</a></li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <p class="text-[10px] tracking-widest uppercase font-semibold text-white/60">Sumber Data</p>
            <ul class="space-y-3">
              <li><span class="text-sm text-white/90">Diskominfo Bogor</span></li>
              <li><span class="text-sm text-white/90">Jasa Marga</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-16 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 transition-colors duration-300">
        <p class="text-[11px] tracking-wider uppercase font-medium text-white/60">
          &copy; {{ new Date().getFullYear() }} Bogor Live. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  color: rgba(255, 255, 255, 0.9);
  transition: color 200ms ease;
  font-weight: 500;
}
.footer-link:hover {
  color: #ffffff;
}
</style>
