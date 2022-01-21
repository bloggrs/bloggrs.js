
const momentjs = document.createElement("script")
momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"
document.body.appendChild(momentjs)

Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

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
    this.innerHTML = root_div.innerHTML
    this.style = "width: 100%";
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
      <div className="mb-14 bg-white shadow-md max-h-1/2 w-3/4 rounded-md justify-center">
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


class PostsListWidget extends HTMLElement {
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
    this.innerHTML = root_div.innerHTML
    // console.log("DDDD", this, this.style)
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
    const categories = await window.bloggrs.posts.getPosts(args);
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
    const { loading, categories } = this.state
    const first_div_class = {
      0: 'border-b-2 border-b-slate-300 col-span-3 h-full flex',
      1: 'border-b-2 my-4 border-b-slate-300 col-span-3 flex',
      2: 'col-span-3 my-8 h-full flex'
    }
    return (
      <div className="grid grid-rows-3 grid-flow-col col-span-2 gap-4">
        { loading ? "Loading..." : '' }
        { this.state.categories.length ? '' : 'No posts to show'}
        {
          this.state.categories.map((post, pIndex) => {
            return (
              <div className={first_div_class[pIndex]}>
                <div className="bg-white shadow-md h-3/4 w-1/2 rounded-md" />
                <div className="px-3 h-3/4 w-3/4">
                  <h1 className="text-slate-700 font-medium text-xl">
                    {post.title}
                  </h1>
                  <p className="py-2 text-slate-400 font-normal text-sm">
                    {/* {post.html_content} */}
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer

                  </p>
                  <div className="flex">
                    <p className="ml-24 text-slate-700 font-normal text-sm">
                      {moment(post.createdAt).format("dddd, DD MMMM, YYYY")} &nbsp;&nbsp;&nbsp; |
                      {/* Wednesday, December 22, 2021 &nbsp;&nbsp;&nbsp; | */}
                    </p>
                    <p className="mx-4 text-slate-700 font-normal text-sm">
                      {post.users.first_name.capitalize()} {post.users.last_name.capitalize()}
                    </p>
                  </div>
                  <div className="flex  my-2 w-full">
                    <p className="w-1/2 text-blue-300 font-medium text-sm flex ">
                      <img src="http://localhost:3001/dist/static/icons8-heart-80.png" />
                      <span className="mx-2 text-center my-2">{post.meta.likes_count} likes</span>
                    </p>
                    <p className="w-1/2 right-0 text-blue-400 font-normal text-sm flex items-center justify-center">
                      <img src="http://localhost:3001/dist/static/icons8-comments-80.png" />
                      <span className="mx-2">{post.meta.comments_count} comments</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
customElements.define("posts-list-widget", PostsListWidget);

class HeaderWidget extends HTMLElement {
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
    this.innerHTML = root_div.innerHTML
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
    const categories = await window.bloggrs.general.getBlogHeaderWidgetData(args);
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
    const { loading, categories } = this.state
    if (loading) return '';
    return (
      <nav className="bg-white shadow-md max-h-96 py-5">
        <div className="mx-32 px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <button type="button" className="
                inline-flex
                items-center
                justify-center
                p-2
                rounded-md
                text-slate-400
                hover:text-white hover:bg-slate-700
                focus:outline-none
                focus:ring-2
                focus:ring-inset
                focus:ring-white
              " aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                {/*
              Icon when menu is closed.

              Heroicon name: outline/menu

              Menu open: "hidden", Menu closed: "block"
            */}
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/*
              Icon when menu is open.

              Heroicon name: outline/x

              Menu open: "block", Menu closed: "hidden"
            */}
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:justify-start">
              <div className="w-9/12 flex-shrink-0 flex items-center">
                <img className="block w-40 lg:hidden h-8 w-auto h-auto" src="http://localhost:3001/dist/static/logo-placeholder-image.png" alt="Workflow" />
                <img style={{ width: '12rem' }} className="hidden absolute lg:block h-32 w-auto h-auto" style={{width: '12rem'}} src="http://localhost:3001/dist/static/logo-placeholder-image.png" alt="Workflow" />
                <h1 className="text-xl lg:px-52 md:px-22 font-bold text-slate-700">{this.state.categories.blog.name}</h1>
              </div>
              <div className="w-3/12 hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  {/* Current: "bg-slate-900 text-white", Default: "text-slate-300 hover:bg-slate-700 hover:text-white" */}
                  {
                    this.state.categories.pages.map(page => (
                      <a href={page.slug} className="
                        text-slate-600
                        hover:text-slate-900
                        px-3
                        py-2
                        rounded-md
                        text-base
                        font-medium
                      ">{page.name}</a>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile menu, show/hide based on menu state. */}
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Current: "bg-slate-900 text-white", Default: "text-slate-300  hover:text-slate-900" */}
            {
              this.state.categories.pages.map(page => (
                <a href={page.slug} className="
                  text-slate-600
                  hover:text-slate-900
                  px-3
                  py-2
                  rounded-md
                  text-base
                  font-medium
                ">{page.name}</a>
              ))
            }
          </div>
        </div>
      </nav>
    )
    return (
      <div className="grid grid-col-3 grid-flow-row col-span-2 gap-4">
        { loading ? "Loading..." : '' }
        { this.state.categories.length ? '' : 'No posts to show'}
        {
          this.state.categories.map(post => {
            return (
              <div className="border-b-2 border-b-slate-300 col-span-3 h-full flex">
                <div className="bg-white shadow-md h-3/4 w-1/2 rounded-md" />
                <div className="px-3 h-3/4 w-3/4">
                  <h1 className="text-slate-700 font-medium text-xl">
                    {post.title}
                  </h1>
                  <p className="py-2 text-slate-400 font-normal text-sm">
                    {post.html_content}
                  </p>
                  <div className="flex">
                    <p className="ml-24text-slate-700 font-normal text-sm">
                      {moment(post.createdAt).format("dddd, DD MMMM, YYYY")} &nbsp;&nbsp;&nbsp; |
                      {/* Wednesday, December 22, 2021 &nbsp;&nbsp;&nbsp; | */}
                    </p>
                    <p className="mx-4 text-slate-700 font-normal text-sm">
                      {post.users.first_name.capitalize()} {post.users.last_name.capitalize()}
                    </p>
                  </div>
                  <div className="flex  my-2 w-full">
                    <p className="w-1/2 text-blue-300 font-medium text-sm flex ">
                      <img src="http://localhost:3001/dist/static/icons8-heart-80.png" />
                      <span className="mx-2 text-center my-2">{post.meta.likes_count} likes</span>
                    </p>
                    <p className="w-1/2 right-0 text-blue-400 font-normal text-sm flex items-center justify-center">
                      <img src="http://localhost:3001/dist/static/icons8-comments-80.png" />
                      <span className="mx-2">{post.meta.comments_count} comments</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
customElements.define("header-widget", HeaderWidget);



// const categoriesListWidget = new CategoriesListWidget({ })
// console.log(categoriesListWidget, categoriesListWidget.render())
// window.document.getElementById("app").replaceWith(categoriesListWidget.render());