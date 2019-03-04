//排行榜页面
const app = getApp()
// 设置音乐播放器
app.music_player = wx.createInnerAudioContext()
Page({
  data: {
    music: '',
    rankings:''
  },
  //页面加载
  onLoad: function (options) {
    //页面未加载成功时，显示‘loading’提示信息
    wx.showLoading({
      title: '加载中',
    })
    //请求音乐排行榜详情
    wx.request({
      url: "https://api.apiopen.top/musicRankingsDetails?type="+options.music_id,
      method: 'GET',
      header: { 'content-Type': 'application/json' },
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
    if (app.off_on) {
      //如果播放，先停止正在播放的
      app.music_player.stop();
    }
    //根据歌名请求歌曲详情
    wx.request({
      url: "https://api.apiopen.top/searchMusic?name=" + e.currentTarget.id,
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: res => {
        this.setData({
          //保存请求成功后的数据
          rankings: res.data.result[0]
        })
        //获取页面栈
        var pages = getCurrentPages();
        if (pages.length > 1) { //说明有上一页存在
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          //调用上一页的函数
          prePage.changeData(res.data.result[0])
        }
        //修改app.js里保存的播放器的状态
        app.off_on = true;
        //设置播放器的音源
        app.music_player.src = res.data.result[0].url
        //播放
        app.music_player.play();
      }
    });
  },
})

