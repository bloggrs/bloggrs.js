

function createElement(tagName, attrs = {}, ...children) {
  const elem = Object.assign(document.createElement(tagName), attrs);
  for (const child of children) {
    if (Array.isArray(child)) elem.append(...child);
    else elem.append(child);
  }
  return elem;
}

window.bloggrs = new window.bloggrs.Bloggrs("fa1dc96f-2136-4c0c-bdbc-95a4f4b7d4fb");;

class CategoriesListWidget extends HTMLElement {
  constructor() {
    super();
    this.state = {
      loading: true,
      categories: []
    }
  }
  setState = obj => {
    if (typeof(obj) !== "object") {
      console.error("setState not called properly")
      return;
    }
    Object.assign(this.state, obj);
    this._render();
  };
  _render = () => {
    const style = this.getStyleElement;
    const element = this.render()
    const root_div = document.createElement('div')
    root_div.id = "root"
    root_div.append(element);
    const this_root = this.querySelector('#root')
    if (this_root) {
      this_root.innerHTML = ''
      this_root.append(root_div);
    } else this.append(root_div)
  }
  connectedCallback(){
    this.fetchData();
    this._render()
  }
  async fetchData() {
    this.setState({ loading: true })
    const args = {};
    const size = this.getAttribute("size");
    if (size) args.pageSize = size;
    const categories = await window.bloggrs.categories.getCategories(args);
    this.setState({ categories, loading: false })
  }
  getCategoriesListElements = () => {
    const display_posts_count = (this.getAttribute("display_posts_count") || "false") === "true"
    return this.state.categories.map(ctg => (
      <li>{ctg.name} {display_posts_count ? `(${ctg.meta.posts_count})` : '' }</li>
    ))
  }
  static get observedAttributes() { return ['title', 'display_posts_count', 'size']; }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.', name, oldValue, newValue);
    switch (name) {
      case "title": return this._render();
      case "display_posts_count": return this._render()
      case "size": return this.fetchData()
    }
  }
  render() {
    const title = this.getAttribute("title")
    const { loading } = this.state
    return (
      <div className="mb-14 bg-white shadow-md rounded-md justify-center">
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