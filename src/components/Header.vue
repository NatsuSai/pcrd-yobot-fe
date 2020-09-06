<template>
  <div>
<!--    <el-page-header @back="location = '..'" content="统计"></el-page-header>-->
    <el-input id="apiUrl" @change="handleApiUrlChange" value="http://212.64.38.32:9222/yobot/clan/737974222/statistics/api/?apikey=zcuOlwOhHLBCvh6s" />
    <el-button @click="handleEdit">查询</el-button>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleTitleSelect"
    >
      <el-menu-item index="1">面板</el-menu-item>
      <el-menu-item index="2">预约</el-menu-item>
      <el-menu-item index="3">查刀</el-menu-item>
      <el-menu-item index="4">统计</el-menu-item>
      <el-menu-item index="5">我的</el-menu-item>
      <el-menu-item index="6">切噜语</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "4",
      apiUrl: null
    };
  },
  methods: {
    handleEdit() {
      window.localStorage.setItem('API_URL', this.apiUrl);
      window.reload();
    },

    handleApiUrlChange(e) {
      e.preventDefault();
      this.apiUrl = e.target.value;
    },
    handleTitleSelect(key) {
      switch (key) {
        case "1":
          window.location = "../";
          break;
        case "2":
          window.location = "../subscribers/";
          break;
        case "3":
          window.location = "../progress/";
          break;
        case "4":
          window.location = "../statistics/";
          break;
        case "5":
          window.location = `../my/`;
          break;
        case "6":
          window.location = `/Chieru`;
          break;
        default:
          break;
      }
    },
  },
};
</script>
