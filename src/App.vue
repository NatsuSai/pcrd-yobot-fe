<template>
  <div id="app">
    <Header />
    <section class="container">
      <aside class="side-menu">
        <SideMenu :defaultActive="activeMenu" @change="handleChangeActiveTab" />
      </aside>
      <article class="content">
        <Statistics
          v-if="activeMenu === 'total'"
          :originData="originData"
          :originUserData="originUserData"
        />
        <ByCycle
          v-else-if="activeMenu === 'cycle'"
          :originData="originData"
          :originUserData="originUserData"
        />
        <template v-else>
          <h2>建设中</h2>
        </template>
      </article>
    </section>
  </div>
</template>

<script>
import axios from "axios";

import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import Statistics from "./components/Statistics";
import ByCycle from "./components/ByCycle";

export default {
  name: "App",
  components: {
    Header,
    SideMenu,
    Statistics,
    ByCycle,
  },
  data() {
    return {
      activeMenu: "total",
      originData: [],
      originUserData: [],
    };
  },
  mounted() {
    let apiUrl = window.localStorage.getItem('API_URL');
    if (apiUrl === '' || apiUrl === null) {
      apiUrl = 'http://212.64.38.32:9222/yobot/clan/737974222/statistics/api/?apikey=zcuOlwOhHLBCvh6s';
    }
    axios
      .all([
        axios.get(apiUrl),
      ])
      .then(
        axios.spread((resData) => {
          if (resData.data.code !== 0) {
            this.$alert(resData.data.message, "获取记录失败");
            return;
          }
          this.originData = resData.data.challenges;
          this.originUserData = resData.data.members;
        })
      );
  },
  methods: {
    handleChangeActiveTab(key) {
      this.activeMenu = key;
    },
  },
};
</script>

<style>
.container {
  display: flex;
}
.side-menu {
  width: 200px;
}
.content {
  padding-left: 20px;
  flex: 1;
}
</style>
