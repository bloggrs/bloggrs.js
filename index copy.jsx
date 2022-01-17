// function createElement(tag, attributes, ...children) {
//     console.log({ tag, attributes, children })
//   }
  
//   let myDocument = <p>Hello, world</p>
class BloggrsAPI {
  constructor({ blog_id, secret }) {
    this.blog_id = blog_id;
    this.secret = secret;
    this.base_url = "http://localhost:5500/api/v1";
  }
  async getCategories() {
    const res = await fetch(
      `${this.base_url}/blogs/${this.blog_id}/categories`
    );
    const {
      data: { categories },
    } = await res.json();
    return categories;
  }
}

function createElement(tagName, attrs = {}, ...children) {
  const elem = Object.assign(document.createElement(tagName), attrs);
  for (const child of children) {
    if (Array.isArray(child)) elem.append(...child);
    else elem.append(child);
  }
  return elem;
}


class ConfirmLink extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._$a = null;
  }
  connectedCallback() {
    const href = this.getAttribute("href") || "#";
    this.innerHTML = `
      <a href="${href}">
        <slot></slot>
      </a>
    `;
    this._$a = this.querySelector("a");
    this._$a.addEventListener("click", e => {
      const result = confirm(`Are you sure you want to go to '${href}'?`);
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
window.bloggrsApi = new BloggrsAPI({ 
  blog_id: 1,
  secret: "59cd2369-7b88-4116-b237-b44af9951e80"
});

class CategoriesListWidget extends HTMLElement {
  constructor() {
    super();
    // this.attachShadow({ mode: "open" });
    this._$el = null;
    this.state = {
      loading: true,
      categories: []
    }
  }
  getStyleElement = (
    <style>
      {"  " || `
        .shadow-md {
          --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
          box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
          }
          .bg-white {
            --tw-bg-opacity: 1;
            background-color: rgb(255 255 255 / var(--tw-bg-opacity));
            }

            .rounded-md {
              border-radius: 0.375rem;
              }

              .justify-center {
                justify-content: center;
                }
                .mb-14 {
                  margin-bottom: 3.5rem;
                  }
                  .mx-6 {
                    margin-left: 1.5rem;
                    margin-right: 1.5rem;
                    }

                    .text-slate-700 {
                      --tw-text-opacity: 1;
                      color: rgb(51 65 85 / var(--tw-text-opacity));
                      }
                      .font-medium {
                      font-weight: 500;
                      }
                      .text-xl {
                      font-size: 1.25rem;
                      line-height: 1.75rem;
                      }
                      .py-3 {
                      padding-top: 0.75rem;
                      padding-bottom: 0.75rem;
                      }
                      .mb-4 {
                      margin-bottom: 1rem;
                      }

                      .py-4 {
                        padding-top: 1rem;
                        padding-bottom: 1rem;
                        }
                        .list-disc {
                        list-style-type: disc;
                        }
                        .mx-5 {
                        margin-left: 1.25rem;
                        margin-right: 1.25rem;
                        }
      `}
    </style>
  )
  setState = key => value => {
    this.state[key] = value
    this._render()
  }
  _render = () => {
    const style = this.getStyleElement;
    const element = this.render()
    this.innerHTML = 'dasdas'
    this.innerHTML = ''
    this.append(style,element)
  }
  connectedCallback(){
    this.fetchData();
    this._render()
  }
  async fetchData() {
    this.setState("loading")(true);
    const categories = await window.bloggrsApi.getCategories();
    this.setState("categories")(categories);
    this.setState("loading")(false);
  }
  getCategoriesListElements = () => {
    const display_posts_count = this.getAttribute("title") || true
    return this.state.categories.map(ctg => (
      <li>{ctg.name} {display_posts_count ? `(${ctg.meta.posts_count})` : '' }</li>
    ))
  }
  render() {
    const title = this.getAttribute("title")
    const children = this.getAttribute("children")
    const { loading } = this.state
    return (
      <div className="mb-14 bg-white shadow-md rounded-md justify-center">
        {children}
          <div className=" mx-6">
            {
              title ?
              (
                <h1 className="py-3 mb-4 text-slate-700 font-medium text-xl">
                    {title}
                </h1>
              ) : ('')   
            }
              <ul className="py-4 mx-5 list-disc space-y-3">
                {
                  loading ? "Loading..."
                  : this.getCategoriesListElements()
                }
              </ul>
          </div>
      </div>
    )
  }
}
customElements.define("categories-list-widget", CategoriesListWidget);


// const categoriesListWidget = new CategoriesListWidget({ })
// console.log(categoriesListWidget, categoriesListWidget.render())
// window.document.getElementById("app").replaceWith(categoriesListWidget.render());