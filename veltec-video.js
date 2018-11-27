import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

export const VideoState = Object.freeze({
    PLAYING: 'playing',
    PAUSED: 'paused',
    ENDED: 'ended',
    BUFFERING: 'buffering'
});

const VideoSize = Object.freeze({
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
        this.display = VideoSize.REGULAR;
        this.isMaster = false;
    }

    get duration() {
        return this.element.duration;
    }

    get currentTime() {
        return this.element.currentTime;
    }

    set currentTime(seconds) {
        if (seconds > this.duration) {
            this.element.currentTime = this.duration;
            this.pause();
            return;
        }

        if (this.ended) {
            this.play();
        }

        this.element.currentTime = seconds;
    }

    get ended() {
        return this.element.ended;
    }

    play() {
        this.element.play();
        this.state = VideoState.PLAYING;
    }

    pause() {
        this.element.pause();
        this.state = VideoState.PAUSED;
    }

    showPosterImage() {
        this.element.load();
    }
}

class VeltecVideo extends PolymerElement {
    constructor() {
        super();
    }

    ready() {
        super.ready();
        this.video = new Video(this.$["[]"]);
    }

    onTimeUpdate() {
        if (this.video.isMaster) {
            this.dispatch('timeUpdate', {currentTime: this.video.currentTime});
        }
    }

    onVideoCanPlay(ev) {
        this.dispatch('newVideo', {video: this.video})
    }

    onVideoEnded(ev) {
        if (this.video.isMaster) {
            this.dispatch('videoEnded', null);
        }
    }

    dispatch(name, obj) {
        const ev = new CustomEvent(name, {
            detail: obj,
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(ev);
    }

    static get template() {
        return html`
            <style>
                .video2 {
                    display: block;
                    width: 50%;
                    height: 100%;
                    object-fit: fill;
                    z-index: 99;
                    flex: 1;
                }
                .video {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
            </style>
            <video
                on-timeupdate="onTimeUpdate"
                on-canplay="onVideoCanPlay"
                on-ended="onVideoEnded"
                class="video"
                id="[]"
                poster="http://i68.tinypic.com/20zae12.png"
                src=[[url]]>
            </video>
        `;
    }

    static get properties() {
        return {
            url: {
                type: String
            }
        }
    }
}

window.customElements.define('veltec-video', VeltecVideo);