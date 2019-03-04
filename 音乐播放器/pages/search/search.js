//搜索页面
const app = getApp()
// 设置音乐播放器
app.music_player = wx.createInnerAudioContext()
Page({
  data: {
    music: ''
  },
  //页面加载
  onLoad: function (options) {
    //页面未加载成功时，显示‘loading’提示信息
    wx.showLoading({
      title: '加载中',
    })
    //根据歌名，请求歌曲
    wx.request({
      url: "https://api.apiopen.top/searchMusic?name="+options.name,
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      //请求成功后，将信息写入music
      success: res => {
        this.setData({
          music: res.data.result
        })
        //页面信息加载成功后，隐藏'loading'提示信息
        wx.hideLoading()
      }
    });
  },
  //点击后播放歌曲
  getProjectDetail: function (e) {
    //判断歌曲的状态，true为播放中,false为未播放
    if(app.off_on){
      //如果播放，先停止正在播放的
      app.music_player.stop();
    }
    //保存页面传过来用“+”拼接的值
    var name = e.currentTarget.id;
    //根据“+”，将字符串拆分成数组
    var arrs = name.split("+");
    //将歌曲信息保存为对象形式
    var music = {
      author: arrs[2],
      title: arrs[1],
      pic: arrs[3],
      url: arrs[0],
    }
    //获取页面栈
    var pages = getCurrentPages();
    if (pages.length > 1) { //说明有上一页存在
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //调用上一页的函数
      prePage.changeData(music);
    }
    //修改app.js里保存的播放器的状态
    app.off_on=true;
    //设置播放器的音源
    app.music_player.src = arrs[0];
    //播放
    app.music_player.play();
  },
})

