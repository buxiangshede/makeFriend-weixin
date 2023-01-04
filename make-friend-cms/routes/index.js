const router = require("koa-router")();
const config = require("../config");
const request = require("request-promise");
const fs = require("fs");

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "Hello Koa 2!",
  });
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

router.post("/uploadBannerImg", async (ctx, next) => {
  const files = ctx.request.files;
  const file = files.file;
  console.log("file", file);

  try {
    let options = {
      uri: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`,
      json: true,
    };
    let { access_token } = await request(options);
    const fileName = `${Date.now()}.jpg`;
    const filePath = `banner/${fileName}`;
    options = {
      method: "POST",
      uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`,
      body: {
        env: "dev-make-friend-8gmd731t3e67ed54",
        path: filePath,
      },
      json: true,
    };
    let res = await request(options);
    console.log(res, "res");
    const file_id = res.file_id;
    options = {
      // method: "POST",
      // uri: res.url,
      // formData: {
      //   Signature: res.authorization,
      //   key: filePath,
      //   "x-cos-security-token": res.token,
      //   "x-cos-meta-fileid": res.cos_file_id,
      //   file: {
      //     value: fs.createReadStream(file.filepath),
      //     options: {
      //       filename: fileName,
      //       contentType: file.mimetype,
      //     },
      //   },
      // },
      method: "POST",
      uri: `https://api.weixin.qq.com/tcb/databaseadd?access_token=${access_token}`,
      body: {
        env: "dev-make-friend-8gmd731t3e67ed54",
        query: "db.collection(\"banner\").add({data:{fileId:\"" + file_id + "\"}})",
      },
      json: true,
    };
    await request(options);
    ctx.body = res;
  } catch (e) {
    console.log("err", e);
  }
});

module.exports = router;
