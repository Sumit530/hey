const pupeteer = require("puppeteer")
const express = require("express")
const app = express()
const cron = require("node-cron")
const mongoose = require("mongoose")
require("dotenv").config()
function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}
const multer = require("multer")


mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((res)=>{
  console.log("connect");
}).catch((err)=>{
  console.log(err);
})
const Tmp = require("./model/url")
app.get("/",(req,res)=>{
    Tmp.find().then((data)=>{
      
      console.log(data)
      res.render("index",{data})
  })
})
app.post("/senddata",multer().array(),async(req,res)=>{
  console.log(req.body)

  try{

    const Data = await Tmp.find({url:req.body.url})
    
    if(Data.length>0){
      return res.json({status:-1,message:"Duplicate Value"})
    }else{
      const storeData = new Tmp({
        url:req?.body?.url ?req?.body?.url : "",
        skill:req?.body?.skill ? req.body.skill.split(",") : [],
      degree:req?.body?.degree ? req?.body?.degree : "",
    })
    await storeData.save()
    return res.json({status:1,message:"Addedd Successfully"})
  }
}catch(err){
  console.log(err)
  return res.json({status:0,message:"Internal Server Error"})
}
})

app.post("/deletedata",multer().array(),async(req,res)=>{
  try{

    const data = await Tmp.find({_id:req.body.id})
    if(data.length>0){
      await Tmp.findOneAndDelete({_id:req.body.id})
      return res.json({status:1,message:"Deleted Successfully"})
    }else{
      return res.json({status:0,message:"Data Not Found"})
    }
  }catch(err){
    console.log(err)
    return res.json({status:0,message:"Internal Server Error"})
  }
})

const login = async() => {

const browser = await pupeteer.launch({headless:false})

const page = await browser.newPage();
const domain = "https://internshala.com/login/employer"
    // navigate to a website and set the viewport
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(domain, {
      timeout: 3000000
    });
    await page.waitForSelector('input[type="email"]')
    await page.type('input[type="email"]','tastemedia22@gmail.com',{delay:100})
    await page.type('input[type="password"]','Akshay1212',{delay:100})
     await page.click('#login_submit')
     
     await page.waitForSelector("#internships_tbody")

     const Data = await Tmp.find()

     for(let e=0;e<Data.length;e++){
       await page.goto(Data[e].url)
       await page.waitForSelector("#skill_filter")
     // await page.type("#skill_filter","content writing",{delay:50})
     await delay(2000)
     for(let i=0;i<Data[e].skill.length;i++){
         console.log(i)
         await (await page.$('#skill_filter')).type(Data[e].skill[i],{delay:200})
         
         await page.waitForSelector("#ui-id-2")
         await delay(3000)
         await (await page.$('#skill_filter')).press('Tab');
         await delay(3000)
        
      }
     //  await (await page.$('#skill_filter')).press('Tab');
     //  await delay(500)
     //  await (await page.$('#degree_filter')).type("science",{delay:200})
     //  await delay(500)
     //  await (await page.$('#degree_filter')).press('Tab');
     //  await delay(500)
     await page.$eval('input[name="assignment_not_sent_app_received_filter"]', check => check.checked = true);
     await delay(500)
     await page.click('#apply_filter')
     await delay(3000)
     
   

     var exists =  await page.$eval("div.individual_application", () => false).catch(() => true)

     while(exists != true){
      const elhndle  = await  page.$$("button.send_message")
      await elhndle[0].evaluate(async(x)=>{
        await x.click()
       })
       await page.waitForSelector("#chat_send_button")
       const elhndle2  = await  page.$$("button#chat_send_button")
       elhndle2[0].evaluate(async(x)=>{
         x.click()
       })
       await  new Promise(function(resolve) { 
         setTimeout(resolve, 3000)
       });
       
       await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
       console.log("after refresh");
       await  new Promise(function(resolve) { 
         setTimeout(resolve, 2000)
       });
        exists = await page.$eval("div.individual_application", () => false).catch(() => true)
        console.log(exists)
     }
    
     await page.click('#new_applications')
     await delay(500)
     for(let i=0;i<Data[e].skill.length;i++){
      await (await page.$('#skill_filter')).type(Data[e].skill[i],{delay:200})
      
      await page.waitForSelector("#ui-id-2")
      await delay(3000)
      await (await page.$('#skill_filter')).press('Tab');
      await delay(3000)
   }
   await page.$eval('input[name="assignment_not_sent_app_received_filter"]', check => check.checked = true);
     await delay(500)
     await page.click('#apply_filter')
     await delay(1000)    
     var existApplication = await page.$eval("div.individual_application", () => false).catch(() => true)
     if(existApplication != true){
      await page.waitForSelector("#select_all")
      await page.$eval('input[id="select_all"]', check => check.click());
      await page.waitForSelector("#group_assignment")
      await delay(1000)
      await page.click("#group_assignment")
      await delay(1000)
      // await page.click('#group_assignment')
      const elhndle3  = await  page.$$("button#submit_assignment_btn")
      elhndle3[0].evaluate(async(x)=>{
        x.click()
       })
     }
   
    await page.click('#shortlisted_applications')
     await delay(3000)
     await page.$eval('input[name="assignment_not_sent_shortlisted_filter"]', check => check.checked = true);
     await delay(500)
     await page.click('#apply_filter')
     await delay(1000)
   
     var existSort = await page.$eval("div.individual_application", () => false).catch(() => true)
     if(existSort != true){
       await page.waitForSelector("#select_all")
       await page.$eval('input[id="select_all"]', check => check.click());
       await page.waitForSelector("#group_assignment")
       await delay(1000)
       await page.click("#group_assignment")
       await delay(1000)
       // await page.click('#group_assignment')
       const elhndle3  = await  page.$$("button#submit_assignment_btn")
       elhndle3[0].evaluate(async(x)=>{
         x.click()
        })
        await delay(1000)
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      }
      await delay(5000)
    
   
         
    }
        
          // await page.click('#select_all')
          // await delay(500)
          // await page.click('#group_assignment')
          // await page.waitForSelector("#submit_assignment_btn")
          // await page.click('#submit_assignment_btn')
        
        
}

login()
// cron.schedule("36 16 * * *",async()=>{
// })




app.set('view engine', 'ejs')
app.listen(2020)