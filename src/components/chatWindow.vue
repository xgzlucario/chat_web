<template>
  <el-scrollbar height="400px">
    <msg :msg-list="msgList" :uid="sender" />
  </el-scrollbar>

  <el-input v-model="input" placeholder="发送消息" />
  <el-button type="primary" :disabled="!input" @click="send">发送</el-button>
</template>

<script>
import msg from "@/components/msg";
export default {
  components:{
    msg
  },
  props:{
    sender: String,
    receiver: String,
    msgList: Array
  },
  data(){
    return{
      input: '',
    }
  },
  methods:{
    send() {
      this.$store.state.ws.send(JSON.stringify({
        "msg": this.input,
        "uid": this.receiver === 'public' ? '' : this.receiver, // 接收者uid 为空表示公共聊天
      }))
      this.input = ''
    }
  }
}
</script>

<style scoped>

</style>
