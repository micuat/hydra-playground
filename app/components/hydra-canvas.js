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

  download(e) {
    var dt = this.state.hydra.canvas.toDataURL('image/png');
    e.currentTarget.href = dt;
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
