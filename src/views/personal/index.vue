<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.tabId"
        :label="item.label"
        :name="item.tabId"
      >
        <div class="content">
          <div v-if="activeName == '1'">
            <el-row class="demo-avatar demo-basic">
              <el-col :span="12">
                <div class="demo-basic--circle">
                  <div class="block">
                    <el-avatar :size="100" :src="'http://wuyi.life/api' + imageUrl" />
                    <span class="avatar-editor" @click="avatarEdit"
                      ><el-icon :size="22">
                        <CameraFilled /> </el-icon
                    ></span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-descriptions
              class="margin-top"
              title="个人信息"
              :column="1"
              size="large"
              border
            >
              <template #extra>
                <el-button
                  type="primary"
                  @click="startEditing"
                  v-if="!isEditing"
                  >编辑</el-button
                >
                <el-button type="primary" @click="save" v-else>保存</el-button>
              </template>
              <!-- 账号 -->
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <user />
                    </el-icon>
                    账号
                  </div>
                </template>
                {{ form.username }}
              </el-descriptions-item>
              <!-- 昵称 -->
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <user />
                    </el-icon>
                    昵称
                  </div>
                </template>
                <el-input v-model="form.nick_name" :readonly="!isEditing" />
                
              </el-descriptions-item>
              <!-- 手机号 -->
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <iphone />
                    </el-icon>
                    手机号
                  </div>
                </template>
                <el-input
                  v-model="form.phone"
                  :readonly="!isEditing"
                />
              </el-descriptions-item>
              <!-- 邮箱 -->
             
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <message />
                    </el-icon>
                    邮箱
                  </div>
                </template>
                <el-input
                  v-model="form.email"
                  :readonly="!isEditing" />
              </el-descriptions-item>
              <el-descriptions-item label="生日">
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <iphone />
                    </el-icon>
                    生日
                  </div>
                </template>
                <div class="demo-date-picker">
                    <el-date-picker
                      v-model="form.birthday"
                      :readonly="!isEditing"
                      type="date"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      placeholder="请选择你的生日"
                    />
                </div>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <tickets />
                    </el-icon>
                    个人介绍
                  </div>
                </template>
                <el-input v-model="form.introduction" :readonly="!isEditing" />
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-if="activeName == '2'">
            <BlogMange></BlogMange>
          </div>
          
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 头像上传对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="头像编辑"
      width="30%"
      style="text-align: center"
    >
      <div>
        <el-upload
        class="avatar-uploader"
        action="http://wuyi.life/api/user/upload"
        :headers="{
          Authorization: token,
        }"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>

        <div class="m-t-30">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BlogMange from "@/views/blogManage/index.vue";
import {
  User,
  Tickets,
  Iphone,
  Message,
  CameraFilled,
  // Plus,
} from "@element-plus/icons-vue";
   
import { ElMessage, ElDialog, } from "element-plus";
import { ref, reactive } from "vue";
import http from "@/utils/request";

export default {
  name: "blog-personal",
  components: {
    BlogMange,
    User,
    Tickets,
    Iphone,
    Message,
    ElDialog,

    CameraFilled,
    // Plus,
  },
  setup() {
    // 自定义验证规则
    const rules = {
      email: [
        { required: true, message: "邮箱不能为空", trigger: "blur" },
        { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
      ],
      phone: [
        { required: true, message: "手机号不能为空", trigger: "blur" },
        {
          pattern: /^1[3-9][0-9]{9}$/,
          message: "请输入正确的手机号",
          trigger: "blur",
        },
      ],
    };

    const isEditing = ref(false);
    const form = reactive({
      username: "2022010835",
      nick_name: "wuyi",
      phone: "13386395309",
      email: "3296785939@qq.com",
      introduction: "hihi我是cc",
      birthday: "1999-09-09",
    });
    const startEditing = () => {
      isEditing.value = true;
    };
    // 提交个人信息修改
    const save = async () => {
      isEditing.value = false;
      await editMyInfo();
    };
    const editMyInfo = async () => {
      try {
        const response = await http({
          method: "put",
          url: "/user",
          data: {
            phone: form.phone,
            email: form.email,
            gender: 1,
            introduction: form.introduction,
            nick_name: form.nick_name,
            birthday: form.birthday,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.message);
      }
    };

    // 头像处理
    const imageUrl = ref("");
    const dialogVisible = ref(false);
    const avatarEdit = () => {
      dialogVisible.value = true;
    };
    const handleClose = () => {
      console.log("关闭");
    };
    const handleAvatarSuccess = function (response, uploadFile) {
      imageUrl.value = URL.createObjectURL(uploadFile.raw);
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
    const token = localStorage.getItem("token");

    return {
      tabs: [
        { tabId: "1", label: "个人信息" },
        { tabId: "2", label: "我的博客" },
      ],
      activeName: "1",
      form,
      isEditing,
      startEditing,
      imageUrl,
      save,
      avatarEdit,
      dialogVisible,
      handleClose,
      token,
      rules,
      handleAvatarSuccess,
      beforeAvatarUpload,
    };
  },
  created() {
    this.getMyInfo();
  },

  methods: {
    handleClick(obj) {
      console.log(obj, obj.index);
    },
    //获取个人信息
    async getMyInfo() {
      const res = await http({
        method: "get",
        url:"/user/info",
      });
      this.form.birthday = res.data.birthday;
      this.form.email = res.data.email;
      this.form.nick_name = res.data.nick_name;
      this.form.phone = res.data.phone;
      this.form.username = res.data.username;
      this.imageUrl = res.data.avatar;
      this.form.introduction = res.data.introduction;
    },
  },
};
</script>

<style scoped>
.margin-top {
  width: 700px;
  margin-left: 140px;
}

.demo-basic {
  text-align: center;
  margin-left: 210px;
  margin-top: 40px;
}

.cell-item {
  line-height: 50px;
  font-size: larger;
}

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.block {
  position: relative;
  display: inline-block;
}

.avatar-editor {
  display: none;
  position: absolute;
  bottom: 10px;
  right: 26px;
  z-index: 999;
  color: rgba(255, 255, 255, 0.8);
}

.block:hover .avatar-editor {
  display: inline-block;
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
