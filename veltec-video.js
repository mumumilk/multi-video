import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';

import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/paper-item/paper-item.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/image-icons';


export const VideoState = Object.freeze({
    PLAYING: 'playing',
    PAUSED: 'paused',
    ENDED: 'ended',
    BUFFERING: 'buffering'
});

export const VideoSize = Object.freeze({
    AMPLIFIED: 'amplified',
    REGULAR: 'regular'
});

const VideoOrientation = Object.freeze({
    LANDSCAPE: 0,
    PORTRAIT: 1
});

const VideoRotation = Object.freeze({
    CLOCKWISE: 'right',
    COUNTERCLOCKWISE: 'left'
});

class Video {
    constructor(element) {
        this.element = element;
        this.state = VideoState.PAUSED;
        this.orientation = VideoOrientation.LANDSCAPE;
        this.size = VideoSize.REGULAR;
        this.isMaster = false;
        this.currentRotationDegrees = 0;
    }

    get duration() {
        return this.element.duration;
    }

    get currentTime() {
        return this.element.currentTime;
    }

    set currentTime(seconds) {
        if (seconds > this.duration) {
            this.setAsEnded();
            return;
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

    rotate(rotation) {
        switch (rotation) {
            case VideoRotation.CLOCKWISE: {
                this.currentRotationDegrees += 90;
                this.element.style['transform'] = `rotate(${this.currentRotationDegrees}deg)`;
            } break;
            case VideoRotation.COUNTERCLOCKWISE: {
                this.currentRotationDegrees -= 90;
                this.element.style['transform'] = `rotate(${this.currentRotationDegrees}deg)`;
            } break;
            default: break;
        }

        this.toggleOrientation();
    }

    toggleOrientation() {
        this.orientation = this.orientation === VideoOrientation.LANDSCAPE ? VideoOrientation.PORTRAIT : VideoOrientation.LANDSCAPE;
        this.setSizeAccordingToOrientation();
    }

    toggleSize() {
        this.size = this.size === VideoSize.AMPLIFIED ? VideoSize.REGULAR : VideoSize.AMPLIFIED;
        this.setSizeAccordingToOrientation();
    }

    setSizeAccordingToOrientation() {
        switch (this.orientation) {
            case VideoOrientation.LANDSCAPE: {
                this.element.style['height'] = '100%';
                this.element.style['width'] = '100%';
            } break;
            case VideoOrientation.PORTRAIT: {
                // O modo retrato possui peculiaridades pois quando
                // o vídeo é girado, a sua altura se torna a largura, e vice-e-versa.
                // Por conta disso, é necessário achar a proporção de acordo com o
                // seu elemento pai.
                this.element.style['height'] = `${this.calculateProportionalWidth(this.element.parentElement)}px}`;
                this.element.style['width'] = `${this.element.parentElement.offsetHeight}px`;
            } break;
        }
    }

    calculateProportionalWidth(element) {
        // O ratio foi escolhido na mão, por isso está hard-coded.
        // Caso queira mudar a proporção do vídeo quando o mesmo é 
        // rotacionado ou ampliado, deve alterar widthRatio e heightRatio
        const height = element.offsetHeight;
    
        const widthRatio = 5;
        const heightRatio = 3.6;
    
        return (height * heightRatio) / widthRatio;
    }

    setAsEnded() {
        this.element.currentTime = this.duration;
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
        this.dispatch('newVideo', {video: this.video});
    }

    onVideoClicked() {
        this.dispatch('videoClicked', {currentSize: this.video.size});
        this.video.toggleSize();
    }

    onVideoEnded(ev) {
        if (this.video.isMaster) {
            this.dispatch('videoEnded', null);
        }
    }

    // Bubbles e composed fazem com que o evento suba a
    // árvore e chegue aos hosts desse componente
    dispatch(name, obj) {
        const ev = new CustomEvent(name, {
            detail: obj,
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(ev);
    }

    rotateLeft() {
        this.video.rotate(VideoRotation.COUNTERCLOCKWISE);
    }

    rotateRight() {
        this.video.rotate(VideoRotation.CLOCKWISE);
    }

    static get template() {
        return html`
            <style>
                .video {
                    height: 100%;
                    width: 100%;
                    object-fit: fill;
                }
                vaadin-context-menu {
                    height: 100%;
                    display: flex;
                    justify-content: center;
                }
            </style>
            <vaadin-context-menu override>
                <template>
                    <paper-listbox>
                        <paper-item disabled>
                            Girar
                        </paper-item>
                        <paper-icon-item on-click="rotateRight">
                            <iron-icon icon="image:rotate-right" slot="item-icon"></iron-icon>    
                            90° para a direita
                        </paper-icon-item>
                        <paper-icon-item on-click="rotateLeft">
                            <iron-icon icon="image:rotate-left" slot="item-icon"></iron-icon>    
                            90° para a esquerda
                        </paper-icon-item>
                    </paper-listbox>
                </template>
                <video
                    on-timeupdate="onTimeUpdate"
                    on-canplay="onVideoCanPlay"
                    on-ended="onVideoEnded"
                    on-click="onVideoClicked"
                    class="video"
                    id="[]"
                    poster="http://i68.tinypic.com/20zae12.png"
                    src=[[url]]>
                </video>
            </vaadin-context-menu>
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