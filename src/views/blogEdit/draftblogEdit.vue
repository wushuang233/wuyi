<template>
  <div class="wrap">
    <div class="header m-b-30">
      <el-page-header @back="$router.back">
        <template #content>
          <div class="flex space-around" style="width: 70vw">
            <span style="min-width: 100px">博客编辑</span>
            <el-input
              v-model="form1.title"
              maxlength="100"
              class="m-r-10"
              placeholder="请输入博客标题"
            />
            <el-button
              type="danger"
              round
              plain
              class="mlr-10"
              @click="saveBlog"
              >保存草稿</el-button
            >
            <el-button type="danger" round @click="open">发布</el-button>
          </div>
        </template>
        <el-dialog v-model="dialogVisible" title="提交">
          <el-form :model="form" label-width="120px">
            <el-form-item label="封面上传">
              <el-upload
                class="avatar-uploader"
                action="http://wuyi.life/api/blog/front"
                :headers="{
                  Authorization: token,
                  'Content-Type': 'multipart/form-data',
                }"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="文章类型">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="Vue" name="type" />
                <el-checkbox label="React" name="type" />
                <el-checkbox label="Angular" name="type" />
                <el-checkbox label="HTML" name="type" />
                <el-checkbox label="CSS" name="type" />
                <el-checkbox label="JavaScript" name="type" />
                <el-checkbox label="JQuery" name="type" />
                <el-checkbox label="IOS" name="type" />
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="文章概要">
              <el-input
                v-model="form.desc"
                type="textarea"
                placeholder="请输入文章的主要内容 不超过100字"
                maxlength="200"
                resize="none"
              />
            </el-form-item>
            <el-form-item> </el-form-item>
          </el-form>
          <div class="dialog-footer" align="center">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
          </div>
        </el-dialog>
      </el-page-header>
    </div>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="form1.html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>
  <script>
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ref, reactive, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import http from "@/utils/request";
import { useRoute,useRouter } from "vue-router";
import {
  ElMessage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
} from "element-plus";

export default {
  name: "draftblog-edit",
  components: {
    Editor,
    Toolbar,
    ElDialog,
    ElForm,
    ElFormItem,
    ElButton,
    ElInput,
    Plus,
  },

  setup() {
    const editor = ref(null);
    const form1=reactive({
      title: "",
      html: "",
    })
    let title = ref(""); //博客标题
    let html = ref(""); //博客内容
    //弹窗提交表单内容
    const imageUrl = ref("");
    const form = reactive({
      imageUrl: "", //封面路径
      type: [], //类型
      desc: "", //描述
    });
    const toolbarConfig = ref({});
    const editorConfig = ref({
      placeholder: "请输入内容...",
    });
    const mode = ref("default");
    const dialogVisible = ref(false);
    const open = () => {
      dialogVisible.value = true;
    };
    // 草稿箱
    const saveBlog = async () => {
      if (!title.value) {
        ElMessage({
          type: "error",
          message: `标题不能为空！`,
        });
      } else {
        dialogVisible.value = true;
        ElMessage({
        type: "success",
        message: `已保存至草稿箱`,
      });
      }
      
      await saveBlog1();
      console.log("博客提交成功");
    };
    const saveBlog1 = async () => {
      const saveBlog1response = await http({
        method: "post",
        url: "/blog",
        data: {
          title: title.value,
          content: html.value,
          front: imageUrl,
          category_id: 1,
          resume: form.desc,
        },
      });
      return saveBlog1response.data;
    };
    const router = useRouter();

    //发布
    const submit = async () => {
      ElMessage({
        type: "success",
        message: `已提交`,
      });
      dialogVisible.value = false;
      await postBlog();
      console.log("博客提交成功");
      router.push("/personal");
    };

    const postBlog = async () => {
      const response = await http({
        method: "post",
        url: "/blog/up",
        data: {
          title: title.value,
          content: html.value,
          front: form.imageUrl,
          category_id: 1,
          resume: form.desc,
        },
      });
      router.push("/personal");
      return response.data;
    };
    const token = localStorage.getItem("token");

    const route = useRoute();
    onMounted(async () => {
      const id = route.query.id;
      if (id) {
        console.log(id);
        const draftRes = await http({
          method: "get",
          url: "/blog",
          params: {
            id: id,
          },
        });
        // 处理 draftRes 数据 把草稿箱的数据渲染到页面上
        console.log(draftRes);
        form1.title = draftRes.data.title;
          console.log(draftRes.data.title);
          form1.html = draftRes.data.content;
          console.log(draftRes.data.content);
      }
    });

    const cancel = () => {
      ElMessage({
        type: "error",
        message: `已取消`,
      });
      dialogVisible.value = false;
    };

    //上传图片
    const handleAvatarSuccess = function (response, uploadFile) {
      imageUrl.value = URL.createObjectURL(uploadFile.raw);
      form.imageUrl = response.url;
    };
    const beforeAvatarUpload = function (rawFile) {
  // 检查文件类型是否为 jpg, png, 或 jpeg
  const acceptedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!acceptedTypes.includes(rawFile.type)) {
    ElMessage.error("Avatar picture must be JPG, PNG, or JPEG format!");
    return false;
  }
  // 检查文件大小是否超过10MB
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  if (rawFile.size > MAX_SIZE) {
    ElMessage.error("Avatar picture size cannot exceed 10MB!");
    return false;
  }
  return true;
};

    return {
      title,
      editor,
      html,
      toolbarConfig,
      editorConfig,
      mode,
      form,
      form1,
      dialogVisible,
      imageUrl,
      open,
      saveBlog,
      postBlog,
      cancel,
      handleAvatarSuccess,
      beforeAvatarUpload,
      submit,
      token,
    };
  },

  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
  },
};
</script>
  
  <style scoped>
.wrap {
  padding: 20px 50px;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

>>> .el-upload {
  margin-bottom: 20px;
  outline: dotted 1px #e7e7e7;
}
</style>
  