class BloggrsAPI {
  constructor({ blog_id, secret }) {
    this.blog_id = blog_id;
    this.secret = secret;
    this.base_url = "http://localhost:4000/api/v1";
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
  async getPosts() {
    const res = await fetch(`${this.base_url}/blogs/${this.blog_id}/posts`);
    const {
      data: { posts },
    } = await res.json();
    return posts;
  }
  async getSinglePost(post_id) {
    const res = await fetch(
      `${this.base_url}/blogs/${this.blog_id}/posts/${post_id}`
    );
    const {
      data: { post },
    } = await res.json();
    return post;
  }
  async getPages() {
    const res = await fetch(`${this.base_url}/blogs/${this.blog_id}/pages`);
    const {
      data: { pages },
    } = await res.json();
    return pages;
  }
  async getBlog() {
    const res = await fetch(`${this.base_url}/blogs/${this.blog_id}`);
    const {
      data: { blog },
    } = await res.json();
    return blog;
  }
}

class BloggrsClient {
  constructor({ blog_id, secret }) {
    this.blog_id = blog_id;
    this.secret = secret;
    this.bloggrsApi = new BloggrsAPI({ blog_id, secret });
  }
  handleCreatePagesListWidget = async (el) => {
    const pages = await this.bloggrsApi.getPages();
    const div = `
      <div class="w-3/12 hidden sm:block sm:ml-6">
        <div class="flex space-x-4">
          <!-- Current: "bg-slate-900 text-white", Default: "text-slate-300 hover:bg-slate-700 hover:text-white" -->

          ${pages
            .map(
              (page) =>
                `<a href="${page.slug}" class="
              text-slate-600
              hover:text-slate-900
              px-3
              py-2
              rounded-md
              text-base
              font-medium
            ">${page.name}</a>`
            )
            .join(" ")}
        </div>
      </div>
    `;
    el.innerHTML = div;
    return div;
  };
  handleCreateHeaderWidget = async (el) => {
    const blog = await this.bloggrsApi.getBlog();
    const div = `
      <nav class="bg-white shadow-md max-h-96 py-5">
            <div class="mx-32 px-2 sm:px-6 lg:px-8">
              <div class="relative flex items-center justify-between h-16">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <!-- Mobile menu button-->
                  <button type="button" class="
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
                    <span class="sr-only">Open main menu</span>
                    <!--
                    Icon when menu is closed.

                    Heroicon name: outline/menu

                    Menu open: "hidden", Menu closed: "block"
                  -->
                    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    <!--
                    Icon when menu is open.

                    Heroicon name: outline/x

                    Menu open: "block", Menu closed: "hidden"
                  -->
                    <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div class="flex-1 flex items-center justify-center sm:justify-start">
                  <div class="w-9/12 flex-shrink-0 flex items-center">
                    <img class="block w-40 lg:hidden h-8 w-auto h-auto" src="/dist/static/logo-placeholder-image.png" alt="Workflow">
                    <img class="hidden absolute lg:block h-32 w-auto h-auto" style="width: 12rem;" src="/dist/static/logo-placeholder-image.png" alt="Workflow">
                    <h1 class="text-xl lg:px-52 md:px-22 font-bold text-slate-700">${blog.name}</h1>
                  </div>
                  <div id="pages_list"></div>
                </div>
              </div>
            </div>

            <!-- Mobile menu, show/hide based on menu state. -->
            <div class="sm:hidden" id="mobile-menu">
              <div class="px-2 pt-2 pb-3 space-y-1">
                <!-- Current: "bg-slate-900 text-white", Default: "text-slate-300  hover:text-slate-900" -->
                <a href="#" class="
                    bg-slate-900
                    text-white
                    block
                    px-3
                    py-2
                    rounded-md
                    text-base
                    font-medium
                  " aria-current="page">Dashboard</a>

                <a href="#" class="
                    text-slate-300
                    hover:text-slate-900
                    block
                    px-3
                    py-2
                    rounded-md
                    text-base
                    font-medium
                  ">Features</a>

                <a href="#" class="
                    text-slate-300
                    hover:text-slate-900
                    block
                    px-3
                    py-2
                    rounded-md
                    text-base
                    font-medium
                  ">Pricing</a>

                <a href="#" class="
                    text-slate-300
                    hover:text-slate-900
                    block
                    px-3
                    py-2
                    rounded-md
                    text-base
                    font-medium
                  ">Blog</a>
              </div>
            </div>
          </nav>
    `;
    el.innerHTML = div;
    const pages_list_el = el.querySelector("#pages_list");
    this.createWidget(pages_list_el, { type: "pages_list" });
    return div;
  };
  handleCreateCategoriesWidget = async (el) => {
    console.log(this.bloggrsApi, this.bloggrsApi, this.secret);
    const categories = await this.bloggrsApi.getCategories();
    const div = document.createElement("div");
    div.className =
      "my-50 mb-14 bg-white shadow-md max-h-1/2 w-3/4 rounded-md justify-center";
    const div__div2 = document.createElement("div");
    div__div2.className = "mx-6";
    const div2__h1 = document.createElement("h1");
    div2__h1.className = "py-3 mb-4 text-slate-700 font-medium text-xl";
    div2__h1.innerHTML = "Categories";
    const div2__ul = document.createElement("ul");
    div2__ul.className = "py-4 mx-5 list-disc space-y-3";
    for (let category of categories) {
      const ul__li = document.createElement("li");
      ul__li.innerHTML = `${category.name} (${category.meta.posts_count})`;
      div2__ul.appendChild(ul__li);
    }
    //
    div__div2.appendChild(div2__h1);
    div__div2.appendChild(div2__ul);
    div.appendChild(div__div2);
    el.appendChild(div);
    return div;
  };
  handleCreatePostsListWidget = async (el) => {
    const posts = await this.bloggrsApi.getPosts();
    const div = `
    <div class="h-full grid grid-rows-3 grid-flow-col col-span-2 gap-4">
        ${posts
          .map((post) => {
            return `
          <div class="border-b-2 border-b-slate-300 col-span-3 h-full flex">
            <div class="bg-white shadow-md h-3/4 w-1/2 rounded-md"></div>
            <div class="px-3 h-3/4 w-3/4">
              <h1 class="text-slate-700 font-medium text-xl">
                ${post.title}
              </h1>
              <p class="py-2 text-slate-400 font-normal text-sm">
                ${post.html_content}
              </p>
              <div class="flex">
                <p class="ml-24text-slate-700 font-normal text-sm">
                  Wednesday, December 22, 2021 &nbsp;&nbsp;&nbsp; |
                </p>
                <p class="mx-4 text-slate-700 font-normal text-sm">
                  John Cena
                </p>
              </div>
              <div class="flex  my-2 w-full">
                <p class="w-1/2 text-blue-300 font-medium text-sm flex ">
                  <img src="/dist/static/icons8-heart-80.png">
                  <span class="mx-2 text-center my-2">${post.meta.likes_count} likes</span>
                </p>
                <p class="w-1/2 right-0 text-blue-400 font-normal text-sm flex items-center justify-center">
                  <img src="/dist/static/icons8-comments-80.png">
                  <span class="mx-2">${post.meta.comments_count} comments</span>
                </p>
              </div>
            </div>
          </div>
          `;
          })
          .join(" ")}
      </div>
    `;
    el.innerHTML = div;
    return div;
  };
  handleCreateSinglePostWidget = async (el, { post_id }) => {
    const post = await this.bloggrsApi.getSinglePost(post_id);
    const div = `
      <div style="grid-template-rows: repeat(2, minmax(0, 0.8fr)" class="h-full grid grid-rows-2 grid-flow-col col-span-2">
        <div style="z-index: -1;" class="h-80 col-span-3 bg-white shadow-md  rounded-md"></div>
        <div class="col-span-3" style="margin-top: 0 auto;">
          <div class="col-span-3 h-full flex">
            <div class="px-3 w-full">
              <h1 class="text-slate-700 font-medium text-4xl">
                ${post.title}
              </h1>
              <div class="flex my-5">
                <p class="text-slate-700 font-normal text-sm">
                  Wednesday, December 22, 2021 &nbsp;&nbsp;&nbsp;
                </p>
                <p class="mx-4 text-slate-700 font-normal text-sm">
                  John Cena
                </p>
              </div>
              <p class="w-full py-2 text-slate-400 font-normal text-xl w-full">
                ${post.html_content}</p>
              <div class="flex  my-6 w-full">
                <p class="w-2/12 text-blue-300 font-medium text-sm flex ">
                  <img src="/dist/static/icons8-heart-80.png"/>
                  <span class="mx-2 text-center my-2">${post.meta.likes_count} likes</span>
                </p>
                <p class="text-blue-400 font-normal text-sm flex items-center justify-center">
                  <img src="/dist/static/icons8-comments-80.png"/>
                  <span class="mx-2">${post.meta.comments_count} comments</span>
                </p>
              </div>

            </div>
          </div>  
        </div>
        <br/>
      </div>
    `;
    el.innerHTML = div;
    return div;
  };
  createWidget(el, { type, ...options }) {
    const widgets = {
      categories: this.handleCreateCategoriesWidget,
      pages_list: this.handleCreatePagesListWidget,
      header: this.handleCreateHeaderWidget,
      posts_list: this.handleCreatePostsListWidget,
      single_post: this.handleCreateSinglePostWidget,
    };
    return widgets[type](el, options);
  }
}

const Bloggrs = BloggrsClient;
module.exports = Bloggrs;
