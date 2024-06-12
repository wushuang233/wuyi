<template >
  <!-- 文章详情：展示富文本文章、点赞、收藏博客，评论区可以评论及回复、评论区可折叠 -->

  <div class="common-layout">
    <el-container>
      <el-aside width="100px" class="vertical-container">
        <div class="flex-column">
          <div class="icon-container m-t-20">
            <el-badge :value="form.like" type="primary">
              <el-icon :size="20" @click="checkIfLiked">
                <Pointer />
              </el-icon>
            </el-badge>
            <!-- <span class="data">{{ form.like }}</span> -->
          </div>
          <div class="icon-container m-t-20">
            <el-badge :value="form.star" type="primary">
              <el-icon :size="20" @click="checkIfcol">
                <Star />
              </el-icon>
            </el-badge>
            <!-- <span class="data">{{ form.star }}</span> -->
          </div>
          <!-- 评论 -->
          <div class="icon-container m-t-20">
            <el-badge :value="form.comment" type="primary">
              <el-icon :size="20" @click="drawer = true">
                <ChatRound />
              </el-icon>
            </el-badge>
            <!-- <span class="data">{{ form.comment }}</span> -->
          </div>
          <el-drawer
            v-model="drawer"
            title="I am the title"
            :with-header="false"
          >
            <h2>
              评论<span class="m-l-10">{{ form.comment }}</span>
            </h2>
            <div class="comment-section m-t-20">
              <el-input
                type="textarea"
                v-model="newComment"
                placeholder="写下你的评论"
              ></el-input>
              <el-button class="m-t-20" type="primary" @click="postComment"
                >发表评论</el-button
              >
              <el-divider></el-divider>
              <el-row :gutter="20">
                <el-col :span="3">
                  <el-avatar
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                  />
                </el-col>
                <el-col :span="21">
                  <span class="gray">我叫大热闹！</span>
                  <div class="m-t-10">晚上不热闹，啥时候热闹！🙄</div>
                  <div class="gray m-t-10">
                    <time>2023年11月01日</time>
                    <span class="m-l-20">
                      <el-icon :size="14" @click="checkIfLiked">
                        <Pointer /> </el-icon
                      >点赞</span
                    >
                    <span class="m-l-20" @click="isShow = true"
                      ><el-icon :size="14">
                        <ChatRound />
                      </el-icon>
                      <i v-if="!isShow">回复</i>
                      <i
                        v-else
                        style="color: skyblue"
                        @click.stop="isShow = false"
                        >取消回复</i
                      >
                    </span>
                  </div>
                  <div>
                    <el-input
                      class="m-t-10"
                      v-if="isShow"
                      type="textarea"
                      v-model="newComment"
                      placeholder="回复‘我是大热闹’"
                    ></el-input>
                    <el-button type="primary" size="small"  v-if="isShow" class="float-r  m-t-5">回复</el-button>
                  </div>

                  <!-- 二级评论区 -->
                  <el-row :gutter="20" class="m-t-20">
                    <el-col :span="3">
                      <el-avatar
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                      />
                    </el-col>
                    <el-col :span="21">
                      <span class="gray">洗洗睡吧！</span>
                      <div class="m-t-10">别卷了，再卷也还是菜！</div>
                      <div class="gray m-t-10">
                        <time>2023年11月03日</time>
                        <span class="m-l-20">
                          <el-icon :size="14" @click="checkIfLiked">
                            <Pointer /> </el-icon
                          >点赞</span
                        >
                        <span class="m-l-20" @click="isShow2 = true"
                          ><el-icon :size="14">
                            <ChatRound />
                          </el-icon>
                          <i v-if="!isShow2">回复</i>
                          <i
                            v-else
                            style="color: skyblue"
                            @click.stop="isShow2 = false"
                            >取消回复</i
                          >
                        </span>
                      </div>
                      <div>
                        <el-input
                          class="m-t-10"
                          v-if="isShow2"
                          type="textarea"
                          v-model="newComment2"
                          placeholder="回复‘洗洗睡吧！’"
                        ></el-input>
                        <el-button type="primary" size="small" v-if="isShow2" class="float-r m-t-5">回复</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-drawer>
        </div>
      </el-aside>

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
                          <el-avatar :size="60" :src="'http://wuyi.life/api' + author.avatar" />
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
              <div :data="author.blog_name" class="text item">
                {{author.blog_name }}
              </div>
            </el-card>
          </el-aside>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { ChatRound, Star, Pointer } from "@element-plus/icons-vue";
import { reactive, toRefs, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import http from "@/utils/request";
import { ElInput, ElButton, ElDivider, ElMessage } from "element-plus";
export default {
  name: "blog-detail",
  components: {
    ChatRound,
    Star,
    Pointer,
    ElInput,
    ElButton,
    ElDivider,
  },
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
      blog_name:" ",
    });
    const form = reactive({
      like: 55,
      star: 55,
      comment: 555,
    });

    const route = useRoute();
    const id = parseInt(route.query.id, 10);
    //获取点赞数
    const getlike = async () => {
      const like = await http({
        method: "get",
        url: "/like",
        params: {
          blog_id: id,
        },
      });
      form.like = like.data;
      console.log(like);
    };
    //获取收藏数
    const getcol = async () => {
      const col = await http({
        method: "get",
        url: "/collection",
        params: {
          blog_id: id,
        },
      });
      form.col = col.data;
      console.log(col);
    };
    //点赞接口
    const likeToggleActive = async () => {
      const like = await http({
        method: "POST",
        url: "/like",
        data: {
          blog_id: id,
        },
      });
      getlike();
      console.log(like);
    };
    // 点赞取消接口
    const cancelLike = async () => {
      const response = await http({
        method: "POST",
        url: "/like/del",
        data: {
          blog_id: id,
        },
      });
      getlike();
      return response.data;
    };
    // 判断是否点赞接口
    const checkIfLiked = async () => {
      const response = await http({
        method: "GET",
        url: "/like/judge",
        params: {
          blog_id: id,
        },
      });
      if (!response.data) {
        await likeToggleActive(id);
      } else {
        await cancelLike(id);
      }
      return response.data;
    };
    //收藏接口
    const collectionToggleActive = async () => {
      const col = await http({
        method: "POST",
        url: "/col",
        data: {
          blog_id: id,
        },
      });
      getcol();
      console.log(col);
    };
    // 收藏取消接口
    const cancelcol = async () => {
      const response = await http({
        method: "POST",
        url: "/col/del",
        data: {
          blog_id: id,
        },
      });
      getcol();
      return response.data;
    };

    // 判断是否收藏接口
    const checkIfcol = async () => {
      const response = await http({
        method: "GET",
        url: "/col/judge",
        params: {
          blog_id: id,
        },
      });
      if (!response.data) {
        await collectionToggleActive(id);
      } else {
        await cancelcol(id);
      }
      return response.data;
    };

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
      article.views = data.view;
      article.content = data.content;
      form.like = data.like;
      form.star = data.collection;
      // form.comment= data.comment;
      // 更新作者信息
      const data1 = await http({
        method: "get",
        url: "/userblog",
        params: {
          id: data.user_id,
        },
      });
      author.name = data1.author.nick_name;
      author.avatar = data1.author.avatar;
      author.articleCount = data1.author.blog_number;
      author.fansCount = data1.author.fan_number;
      author.id = parseInt(data1.author.id, 10);
      author.blog_name = data1.author.blog_name;
    };
    console.log(author.blog_name)
    console.log('1234')
    const showWarningMessage = (message) => {
      ElMessage.warning(message);
    };
    //关注
    const fan = async () => {
      const fan = await http({
        method: "post",
        url: "/fan",
        data: {
          author_id: author.id,
        },
      });
      fetchData();
      console.log(fan);
      if (fan.code === 404) {
        showWarningMessage(fan.msg);
      }
    };
    //取消关注
    const delfan = async () => {
      const delfan = await http({
        method: "delete",
        url: "/fan",
        data: {
          author_id: author.id,
        },
      });
      fetchData();
      console.log(delfan);
    };
    //检查是否关注
    const isfan = async () => {
      const isfan = await http({
        method: "get",
        url: "/fan",
        data: {
          author_id: author.id,
        },
      });
      console.log(isfan.data);
      if (!isfan.data) {
        fan(author.id);
      } else {
        delfan(author.id);
      }
    };

    //评论区
    const comments = ref([]); // 评论列表
    const newComment = ref(""); // 新评论内容
    const newComment2 = ref(""); // 新新评论内容
    const replyForms = ref({}); // 控制回复表单显示

    // 发表评论
    const postComment = () => {
      // 发表评论逻辑
    };

    // 切换回复表单显示
    const toggleReplyForm = (comment) => {
      replyForms.value[comment.id] = !replyForms.value[comment.id];
    };

    // 发表回复
    const postReply = (comment, replyContent) => {
      // 发表回复逻辑
      console.log(comment, replyContent);
    };

    // 点赞评论
    const likeComment = (commentId) => {
      // 点赞逻辑
      console.log(commentId);
    };

    const isShow = ref(false);
    const isShow2 = ref(false);

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
      comments,
      newComment,
      newComment2,
      replyForms,
      postComment,
      toggleReplyForm,
      postReply,
      likeComment,
      likeToggleActive,
      collectionToggleActive,
      checkIfLiked,
      checkIfcol,
      isfan,
      isShow,
      isShow2,
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