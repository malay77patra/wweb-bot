const {Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const  axios = require('axios');
const url = process.env.URL;
const MONGO = process.env.MONGO;
const qrcode = require('qrcode-terminal');
const msgStore = require("./chat.json");

mongoose.connect(MONGO).then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000
    }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });
  client.on('qr', (qr) => {
    console.log("qr received", qr);
    qrcode.generate(qr, {small:true});
    //axios.post(url, {"data": `${qr}`}).then((res) => {
      //console.log(res.data);
    //}).catch((err) => {
      //console.log(err);
    //});
  });
  client.on('ready', () => {
    console.log("<<:Client Ready:>>");
  });
  client.on('message', async msg => {
    const body = await msg.body;
    const chat = await msg.getChat();
    const group = await chat.isGroup;
    const type = await msg.type;
    const hasQT = await msg.hasQuotedMsg;
    if(body==="sticker" || body==="Sticker"){
      if(type==="image"){
        const mediaImg = await msg.downloadMedia();
        chat.sendMessage(mediaImg, {sendMediaAsSticker: true});
      }else if(type==="video"){
        const mediaGif = await msg.downloadMedia();
        chat.sendMessage(mediaGif, {sendMediaAsSticker: true});
      }else if(type==="chat" && hasQT){
        const msgQT = await msg.getQuotedMessage();
        const typeQT = await msgQT.type;
        if(typeQT==="image"){
          const mediaImgQT = await msgQT.downloadMedia();
          chat.sendMessage(mediaImgQT, {sendMediaAsSticker: true});
        }else if(typeQT==="video"){
          msg.reply("send the gif with caption ```sticker```");
        }
      }
    }else if(body==="alive" || body==="Alive"){
      msg.reply("yes 🐤");
    }
  });
  console.log("<<:Cliend Initialized:>>");
  client.initialize();
});
