export function particles(node: HTMLCanvasElement) {
  const ctx = node.getContext('2d');
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let animationFrameId: number;

  node.width = width;
  node.height = height;

  const particlesArray: Particle[] = [];
  const numberOfParticles = Math.min(Math.floor((width * height) / 15000), 100); // Responsive amount
  const maxDistance = 150;

  let mouse = {
    x: -1000,
    y: -1000,
    radius: 150
  };

  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;

    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      // 50% cyan, 50% orange
      this.color = Math.random() > 0.5 ? '6, 182, 212' : '249, 115, 22';
    }

    update() {
      // Bounce off edges
      if (this.x > width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > height || this.y < 0) this.speedY = -this.speedY;

      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        // Gently push particles away
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        
        this.x -= forceDirectionX * force * 2;
        this.y -= forceDirectionY * force * 2;
      }
    }

    draw() {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, 0.8)`;
      ctx.fill();
    }
  }

  function init() {
    particlesArray.length = 0;
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
          + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
        
        if (distance < (maxDistance * maxDistance)) {
          opacityValue = 1 - (distance / (maxDistance * maxDistance));
          if (!ctx) continue;
          ctx.strokeStyle = `rgba(${particlesArray[a].color}, ${opacityValue * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connect();
    
    animationFrameId = requestAnimationFrame(animate);
  }

  const handleResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    node.width = width;
    node.height = height;
    init();
  };

  const handleMouseMove = (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  const handleMouseOut = () => {
    mouse.x = -1000;
    mouse.y = -1000;
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseout', handleMouseOut);

  init();
  animate();

  return {
    destroy() {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    }
  };
}
