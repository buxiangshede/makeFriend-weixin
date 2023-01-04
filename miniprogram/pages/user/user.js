// miniprogram/pages/user/user.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loggined: false,
    userPhoto: "/images/tabBar/home.png",
    nickName: '',
    disabled: true,
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getLocation()
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res=> {
      db.collection('users').where({
        _openid: res.result.openid
      }).get().then(response=> {
        if (response.data.length) {
          app.userInfo = {...response.data[0]}
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            loggined: true,
            userId: app.userInfo._id,
          })
          this.getMessage()
        } else {
          this.setData({
            disabled: false
          })
        }
      })
    })
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userPhoto: app.userInfo.userPhoto,
      nickName: app.userInfo.nickName
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindGetUserInfo: function(ev) {
    const {userInfo} = ev.detail;
    if (!this.data.loggined && userInfo) {
      console.log(this.longitude, 'this.longitude');
      db.collection('users').add({
        data: {
          userPhoto:userInfo.avatarUrl,
          nickName:userInfo.nickName,
          signature: '',
          phoneNumber: '',
          weixinNumber: '',
          links: 0,
          time: db.serverDate(),
          friendList: [],
          isLocation: true,
          // latitude: this.latitude,
          // longitude: this.longitude,
          // location: db.Geo.Point( this.longitude, this.latitude)
        }
      }).then(res=> {
        db.collection('users').doc(res._id).get().then(response => {
          app.userInfo = {...response.data}
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            loggined: true
          })
        })
      })
    }
  },
  getMessage() {
    console.log(app.userInfo._id, 'app.userInfo._id')
    const watcher = db.collection('message').where({
      userId: app.userInfo._id
    })
    console.log('watcher', watcher)
    watcher.watch({
      onChange: function(snapshot){
        console.log('snapshot', snapshot)
        if(snapshot.docChanges.length) {
          const list = snapshot.docChanges[0].doc.list;
          if(list.length) {
            wx.showTabBarRedDot({
              index: 2,
            })
            app.userMessage = list;
          } else {
            wx.hideTabBarRedDot({
              index: 2
            })
            app.userMessage = [];
          }
        }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  getLocation() {
    console.log('location')
    wx.getLocation({
      type: 'gcj02',
      success: (res) =>{
        console.log(res, 'res')
        const latitude = res.latitude
        const longitude = res.longitude;
        console.log(latitude, 'latitude',longitude )
        this.latitude = latitude;
        this.longitude = longitude;
      }
     })  
  }
})