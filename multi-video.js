import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import { PaperButtonBehavior } from '@polymer/paper-behaviors/paper-button-behavior.js';
import '@polymer/paper-slider';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';

const VideoState = Object.freeze({
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
  BUFFERING: 'buffering'
});

const VideoDisplay = Object.freeze({
  FULLSCREEN: 'fullscreen',
  NORMAL: 'normal'
});

const VideoOrientation = Object.freeze({
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape'
});

class MultiVideo extends mixinBehaviors([PaperButtonBehavior], PolymerElement) {
  constructor() {
    super();
    this.state = VideoState.PAUSED;
  }

  ready() {
    super.ready();
  }

  toggleState(videoElement) {
    switch (this.state) {
      case VideoState.PAUSED: {
        videoElement.play();
        this.state = VideoState.PLAYING;
      }
      case VideoState.PLAYING: {
        videoElement.pause();
        this.state = VideoState.PAUSED;
      }
    }
  }

  handleClick() {
    this.videos.forEach(video => {
      this.toggleState(this.shadowRoot.querySelector(`#${video.id}`))
    });
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
          width: 100%;
          height: 100%;
          object-fit: fill;
          z-index: 99;
        }
      </style>

      <div class="videos-container" id="teste">

        <template is="dom-repeat" items="[[videos]]">
          <video class="video" id="[[item.id]]" src=[[item.url]]></video>
        </template>

        ${this.controlsTemplate}

      </div>

    `;
  }

  static get controlsTemplate() {
    return html`
      <style>
        .controls {
          width: 100%;
          background: rgba(0,0,0,0.5);
          height: 50px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          padding: 5px;
        }
        iron-icon {
          fill: var(--icon-toggle-color, rgb(255,255,255));
        }
        button:hover {
          cursor: pointer;
        }
      </style>
        <div class="controls">
          <button
            on-click="handleClick"
            type="button"
            style="border: none; background: transparent">
            <iron-icon
              icon="check">
            </iron-icon>
          </button>

          <button
            on-click="handleClick"
            type="button"
            style="border: none; background: transparent">
            <iron-icon
              icon="check">
            </iron-icon>
          </button>

          <paper-slider
            style="flex: 1"
            value="50"
            max="100">
          </paper-slider>

          <button
            on-click="handleClick"
            type="button"
            style="border: none; background: transparent">
            <iron-icon
              icon="fullscreen">
            </iron-icon>
          </button>
        </div>
    `;
  }

  static get properties() {
    return {
      videos: {
        type: Array,
        value: []
      },
      state: {
        type: String,
        value: VideoState.PAUSED
      }
    };
  }
}


window.customElements.define('multi-video', MultiVideo);
