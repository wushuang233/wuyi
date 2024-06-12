<template>
  <div class="wrap">
    <my-header></my-header>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>
  <script>
import http from "@/utils/request";
import MyHeader from "@/views/header/index.vue";
export default {
  name: "blog-layout",
  components: { MyHeader },
  data() {
    return {};
  },
  created() {
    if(localStorage.getItem("username")){
      this.isAdminUser();
    }
  },
  methods: {
    // 判断用户是否为管理员
    async isAdminUser() {
      const res = await http({
        url: "/user/op",
        method: "get",
      });
      console.log("isAdmin", res);
      if (res.code == 200) {
        localStorage.setItem("isAdmin", false);
      } else if (res.code == 201) {
        localStorage.setItem("isAdmin", true);
      }
    },
  },
};
</script>
  <style scoped>
.main {
  width: 1280px;
  margin: 70px auto 0;
}
</style>