<template>
  <div class="wrap">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-menu :default-active="1">
          <el-menu-item
            v-for="menu in menus"
            :key="menu.id"
            :index="menu.id"
            @click="clickWitch"
          >
            <template #title>
              <el-icon><HelpFilled /></el-icon>
              <span>{{ menu.name }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <el-tabs v-model="activeTab" @tab-click="tabClick">
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.tabId"
            :label="tab.tabName"
            :name="tab.tabId"
          />
        </el-tabs>
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <figure
            class="flex card"
            v-for="content in contents"
            :key="content.id"
            @click="viewBlog(content.id)"
          >
            <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                class="image"/> -->
            <img
              :src="
                'http://wuyi.life/api/' + content.front
              "
              class="image"
            />
            <figcaption style="padding: 14px">
              <h3>{{ content.title }}</h3>
              <p class="m-t-10 font14 gray towline">{{ content.resume }}</p>
              <div class="flex space-between m-t-20">
                <p class="artical-info">
                  <span>{{ content.author }}</span>
                  <span>|</span>
                  <span
                    ><el-icon><View /></el-icon>{{ content.view }}</span
                  >
                  <span
                    ><el-icon><Pointer /></el-icon>{{ content.hot }}</span
                  >
                  <span
                    ><el-icon><Star /></el-icon> {{ content.like }}</span
                  >
                </p>
                <p>
                  <el-tag
                    class="m-r-10"
                    type="info"
                    v-for="tag in tags"
                    :key="tag.tagId"
                    >{{ tag.tagName }}</el-tag
                  >
                </p>
              </div>
            </figcaption>
          </figure>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
  <script>
import { onMounted, ref } from "vue";
import { HelpFilled, Star, View, Pointer } from "@element-plus/icons-vue";
import http from "@/utils/request";
import { useRouter } from "vue-router";

export default {
  name: "blog-category",
  components: { HelpFilled, Star, View, Pointer },
  setup() {
    const menus = ref([]);
    const getMenus = async () => {
      const res = await http.get("/all");
      menus.value = res.data;
    };
    const router = useRouter();
    const tabs = [
      { tabId: "1", tabName: "热门" },
      { tabId: "2", tabName: "最新" },
    ];
    let activeTab = ref("1");
    const tags = [
      { tagId: "1", tagName: "Vue" },
      { tagId: "2", tagName: "前端" },
      { tagId: "3", tagName: "表单" },
    ];
    const categoryId = ref(1);
    const contents = ref([]);
    
    const fetchData = async () => {
      const res1 = await http({
        method: "get",
        url: "/category",
        params: {
          page: 1,
          page_size: 10,
          category_id: categoryId.value,
        },
      });
      console.log("time：", res1);
      contents.value = res1.data;
    
      
    };

    const fetchData2 = async () => {
      const res2 = await http({
        method: "get",
        url: "/hot",
        params: {
          page: 1,
          page_size: 10,
          category_id: categoryId.value,
        },
      });
      console.log("hot：", res2);
      contents.value = res2.data;

    };

    const clickWitch = (item) => {
      console.log(item.index, activeTab.value);
      categoryId.value = item.index;

      if (activeTab.value == 1) {
        fetchData2();
      } else if (activeTab.value == 2) {
        fetchData();
      }
    };
    const tabClick = (tab) => {
      console.log(tab.paneName, 111111);

      if (tab.paneName == 1) {
        fetchData2();
      } else if (tab.paneName == 2) {
        fetchData();
      }
    };
    const viewBlog =(id) => {
      router.push({
        path: "/blogDetail",
        query: {
          id: id,
        },
      });
      console.log(id);
    };
    onMounted(() => {
      getMenus();
      fetchData2()
    });
    return {
      menus,
      tabs,
      activeTab,
      tags,
      clickWitch,
      tabClick,
      contents,
      viewBlog,
    };
  },
};
</script>
  <style scoped>
.el-menu {
  min-height: calc(100vh - 70px);
}

.card {
  padding: 10px 20px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 0 2px #ccc;
}
.card:hover {
  box-shadow: 0 0 5px #ccc;
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
</style>