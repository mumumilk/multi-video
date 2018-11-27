import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons';

import '@polymer/paper-slider';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
import '@polymer/font-roboto';

import { VideoState } from  './veltec-video.js';
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
  }

  onNewVideoAttached(ev) {
    this.videoArray.push(ev.detail.video);
    this.setMasterVideo();
  }

  onMasterEnd(ev) {
    this.setAsPaused();
  }

  onMasterTimeUpdate(ev) {
    console.log('time uopdate')
    this.masterCurrentTime = ev.detail.currentTime;
    this.masterCurrentPercentage = (ev.detail.currentTime * 100) / this.masterDuration
  }

  setMasterVideo() {
    if (this.videoArray.length !== this.videos.length) {
      return;
    }

    const longestDuration = Math.max(...this.videoArray.map(video => video.duration));
    this.masterDuration = longestDuration;
  
    const longestVideo = this.videoArray.find(video => video.duration === longestDuration)
    longestVideo.isMaster = true;
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
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          background-color: #0e0e0e;
        }
      </style>

      <div class="videos-container" id="teste">

        <template is="dom-repeat" items="[[videos]]">
            <veltec-video
              url="[[item.url]]"
              id="[[item.id]]">
            </veltec-video>
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
      }
    };
  }
}


window.customElements.define('veltec-multi-video', VeltecMultiVideo);
