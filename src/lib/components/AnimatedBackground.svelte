<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { animate } from "motion";

  let canvas: HTMLCanvasElement;
  let topGlow: HTMLDivElement;
  let leftGlow: HTMLDivElement;
  let rightGlow: HTMLDivElement;

  onMount(() => {
    if (!browser || !canvas) return;

    // 1. Framer Motion Animation on Ambient Glow Elements
    let stopTopGlow: () => void = () => {};
    let stopLeftGlow: () => void = () => {};
    let stopRightGlow: () => void = () => {};

    if (topGlow) {
      const anim = animate(
        topGlow,
        {
          transform: [
            "translate(-50%, 0px) scale(1)",
            "translate(-50%, -30px) scale(1.08)",
            "translate(-50%, 15px) scale(0.96)",
            "translate(-50%, 0px) scale(1)"
          ],
          opacity: [0.75, 0.95, 0.8, 0.75]
        },
        {
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }
      );
      stopTopGlow = () => anim.stop();
    }

    if (leftGlow) {
      const anim = animate(
        leftGlow,
        {
          transform: [
            "translate(0px, 0px) scale(1)",
            "translate(45px, 35px) scale(1.15)",
            "translate(-20px, 20px) scale(0.92)",
            "translate(0px, 0px) scale(1)"
          ],
          opacity: [0.35, 0.65, 0.4, 0.35]
        },
        {
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }
      );
      stopLeftGlow = () => anim.stop();
    }

    if (rightGlow) {
      const anim = animate(
        rightGlow,
        {
          transform: [
            "translate(0px, 0px) scale(1)",
            "translate(-40px, -30px) scale(1.12)",
            "translate(25px, -15px) scale(0.95)",
            "translate(0px, 0px) scale(1)"
          ],
          opacity: [0.3, 0.55, 0.35, 0.3]
        },
        {
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut"
        }
      );
      stopRightGlow = () => anim.stop();
    }

    // 2. High-Performance Interactive Neural Graph Mesh (Procedure Edges Simulation)
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Generate floating nodes
    const NODE_COUNT = Math.min(48, Math.floor((width * height) / 28000));
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
    }> = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
        baseAlpha: Math.random() * 0.25 + 0.15
      });
    }

    // Mouse proximity tracking
    let mouseX = -9999;
    let mouseY = -9999;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    // Render loop
    const MAX_DISTANCE = 135;
    const MOUSE_RADIUS = 160;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Soft mouse repulsion/attraction
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        if (mouseDist < MOUSE_RADIUS) {
          const force = (1 - mouseDist / MOUSE_RADIUS) * 0.02;
          node.vx += dx * force;
          node.vy += dy * force;
        }

        // Apply friction
        node.vx *= 0.99;
        node.vy *= 0.99;

        node.x += node.vx;
        node.y += node.vy;

        // Wrap around boundaries
        if (node.x < -10) node.x = width + 10;
        else if (node.x > width + 10) node.x = -10;
        if (node.y < -10) node.y = height + 10;
        else if (node.y > height + 10) node.y = -10;

        // Draw node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${node.baseAlpha})`;
        ctx.fill();

        // Connect nearby nodes with faint hairline edges
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const distDx = other.x - node.x;
          const distDy = other.y - node.y;
          const dist = Math.sqrt(distDx * distDx + distDy * distDy);

          if (dist < MAX_DISTANCE) {
            const edgeAlpha = (1 - dist / MAX_DISTANCE) * 0.08;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${edgeAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      stopTopGlow();
      stopLeftGlow();
      stopRightGlow();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  });
</script>

<!-- Ambient Atmospheric Layers with Framer Motion Elements & Neural Graph -->
<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
  <!-- Interactive Neural Procedure Graph Canvas -->
  <canvas
    bind:this={canvas}
    class="absolute inset-0 w-full h-full pointer-events-none opacity-80"
  ></canvas>

  <!-- Top Primary Atmospheric Spotlight (Driven by Framer Motion) -->
  <div
    bind:this={topGlow}
    class="absolute -top-36 left-1/2 -translate-x-1/2 w-[1300px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.13),transparent_65%)] blur-[100px]"
  ></div>

  <!-- Left Ambient Subsystem Glow (Driven by Framer Motion) -->
  <div
    bind:this={leftGlow}
    class="absolute top-[22%] -left-52 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(99,102,241,0.08),transparent_70%)] blur-[150px]"
  ></div>

  <!-- Right Ambient Subsystem Glow (Driven by Framer Motion) -->
  <div
    bind:this={rightGlow}
    class="absolute top-[46%] -right-52 w-[750px] h-[750px] bg-[radial-gradient(circle,rgba(0,242,254,0.06),transparent_70%)] blur-[150px]"
  ></div>

  <!-- Precision Line Grid Pattern -->
  <div
    class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_15%,#000_65%,transparent_100%)]"
  ></div>

  <!-- Micro Dot Matrix Texture -->
  <div
    class="absolute inset-0 bg-[radial-gradient(#ffffff0f_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_35%,#000_50%,transparent_100%)] opacity-70"
  ></div>

  <!-- Delicate Vertical Sweeping Light Beam -->
  <div
    class="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-light-beam blur-[1px]"
  ></div>
</div>
