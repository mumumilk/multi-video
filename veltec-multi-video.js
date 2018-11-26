import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons';

import '@polymer/paper-slider';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
import '@polymer/font-roboto';

const VideoState = Object.freeze({
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
  BUFFERING: 'buffering'
});

const VideoDisplay = Object.freeze({
  AMPLIFIED: 'amplified',
  REGULAR: 'regular'
});

const VideoOrientation = Object.freeze({
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape'
});

class Video {
  constructor(element) {
    this.element = element;
    this.state = VideoState.PAUSED;
    this.orientation = VideoOrientation.LANDSCAPE;
    this.display = VideoDisplay.REGULAR;
  }

  get duration() {
    this.element.duration;
  }

  get currentTime() {
    return this.element.currentTime;
  }

  set currentTime(seconds) {
    this.element.currentTime = seconds;
  }

  play() {
    this.element.play();
    this.state = VideoState.PLAYING;
  }

  pause() {
    this.element.pause();
    this.state = VideoState.PAUSED;
  }

  
}

class VeltecMultiVideo extends PolymerElement {
  constructor() {
    super();
    this.videoArray = [];

    this.state = VideoState.PAUSED;
    this.duration = 0;
    this.currentTime = 0;
    this.videoEl = null;
    this.highest
  }

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  toggleState() {debugger
    this.videoArray.forEach(video => video.play());
    // switch (this.state) {
    //   case VideoState.PAUSED: {
    //     this.playAll();
    //     break;
    //   }
    //   case VideoState.PLAYING: {
    //     this.pauseAll();
    //     break;
    //   }
    //   case VideoState.ENDED: {
    //     this.playAll();
    //     break;
    //   }
    // }
  }

  playAll() {
    this.videos.forEach(video => {
      this.shadowRoot.querySelector(`#${video.id}`).play();
    });
    this.state = VideoState.PLAYING;
    this.icon = 'av:pause';
  }

  pauseAll() {
    this.videos.forEach(video => {
      this.shadowRoot.querySelector(`#${video.id}`).pause();
    });
    this.state = VideoState.PAUSED;
    this.icon = 'av:play-arrow';
  }

  onVideoCanPlay(e) {
    this.videoArray.push(new Video(e.target));

    this.videoEl = e.target;
    let videoDuration = this.duration = e.target.duration;
    let video = this.videoEl = e.target;
    let slideBar = this.$.ratings;

    // slideBar.addEventListener('change', function() {
    //   video.currentTime =  (videoDuration * slideBar.value) / 100;
    // });
  }

  onTimeUpdate(e) {
    // this.currentTime = e.target.currentTime;
    // this.currentTimePercent = (this.currentTime * 100) / this.duration;
  }

  onVideoEnded(e) {
    e.target.load();
    
    // this.state = VideoState.ENDED;
    // this.icon = 'av:play-arrow';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        body {
          font-family: Roboto;
        }
        .videos-container {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          background-color: #0e0e0e;
        }
        .video {
          display: block;
          width: 50%;
          height: 100%;
          object-fit: fill;
          z-index: 99;
          flex: 1;
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
            poster="http://i68.tinypic.com/20zae12.png"
            src=[[item.url]]></video>
        </template>

        ${this.controlsTemplate}

        <veltec-video></veltec-video>
      </div>

    `;
  }

  playOrPause() {
    this.toggleState();
    // this.videos.forEach(video => {
    //   this.shadowRoot.querySelector(`#${video.id}`).play();
    //   this.toggleState(this.shadowRoot.querySelector(`#${video.id}`))
    // });
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
          font-family: Roboto;
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
            id="ratings"
            style="flex: 1"
            value="[[currentTimePercent]]"
            max="100"
            step="0.1">
          </paper-slider>

          <time>[[toHHMMSS(duration)]]</time>
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


window.customElements.define('veltec-multi-video', VeltecMultiVideo);
