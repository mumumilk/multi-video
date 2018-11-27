import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons';

import '@polymer/paper-slider';
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
import '@polymer/font-roboto';

import './veltec-video.js';
import './veltec-controls.js';

class VeltecControls extends PolymerElement {
    constructor() {
        super();
    }

    static get template() {
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
          <p>[[currentTime]]</p>


          <p>[[toHHMMSS(duration)]]</p>
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

    _valueObserver(e) {
        console.log('value observer')
    }

    static get properties() {
        return {
            duration: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true
            },
            currentTime: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true,
                observer: '_valueObserver'
            }
        }
    }
}

window.customElements.define('veltec-controls', VeltecControls);