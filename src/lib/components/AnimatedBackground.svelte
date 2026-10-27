<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { scroll } from "motion";

  let spotlightEl: HTMLDivElement;
  let beamEl: HTMLDivElement;
  let gridEl: HTMLDivElement;
  let scrollProgress = 0;

  onMount(() => {
    if (!browser) return;

    // Framer Motion Scroll Observer
    const stopScroll = scroll((progress) => {
      scrollProgress = progress;

      // 1. Move the primary focal spotlight smoothly with scroll
      if (spotlightEl) {
        const translateY = Math.round(progress * 260);
        const scale = (1 + progress * 0.18).toFixed(3);
        const opacity = (0.85 - progress * 0.35).toFixed(3);
        spotlightEl.style.transform = `translate(-50%, ${translateY}px) scale(${scale})`;
        spotlightEl.style.opacity = opacity;
      }

      // 2. Drive the luminous horizon scan line across viewport based on scroll depth
      if (beamEl) {
        const beamY = Math.round(progress * 100);
        const beamOpacity = (0.2 + Math.sin(progress * Math.PI) * 0.5).toFixed(3);
        beamEl.style.transform = `translateY(${beamY}vh)`;
        beamEl.style.opacity = beamOpacity;
      }

      // 3. Modulate grid mask visibility as user scrolls through architecture
      if (gridEl) {
        const maskSize = Math.round(65 + progress * 25);
        gridEl.style.maskImage = `radial-gradient(ellipse 85% ${maskSize}% at 50% 10%, #000 50%, transparent 100%)`;
        gridEl.style.webkitMaskImage = `radial-gradient(ellipse 85% ${maskSize}% at 50% 10%, #000 50%, transparent 100%)`;
      }
    });

    return () => {
      stopScroll();
    };
  });
</script>

<!-- Resend / Vercel-Style Scroll-Driven Atmospheric Architecture -->
<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
  
  <!-- Primary Focal Spotlight (Tracks scroll progress with Framer Motion) -->
  <div
    bind:this={spotlightEl}
    class="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_70%)] blur-[90px] transition-transform duration-75 ease-out will-change-transform"
  ></div>

  <!-- Deep Subsystem Ambient Glows -->
  <div class="absolute top-[28%] -left-48 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.04),transparent_70%)] blur-[140px]"></div>
  <div class="absolute top-[55%] -right-48 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(0,242,254,0.03),transparent_70%)] blur-[140px]"></div>

  <!-- Precision Line Grid (Dynamically illuminated on scroll) -->
  <div
    bind:this={gridEl}
    class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_85%_65%_at_50%_10%,#000_50%,transparent_100%)] transition-all duration-150"
  ></div>

  <!-- Scroll-Linked Luminous Horizon Beam -->
  <div
    bind:this={beamEl}
    class="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent blur-[0.5px] will-change-transform transition-transform duration-75 ease-out opacity-20"
  ></div>

  <!-- Vercel-Style Bottom Vignette Falloff -->
  <div class="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

  <!-- Resend-Style Micro Dot Texture Overlay -->
  <div class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_30%,#000_40%,transparent_100%)] opacity-60"></div>
</div>
