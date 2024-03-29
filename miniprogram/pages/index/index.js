const app = getApp()
const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    listData: [],
    current: 'links'
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
    this.getDataList()
    this.getBannerList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  handleLinks(e) {
    const id = e.target.dataset.id;
    wx.cloud.callFunction({
      name: 'update',
      data: {
        collection: 'users',
        doc: id,
        data: "{links: _.inc(1)}"
      }
    }).then(res=> {
      console.log(res, 'res')
      const updated = res.result.stats.updated
      if (updated) {
        let tempData=[...this.data.listData]
        for(let i =0;i<tempData.length;i++) {
          if (tempData[i]._id === id) {
            tempData[i].links++; 
          }
        }
        this.setData({
          listData: tempData
        })
      }
    })
  },
  handleCurrent(e) {
    const current = e.target.dataset.current;
    if (current === this.data.current) return
    this.setData({
      current,
    })
    this.getDataList()
  },
  getDataList() {
    db.collection('users').field({
      userPhoto: true,
      nickName: true,
      links: true
    }).orderBy(this.data.current, 'desc')
    .get().then(res=> {
      this.setData({
        listData: res.data
      })
    })
  },
  handleDetail(e) {
    const id = e.target.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `/pages/userInfo/userInfo?userId=${id}`,
    })
  },
  getBannerList() {
    db.collection("banner").get().then(res=> {
      console.log( res.data, 'res')
      this.setData({
        bannerList: res.data
      })
    })
  }
})