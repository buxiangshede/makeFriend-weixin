// miniprogram/pages/near/near.js
const db= wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    markers: []
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
    this.getLocation();
    this.getNearUser()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
 
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
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) =>{
        console.log(res, 'res')
        const latitude = res.latitude
        const longitude = res.longitude;
        console.log(latitude, 'latitude',longitude )
        this.setData({
          latitude,
          longitude
        })
      }
     })
     
  },
  getNearUser() {
    db.collection('users').where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000,
      }),
      isLocation: true
    }).field({
      userPhoto: true,
      longitude: true,
      latitude: true
    }).get().then(res=> {
      const list = res.data
      if (list) {
        let result=[]
        for(let i = 0;i<list.length;i++) {
          if(data[i].userPhoto.includes('cloud://')) {
            wx.cloud.getTempFileURL({
              fileList: [data[i].userPhoto],
              success: (res)=> {

                result.push({
                  width:30,
                  height: 30,
                  id: list[i]._id,
                  iconPath: res.fileList[0].tempFileURL,
                  longitude: list[i].longitude,
                  latitude: list[i].latitude
                })
                this.setData({
                  markers: result
                })
              }
            })
          } else {
            result.push({
              width:30,
              height: 30,
              id: list[i]._id,
              iconPath: list[i].userPhoto,
              longitude: list[i].longitude,
              latitude: list[i].latitude
            })
          }
        }
        this.setData({
          markers: result
        })
      }
    })
  },
  markerTap(e) {
    wx.navigateTo({
      url: 'pages/userInfo/userInfo?userId='+ e.markerId,
    })
  }
})