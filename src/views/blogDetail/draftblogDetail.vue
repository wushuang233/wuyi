<template >
    <!-- 文章详情：展示富文本文章、点赞、收藏博客，评论区可以评论及回复、评论区可折叠 -->
  
    <div class="common-layout">
      <el-container>
      
        <el-container>
          <el-container>
            <el-main width="600px">
              <h2 class="m-t-20">{{ article.title }}</h2>
              <div class="articalDetail m-t-10 m-b-10">
                <span>作者：{{ article.author }}</span>
                <span>发布时间：{{ article.publishTime }}</span>
                <span>浏览量：{{ article.views }}</span>
              </div>
  
              <div v-if="article.content" v-html="article.content"></div>
            </el-main>
            <el-aside width="300px" class="m-l-20">
              <el-card class="box-card">
                <template #header>
                  <div class="card-header">
                    <el-row class="demo-avatar demo-basic">
                      <el-col :span="12">
                        <div class="demo-basic--circle">
                          <div class="block">
                            <el-avatar :size="60" :src="author.avatar" />
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <span>{{ author.name }}</span>
                    <el-button class="button" type="primary" @click="isfan"
                      >关注</el-button
                    >
                  </div>
                </template>
                <div class="article-fans">
                  <div class="article-count">
                    <div class="count">{{ author.articleCount }}</div>
                    <div class="label">文章</div>
                  </div>
                  <div class="fans-count">
                    <div class="count">{{ author.fansCount }}</div>
                    <div class="label">粉丝</div>
                  </div>
                </div>
              </el-card>
              <!-- 卡片2 个人文章列表展示 -->
              <el-card class="box-card m-t-20">
                <template #header>
                  <div class="card-header">
                    <strong><span>其他文章</span></strong>
                  </div>
                </template>
                <div v-for="o in 4" :key="o" class="text item">
                  {{ "List item " + o }}
                </div>
              </el-card>
            </el-aside>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </template>
  <script>
  import { reactive, toRefs, ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import http from "@/utils/request";
  export default {
    name: "draftblog-detail",
    
    setup() {
      const state = reactive({
        circleUrl: "../../assets/bg.jpg",
      });
      const { circleUrl } = toRefs(state);
      const drawer = ref(false);
      const article = reactive({
        title: "我要发疯啦",
        author: "cc",
        publishTime: "20231101",
        views: 0,
        content: "hihi",
      });
      const author = reactive({
        name: "hihi",
        avatar: "",
        articleCount: 55,
        fansCount: 55,
      });
      const form = reactive({
        like: 55,
        star: 55,
        comment: 555,
      });
  
      const route = useRoute();
      const id = parseInt(route.query.id, 10);
      // 获取文章数据
      const fetchData = async () => {
        const { data } = await http.get("/blog", {
          params: {
            id: id,
          },
        });
        console.log(data);
        // 更新文章信息
        article.title = data.title;
        article.author = data.author;
        article.publishTime = data.time;
        article.content = data.content;
        // 更新作者信息
        const data1 = await http({
          method: "get",
          url: "/userblog",
          params: {
            id: data.user_id,
          },
        });
        console.log("1");
        console.log(data1);
        author.name = data1.author.username;
        author.avatar = data1.author.avatar;
        author.articleCount = data1.author.blog_number;
        author.fansCount = data1.author.fan_number;
        author.id = parseInt(data1.author.id, 10);
      };
     
      onMounted(() => {
        fetchData(); // 在组件挂载后调用fetchData方法
      });
  
      return {
        circleUrl,
        drawer,
        isActive: false,
        article,
        author,
        form,
      };
    },
    methods: {
      toggleActive() {
        this.isActive = !this.isActive;
      },
    },
  };
  </script>
  <style  scoped>
  .flex-column {
    display: flex;
    flex-direction: column;
    position: absolute;
  }
  
  .icon-container {
    display: flex;
    align-items: center;
  }
  
  .data {
    margin-top: 20px;
  }
  
  .icon-container .el-icon {
    border: 1px solid rgb(254, 253, 253);
    border-radius: 50%;
    padding: 12px;
    background-color: #fff;
    margin-right: 3px;
  }
  
  .icon-container .el-icon:hover {
    background-color: #dcefe8;
  }
  
  .active {
    background-color: red;
  }
  
  .el-main {
    background-color: #fff;
  }
  
  .articalDetail span {
    color: #bcbcbc;
    font-size: 16px;
    margin-right: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .text {
    font-size: 14px;
  }
  
  .item {
    margin-bottom: 18px;
  }
  
  .demo-basic {
    text-align: center;
  }
  
  .demo-basic .sub-title {
    margin-bottom: 10px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
  
  .demo-basic .demo-basic--circle,
  .demo-basic .demo-basic--square {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .demo-basic .block:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
  }
  
  .demo-basic .block {
    flex: 1;
  }
  
  .demo-basic .el-col:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
  }
  
  .article-fans {
    display: flex;
    align-items: center;
    margin-left: 30px;
  }
  
  .article-count,
  .fans-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
    margin-left: 30px;
  }
  
  .count {
    font-size: 24px;
    font-weight: bold;
  }
  
  .label {
    font-size: 14px;
    color: #999;
  }
  
  .text:hover {
    color: #8cebbe;
  }
  </style>