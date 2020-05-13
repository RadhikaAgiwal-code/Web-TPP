let { pageUrl } = require('./scrap');
require("chromedriver");
let fs = require("fs");
let swd = require("selenium-webdriver");
let bldr = new swd.Builder();
let driver = bldr.forBrowser("chrome").build();

let cFile = process.argv[2];

(async function () {
    try {
        await driver.manage().setTimeouts({ implicit: 30000, pageLoad: 30000 })
        let data = await fs.promises.readFile(cFile);
        let { url, pwd, user } = JSON.parse(data);
        // Login page
        await driver.get(url);
        let mailBox = await driver.findElement(swd.By.css("#login-email-input"));
        await mailBox.sendKeys(user)
        let pwdbox = await driver.findElement(swd.By.css("#login-password-input"));
        await pwdbox.sendKeys(pwd);

        let singinbox1 = await driver.findElement(swd.By.css("#login-submit-button"));
        await singinbox1.click();

        let main1 = await driver.findElement(swd.By.css(".gnav-PageLink-text"));

        await main1.click();

        let main4 = await driver.findElement(swd.By.css(".icl-TextInput-control.icl-TextInput-control--whatWhere"));
        await main4.sendKeys("software engineer")
        await main4.click()
        let main2 = await driver.findElement(swd.By.css(".icl-WhatWhere-input--where .icl-TextInput-control.icl-TextInput-control--whatWhere"));
        await main2.sendKeys("delhi");
        let main3 = await driver.findElement(swd.By.css(".icl-Button.icl-Button--primary.icl-Button--md.icl-WhatWhere-button"));
        await main3.click()



        let unInputWillBeFoundPromise = await driver.findElement(swd.By.css(".dropdown-button.dd-target"));
        await unInputWillBeFoundPromise.click();
        let unInputWillBeFoundPromise1 = await driver.findElements(swd.By.css("#filter-salary-estimate ul li"));

        await unInputWillBeFoundPromise1[4].click();
        console.log(unInputWillBeFoundPromise1.length)

        let popup = await driver.findElement(swd.By.css("#popover-close-link"));
        await popup.click()


        let companyDropDownClick = await driver.findElement(swd.By.css("#filter-company .dropdown-button.dd-target"));
        await companyDropDownClick.click();
        let companyDropDownOptions = await driver.findElements(swd.By.css("#filter-company ul li"));
        // //   console.log(unInputWillBeFoundPromise)
        await companyDropDownOptions[0].click();

        let jobTypeDropDownClick = await driver.findElement(swd.By.css("#filter-job-type .dropdown-button.dd-target"));
        await jobTypeDropDownClick.click();
        let jobTypeList = await driver.findElements(swd.By.css("#filter-job-type ul li"));
        // //   console.log(unInputWillBeFoundPromise)
        await jobTypeList[0].click();
        // console.log(unInputWillBeFoundPromise1.length)


        let locationDropDown = await driver.findElement(swd.By.css("#filter-location .dropdown-button.dd-target"));
        await locationDropDown.click();
        let locationList = await driver.findElement(swd.By.css("#filter-location ul li"));
        // //   console.log(unInputWillBeFoundPromise)
        await locationList.click();

        //   ==================company=============================
        let cards = await driver.findElements(swd.By.css(".jobsearch-SerpJobCard.unifiedRow.row.result.clickcard"));
        let cUrl = await driver.getCurrentUrl();
        await driver.get(cUrl);
        await cards[0].click();
        let cards1 = await driver.findElement(swd.By.css(".job-footer-button-row a")).getAttribute("href");
        await driver.get(cards1);

        let inputbox = driver.findElement(swd.By.css("#signInLink"));
        await inputbox.click()
        let namebox = await driver.findElement(swd.By.css(".hideInMobile.loginControl.blockLevelElement.ng-pristine.ng-invalid.ng-invalid-required.ng-valid-pattern"))

        await namebox.sendKeys(user)
        let pwdbox1 = await driver.findElement(swd.By.css(".loginControl.hideInMobile.ng-scope.ng-pristine.ng-invalid.ng-invalid-required"))
        await pwdbox1.sendKeys(pwd+"]");
        let snginbox = await driver.findElement(swd.By.css(".primaryButton.submitButton.hideInMobile.ladda-button"))
        await snginbox.click()
        driver.executeScript('window.scrollTo(0,10000);');
        let applybox = await driver.findElement(swd.By.css(".ladda-button.ng-scope"))
        await applybox.click();
        let savebox = await driver.findElement(swd.By.css(".goLink.ladda-button.ng-scope"))
        await savebox.click();
        await driver.get(cUrl)

        for (let i = 1; i < cards.length; i++) {
            console.log("----------------")
            driver.wait(swd.until.elementLocated(swd.By.css('#popover-close-link')), 2000).then(function(elm) {
                elm.click();
            }).catch(function(ex) {
                console.log('elem not found');
            });
    
            cards = await driver.findElements(swd.By.css(".jobsearch-SerpJobCard.unifiedRow.row.result.clickcard"));
            await cards[i].click();

            let cards1 = await driver.findElement(swd.By.css(".job-footer-button-row a")).getAttribute("href");
            await driver.get(cards1)
            
            driver.executeScript('window.scrollTo(0,10000);');
            let applybox10 = await driver.findElement(swd.By.css(".ladda-button.ng-scope"))
            
            await applybox10.click();
            let savebox10 = await driver.findElement(swd.By.css(".goLink.ladda-button.ng-scope"))
            await savebox10.click();

            await driver.get(cUrl)
        }



    } catch (err) {
        console.log(err)
    }



})()

