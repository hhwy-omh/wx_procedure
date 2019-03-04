const app = getApp()
wx.cloud.init();
Page({
  data: {
    //播放器的基础数据
    author: "MC梦, 孝琳",//歌手
    title: "下定决心",//歌名
    img_url: "http://p1.music.126.net/1zHgh9kCAllBxHYOPo4-9w==/3234763209015173.jpg?param=300x300",//img
    music_url: "http://music.163.com/song/media/outer/url?id=29709498.mp3",//音源
    off_on_img:"./../../images/play.png",//开始，暂停
    rankings:'',
    queryResult:'',
    userName:'' 
  },
  //页面加载
  onLoad: function (options) {
    //设置播放器
    app.music_player = wx.createInnerAudioContext()
    //请求音乐排行榜信息
    wx.request({
      url: "https://api.apiopen.top/musicRankings",
      method: 'GET',//请求方式
      //请求得到的格式，json
      header: { 'content-Type': 'application/json' },
      //请求成功，将数据保存在rankings中
      success: res => {
          this.setData({
            rankings: res.data.result
          })
      }
    });
    //请求音乐电台信息
    wx.request({
      url: "https://api.apiopen.top/musicBroadcasting",
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: res => {
        this.setData({
          queryResult: res.data.result[0].channellist
        })
      }
    });
    //监听音乐播放状态，播放完就设置为暂停按钮
    app.music_player.onEnded((res) => {
      app.off_on = false
      this.setData({
        off_on_img: "./../../images/play.png"
      })
    });
  },
  //播放按钮切换
play_sterat:function(e){
  //app.off_on为true
  if (app.off_on){
    //点击后暂停音源
    app.music_player.pause();
    //状态设为false
    app.off_on = false
    //设为开始按钮
    this.setData({
      off_on_img: "./../../images/play.png"
    })
  //app.off_on为true，
  }else{
    app.music_player.src = e.target.id
    //点击后播放音源，
    app.music_player.play();
    //状态设为true
    app.off_on = true
    //设为暂停按钮
    this.setData({
      off_on_img: "./../../images/pause.png"
    })
  }
},
  //跳转至音乐排行榜详情頁
gotoProjectDetail: function (e) {
    wx.navigateTo({
      url: '/pages/ticket/ticket?music_id=' + e.currentTarget.id,
    })
  },
  //跳转至音乐电台详情頁
getProjectDetail: function (e) {
    wx.navigateTo({
      url: '/pages/utils/utils?music_id=' + e.currentTarget.id,
    })
  },
  //搜索框输入就修改userName的值
userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //跳转到搜索页面
loginBtnClick: function (e) {
  wx.navigateTo({
    url: '/pages/search/search?name=' + this.data.userName,
  })
},
//修改音乐播放器的信息
changeData: function (name) {
    this.setData({
      author: name.author,
      title: name.title,
      img_url: name.pic,
      music_url: name.url,
      off_on_img: "./../../images/pause.png"
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})