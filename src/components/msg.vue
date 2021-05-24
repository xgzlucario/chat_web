<template>
  <div v-if="msg.type === 'receive'" :style="{marginLeft: msg.data['send_user'].uid === uid ? '70%' : '0%'}">
    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
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
</template>

<script>
export default {
  props:{
    msg: Object
  },
  computed:{
    uid(){
      return this.$store.state.uid
    }
  },
  methods:{
    getTime(timestamp){
      let date = new Date(timestamp*1000)
      return date.getHours() + ":" + date.getMinutes() + ':' + date.getSeconds()
    }
  }
}
</script>

<style scoped>

</style>
