<template>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left">
        <el-tab-pane
          v-for="item in tabs"
          :key="item.tabId"
          :label="item.label"
          :name="item.tabId"
          :rules="rules"
        >
          <div class="content">
            <div v-if="activeName == '1'">
              <el-row class="demo-avatar demo-basic">
                <el-col :span="12">
                  <div class="demo-basic--circle">
                    <div class="block">
                      <el-avatar :size="100" :src="imageUrl" />
                     
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
                   
                    prop="phone"
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
                    :readonly="!isEditing"
                    prop="email"
                  />
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
                  <el-input
                    v-model="form.birthday"
                    :readonly="!isEditing"
                    prop="birthday"
                  />
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
            <!-- <div v-if="activeName == '2'">
                <el-card v-for="blog in Blogs" :key="blog.id" :body-style="{ padding: '10px' }" shadow="hover">
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
                              <el-icon>
                                <View />
                              </el-icon>{{ blog.views }}
                            </span>
                            <span class="m-r-10">
                              <el-icon>
                                <Pointer />
                              </el-icon>{{ blog.top }}
                            </span>
                            <span class="m-r-10">
                              <el-icon>
                                <Star />
                              </el-icon>{{ blog.likes }}
                            </span>
                          </p>
                          <p>
                            <el-button class="m-r-10" type="primary" size="small" @click="viewBlog(blog.id)">浏览</el-button>
                          </p>
                        </div>
                      </figcaption>
                    </figure>
                  </el-card>
            </div> -->
            
          </div>
        </el-tab-pane>
      </el-tabs>
  
    </div>
  </template>
  
  <script>
  import {
    User,
    Tickets,
    Iphone,
    Message,
  } from "@element-plus/icons-vue";
 
  import { ref, reactive } from "vue";
  import http from "@/utils/request";
  
  export default {
    name: "blog-personal",
    components: {
      User,
      Tickets,
      Iphone,
      Message,
    },
    setup() {
      const form = reactive({
        username: "2022010835",
        nick_name: "wuyi",
        phone: "13386395309",
        email: "3296785939@qq.com",
        introduction: "hihi我是cc",
        birthday: "1999-09-09",
      });
      
      // 头像处理
      const imageUrl = ref("");
      const token = localStorage.getItem("token");
  
      return {
        tabs: [
          { tabId: "1", label: "个人信息" },
          { tabId: "2", label: "他的博客" },
        ],
        activeName: "1",
        form,
        imageUrl,
        token,
      };
    },
    created() {
      this.getHisInfo();
    },
    
    methods: {
      handleClick(obj) {
        console.log(obj, obj.index);
      },
      //获取个人信息
      async getHisInfo() {
        const res = await http({
          method: "get",
          url: "/user/id",
          params: {
            id:31,
          },
        });
        this.form.birthday=res.data.birthday;
        this.form.email=res.data.email;
        this.form.nick_name=res.data.nick_name;
        this.form.phone=res.data.phone;
        this.form.username=res.data.username;
        this.imageUrl=res.data.avatar;
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
  