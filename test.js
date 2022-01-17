class ConfirmLink extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._$a = null;
    }
    connectedCallback() {
      const href = this.getAttribute("href") || "#";
      this.shadowRoot.innerHTML = `
        <a href="${href}">
          <slot></slot>
        </a>
      `;
      this._$a = this.shadowRoot.querySelector("a");
      this._$a.addEventListener("click", e => {
        const result = confirm(`Are you sure you want to go to '${e.target.href}'?`);
        if (!result) e.preventDefault();
      });
    }
    static get observedAttributes() { return ["href"]; }
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (this._$a === null) return;
        this._$a.setAttribute("href", newValue);
      }
    }
  }
  
  customElements.define("confirm-link", ConfirmLink);