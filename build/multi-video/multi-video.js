import { html, PolymerElement } from "./node_modules/@polymer/polymer/polymer-element.js";
import "./node_modules/@vaadin/vaadin-context-menu/vaadin-context-menu.js";
import "./node_modules/@polymer/paper-slider/paper-slider.js";
/**
 * `multi-video`
 * Webcomponent para rodar vários vídeos em sincronia
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class MultiVideo extends PolymerElement {
  constructor() {
    super();
  }

  handleClick() {
    this.$.video0.play();
    this.$.video1.play();
    this.$.video2.play();
    this.$.video3.play();
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .videos-container {
          height: 100%;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          background-color: #0e0e0e;
        }
        .video {
          display: block;
          width: 50%;
          height: 50%;
          object-fit: fill;
          z-index: 99;
        }
        .controls {
          width: 100%;
          background: rgba(0,0,0,0.7);
          height: 50px;
        }
      </style>
      <div class="videos-container">
        <template is="dom-repeat" items="[[videos]]">
          <video class="video" id="[[item.id]]" src=[[item.url]]></video>
        </template>
        <div class="controls">
          <button on-click="handleClick" type="button">Click Me!</button>
        </div>
      </div>
      <paper-slider
        value="50"
        max="100">
      </paper-slider>
    `;
  }

  static get properties() {
    return {
      videos: {
        type: Array,
        value: []
      }
    };
  }

}

window.customElements.define('multi-video', MultiVideo);