<template>
  <el-tabs
    v-model="activeTab"
    :tab-position="tabPosition"
    style="height: 100%"
    class="demo-tabs"
    ref="multipleTableRef1"
    @selection-change="handleSelectionChange"
    @tab-click="handleTabClick"
  >
    <el-tab-pane label="未审核" name="unchecked">
      <div style="width: 100%; height: 100%">
        <div class="m-t-20 m-b-10">
          <el-button type="success">通过</el-button>
          <el-button type="danger">删除</el-button>
        </div>
        <el-table
          ref="multipleTableRef2"
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="padding-left: 20px"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column label="发布时间" width="180">
            <template #default="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            property="id"
            label="文章id"
            width="80"
            align="center"
          />
          <el-table-column property="title" label="标题" width="240">
            <template #default="scope">
              <div @click="viewBlog(scope.row.id)">
                {{ scope.row.title }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            property="name"
            label="用户昵称"
            width="100"
            align="center"
          />
          <el-table-column
            property="category"
            label="分区"
            width="100"
            align="center"
          />
          <el-table-column
            property="status"
            label="操作"
            width="250"
            align="center"
          >
            <template #default="scope">
              <el-button
                type="success"
                size="small"
                @click="check(parseInt(scope.row.id, 10))"
                >通过</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="checkno(parseInt(scope.row.id, 10))"
                >不通过</el-button
              >
              <el-button
                type="primary"
                size="small"
                :plain="true"
                @click="top(scope.row.id)"
                >置顶</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            property="top"
            label="优质"
            width="60"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane label="已通过" name="published">
      <div style="width: 100%; height: 100%">
        <div class="m-t-20 m-b-10">
          <el-button>删除</el-button>
        </div>
        <el-table
          ref="multipleTableRef2"
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="padding-left: 20px height:100%"
          class="m-b-10"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column label="发布时间" width="200" align="center">
            <template #default="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            property="id"
            label="文章id"
            width="80"
            align="center"
          />

          <el-table-column property="title" label="标题" width="240">
            <template #default="scope">
              <div @click="viewBlog(scope.row.id)">
                {{ scope.row.title }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            property="name"
            label="用户昵称"
            width="100"
            align="center"
          />
          <el-table-column
            property="category"
            label="分区"
            width="100"
            align="center"
          />

          <el-table-column
            property="status"
            label="操作"
            width="250"
            align="center"
          >
            <template #default="scope">
              <el-button
                type="danger"
                size="small"
                @click="del(parseInt(scope.row.id, 10))"
                >删除</el-button
              >
              <el-button
                type="primary"
                size="small"
                :plain="true"
                @click="top(scope.row.id)"
                >置顶</el-button
              >
              <el-button
                type="primary"
                size="small"
                :plain="true"
                @click="canceltop(scope.row.id)"
                >取消置顶</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            property="top"
            label="优质"
            width="60"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane label="已删除博客">
      <div style="width: 100%; height: 100%">
        <div class="m-t-20 m-b-10">
          <el-button>通过审核</el-button>
          <el-button>删除</el-button>
        </div>
        <el-table
          ref="multipleTableRef4"
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="padding-left: 20px; height: 100%"
          class="m-b-10"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="发布时间" width="180" align="center">
            <template #default="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            property="title"
            label="标题"
            width="240"
            align="center"
          >
            <template #default="scope">
              <div @click="viewBlog(scope.row.id)">
                {{ scope.row.title }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            property="name"
            label="用户昵称"
            width="100"
            align="center"
          />
          <el-table-column
            property="category"
            label="分区"
            width="100"
            align="center"
          />

          <el-table-column
            property="status"
            label="状态"
            width="220"
            align="center"
          >
            <template #default>
              <el-button type="danger" size="small" @click="open"
                >已删除</el-button
              >
            </template>
          </el-table-column>
          <el-table-column property="reason" label="删除理由" width="120" />
        </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import { ElTable } from 'element-plus'
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";
import http from "@/utils/request";
import { useRouter } from "vue-router";

export default {
  name: "blogAudit",
  setup() {
    const router = useRouter();
    const activeTab = ref("unchecked");
    const tabPosition = ref("left");
    const multipleTableRef1 = ref(null);
    const multipleTableRef2 = ref(null);
    const multipleTableRef3 = ref(null);
    const multipleTableRef4 = ref(null);
    const multipleSelection = ref([]);
    const handleSelectionChange = (val) => {
      multipleSelection.value = val;
    };
    const tableData = ref([
      {
        date: "2023-05-03",
        id: "2",
        name: "wuyi",
        title: "No. 189",
        category: "前端",
        reason: "我不喜欢",
      },
    ]);
    const pageConfig = {
      currentPage: 1,
      pageSize: 3,
      pageSizes: [10, 20, 30, 40],
      total: 0,
      layout: "prev, pager, next, jumper,->, total, sizes",
      background: true,
    };
    // //提交弹窗
    const showPromptDialog = () => {
      return new Promise((resolve, reject) => {
        ElMessageBox.prompt("请输入删除的原因", "删除博客", {
          confirmButtonText: "提交",
          cancelButtonText: "取消",
        })
          .then(({ value }) => {
            showSuccessMessage(`删除的原因是: ${value}`);
            resolve(value);
          })
          .catch(() => {
            reject(new Error("取消删除"));
          });
      });
    };
    const handleCurrentChange = (val) => {
      pageConfig.currentPage = val;
    };
    const handleSizeChange = (val) => {
      pageConfig.pageSize = val;
    };

    const showSuccessMessage = (message) => {
      ElMessage.success(message);
    };
    // const showWarningMessage = (message) => {
    //   ElMessage.warning(message);
    // };
    const showInfoMessage = (message) => {
      ElMessage.info(message);
    };

    //获取待审核博客
    const getUncheckBlog = async () => {
      const response = await http({
        method: "get",
        url: "/op/blog",
        params: {
          status: 1,
          page: 1,
          page_size: 10,
        },
      });
      const processedNotices = response.data.map((item) => {
        return {
          id: item.id,
          title: item.title,
          name: item.author,
          date: item.time,
          category: item.category,
        };
      });
      tableData.value = processedNotices;
      console.log("111111s");
    };
    //获取已发布博客
    const getPublishedBlog = async () => {
      const response = await http({
        method: "get",
        url: "/op/blog",
        params: {
          status: 2,
          page: 1,
          page_size: 10,
        },
      });
      const processedNotices = response.data.map((item) => {
        return {
          id: item.id,
          title: item.title,
          name: item.author,
          date: item.time,
          category: item.category,
        };
      });
      tableData.value = processedNotices;
      console.log(response.data);
      console.log(response.data.id);
    };
    const handleTabClick = (tab) => {
      console.log(tab.index);
      if (tab.paneName === "unchecked") {
        getUncheckBlog();
      }
      if (tab.paneName === "published") {
        getPublishedBlog();
      }
    };

    
    //置顶
    const top = async (id) => {
      const response = await http({
        method: "post",
        url: "/op/top",
        params: {
          id: id,
        },
      });
      if (response.code === 200) {
        ElMessage({
          message: response.msg,
          type: "success",
        });
      } else {
        ElMessage({
          message: response.msg,
          type: "warning",
        });
      }
    };
    //取消置顶
    const canceltop = async (id) => {
      const response = await http({
        method: "post",
        url: "/op/deltop",
        params: {
          id: id,
        },
      });
      if (response.code === 200) {
        ElMessage({
          message: response.msg,
          type: "success",
        });
      } else {
        ElMessage({
          message: response.msg,
          type: "warning",
        });
      }
    };
    //查看详情
    const viewBlog = (id) => {
      router.push({
        path: "/blogDetail",
        query: {
          id: id,
        },
      });
      console.log(id);
    };
    //通过审核
    const check = async (id) => {
      const response = await http({
        method: "post",
        url: "/op/check",
        data: {
          status: 1,
          id: id,
          content: " ",
        },
      });
      if (response.code === 200) {
        ElMessage({
          message: response.msg,
          type: "success",
        });
      }
      getUncheckBlog();
      return response.data;
    };
    //删除博客
    const del = async (id) => {
      const value = await showPromptDialog();
      getPublishedBlog();
      const response = await http({
        method: "post",
        url: "/op/del",
        data: {
          status: 0,
          id: id,
          content: value,
        },
      }); 
      if(response.code === 200)
      {
        ElMessage({
          message: response.msg,
          type: "warning",
        });
      }
      return response.data;
     
    };

    // 不通过
    const checkno = async (id) => {
      const value = await showPromptDialog();
      getPublishedBlog();
      const response = await http({
        method: "post",
        url: "/op/check",
        data: {
          status: 0,
          id: id,
          content: value,
        },
      });
      if(response.code === 200)
      {
        ElMessage({
          message: response.msg,
          type: "warning",
        });
      }
      return response.data;
    };

    onMounted(() => {
      getUncheckBlog(); // 组件挂载后立即获取未审核博客
    });
    return {
      top,
      multipleTableRef1,
      multipleTableRef2,
      multipleTableRef3,
      multipleTableRef4,
      handleSelectionChange,
      tableData,
      open,
      tabPosition,
      del,
      handleSizeChange,
      handleCurrentChange,
      pageConfig,
      canceltop,
      viewBlog,
      check,
      checkno,
      getUncheckBlog,
      getPublishedBlog,
      handleTabClick,
      activeTab,
      showInfoMessage,
      showPromptDialog
    };
  },
};
</script>
