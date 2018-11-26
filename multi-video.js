import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons';

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

class MultiVideo extends PolymerElement {
  constructor() {
    super();
    this.state = VideoState.PAUSED;
    this.duration = 0;
    this.currentTime = 0;
  }

  ready() {
    super.ready();
  }

  toggleState(videoElement) {debugger
    switch (this.state) {
      case VideoState.PAUSED: {
        videoElement.play();
        this.icon = 'av:pause';
        this.state = VideoState.PLAYING;
        break;
      }
      case VideoState.PLAYING: {
        videoElement.pause();
        this.icon = 'av:play-arrow';
        this.state = VideoState.PAUSED;
        break;
      }
      case VideoState.ENDED: {
        videoElement.play();
        this.icon = 'av:pause';
        this.state = VideoState.PLAYING;
        break;
      }
    }
  }

  onVideoCanPlay(e) {
    this.duration = e.target.duration;
  }

  onTimeUpdate(e) {
    this.currentTime = e.target.currentTime;
    this.currentTimePercent = (this.currentTime * 100) / 5;
  }

  onVideoEnded(e) {
    this.state = VideoState.ENDED;
    this.icon = 'av:play-arrow';
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
          <video
            class="video"
            on-timeupdate="onTimeUpdate"
            on-canplay="onVideoCanPlay"
            on-ended="onVideoEnded"
            id="[[item.id]]"
            src=[[item.url]]></video>
        </template>

        ${this.controlsTemplate}

      </div>

    `;
  }

  playOrPause() {
    this.videos.forEach(video => {
      this.toggleState(this.shadowRoot.querySelector(`#${video.id}`))
    });
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
        button:focus {
          outline: 0;
        }
        p, time {
          color: white;
        }
      </style>
        <div class="controls">

          <button
            id="play"
            on-click="playOrPause"
            type="button"
            style="border: none; background: transparent">
            <iron-icon
              icon="[[icon]]">
            </iron-icon>
          </button>

          <p>[[toHHMMSS(currentTime)]]</p>

          <paper-slider
            style="flex: 1"
            value="[[currentTimePercent]]"
            max="100"
            step="1">
          </paper-slider>

          <time>[[toHHMMSS(duration)]]</time>

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

  toHHMMSS(secs) {
    var sec_num = parseInt(secs, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return minutes + ':' + seconds;
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
      },
      icon: {
        type: String,
        value: 'av:play-arrow',
        notify: true,
        reflectToAttribute: true
      },
      currentTime: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true
      },
      currentTimePercent: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true
      }
    };
  }
}


window.customElements.define('multi-video', MultiVideo);
