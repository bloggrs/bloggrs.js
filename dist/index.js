const momentjs = document.createElement("script");
momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js";
document.body.appendChild(momentjs);
Object.defineProperty(String.prototype, 'capitalize', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

function createElement(tagName, attrs = {}, ...children) {
  const elem = Object.assign(document.createElement(tagName), attrs);

  for (const child of children) {
    if (Array.isArray(child)) elem.append(...child);else elem.append(child);
  }

  return elem;
}

window.bloggrs = new window.bloggrs.Bloggrs("fa1dc96f-2136-4c0c-bdbc-95a4f4b7d4fb");
;

class CategoriesListWidget extends HTMLElement {
  constructor() {
    super();
    this.state = {
      loading: true,
      categories: []
    };
  }

  setState = obj => {
    if (typeof obj !== "object") {
      console.error("setState not called properly");
      return;
    }

    Object.assign(this.state, obj);

    this._render();
  };
  _render = () => {
    const style = this.getStyleElement;
    const element = this.render();
    const root_div = document.createElement('div');
    root_div.id = "root";
    root_div.append(element);
    this.innerHTML = root_div.innerHTML;
  };

  connectedCallback() {
    this.fetchData();

    this._render();
  }

  async fetchData() {
    this.setState({
      loading: true
    });
    const args = {};
    const size = this.getAttribute("size");
    if (size) args.pageSize = size;
    const categories = await window.bloggrs.categories.getCategories(args);
    this.setState({
      categories,
      loading: false
    });
  }

  getCategoriesListElements = () => {
    const display_posts_count = (this.getAttribute("display_posts_count") || "false") === "true";
    return this.state.categories.map(ctg => createElement("li", null, ctg.name, " ", display_posts_count ? `(${ctg.meta.posts_count})` : ''));
  };

  static get observedAttributes() {
    return ['title', 'display_posts_count', 'size'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.', name, oldValue, newValue);

    switch (name) {
      case "title":
        return this._render();

      case "display_posts_count":
        return this._render();

      case "size":
        return this.fetchData();
    }
  }

  render() {
    const title = this.getAttribute("title");
    const {
      loading
    } = this.state;
    return createElement("div", {
      className: "mb-14 bg-white shadow-md rounded-md justify-center"
    }, createElement("div", {
      className: " mx-6"
    }, title ? createElement("h1", {
      className: "py-3 mb-4 text-slate-700 font-medium text-xl"
    }, title) : '', createElement("ul", {
      className: "py-4 mx-5 list-disc space-y-3"
    }, loading ? "Loading..." : this.getCategoriesListElements())));
  }

}

customElements.define("categories-list-widget", CategoriesListWidget);

class PostsListWidget extends HTMLElement {
  constructor() {
    super();
    this.state = {
      loading: true,
      categories: []
    };
  }

  setState = obj => {
    if (typeof obj !== "object") {
      console.error("setState not called properly");
      return;
    }

    Object.assign(this.state, obj);

    this._render();
  };
  _render = () => {
    const style = this.getStyleElement;
    const element = this.render();
    const root_div = document.createElement('div');
    root_div.id = "root";
    root_div.append(element);
    this.innerHTML = root_div.innerHTML;
  };

  connectedCallback() {
    this.fetchData();

    this._render();
  }

  async fetchData() {
    this.setState({
      loading: true
    });
    const args = {};
    const size = this.getAttribute("size");
    if (size) args.pageSize = size;
    const categories = await window.bloggrs.posts.getPosts(args);
    this.setState({
      categories,
      loading: false
    });
  }

  getCategoriesListElements = () => {
    const display_posts_count = (this.getAttribute("display_posts_count") || "false") === "true";
    return this.state.categories.map(ctg => createElement("li", null, ctg.name, " ", display_posts_count ? `(${ctg.meta.posts_count})` : ''));
  };

  static get observedAttributes() {
    return ['title', 'display_posts_count', 'size'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.', name, oldValue, newValue);

    switch (name) {
      case "title":
        return this._render();

      case "display_posts_count":
        return this._render();

      case "size":
        return this.fetchData();
    }
  }

  render() {
    const title = this.getAttribute("title");
    const {
      loading,
      categories
    } = this.state;
    return createElement("div", {
      className: "h-full grid grid-col-3 grid-flow-row col-span-2 gap-4"
    }, loading ? "Loading..." : '', this.state.categories.length ? '' : 'No posts to show', this.state.categories.map((post, pIndex) => {
      return createElement("div", {
        className: `
                ${pIndex === this.state.categories.length - 1 ? '' : 'border-b-2'}
                border-b-slate-300 col-span-3 h-full flex
              `
      }, createElement("div", {
        className: "bg-white shadow-md h-3/4 w-1/2 rounded-md"
      }), createElement("div", {
        className: "px-3 h-3/4 w-3/4"
      }, createElement("h1", {
        className: "text-slate-700 font-medium text-xl"
      }, post.title), createElement("p", {
        className: "py-2 text-slate-400 font-normal text-sm"
      }, post.html_content), createElement("div", {
        className: "flex"
      }, createElement("p", {
        className: "ml-24 text-slate-700 font-normal text-sm"
      }, moment(post.createdAt).format("dddd, DD MMMM, YYYY"), " \xA0\xA0\xA0 |"), createElement("p", {
        className: "mx-4 text-slate-700 font-normal text-sm"
      }, post.users.first_name.capitalize(), " ", post.users.last_name.capitalize())), createElement("div", {
        className: "flex  my-2 w-full"
      }, createElement("p", {
        className: "w-1/2 text-blue-300 font-medium text-sm flex "
      }, createElement("img", {
        src: "http://localhost:3001/dist/static/icons8-heart-80.png"
      }), createElement("span", {
        className: "mx-2 text-center my-2"
      }, post.meta.likes_count, " likes")), createElement("p", {
        className: "w-1/2 right-0 text-blue-400 font-normal text-sm flex items-center justify-center"
      }, createElement("img", {
        src: "http://localhost:3001/dist/static/icons8-comments-80.png"
      }), createElement("span", {
        className: "mx-2"
      }, post.meta.comments_count, " comments")))));
    }));
  }

}

customElements.define("posts-list-widget", PostsListWidget);

class HeaderWidget extends HTMLElement {
  constructor() {
    super();
    this.state = {
      loading: true,
      categories: []
    };
  }

  setState = obj => {
    if (typeof obj !== "object") {
      console.error("setState not called properly");
      return;
    }

    Object.assign(this.state, obj);

    this._render();
  };
  _render = () => {
    const style = this.getStyleElement;
    const element = this.render();
    const root_div = document.createElement('div');
    root_div.id = "root";
    root_div.append(element);
    this.innerHTML = root_div.innerHTML;
  };

  connectedCallback() {
    this.fetchData();

    this._render();
  }

  async fetchData() {
    this.setState({
      loading: true
    });
    const args = {};
    const size = this.getAttribute("size");
    if (size) args.pageSize = size;
    const categories = await window.bloggrs.general.getBlogHeaderWidgetData(args);
    this.setState({
      categories,
      loading: false
    });
  }

  getCategoriesListElements = () => {
    const display_posts_count = (this.getAttribute("display_posts_count") || "false") === "true";
    return this.state.categories.map(ctg => createElement("li", null, ctg.name, " ", display_posts_count ? `(${ctg.meta.posts_count})` : ''));
  };

  static get observedAttributes() {
    return ['title', 'display_posts_count', 'size'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.', name, oldValue, newValue);

    switch (name) {
      case "title":
        return this._render();

      case "display_posts_count":
        return this._render();

      case "size":
        return this.fetchData();
    }
  }

  render() {
    const title = this.getAttribute("title");
    const {
      loading,
      categories
    } = this.state;
    if (loading) return '';
    return createElement("nav", {
      className: "bg-white shadow-md max-h-96 py-5"
    }, createElement("div", {
      className: "mx-32 px-2 sm:px-6 lg:px-8"
    }, createElement("div", {
      className: "relative flex items-center justify-between h-16"
    }, createElement("div", {
      className: "absolute inset-y-0 left-0 flex items-center sm:hidden"
    }, createElement("button", {
      type: "button",
      className: " inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ",
      "aria-controls": "mobile-menu",
      "aria-expanded": "false"
    }, createElement("span", {
      className: "sr-only"
    }, "Open main menu"), createElement("svg", {
      className: "block h-6 w-6",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      "aria-hidden": "true"
    }, createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M4 6h16M4 12h16M4 18h16"
    })), createElement("svg", {
      className: "hidden h-6 w-6",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      "aria-hidden": "true"
    }, createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M6 18L18 6M6 6l12 12"
    })))), createElement("div", {
      className: "flex-1 flex items-center justify-center sm:justify-start"
    }, createElement("div", {
      className: "w-9/12 flex-shrink-0 flex items-center"
    }, createElement("img", {
      className: "block w-40 lg:hidden h-8 w-auto h-auto",
      src: "http://localhost:3001/dist/static/logo-placeholder-image.png",
      alt: "Workflow"
    }), createElement("img", {
      className: "hidden absolute lg:block h-32 w-auto h-auto",
      style: {
        width: '12rem'
      },
      src: "http://localhost:3001/dist/static/logo-placeholder-image.png",
      alt: "Workflow"
    }), createElement("h1", {
      className: "text-xl lg:px-52 md:px-22 font-bold text-slate-700"
    }, this.state.categories.blog.name)), createElement("div", {
      className: "w-3/12 hidden sm:block sm:ml-6"
    }, createElement("div", {
      className: "flex space-x-4"
    }, this.state.categories.pages.map(page => createElement("a", {
      href: page.slug,
      className: " text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-base font-medium "
    }, page.name))))))), createElement("div", {
      className: "sm:hidden",
      id: "mobile-menu"
    }, createElement("div", {
      className: "px-2 pt-2 pb-3 space-y-1"
    }, this.state.categories.pages.map(page => createElement("a", {
      href: page.slug,
      className: " text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-base font-medium "
    }, page.name)))));
    return createElement("div", {
      className: "grid grid-col-3 grid-flow-row col-span-2 gap-4"
    }, loading ? "Loading..." : '', this.state.categories.length ? '' : 'No posts to show', this.state.categories.map(post => {
      return createElement("div", {
        className: "border-b-2 border-b-slate-300 col-span-3 h-full flex"
      }, createElement("div", {
        className: "bg-white shadow-md h-3/4 w-1/2 rounded-md"
      }), createElement("div", {
        className: "px-3 h-3/4 w-3/4"
      }, createElement("h1", {
        className: "text-slate-700 font-medium text-xl"
      }, post.title), createElement("p", {
        className: "py-2 text-slate-400 font-normal text-sm"
      }, post.html_content), createElement("div", {
        className: "flex"
      }, createElement("p", {
        className: "ml-24text-slate-700 font-normal text-sm"
      }, moment(post.createdAt).format("dddd, DD MMMM, YYYY"), " \xA0\xA0\xA0 |"), createElement("p", {
        className: "mx-4 text-slate-700 font-normal text-sm"
      }, post.users.first_name.capitalize(), " ", post.users.last_name.capitalize())), createElement("div", {
        className: "flex  my-2 w-full"
      }, createElement("p", {
        className: "w-1/2 text-blue-300 font-medium text-sm flex "
      }, createElement("img", {
        src: "http://localhost:3001/dist/static/icons8-heart-80.png"
      }), createElement("span", {
        className: "mx-2 text-center my-2"
      }, post.meta.likes_count, " likes")), createElement("p", {
        className: "w-1/2 right-0 text-blue-400 font-normal text-sm flex items-center justify-center"
      }, createElement("img", {
        src: "http://localhost:3001/dist/static/icons8-comments-80.png"
      }), createElement("span", {
        className: "mx-2"
      }, post.meta.comments_count, " comments")))));
    }));
  }

}

customElements.define("header-widget", HeaderWidget);