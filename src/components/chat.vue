<template>
  <div v-if="!login">
    欢迎来到多人聊天室
    <el-input v-model="name" placeholder="请输入你的名字"></el-input>
    <el-button type="primary" :disabled="!name" @click="connect">进入</el-button>
  </div>

  <el-container style="height:450px; width: 80%; margin-left: 10%" v-else>
    <el-header>欢迎来到多人聊天室</el-header>

    <el-tabs v-model="activeName">
    <el-tab-pane label="公共聊天窗口" name="public">
      <el-container>
        <el-aside width="200px">

        </el-aside>

        <el-main>
          <el-scrollbar height="450px">
            <msg v-for="i in msgList" :key="i.time" :msg="i"></msg>
          </el-scrollbar>
          <el-input v-model="input" placeholder="发送消息"></el-input>
          <el-button type="primary" :disabled="!input" @click="send">发送</el-button>
        </el-main>

        <el-footer>
        </el-footer>

      </el-container>
    </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script>
import msg from "@/components/msg";
export default {
  components:{
    msg
  },
  data(){
    return{
      activeName:'public',
      name: '',
      input: '',
      login: false,
      msgList: [],
    }
  },
  methods:{
    connect(){
      let ws = new WebSocket("ws://localhost:10888/ws/connect")
      // 回调函数
      ws.onopen = () => {
        ws.send(this.name)
        console.log("连接成功")
        this.login = true
      }
      ws.onmessage = (evt) => {
        this.update(JSON.parse(evt.data))
      }
      ws.onclose = function () {
        console.log("websocket close")
      }
      ws.onerror = function (evt) {
        console.log("error!", evt)
      }
      this.ws = ws
    },
    update(data){
      console.log(data)
      if (data.type === 'init') {
        this.$store.state.uid = data.data.uid
      }
      this.msgList.push(data)
    },
    send(){
      this.ws.send(this.input)
      this.input = ''
    }
  }
}
</script>

<style scoped>

</style>
