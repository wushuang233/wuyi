<template>
  <div class="wrap">
    <div class="login-form">
      <div class="title">登 录</div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="m-t-50"
      >
        <el-form-item label="账号：" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.push('/register')">注册</el-button>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
      <span class="float-r cursor-p gray" @click="$router.push('/forgetPassword')">忘记密码？</span>
    </div>
  </div>
</template>
<script>
import http from "@/utils/request";
export default {
  name: "blog-login",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 登录请求
    login() {
      // 表单验证规则
      this.$refs["formRef"].validate(async (valid) => {
        if (valid) {
          // 发送 http 请求登录接口：配置请求方法、请求路径、请求参数
          const res = await http({
            method: "post",
            url: "/login",
            data: this.form,
          });
          if (res.code === 200||res.code === 201) {
            this.$message.success("登录成功");
            localStorage.setItem("token", res.token);
            localStorage.setItem("username", this.form.username);
            if(res.code === 201)
            {
              localStorage.setItem("isAdmin",true);
            }
            else {
              localStorage.setItem("isAdmin",false);
            }
            this.$router.push("/");
          }else{
            this.$message.error(res.msg)
          }
        }
      });
    },
  },
  mounted() {},
};
</script>
<style scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/bg.jpg") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  text-align: center;
}
.login-form {
  position: fixed;
  top: 50vh;
  left: 10vw;
  width: 400px;
  height: 240px;
  padding: 50px 50px 50px 30px;
  transform: translateY(-50%);
  box-shadow: 0 0 10px skyblue;
  background-color: #8dbfe6;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__content {
  width: 100%;
}

.el-input {
  width: 100%;
}
</style>