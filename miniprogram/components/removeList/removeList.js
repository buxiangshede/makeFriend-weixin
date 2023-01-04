const db = wx.cloud.database()
const app = getApp()
const _ = db.command;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDelete(e) {
      wx.showModal({
        title: '提示消息',
        content: '删除消息',
        confirmText: '删除',
        success: (res) =>{
          if (res.confirm) {
            this.removeMessage()
          }
        }
      })
    },
    handleAddFriend() {
      wx.showModal({
        title: '提示消息',
        content: '申请好友',
        confirmText: '同意',
        success: (res) =>{
          if (res.confirm) {
            db.collection('users').doc(app.userInfo._id).update({
              data: {
                friendList:_.unshift(this.data.messageId)
              }
            }).then(res2=> {
              wx.cloud.callFunction({
                name: 'update',
                data: {
                  collection: 'users',
                  doc: this.data.messageId,
                  data: `{friendList: _.unshift('${app.userInfo._id}')}`
                }
              }).then(res3=> {
                console.log('res3', res3)
              })
            })
            this.removeMessage()
          } else if(res.cancel) {

          }
        }
      })
    },
    removeMessage() {
      db.collection('message').where({
        userId: app.userInfo._id
      }).get().then(res2=> {
        let list = res2.data[0].list;
        list =list.filter(ele=> ele!==this.data.messageId)
        wx.cloud.callFunction({
          name: 'update',
          data: {
            collection: 'message',
            where: {
              userId: app.userInfo._id
            },
            data: {
              list
            }
          }
        }).then(res3=> {
          console.log('res3', res3)
          this.triggerEvent('myEvent', list)
        })
      })
    }
  },
  lifetimes: {
    attached: function() {
      db.collection('users').doc(this.data.messageId).field({
        nickName: true,
        userPhoto: true
      }).get().then(res=> {
        this.setData({
          userMessage: res.data
        })
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
