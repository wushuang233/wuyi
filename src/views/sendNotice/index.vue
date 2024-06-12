<template>
  <div>
    <el-input
      v-model="searchKeyword"
      placeholder="搜索公告标题"
      class="m-b-20"
    />
    <el-button type="primary" :icon="Edit" square class="m-b-20" @click="open"
      >新增</el-button
    >
    <el-button type="danger" :icon="Delete" square class="m-b-20"
      >删除</el-button
    >

    <el-table
      ref="multipleTableRef"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :data="notices"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="文章ID" />
      <el-table-column prop="date" label="公告标题" width="460" align="center">
        <template #default="scope">
          <span @click="open2(scope.row.id)">
            {{ scope.row.date }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        property="name"
        label="发布人"
        width="180"
        align="center"
      />
      <el-table-column
        property="time"
        label="发布时间"
        show-overflow-tooltip
        width="200"
        align="center"
      />
      <el-table-column label="操作" align="center" width="270">
        <template #default="scope">
          <el-button size="small" @click="open1(scope.row.id)"> 编辑 </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
   
    <!-- 发布公告弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="发布公告"
      style="text-align: center"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="公告标题">
          <el-input v-model="form.date" />
        </el-form-item>
        <el-form-item label="公告内容">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 300px; overflow-y: hidden"
              v-model="html"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <div class="align">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>


    <!-- 查看公告内容 -->
    <el-dialog v-model="dialogVisible2" width="500px" label="通知详情">
      <div :model="form2">
        <h2 align="center">
          <strong>{{ form2.title }}</strong>
        </h2>
        <p align="center" class="form2content" v-html="form2.content"></p>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ref, reactive, onMounted,computed } from "vue";
import http from "@/utils/request";
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
} from "element-plus";

export default {
  name: "blog-send-notice",
  components: {
    Editor,
    Toolbar,
    ElDialog,
    ElForm,
    ElFormItem,
    ElButton,
    ElInput,
  },
  setup() {
    const editor = ref(null);
    let html = ref("");
    const toolbarConfig = ref({});
    const editorConfig = ref({
      placeholder: "请输入内容...",
    });
    const mode = ref("default");

    const multipleTableRef = ref();
    const multipleSelection = ref([]);
    const searchKeyword = ref("");
    const handleSelectionChange = (val) => {
      multipleSelection.value = val;
    };
    const notices = ref([
      {
        id: "1",
        date: "第一个标题第一个标题第一个标题",
        name: "cc",
        time: "2023-11-03",
      },
      {
        id: "123",
        date: "第二个标题第一个标题第一个标题",
        name: "cc",
        time: "2023-11-03",
      },
    ]);
    const status = ref(0);
    let form = reactive({
      title: "cc",
      desc: "111",
    });
   const form2=reactive({ })
    const dialogVisible = ref(false);
    const dialogVisible2 = ref(false);
//获取通知详情
const detail = async (id) => {
      const response = await http({
        method: "get",
        url: "/user/noticeinfo",
        params: {
          id:id,
        },
      });
      form.date= response.data.title;
      html.value = response.data.content;
      form2.title= response.data.title;
      form2.content= response.data.content;
    };
    const open = () => {
      dialogVisible.value = true;
      form.date = "";
      html.value ="";
    };
    const open1 = async (id) => {
      dialogVisible.value = true;
      await detail(id);
      localStorage.setItem("id", id);
      status.value = 1; // 更新 status 的值为 1
    };

    const open2 = (row) => {
      console.log(row);
      dialogVisible2.value = true;
      form.date = row.date;
      detail(row);
    };

    //发布通知
    const submit = async () => {
      if (status.value === 0) {
        const response = await http({
          method: "post",
          url: "/op/notice",
          data: {
            title: form.date,
            content: html.value,
          },
        });
        console.log(response);
      } else if (status.value === 1) {
        await update(); // 调用更新函数
      }
      fetchData();
      ElMessage({
        type: "success",
        message: status.value === 0 ? `已发布` : `已更新`,
      });
      dialogVisible.value = false;
    };

    const update = async () => {
      dialogVisible.value = false;
      const id = parseInt(localStorage.getItem("id"), 10);
      const response = await http({
        method: "put",
        url: "/op/notice",
        data: {
          title: form.date,
          content: html.value,
          id: id,
        },
      });
      console.log(response.content);
      console.log(111);
      
      fetchData();
      console.log(response);
      dialogVisible.value = false;
    };
    // 删除通知 
    const handleDelete = async (id) => {
      const response = await http({
        method: "delete",
        url: "/op/notice",
        data: {
          id: id,
        },
      });
      if (response.code === 200) {
        ElMessage({
          type: "warning",
          message: `已删除`,
        });
      }
      fetchData();
      console.log(response);
    };
    // 更新通知 
   
    const filteredSearch = computed(() => {
      if (searchKeyword.value) {
        return notices.value.filter((item) => {
          return (
            item.date.includes(searchKeyword.value) ||
            item.name.includes(searchKeyword.value)
          );
        });
      } else {
        return notices;
      }
    });
    const filteredNotices = filteredSearch;

    
    const cancel = () => {
      ElMessage({
        type: "error",
        message: `已取消`,
      });
      dialogVisible.value = false;
    };
    const cancel2 = () => {
      ElMessage({
        type: "error",
        message: `已关闭`,
      });
      dialogVisible2.value = false;
    };

    //获取通知
    const fetchData = async () => {
      const response = await http({
        method: "get",
        url: "/op/notice",
        params: {
          page: 1,
          page_size: 20,
        },
      });
      const processedNotices = response.data.map((item) => {
        return {
          id: item.id,
          date: item.title,
          name: item.name,
          time: item.time,
        };
      });
      notices.value = processedNotices;
      console.log(notices.value, 111);
    };

    onMounted(() => {
      fetchData(); 

    });

    return {
      editor,
      html,
      toolbarConfig,
      editorConfig,
      mode,
      multipleTableRef,
      multipleSelection,
      searchKeyword,
      notices,
      handleSelectionChange,
      form,
      form2,
      open,
      open1,
      open2,
      submit,
      handleDelete,
      cancel,
      cancel2,
      dialogVisible,
      dialogVisible2,
      noticeDialogVisible: false,
      noticeContent: "",
      detail,
      filteredSearch,
      filteredNotices
    };
  },

  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    
  },
  
};
</script>
  
<style>
.btn {
  margin-bottom: 20px;
}

.wrap {
  padding: 20px 50px;
}
.form2content{
  margin-top: 40px;
  font-size: 18px;
  line-height: 30px;
  margin-bottom: 50px;
}
.align{
  margin-left: 120px;
}
</style>
  