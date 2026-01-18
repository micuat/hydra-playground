import html from "choo/html";
import Component from "choo/component";
import Hydra from "hydra-synth";

export default class Map extends Component {
  constructor(id, state, emit) {
    super(id);
    this.local = state.components[id] = {};
    this.state = state;
    this.playing = true;
  }

  load(element) {
    console.log("loading hydra", element, this.canvas);

    // create a new hydra-synth instance
    const hydraCanvas = element.querySelector("canvas");
    hydraCanvas.width = window.innerWidth;
    hydraCanvas.height = window.innerHeight;
    // hydraCanvas.width = 800//window.innerWidth;
    // hydraCanvas.height = 800//window.innerHeight;
    hydraCanvas.getContext("webgl", {
      preserveDrawingBuffer: true
    });

    if (this.state.hydra == undefined) {
      this.state.hydra = new Hydra({
        canvas: hydraCanvas,
        detectAudio: false,
        width: hydraCanvas.width,
        height: hydraCanvas.height,
        autoLoop: false,
      });

      window.requestAnimationFrame(() => {
        this.draw();
      });
    } else {
      // hydra = this.state.hydra;
    }
  }

  evalCode() {
    src(o0).rotate(this.state.hydraValues.rotate.func)
    .modulate(gradient().pixelate(2,2).brightness(-.5), this.state.hydraValues.modulate.func)
    .modulate(osc(6,0,1.6).brightness(-.5).modulate(noise(this.state.hydraValues.modulateNoiseFreq.func,0).sub(gradient()),1),this.state.hydraValues.modulateNoiseAmount.func)
    .modulate(osc(6,0).brightness(-.5),this.state.hydraValues.modulateOsc.func)
    .layer(src(s0).mask(shape(4,1,0)).scale(this.state.hydraValues.scale.func)).out();
  }

  draw() {
    if (this.playing != false) {
      this.state.hydra.tick(1/30);
      window.requestAnimationFrame(() => {
        this.draw();
      });
    }
  }

  play() {
    if (this.playing == false) {
      this.playing = true;
      window.requestAnimationFrame(() => {
        this.draw();
      });
    }
  }

  pause () {
    this.playing = false;
  }

  nextFrame() {
    if (this.playing == false) {
      this.state.hydra.tick(1/30);
    }
  }

  clear() {
    solid(0,0,0,0).out();
    if (this.playing == false) {
      this.state.hydra.tick(1/30);
    }
    setTimeout(()=>{
      this.evalCode();
    }, 500);
  }

  async download(e) {
    var dt = this.state.hydra.canvas.toDataURL('image/png');
    e.currentTarget.href = dt;
  }

  async copy() {
    async function getBlobFromCanvas(canvas) {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        });
      });
    }
    try {
      const blob = await getBlobFromCanvas(this.state.hydra.canvas);
      // Create ClipboardItem with blob and it's type, and add to an array
      const data = [new ClipboardItem({ [blob.type]: blob })];
      // Write the data to the clipboard
      await navigator.clipboard.write(data);
      console.log("Copied");
    } catch (error) {
      console.log(error);
    }
  }

  update() {
    return false;
  }

  createElement(center) {
    return html`
      <div class="relative z-0 w-screen h-screen">
        <canvas class="w-full h-full z-0"></canvas>
      </div>
    `;
  }
};
