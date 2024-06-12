<template>
  <div>
    <el-input
      v-model="searchKeyword"
      placeholder="请输入用户名"
      clearable
    ></el-input>
    <el-tabs
      :tab-position="tabPosition"
      class="demo-tabs"
      ref="multipleTableRef"
      v-model="tabActive"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="管理员" name="one">
        <div class="m-t-20 m-b-10 float-r m-r-40">
          <el-button type="primary">解封</el-button>
          <el-button type="danger">封禁</el-button>
        </div>
        <el-table :data="filteredManager" stripe style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" width="60" />
          <el-table-column prop="id" label="用户ID" align="center" />
          <el-table-column prop="name" label="用户名" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column
            prop="num"
            label="博客数"
            width="80"
            align="center"
          />
          <el-table-column prop="time" label="注册时间" align="center" />
          
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="正常用户" name="two">
        <div class="m-t-20 m-b-10 float-r m-r-40">
          <el-button type="primary">解封</el-button>
          <el-button type="danger">封禁</el-button>
        </div>
        <el-table :data="filteredNormalUsers" stripe style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" width="60" />
          <el-table-column prop="id" label="用户ID" align="center" />
          <el-table-column prop="name" label="用户名" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column
            prop="num"
            label="博客数"
            width="80"
            align="center"
          />
          <el-table-column prop="time" label="注册时间" align="center" />

          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button type="danger" @click="ban(parseInt(row.id, 10))"
                >封禁</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已封禁用户" name="three">
        <div class="m-t-20 m-b-10 float-r m-r-40">
          <el-button type="primary">解封</el-button>
        </div>
        <el-table :data="filteredBlockedUsers" stripe style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" width="60" />
          <el-table-column prop="id" label="用户ID" align="center" />
          <el-table-column prop="name" label="用户名" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column
            prop="num"
            label="博客数"
            width="80"
            align="center"
          />
          <el-table-column prop="time" label="注册时间" align="center" />

          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button type="success" @click="unban(parseInt(row.id, 10))"
                >解封</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import http from "@/utils/request";
import { ref, computed,onMounted } from "vue";
import { ElMessage,  } from "element-plus";
export default {
  name: "blog-usermanage",
  setup() {
    const tabActive = ref("one");
    const tabPosition = ref("left");
    const searchKeyword = ref("");
    const tableData = ref([
      {
        id: "00001",
        name: "孙于程",
        phone: 18899999999,
        email: "333333@qq.com",
        status: 0,
        num: 90,
        time: "2023.10.23",
        ban: false,
      },
      {
        id: "00001",
        name: "孙于程",
        phone: 18899999999,
        email: "333333@qq.com",
        status: 0,
        num: 90,
        ban: true,
        time: "2023.10.23",
      },
      {
        id: "00001",
        name: "vv",
        phone: 18899999,
        email: "333333@qq.com",
        status: 0,
        ban: true,
        num: 90,
        time: "2023.10.23",
      },
      {
        id: "00001",
        name: "vv",
        phone: 18899999,
        email: "333333@qq.com",
        status: 1,
        ban: true,
        num: 90,
        time: "2023.10.23",
      },
      {
        id: "00001",
        name: "vv2",
        phone: 18899999,
        email: "333333@qq.com",
        status: 1,
        ban: true,
        num: 90,
        time: "2023.10.23",
      },
      {
        id: "00001",
        name: "v333v",
        phone: 18899999,
        email: "333333@qq.com",
        status: 1,
        ban: true,
        num: 90,
        time: "2023.10.23",
      },
    ]);
    const pageConfig = {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      total: 0,
      layout: "prev, pager, next, jumper,->, total, sizes",
      background: true,
    };
    const showWarningMessage = (message) => {
      ElMessage.warning(message);
    };
    const showSuccessMessage = (message) => {
      ElMessage.success(message);
    };
    
    // 获取管理员的数据
    const getop = async () => {
      const op = await http({
        method: "get",
        url: "/op/user",
        params: {
          status: 1,
          page: pageConfig.currentPage,
          page_size: pageConfig.pageSize,
        },
      });
      const processedNotices = op?.data?.map((item) => {
        return {
          id: item.id,
          name: item.username,
          phone: item.phone,
          email: item.email,
          status: 1,
          ban: item.ban,
          num: item.blog_number,
          time: item.time,
        };
      });
      tableData.value = processedNotices;
      if (op.code === 200) {
        console.log("管理员的数据");
        pageConfig.total = op.page.page_total;
      }
    };

    
    // 获取用户的数据
    const getuser = async () => {
      const user = await http({
        method: "get",
        url: "/op/user",
        params: {
          status: 0,
          page: pageConfig.currentPage,
          page_size: pageConfig.pageSize,
        },
      });
      console.log(user?.data)
      const processedNotices = user?.data?.map((item) => {
        return {
          id: item.id,
          name: item.username,
          phone: item.phone,
          email: item.email,
          status: 0,
          ban: item.ban,
          num: item.blog_number,
          time: item.time,
        };
      });
      tableData.value = processedNotices;
      console.log("111111s");
      if (user.code === 200) {
        console.log("用户的数据");
        pageConfig.total = user.page.page_total;
      }
    };
    // 获取封禁用户的数据
    const getban = async () => {
      const ban = await http({
        method: "get",
        url: "/op/user",
        params: {
          status: -1,
          page: pageConfig.currentPage,
          page_size: pageConfig.pageSize,
        },
      });
      const processedNotices = ban?.data?.map((item) => {
        return {
          id: item.id,
          name: item.username,
          phone: item.phone,
          email: item.email,
          status: -1,
          ban: item.ban,
          num: item.blog_number,
          time: item.time,
        };
      });
      tableData.value = processedNotices;
      console.log(tableData.value);
      if (ban.code === 200) {
        console.log("封禁的数据");
        pageConfig.total = ban.page.page_total;
      }
    };
    //封禁用户
    const ban = async (id) => {
      const ban = await http({
        method: "post",
        url: "/op/ban",
        data: {
          id: id,
        },
      });
      getuser();
      getban();
      showWarningMessage(ban.msg);
    };
    //解封用户
    const unban = async (id) => {
      const unban = await http({
        method: "post",
        url: "/op/open",
        data: {
          id: id,
        },
      });
      getuser();
      getban();
      showSuccessMessage(unban.msg);
    };

    const handleTabClick = (tab) => {
      console.log(tab.index);
      if (tab.paneName === "one") {
        getop();
      }
      if (tab.paneName === "two") {
        getuser();
      }
      if (tab.paneName === "three") {
        getban();
      }
    };
    const filteredManager = computed(() => {
      return tableData?.value?.filter(
        (item) => item.status === 1 && item.name.includes(searchKeyword.value)
      );
    });
    const filteredNormalUsers = computed(() => {
      return tableData?.value?.filter(
        (item) => item.status === 0 && item.name.includes(searchKeyword.value)
      );
    });

    const filteredBlockedUsers = computed(() => {
      return tableData?.value?.filter(
        (item) => item.status === -1 && item.name.includes(searchKeyword.value)
      );
    });
    const handleSizeChange = (val) => {
      console.log(`每页 ${val} 项`);
      pageConfig.pageSize = val;
    };
    const handleCurrentChange = (val) => {
      console.log(`当前页: ${val}`);
      pageConfig.currentPage = val;
    };
    onMounted(() => {
      getop(); 

    });
    return {
      tabPosition,
      tableData,
      searchKeyword,
      filteredNormalUsers,
      filteredBlockedUsers,
      tabActive,
      filteredManager,
      handleTabClick,
      handleSizeChange,
      handleCurrentChange,
      ban,
      unban,
    };
  },
};
</script>


<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--left .el-tabs__content {
  height: 100%;
}

.el-table-column {
  background-color: #e6e6e6;
}
</style>
