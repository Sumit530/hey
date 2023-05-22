const pupeteer = require("puppeteer")
function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

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
     await page.goto("https://internshala.com/employer/applications/2162954/1/invite")
     await page.waitForSelector("#skill_filter")
     // await page.type("#skill_filter","content writing",{delay:50})
     await delay(2000)
     await (await page.$('#skill_filter')).type("content writing",{delay:200})
     
     await page.waitForSelector("#ui-id-2")
     await delay(2000)
     await (await page.$('#skill_filter')).press('Tab');
     await delay(500)
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
        
        // await page.click('button[application_id="741844798"]')
        
        const len = await  page.$$("div.individual_application")
        console.log(len);
        len.map(async()=>{
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
            setTimeout(resolve, 30000)
          });
          console.log("without refresh");
          await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
          console.log("after refresh");
          await  new Promise(function(resolve) { 
            setTimeout(resolve, 20000)
          });
        })
        
        
          // await page.click('#select_all')
          // await delay(500)
          // await page.click('#group_assignment')
          // await page.waitForSelector("#submit_assignment_btn")
          // await page.click('#submit_assignment_btn')
        
        
}

login()