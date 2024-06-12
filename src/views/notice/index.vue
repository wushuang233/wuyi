<template>
  <div class="wrap">
    <h3 class="m-b-30">消息通知</h3>
    <el-timeline>
      <el-timeline-item
        v-for="notice in notices"
        :key="notice.id"
        :timestamp="notice.timestamp"
        placement="top"
        style="width: 70%;"
      >
        <el-card @click="openDialog(notice)" style=" height: 100%;">
          <h3>{{ notice.title }}</h3> <br>
          <p v-html="notice.content" class="font16"></p>
          <!-- <p>{{ notice.timestamp }}</p> -->
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-dialog v-model="dialogFormVisible" width="500px" align-center="true">
      <div  :model="selectedNotice">
        <h2 align="center">
          <strong>{{ selectedNotice.title }}</strong>
        </h2>
        <p align="center" class="form2content" v-html="selectedNotice.content"></p>
      </div>
      <!-- <div v-else>
        <p>Loading...</p>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted,reactive } from "vue";
import http from "@/utils/request";

export default {
  name: "blog-notice",
  setup() {
    const dialogFormVisible = ref(false);
    const selectedNotice = reactive({
      title: "",
      content: "",
    });
    const notices = ref([
      {
        id: 1,
        timestamp: "2018-05-09T16:00:00+08:00",
        title: "Notice 1",
        content: "notice 1 content",
      },
      {
        id: 2,
        timestamp: "2018-05-09T16:00:00+08:00",
        title: "Notice 2",
        content: "notice 2 content",
      },
      {
        id: 3,
        timestamp: "2018-05-09T16:00:00+08:00",
        title: "Notice 3",
        content: "notice 3 content",
      },
    ]);

    // 接口
    const fetchData = async () => {
      const response = await http({
        method: "get",
        url: "/user/notice",
        params: {
          page: 1,
          page_size: 120,
        },
      });
      const processedNotices = response.data.map((item) => {
        return {
          id: item.id,
          timestamp: item.time,
          title: item.title,
          content: item.content,
        };
      });
      notices.value = processedNotices;
    };

    onMounted(() => {
      fetchData(); // 页面加载时获取通知数据
    });

    const openDialog = (notice) => {
      selectedNotice.title = notice.title;
      selectedNotice.content = notice.content;
      dialogFormVisible.value = true;
    };

    return {
      dialogFormVisible,
      selectedNotice,
      notices,
      openDialog,
    };
  },
};
</script>
<style scoped>
.btn {
  margin-bottom: 20px;
}

.wrap {
  padding: 20px 50px;
}
.form2content{
  margin-top: 50px;
  margin-bottom: 50px;
  font-size: 18px;
  line-height: 30px;
}
</style>
  