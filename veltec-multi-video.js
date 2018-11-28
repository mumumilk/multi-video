import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons';

import '@polymer/paper-slider';
import '@polymer/font-roboto';

import { VideoState, VideoSize } from  './veltec-video.js';
import './veltec-controls.js';

class VeltecMultiVideo extends PolymerElement {
  constructor() {
    super();
    this.videoArray = [];
    this.state = VideoState.PAUSED;

    this.addEventListener('timeUpdate', this.onMasterTimeUpdate);
    this.addEventListener('newVideo', this.onNewVideoAttached);
    this.addEventListener('videoEnded', this.onMasterEnd);
    this.addEventListener('change', this.setTimeForAllVideos);
    this.addEventListener('videoClicked', this.videoClicked);
  }

  videoClicked(ev) {
    const videoElement = ev.path[0];

    if (ev.detail.currentSize === VideoSize.AMPLIFIED) {
      videoElement.style['gridArea'] = '';
      this.setFirstVideoCSS();
      return;
    }

    videoElement.style['gridArea'] = `1 / 1 / ${this.template + 1} / ${this.template + 1}`;
  }

  onNewVideoAttached(ev) {
    this.videoArray.push(ev.detail.video);

    if (this.allVideosAreLoaded) {
      this.setMasterVideo();
      this.setFirstVideoCSS();
    }
  }

  onMasterEnd(ev) {
    this.setAsPaused();
  }

  onMasterTimeUpdate(ev) {
    this.masterCurrentTime = ev.detail.currentTime;
    this.masterCurrentPercentage = (ev.detail.currentTime * 100) / this.masterDuration
  }

  get allVideosAreLoaded() {
    return this.videoArray.length === this.videos.length;
  }

  setMasterVideo() {
    const longestDuration = Math.max(...this.videoArray.map(video => video.duration));
    this.masterDuration = longestDuration;
  
    const longestVideo = this.videoArray.find(video => video.duration === longestDuration)
    longestVideo.isMaster = true;
  }

  setFirstVideoCSS() {
    const firstVideo = this.shadowRoot.querySelector(`#${this.videos[0].id}`);

    switch (this.template) {
      case GridTemplate.TEMPLATE3: {
        firstVideo.style['gridArea'] = '1 / 1 / 3 / 3';
      }
    }
  }

  playOrPause() {
    switch (this.state) {
      case VideoState.PLAYING: {
        this.pauseAllVideos();
        break;
      }
      case VideoState.PAUSED: 
      case VideoState.ENDED: {
        this.playAllVideos();
        break;
      }
    }
  }

  pauseAllVideos() {
    this.videoArray.forEach(video => video.pause());
    this.setAsPaused();
  }

  playAllVideos() {
    if (this.state === VideoState.ENDED) {
      this.videoArray.forEach(video => video.play());
    } else {
      this.videoArray.forEach(video => {
        if (!video.ended) { video.play(); }
      });
    }

    this.setAsPlaying();
  }

  setTimeForAllVideos() {
    const newTime = (this.$.paperSlider.value * this.masterDuration) / 100;
    this.videoArray.forEach(video => video.currentTime = newTime);
  }

  setAsPaused() {
    this.state = VideoState.PAUSED;
    this.icon = 'av:play-arrow';
  }

  setAsPlaying() {
    this.state = VideoState.PLAYING;
    this.icon = 'av:pause';
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
          display: grid;
          grid-template-columns: 50% 50%;
          grid-template-rows: 50% 50%;
          background-color: #0e0e0e;
          overflow: hidden;
        }
        .fill {
          height: 100%;
          width: 100%;
        }
      </style>

      <div class="fill">

        <div class="videos-container fill" id="template">
          <template is="dom-repeat" items="[[videos]]" >
              <veltec-video class="fill"
                url="[[item.url]]"
                id="[[item.id]]">
              </veltec-video>
          </template>
        </div>

        ${this.controlsTemplate}
      </div>
    `;
  }

  static get controlsTemplate() {
    return html`
      <style>
        .controls {
          background: black;
          display: flex;
          z-index: 999;
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

          <p>[[toHHMMSS(masterCurrentTime)]]</p>

          <paper-slider
            id="paperSlider"
            style="flex: 1"
            value="[[masterCurrentPercentage]]"
            max="100"
            step="0.1">
          </paper-slider>

          <p>[[toHHMMSS(masterDuration)]]</p>
        </div>
    `;
  }

  toHHMMSS(secs) {
    var sec_num = parseInt(secs, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return minutes + ':' + seconds;
  }

  videosChanged(videos) {
    switch (videos.length) {
      case 1: this.template = GridTemplate.TEMPLATE1; break;
      case 2: case 3: case 4: this.template = GridTemplate.TEMPLATE2; break;
      case 5: case 6: this.template = GridTemplate.TEMPLATE3; break;
      default: this.template = GridTemplate.TEMPLATE1; break;
    }

    this.setContainerTemplate();
  }

  setContainerTemplate() {
    this.$.template.style['grid-template-columns'] = `repeat(${this.template}, ${(100/this.template).toFixed(2)}%)`;
    this.$.template.style['grid-template-rows'] = `repeat(${this.template}, ${(100/this.template).toFixed(2)}%)`;
  }

  static get properties() {
    return {
      videos: {
        type: Array,
        value: [],
        observer: 'videosChanged'
      },
      icon: {
        type: String,
        value: 'av:play-arrow',
        notify: true,
        reflectToAttribute: true
      },
      masterDuration: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true
      },
      masterCurrentTime: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true
      },
      masterCurrentPercentage: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true
      },
      template: {
        type: Number,
        value: GridTemplate.TEMPLATE1,
        notify: true,
        reflectToAttribute: true
      }
    };
  }
}

const GridTemplate = Object.freeze({
  //  ______________
  // |              |
  // |              |
  // |______________|
  TEMPLATE1: 1,
  //  ______________
  // |       |      |
  // |-------|------|
  // |_______|______|
  TEMPLATE2: 2,
  //  ______________
  // |         |____|
  // |_________|____|
  // |____|____|____|
  TEMPLATE3: 3
});

window.customElements.define('veltec-multi-video', VeltecMultiVideo);
