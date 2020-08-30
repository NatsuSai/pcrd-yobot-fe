<template>
  <div>
    <h1 style="text-align:center">伤害统计</h1>
    <span>伤害颜色：</span>
    <a class="digit6">十万</a> | <a class="digit7">百万</a> |
    <a class="digit8">千万</a> |
    <a class="digit9">亿</a>
    <el-table
      :data="statisticsData"
      :default-sort="{ prop: 'damage', order: 'descending' }"
      >>
      <el-table-column prop="qqid" label="QQ号" sortable></el-table-column>
      <el-table-column prop="nickname" label="昵称" sortable></el-table-column>
      <el-table-column prop="damage" label="总伤害" sortable>
        <template v-if="scope.row" slot-scope="scope">
          <a :class="'digit' + scope.row.damage.toString().length">{{
            scope.row.damage
          }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="总分数" sortable>
        <template v-if="scope.row" slot-scope="scope">
          <a :class="'digit' + scope.row.score.toString().length">{{
              scope.row.score
            }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="总出刀数" sortable></el-table-column>
      <el-table-column prop="totalNotRemain" label="总出刀数（不包含剩余刀）" sortable width="220"></el-table-column>
      <el-table-column
        prop="normal"
        label="正常刀数"
        sortable
      ></el-table-column>
      <el-table-column prop="tail" label="尾刀数" sortable></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="伤害详情" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column prop="item.cycle" label="周目"></el-table-column>
        <el-table-column prop="item.boss_num" label="BOSS顺位"></el-table-column>
        <el-table-column prop="score" label="分数" sortable>
          <template v-if="scope.row" slot-scope="scope">
            <a :class="'digit' + scope.row.score.toString().length">{{
                scope.row.score
              }}</a>
          </template>
        </el-table-column>
        <el-table-column label="刀伤害">
          <template v-if="scope.row.item" slot-scope="scope">
            <span v-html="csummary(scope.row.item)"></span>
            <el-popover placement="top" effect="light" trigger="hover">
              {{ cdetail(scope.row.item) }}
              <i class="el-icon-info" slot="reference"></i>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import clonedeep from "lodash.clonedeep";

export default {
  props: ["originData", "originUserData"],
  data() {
    return {
      dialogTableVisible: false,
      activeId: null,
    };
  },
  computed: {
    userData() {
      if (!this.originData || !this.originUserData) return {};
      const data = {};
      this.originUserData.forEach((item) => {
        data[item.qqid] = {
          nickname: item.nickname,
          score: 0,
          damage: 0,
          damageDetail: [],
        };
      });
      clonedeep(this.originData)
        .sort((a, b) => (a.challenge_time > b.challenge_time ? 1 : -1))
        .forEach((item) => {
          const { qqid, damage } = item;
          data[qqid].damage += damage;
          if (item.cycle < 4) {
            switch (item.boss_num) {
              case 1:
              case 2:
                data[qqid].score += Math.ceil(damage);
                break;
              case 3:
              case 4:
                data[qqid].score += Math.ceil(damage*1.1);
                break;
              case 5:
                data[qqid].score += Math.ceil(damage*1.2);
                break;
            }
          } else if (item.cycle < 11) {
            switch (item.boss_num) {
              case 1:
              case 2:
                data[qqid].score += Math.ceil(damage*1.2);
                break;
              case 3:
                data[qqid].score += Math.ceil(damage*1.5);
                break;
              case 4:
                data[qqid].score += Math.ceil(damage*1.7);
                break;
              case 5:
                data[qqid].score += Math.ceil(damage*2.0);
                break;
            }
          } else if (item.cycle < 35){
            switch (item.boss_num) {
              case 1:
              case 2:
                data[qqid].score += Math.ceil(damage*2);
                break;
              case 3:
              case 4:
                data[qqid].score += Math.ceil(damage*2.4);
                break;
              case 5:
                data[qqid].score += Math.ceil(damage*2.6);
                break;
            }
          }
          const score = data[qqid].score;
          data[qqid].damageDetail.push({item, score});
        });
      Object.values(data).forEach((item) => {
        const count = this.count(item.damageDetail);
        item.total = count.total;
        item.normal = count.normal;
        item.remain = count.remain;
        item.tail = count.tail;
        item.totalNotRemain = count.totalNotRemain;
      });
      return data;
    },
    statisticsData() {
      return Object.entries(this.userData).map(([qqid, data]) => ({
        ...data,
        qqid,
      }));
    },
    gridData() {
      if (!this.dialogTableVisible) return [];
      return this.userData[this.activeId].damageDetail;
    },
  },
  methods: {
    count(data) {
      let normalCount = 0;
      let remainCount = 0;
      let tailCount = 0;
      data.forEach((item) => {
        if (item.is_continue) remainCount++;
        else if (item.health_ramain === 0) tailCount++;
        else normalCount++;
      });
      return {
        normal: normalCount,
        ramain: remainCount,
        tail: tailCount,
        total: data.length,
        totalNotRemain: data.length - remainCount,
      };
    },
    csummary: function(cha) {
      if (cha == undefined) {
        return "";
      }
      let flag = "";
      if (cha.is_continue) {
        flag = "（剩余刀）";
      }
      if (cha.health_ramain === 0) {
        flag = "（尾刀）";
      }
      return `${flag} <a class="digit${cha.damage.toString().length}">${
        cha.damage
      }</a>`;
    },
    cdetail: function(cha) {
      if (cha == undefined) {
        return "";
      }
      var nd = new Date();
      nd.setTime(cha.challenge_time * 1000);
      var detailstr = nd.toLocaleString("chinese", { hour12: false }) + "\n";
      detailstr += cha.cycle + "周目" + cha.boss_num + "号boss\n";
      detailstr +=
        (cha.health_ramain + cha.damage).toLocaleString() +
        "→" +
        cha.health_ramain.toLocaleString();
      if (cha.message) {
        detailstr += "\n留言：" + cha.message;
      }
      return detailstr;
    },
    handleClick(row) {
      this.activeId = row.qqid;
      this.dialogTableVisible = true;
    },
  },
};
</script>

<style>
.el-table td,
.el-table th {
  text-align: center;
}
.el-popover {
  white-space: pre-wrap;
}
.digit6 {
  color: blue;
}
.digit7 {
  color: green;
}
.digit8 {
  color: orange;
}
.digit9 {
  color: red;
}
</style>
