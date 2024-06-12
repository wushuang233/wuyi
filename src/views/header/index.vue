<template>
  <div>
    <div class="header">
      <div class="logo">
        <span>十月无易</span>
      </div>
      <div class="tabs">
        <router-link v-for="(tab, index) in tabs" :key="index" :to="tab.path" :class="index === cutIdx ? 'active' : ''"
          @click="tabClick(index)">{{ tab.name }}</router-link>
      </div>
      <div class="search">
        <el-input v-model="searchVal" clearable placeholder="请输入搜索内容">
          <template #append>
            <el-icon class="el-input__icon" >
              <SearchIcon />
            </el-icon>
            <span class="m-l-5" @click="querySearch">搜索</span>
          </template>
        </el-input>
      </div>
      <div class="login flex">
        <template v-if="!isLogin">
          <span @click="goToLogin">登录</span>
        </template>
        <template v-else>
          <el-icon>
            <AvatarIcon />
          </el-icon>
          <el-dropdown>
            <span class="el-dropdown-link m-l-5">
              {{ username }}
              <el-icon class="el-icon--right">
                <ArrowDownIcon />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item, index) in menus" :key="index" divided @click="toPath(item.path)">{{ item.name }}</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
      <div class="publish" v-if="isLogin">
        <el-button type="danger" round @click="goToBlogEdit"><el-icon class="el-icon--right m-r-5">
            <CirclePlusIcon />
          </el-icon>发布博客</el-button>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import {  useRouter } from "vue-router";
  import http from "@/utils/request";
  import {
    CirclePlus as CirclePlusIcon,
    Search as SearchIcon,
    Avatar as AvatarIcon,
    ArrowDown as ArrowDownIcon,
  } from "@element-plus/icons-vue";
  
  export default {
    name: "page-header",
    components: { CirclePlusIcon, SearchIcon, AvatarIcon, ArrowDownIcon },
    setup() {
      // const route = useRoute();
      const router = useRouter();
  
      const tabs = ref([
        { name: "首页", path: "/" },
        { name: "分类", path: "/category" },
        { name: "关于", path: "/about" },
      ]);
      const cutIdx = ref(0);
      const searchVal = ref("");
      const isLogin = ref(false);
      let isAdmin = ref(false);
      const username = ref("");
      const menus = ref([
        { name: "个人中心", path: "/personal" },
        { name: "消息通知", path: "/notice" },
      ]);
  
      const querySearch = () => {
        
        router.push({
          path: '/searchResults',
          query: {
             key: searchVal.value
            }
        });
        localStorage.setItem("搜索关键字", searchVal.value);
        console.log('我要跳转页面啦',searchVal.value);

      };
  
      const tabClick = (index) => {
        cutIdx.value = index;
        sessionStorage.setItem("tabIdx", index);
      };
  
      const toPath = (path) => {
        cutIdx.value = -1;
        sessionStorage.setItem("tabIdx", -1);
        router.push(path);
      };
  
      const logout = async () => {
        try {
          await http.post("/user/logout");
          // 这里退出之后把用户信息清除了
          localStorage.clear()
          router.push("/home");
        } catch (error) {
          console.log(error);
        }
        isLogin.value = false;
      };
  
      const goToLogin = () => {
        router.push('/login');
      };
  
      const goToBlogEdit = () => {
        router.push('/blogEdit');
      };
  
      onMounted(() => {
        cutIdx.value = sessionStorage.getItem("tabIdx") || 0;
        if (localStorage.getItem("username")) {
          isLogin.value = true;
          username.value = localStorage.getItem("username");
        }
        isAdmin.value = Object.is(localStorage.getItem("isAdmin"), "true") ? true : false;
        if (isAdmin.value) {
          tabs.value.splice(
            1,
            0,
            ...[
              { name: "用户管理", path: "/userManage" },
              { name: "博客审核", path: "/blogAudit" },
              { name: "消息管理", path: "/sendNotice" },
            ]
          );
          console.log(isAdmin.value, typeof isAdmin.value);
        }
      });
  
      return {
        tabs,
        cutIdx,
        searchVal,
        isLogin,
        isAdmin,
        username,
        menus,
        querySearch,
        tabClick,
        toPath,
        logout,
        goToLogin,
        goToBlogEdit,
      };
    },
  };
  </script>
  
  
  <style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 0 5px #e3e3e3;
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 60px;
    padding: 0 50px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    font-size: 22px;
    color: #606266;
  }
  
  .tabs a {
    margin-right: 30px;
  }
  
  .tabs a:hover,
  .tabs a.active {
    color: #0091ff;
  }
  
  .search {
    width: 30%;
  }
  
  /deep/.el-autocomplete {
    width: 100%;
  }
  
  /deep/.el-input__wrapper {
    padding-left: 20px;
  }
  
  /deep/.el-input-group__append {
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    background-color: rgb(113, 200, 155);
  }
  
  .login {
    color: gray;
  }
  
  .login span {
    cursor: pointer;
  }
  
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  </style>
  