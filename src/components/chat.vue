<template>
  <div v-if="!login" style="width: 40%; margin-left: 30%; margin-top: 20%">
    <p align="center">欢迎来到多人聊天室</p>

    <el-input v-model="name" placeholder="请输入你的名字"></el-input>
    <el-button type="primary" :disabled="!name" @click="connect">进入</el-button>
  </div>

  <el-container style="height:650px; width: 60%; margin-left: 20%" v-else>
    <el-header>
      <p align="center">欢迎来到多人聊天室，当前在线人数：{{ members }}人</p>
    </el-header>

    <el-container>
      <el-main>
        <el-tabs v-model="activeName" editable style="height: 500px" @edit="edit">

          <el-tab-pane :label="i.label" :name="i.name" v-for="i in windows" :key="i">

            <chat-window :sender="uid" :receiver="i.name" :msgList="i.msgList" />

          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import chatWindow from "@/components/chatWindow";
export default {
  components:{
    chatWindow
  },
  data(){
    return{
      uid: '',
      activeName: 'public',
      name: '',
      members: 0,
      login: false,
    }
  },
  computed:{
    windows(){
      return this.$store.state.windows
    }
  },
  mounted() {
    this.windows.remove = function(val) {
      let index = this.indexOf(val)
      if (index > -1) {
        this.splice(index, 1)
      }
    }
  },
  methods:{
    getLength(){
      if (this.login)
      require('axios')({
        url: '/go/length',
        method: 'get'
      }).then(res => {
        this.members = res.data.length
      })
    },
    connect(){
      let ws = new WebSocket("ws://localhost:10888/ws/connect")
      // 回调函数
      ws.onopen = () => {
        ws.send(this.name)
        this.getLength()
        setInterval(() => {
          this.getLength()
        }, 2000)
        console.log("连接成功")
        this.login = true
      }
      ws.onmessage = (evt) => {
        this.update(JSON.parse(evt.data))
      }
      ws.onclose = function () {
        this.login = false
        console.log("websocket close")
      }
      ws.onerror = function (evt) {
        this.login = false
        console.log("error!", evt)
      }
      this.$store.state.ws = ws
      this.ws = ws
    },
    update(data){
      // 是否为初始化
      if (data.type === 'add' && this.uid === '') {
        this.uid = data.data.uid
        this.windows[0].msgList.push(data)
      }
      // 判断是否为公聊
      else if (data.type !== 'private') {
        this.windows[0].msgList.push(data)
      }
      else {
        let flag = 0
        // 不能添加自己的窗口
        if (data.data['send_user'].uid === this.uid) flag = 1
        // 窗口已存在
        this.windows.forEach(i => {
          if (i.name === data.data['send_user'].uid) flag = 1
        })

        if (flag === 0){
          // 添加窗口
          let new_window = {
            label: data.data['send_user'].name,
            name: data.data['send_user'].uid,
            msgList: [],
          }
          this.windows.push(new_window)
        }

        // 添加消息
        this.windows.forEach(i => {
          if (i.name === data.data['send_user'].uid) i.msgList.push(data)
          if (i.name === data.data['receive_user'].uid) i.msgList.push(data)
        })
      }
    },
    // 删除私聊页面
    edit(uid){
      this.windows.forEach(i => {
        if (uid === i.name && uid !== 'public'){
          this.windows.remove(i)
        }
      })
    },
    // 添加私聊页面
    addPrivateChart(uid, name){
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
