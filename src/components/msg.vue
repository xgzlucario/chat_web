<template>
  <span v-for="msg in msgList" :key="msg.data.time">
  <div v-if="msg.type === 'receive'" :style="{marginLeft: isYourSelf(msg.data.send_user.uid) ? '80%' : '0%'}">
    <el-tooltip content="点击头像私聊Ta" placement="top" effect="light">
      <el-avatar
          @click="addPrivateChart(msg.data['send_user'].uid, msg.data['send_user'].name)"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
    </el-tooltip>
    <span style="color: gray; font-size: 10pt">{{ msg.data['send_user'].name }}
      {{ msg.data['send_user'].uid === uid ? '(我)' : ''}}&ensp;{{ getTime(msg.data.time) }}</span>
    <p>{{ msg.data.data }}</p>
  </div>

  <div v-if="msg.type === 'private'" :style="{marginLeft: isYourSelf(msg.data.send_user.uid) ? '80%' : '0%'}">
      <el-avatar
          @click="addPrivateChart(msg.data['send_user'].uid, msg.data['send_user'].name)"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
    <span style="color: gray; font-size: 10pt">{{ msg.data['send_user'].name }}
      {{ msg.data['send_user'].uid === uid ? '(我)' : ''}}&ensp;{{ getTime(msg.data.time) }}</span>
    <p>{{ msg.data.data }}</p>
  </div>

  <div v-else-if="msg.type === 'add'">
    <p align="center" style="color: gray; font-size: 10pt">
      用户 {{ msg.data.name }} 于 {{ getTime(msg.data['create_time']) }} 加入了聊天室
    </p>
  </div>

  <div v-else-if="msg.type === 'logout'">
    <p align="center" style="color: gray; font-size: 10pt">
      用户 {{ msg.data.name }} 退出了聊天室
    </p>
  </div>

  <!--私聊提示-->
  <div v-else-if="msg.type === 'tips'">
    <p align="center" style="color: gray; font-size: 10pt">
      {{ msg.data }}
    </p>
  </div>
    </span>
</template>

<script>
export default {
  props:{
    msgList: Array,
    uid: String
  },
  computed:{
    windows(){
      return this.$store.state.windows
    }
  },
  methods:{
    getTime(timestamp){
      let date = new Date(timestamp*1000)
      return date.getHours() + ":" + date.getMinutes() + ':' + date.getSeconds()
    },
    isYourSelf(uid){
      return this.uid === uid
    },
    // 添加私聊页面
    addPrivateChart(uid, name){
      // 不能添加自己
      if (uid === this.uid) return
      let flag = 0
      this.windows.forEach(i => {
        if (i.name === uid) flag = 1
      })
      if (flag === 0)
        this.windows.push({
          label: name,
          name: uid,
          msgList: [],
        })
    }
  }
}
</script>

<style scoped>

</style>
