import { createRouter, createWebHistory } from "vue-router";

// 定义路由
const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/register/index.vue"),
    meta: {
      title: "注册",
    },
  },
  {
    path: "/forgetPassword",
    name: "ForgetPassword",
    component: () => import("@/views/forgetPassword/index.vue"),
    meta: {
      title: "忘记密码",
    },
  },
  {
    path: "/",
    redirect: "/layout",
  },
  {
    path: "/layout",
    name: "Layout",
    component: () => import("@/views/layout/index.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
        }
      },
      {
        path: "/category",
        name: "Category",
        component: () => import("@/views/category/index.vue"),
        meta: {
          title: "分类",
        }
      },
      {
        path: "/searchResults",
        name: "SearchResults",
        component: () => import("@/views/search/index.vue"),
        meta: {
          title: "搜索结果",
        }
      },
      
      {
        path: "/about",
        name: "About",
        component: () => import("@/views/about/index.vue"),
        meta: {
          title: "关于",
        },
      },
     
      {
        path: "/personal",
        name: "Personal",
        component: () => import("@/views/personal/index.vue"),
        meta: {
          title: "个人中心",
        }
      },
      {
        path: "/other",
        name: "Other",
        component: () => import("@/views/personal/other.vue"),
        meta: {
          title: "用户信息",
        }
      },
      // {
      //   path: "/blogManage",
      //   name: "BlogManage",
      //   component: () => import("@/views/blogManage/index.vue"),
      //   meta: {
      //     title: "博客管理",
      //   }
      // },
      {
        path: "/notice",
        name: "Notice",
        component: () => import("@/views/notice/index.vue"),
        meta: {
          title: "消息通知",
        }
      },
      {
        path: "/userManage",
        name: "UserManage",
        component: () => import("@/views/userManage/index.vue"),
        meta: {
          title: "用户管理",
        }
      },
      {
        path: "/blogAudit",
        name: "BlogAudit",
        component: () => import("@/views/blogAudit/index.vue"),
        meta: {
          title: "博客审核",
        }
      },
      {
        path: "/sendNotice",
        name: "SendNotice",
        component: () => import("@/views/sendNotice/index.vue"),
        meta: {
          title: "发送通知",
        }
      },
      {
        path: "/blogDetail",
        name: "BlogDetail",
        component: () => import("@/views/blogDetail/index.vue"),
        meta: {
          title: "文章详情",
        }
      },
      {
        path: "/draftblogDetail",
        name: "DraftBlogDetail",
        component: () => import("@/views/blogDetail/draftblogDetail.vue"),
        meta: {
          title: "草稿文章详情",
        }
      }
    ],
  },
  {
    path: "/blogEdit",
    name: "BlogEdit",
    component: () => import("@/views/blogEdit/index.vue"),
    meta: {
      title: "博客编辑",
    }                                                          
  },
  {
    path: "/draftblogEdit",
    name: "DraftBlogEdit",
    component: () => import("@/views/blogEdit/draftblogEdit.vue"),
    meta: {
      title: "草稿箱博客编辑",
    }
  },
  {
    path: "/publishedblogEdit",
    name: "PublishedBlogEdit",
    component: () => import("@/views/blogEdit/publishedblogEdit.vue"),
    meta: {
      title: "已发布博客编辑",
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404/index.vue"),
    meta: {
      title: "404",
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title;
  next();
});

export { router };

export default router;
