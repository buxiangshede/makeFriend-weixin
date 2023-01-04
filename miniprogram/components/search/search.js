// components/search/search.js
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    historyList: [],
    searchList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus(e) {
      wx.getStorage({
        key: 'searchHistory',
        success: (res)=> {
          this.setData({
            historyList: res.data
          })
        }
      })
      this.setData({
        isFocus: true
      })
    },
    handleCancel() {
      this.setData({
        isFocus: false
      })
    },
    handleConfirm(e) {
      console.log('confirm',e.detail.value)
      const value= e.detail.value
      const tempList = [...this.data.historyList];
      tempList.unshift(value)
      wx.setStorage({
        key: 'searchHistory',
        data:[...new Set(tempList)]
      })
      this.changeSearchList(value)
    },
    handleDeleteHistory() {
      wx.removeStorage({
        key: 'searchHistory',
        success: ()=> {
          this.setData({
            historyList: []
          })
        }
      })
    },
    changeSearchList(value) {
      db.collection('users').where({
        nickName: db.RegExp({
          regexp: value,
          options: 'i'
        })
      }).field({
        userPhoto: true,
        nickName: true
      }).get().then(res=> {
          console.log(res, 'res')
          this.setData({
            searchList: res.data
          })
      })
    },
    handleDeleteHistoryItem(e) {
      console.log(e, 'e')
      const value= e.target.dataset.text
      this.changeSearchList(value)
    }
  }
})
