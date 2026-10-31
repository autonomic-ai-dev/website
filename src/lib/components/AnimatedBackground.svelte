<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import { scroll } from "motion";

  let spotlightEl: HTMLDivElement;
  let floorGridEl: HTMLDivElement;
  let horizonBeamEl: HTMLDivElement;

  onMount(() => {
    if (!browser) return;

    // Framer Motion Scroll Observer
    const stopScroll = scroll((progress) => {
      // 1. Perspective Grid Floor Shift: as user scrolls down, plane recedes and transitions
      if (floorGridEl) {
        const translateY = Math.round(progress * 120);
        const pitch = (68 + progress * 8).toFixed(1);
        const opacity = Math.max(0, 0.7 - progress * 1.2).toFixed(3);
        floorGridEl.style.transform = `rotateX(${pitch}deg) translateY(${translateY}px)`;
        floorGridEl.style.opacity = opacity;
      }

      // 2. Primary Spotlight follows the viewport focus down into the console
      if (spotlightEl) {
        const translateY = Math.round(progress * 280);
        const scale = (1 + progress * 0.15).toFixed(3);
        const opacity = Math.max(0.3, 0.9 - progress * 0.4).toFixed(3);
        spotlightEl.style.transform = `translate(-50%, ${translateY}px) scale(${scale})`;
        spotlightEl.style.opacity = opacity;
      }

      // 3. Horizon Beam reacts to scroll position
      if (horizonBeamEl) {
        const beamOpacity = (0.2 + Math.sin(progress * Math.PI) * 0.45).toFixed(3);
        horizonBeamEl.style.opacity = beamOpacity;
      }
    });

    return () => {
      stopScroll();
    };
  });
</script>

<!-- Resend & Vercel World-Class Perspective Ground & Lighting -->
<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none bg-black">

  <!-- 1. Top Overhead Conic Spotlight (Signature Resend / Vercel focal cone) -->
  <div
    bind:this={spotlightEl}
    class="absolute -top-36 left-1/2 -translate-x-1/2 w-[1250px] h-[580px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_65%)] blur-[95px] will-change-transform transition-transform duration-75 ease-out"
  ></div>

  <!-- 2. Resend 3D Perspective Grid Floor (Receding into horizon with depth) -->
  <div class="absolute inset-0 overflow-hidden [perspective:850px] pointer-events-none">
    <div
      bind:this={floorGridEl}
      class="absolute top-[28%] -left-[50%] w-[200%] h-[160%] [transform-origin:50%_0%] [transform:rotateX(68deg)] will-change-transform transition-all duration-100 ease-out"
      style="opacity: 0.7;"
    >
      <!-- Receding Grid Lines -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <!-- Perspective Depth Gradient Mask: brightest at horizon, falloff into deep foreground -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black [mask-image:linear-gradient(to_top,black_20%,transparent_100%)]"></div>
    </div>
  </div>

  <!-- 3. Horizon Line & Atmospheric Glare -->
  <div
    bind:this={horizonBeamEl}
    class="absolute top-[28%] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[0.5px] will-change-transform transition-opacity duration-150"
    style="opacity: 0.35;"
  ></div>

  <!-- 4. Subtle Ambient Deep Indigo/Cyan Side Accents (ultra low opacity < 0.04) -->
  <div class="absolute top-[35%] -left-64 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(99,102,241,0.035),transparent_70%)] blur-[160px]"></div>
  <div class="absolute top-[55%] -right-64 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(0,242,254,0.025),transparent_70%)] blur-[160px]"></div>

  <!-- 5. Vertical Vignette & Bottom Falloff -->
  <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>

  <!-- 6. Film Grain / Micro Dot Matrix Texture (Crisp Resend micro-texture) -->
  <div class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_25%,#000_40%,transparent_100%)] opacity-50"></div>
</div>
