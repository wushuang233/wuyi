<template>
  <div class="wrap">
    <div class="login-form">
      <div class="title">注 册</div>
      
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
          />
        </el-form-item>
        
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11"/>
        </el-form-item>
        <el-form-item class="m-t-30">
          <el-button @click="$router.push('/login')">登录</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  <script>
import http from "@/utils/request";

export default {
  name: "blog-login",
  data() {
    // 自定义表单验证规则
    const checkEmail = (rule, value, callback) => {
      // 邮箱验证正则表达式
      const reg =
        /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      } else if (!reg.test(value)) {
        return callback(new Error("请输入正确的邮箱格式"));
      } else {
        callback();
      }
    };
    const checkPhone = (rule, value, callback) => {
        const reg =
          /^1[3-9][0-9]{9}$/;
        if (!value) {
          return callback(new Error("手机号不能为空"));
        } else if (!reg.test(value)) {
          return callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      };
    return {
      form: {
        username: "",
        password: "",
        email: "",
        phone: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],

      },
    };
  },
  methods: {
    // 注册提交
    submit() {
      this.$refs["formRef"].validate(async (valid) => {
        if (valid) {
          // http 发送请求
          const res = await http({
            method: "post",
            url: "/register",
            data: this.form,
          });
          if (res.code === 200) {
            this.$message.success("注册成功");
            this.$router.push("/login");
          } else {
            this.$message.error("注册失败！" + res.msg);
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
  height: 300px;
  padding: 50px 50px 50px 30px;
  transform: translateY(-50%);
  box-shadow: 0 0 10px skyblue;
  background-color: #8dbfe6;
  border-radius: 10px;
  
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