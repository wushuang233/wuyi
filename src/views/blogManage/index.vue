<template>
  <div class="wrap">
    <el-tabs v-model="activeTab" tab-position="top" @tab-click="tabClick">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.tabId"
        :label="tab.tabName"
        :name="tab.tabId"
      ></el-tab-pane>
          </el-tabs>
    <template v-if="blogs&&blogs.length">
      <el-card
        v-for="blog in blogs"
        :key="blog.id"
        :body-style="{ padding: '10px' }"
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
              <p
                class="artical-info"
                v-if="activeTab === '4' || activeTab === '1'"
              >
                <span>{{ blog.author }}</span>
                <span>|</span>
                <span class="m-r-10">
                  <el-icon>
                    <View /> </el-icon
                  >{{ blog.views }}
                </span>
                <span class="m-r-10">
                  <el-icon>
                    <Pointer /> </el-icon
                  >{{ blog.top }}
                </span>
                <span class="m-r-10">
                  <el-icon>
                    <Star /> </el-icon
                  >{{ blog.likes }}
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
                    activeTab === '3' || activeTab === '1' || activeTab === '2'
                  "
                  class="m-r-10"
                  type="primary"
                  size="small"
                  @click="editBlog(blog.id)"
                  >编辑</el-button
                >
  
                <el-button
                  v-if="activeTab === '3'"
                  class="m-r-10"
                  type="primary"
                  size="small"
                  @click="publishBlog(blog.id)"
                  >发布</el-button
                >
  
                <el-button
                  v-if="
                    activeTab === '2' || activeTab === '1' || activeTab === '3'
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
    </template>
    <div v-else class="empty">暂无数据</div>
    <el-pagination
      v-if="blogs&&blogs.length"
      v-model:current-page="pageConfig.currentPage"
      v-model:page-size="pageConfig.pageSize"
      :page-sizes="pageConfig.pageSizes"
      :background="pageConfig.background"
      :layout="pageConfig.layout"
      :total="pageConfig.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {ElMessage,} from "element-plus";
import { Star, View, Pointer, Download } from "@element-plus/icons-vue";
import http from "@/utils/request";

export default {
  name: "blog-manage",
  components: { Star, View, Pointer, Download },
  data() {
    return {
      isPublished: true,
      isDraft: false,
      isPending: false,
      isFavorite: false,
      tabs: [
        { tabId: "1", tabName: "已发布" },
        { tabId: "2", tabName: "审核中" },
        { tabId: "3", tabName: "草稿" },
        { tabId: "4", tabName: "我的收藏" },
      ],
      activeTab: "1",
      blogs: [],
      publishedBlogs: [],
      pendingBlogs: [],
      draftBlogs: [],
      favoriteBlogs: [],
      baseurl: "http://wuyi.life/api/",
      // 分页配置
      pageConfig: {
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5,10, 20, 50],
        total: 0,
        layout: "prev, pager, next, jumper,->, total, sizes",
        background: true,
      },
    };
  },
  created() {
    this.getPublishedBlogs();
    // this.getDraftBlogs();
    // this.getPendingBlogs();
    // this.getFavoriteBlogs();
  },
  methods: {
    // 分页监听
    handleSizeChange(val) {
      console.log(`每页 ${val} 项`);
      this.pageConfig.pageSize = val;
      this.switchTab(this.activeTab)
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}，${this.tabClick}，${this.activeTab}`);
      this.pageConfig.currentPage = val;
      this.switchTab(this.activeTab)
    },

    //  对不同的接口
    tabClick(tab) {
      console.log(tab.paneName)
      // this.activeTab = tab.paneName;;
      this.pageConfig.currentPage = 1;
      this.pageConfig.pageSize = 5;
      this.switchTab(tab.paneName)
    },
    switchTab(witch) {
      switch (witch) {
        case "1": // 已发布
          this.getPublishedBlogs();
          break;
        case "2": // 审核中
          this.getPendingBlogs();
          break;
        case "3": // 草稿
          this.getDraftBlogs();
          break;
        case '4': // 我的收藏
          this.getFavoriteBlogs();
        break;
        default:
          break;
      }
    },
    // 已发布
    async getPublishedBlogs() {
      const publishedRes = await http({
        method: "get",
        url: "/blog/put",
        params: {
          page: this.pageConfig.currentPage,
          page_size: this.pageConfig.pageSize,
        },
      });
      if (publishedRes.code !== 200) return false;
      this.blogs = publishedRes.data;
      this.pageConfig.total = publishedRes.page.page_total
    },
    // 审核中
    async getPendingBlogs() {
      const pendingRes = await http({
        method: "get",
        url: "/blog/check",
        params: {
          page: this.pageConfig.currentPage,
          page_size: this.pageConfig.pageSize,
        },
      });
      if (pendingRes.code !== 200) return false;
      this.blogs = pendingRes.data;
      this.pageConfig.total = pendingRes.page.page_total
    },
    // 草稿箱
    async getDraftBlogs() {
      const draftRes = await http({
        method: "get",
        url: "/blog/draft",
        params: {
          page: this.pageConfig.currentPage,
          page_size: this.pageConfig.pageSize,
        },
      });
      if (draftRes.code !== 200) return false;
      this.blogs = draftRes.data;
      this.pageConfig.total = draftRes.page.page_total
    },
    //收藏
    async getFavoriteBlogs() {
      const favoriteRes = await http({
        method: "get",
        url: "/user/col",
        params: {
          page: this.pageConfig.currentPage,
          page_size: this.pageConfig.pageSize,
        },
      });
      if (favoriteRes.code !== 200) return false;
      this.blogs = favoriteRes.data
      this.pageConfig.total = favoriteRes.page.page_total
    },
    // 编辑博客
    editBlog(id) {
      if (this.activeTab === "3") {
        this.$router.push({
          path: "/draftblogEdit",
          query: {
            id: id,
          },
        });
      }
      if (this.activeTab === "1" || this.activeTab === "2") {
        this.$router.push({
          path: "/publishedblogEdit",
          query: {
            id: id,
          },
        });
      }
    },
    // 查看博客
    viewBlog(id) {
      if (this.activeTab === "1" || this.activeTab === "4") {
      this.$router.push({
        path: "/blogDetail",
        query: {
          id: id,
        },
      });
    }
    else{
      this.$router.push({
        path: "/draftblogDetail",
        query: {
          id: id,
        },
      });
    }
      console.log(id);
    },

    // 删除
    deleteBlog(id) {
      console.log(id);
      if (this.activeTab !== "4") {
        (async function () {
          try {
            const res = await http({
              method: "delete",
              url: "/blog",
              data: {
                id: id,
              },
            });
            ElMessage({
          type: "warning",
          message: `已删除`,
        });
            console.log(res);
          } catch (error) {
            console.log(error);
          }
        })();
      }
    },

    publishBlog(id) {
      if (this.activeTab === "3") {
        (async function () {
          try {
            const res = await http({
              method: "post",
              url: "/blog/updraft",
              data: {
                id: id,
              },
            });
            ElMessage({
          type: "warning",
          message:res.msg,
        });
            console.log(id, res);
          } catch (error) {
            console.log(error);
          }
        })();
      }
    },

    handlePageChange(page) {
      this.pageNo = page;
      this.getMyBlogs();
    },
  },
};
</script>

<style scoped>
.wrap {
  padding: 20px;
}

>>> .el-card {
  margin-bottom: 10px;
}

.card {
  padding: 10px 20px;
  border-radius: 14px;
}

.card img {
  height: 120px;
  width: 240px;
  min-width: 240px;
  margin-right: 30px;
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

.figcaption {
  width: 600px;
}
.empty {
  height: 300px;
  color: gray;
  font-size: 20px;
  line-height: 300px;
  text-align: center;
  background-color: #fff;
}
</style>
