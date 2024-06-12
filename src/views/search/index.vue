<template>
  <div class="wrap">
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="文章" name="first">
        <el-row :gutter="20">
          <el-col :span="20">
            <el-card
              v-for="blog in articleResults"
              :key="blog.id"
              :body-style="{ padding: '0px' }"
              shadow="hover"
            >
              <figure class="flex card">
                <img :src="baseurl + blog.front" class="image" />
                <figcaption style="padding: 24px">
                  <h3>
                    {{ blog.title }}
                    <span class="float-r cursor-p">
                      <el-button size="small">
                        <el-icon>
                          <Download />
                        </el-icon>
                      </el-button>
                    </span>
                  </h3>
                  <p class="m-t-10 font14 gray towline">
                    {{ blog.resume }}
                  </p>
                  <div class="flex space-between m-t-20">
                    <p class="artical-info">
                      <span>{{ blog.author }}</span>
                      <span>|</span>
                      <span class="m-r-10">
                        <el-icon> <View /> </el-icon>{{ blog.views }}
                      </span>
                      <span class="m-r-10">
                        <el-icon> <Pointer /> </el-icon>{{ blog.top }}
                      </span>
                      <span class="m-r-10">
                        <el-icon> <Star /> </el-icon>{{ blog.likes }}
                      </span>
                    </p>
                    <p>
                      <el-button
                        class="m-r-10"
                        type="primary"
                        size="small"
                        @click="viewBlog(blog.id)"
                        >浏览</el-button
                      >

                      <el-button
                        v-if="
                          activeName === '3' ||
                          activeName === '1' ||
                          activeName === '2'
                        "
                        class="m-r-10"
                        type="primary"
                        size="small"
                        @click="editBlog(blog.id)"
                        >编辑</el-button
                      >

                      <el-button
                        v-if="activeName === '3'"
                        class="m-r-10"
                        type="primary"
                        size="small"
                        @click="publishBlog(blog.id)"
                        >发布</el-button
                      >

                      <el-button
                        v-if="
                          activeName === '2' ||
                          activeName === '1' ||
                          activeName === '3'
                        "
                        class="m-r-10"
                        type="danger"
                        size="small"
                        @click="deleteBlog(blog.id)"
                        >删除</el-button
                      >
                    </p>
                  </div>
                </figcaption>
              </figure>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="用户" name="second" class="demo-tabs1">
        <el-table :data="userResults" highlight-current-row style="width: 100%">
          <el-table-column width="520">
            <template v-slot="{ row }">
              <div class="block float-l">
                <el-avatar
                  :size="100"
                  :src="row.circleUrl"
                  class="m-b-15 m-t-10"
                />
                <div class="detail">
                  <p class="font16 m-b-15 m-t-10">{{ row.username }}</p>
                  <p class="font14 m-b-10">
                    {{ row.fansnum }}粉丝
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {{ row.blognum }}博客
                  </p>
                  <p>
                    <el-button class="button" type="primary">关注</el-button>
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  ElTabs,
  ElTabPane,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElAvatar,
  ElButton,
} from "element-plus";
import { ref } from "vue";
import http from "@/utils/request";
import { useRoute } from "vue-router";

export default {
  name: "blog-search",
  components: {
    ElTabs,
    ElTabPane,
    ElRow,
    ElCol,
    ElTable,
    ElTableColumn,
    ElAvatar,
    ElButton,
  },
  setup() {
    const activeName = ref("first");
    const articleResults = ref([]);
    const userResults = ref([]);

    const route = useRoute();
    const keyword = route.query.key;
    console.log(keyword);
    const fetchArticleData = async (keyword) => {
      const response = await http({
        method: "get",
        url: "/search",
        params: {
          status: 0,
          key: keyword,
          page: 1,
          page_size: 10,
        },
      });
      articleResults.value = response.data;
      console.log(articleResults.value);
    };

    const fetchUserData = async (keyword) => {
      const response = await http({
        method: "get",
        url: "/search",
        params: {
          status: 1,
          key: keyword,
          page: 1,
          page_size: 10,
        },
      });
      userResults.value = response.data;
      console.log(articleResults.value);

    };

    const handleClick = (tab) => {
      const keyword = route.query.key;
      console.log(keyword);
      if (tab.paneName === "first") {
        fetchArticleData(keyword);
        console.log(tab.paneName);
      }
      if (tab.paneName === "second") {
        fetchUserData(keyword);
      }
    };

    return {
      activeName,
      handleClick,
      articleResults,
      userResults,
      keyword,
    };
  },
};
</script>

  
<style scoped>
#outSide {
  display: flex;
  flex-wrap: wrap;
}
.demo-tabs > .el-tabs__content {
  padding: 40px;
  color: #607d8b;
  font-size: 32px;
  font-weight: 600;
}

.demo-tabs1 {
  width: 1200px;
}

.el-menu {
  min-height: calc(100vh - 70px);
}

.card {
  padding: 10px 20px;
  border-radius: 10px;
  border: rgb(236, 240, 239) 1px solid;
}

.card:hover {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  transform: translateY(-1px);
  transition: all 0.3s;
}

.card img {
  height: 120px;
  width: 240px;
  min-width: 240px;
}

.artical-info {
  color: gray;
  font-size: 12px;
}

.artical-info span {
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
}
.detail {
  display: inline-block;
  vertical-align: top;
  margin-left: 40px;
}
.flex {
  display: flex;
}
</style>