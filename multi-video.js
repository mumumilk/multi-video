import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';

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
        <video class="video" id="video0" src={{url}}></video>
        <video class="video" id="video1" src={{url}}></video>
        <video class="video" id="video2" src={{url}}></video>
        <video class="video" id="video3" src={{url}}></video>
        <div class="controls">
          <button on-click="handleClick" type="button">Click Me!</button>
        </div>
      </div>

    `;
  }
  static get properties() {
    return {
      url: {
        type: String,
        value: 'http://techslides.com/demos/sample-videos/small.mp4'
      }
    };
  }
}


window.customElements.define('multi-video', MultiVideo);
