import { html, PolymerElement } from "./node_modules/@polymer/polymer/polymer-element.js";
import "./node_modules/@vaadin/vaadin-context-menu/vaadin-context-menu.js";
/**
 * `multi-video`
 * Webcomponent para rodar vários vídeos em sincronia
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class MultiVideo extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        .container {
          display: block;
          border: 2px solid red;
        }
      </style>

      <vaadin-context-menu>
        <template>
          <vaadin-list-box>
            <vaadin-item>First menu item</vaadin-item>
            <vaadin-item>Second menu item</vaadin-item>
            <vaadin-item>Third menu item</vaadin-item>
            <hr>
            <vaadin-item disabled>Fourth menu item</vaadin-item>
            <vaadin-item disabled>Fifth menu item</vaadin-item>
            <hr>
            <vaadin-item>Sixth menu item</vaadin-item>
          </vaadin-list-box>
        </template>
        <video class="video" controls src={{url}}></video>
      </vaadin-context-menu>
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