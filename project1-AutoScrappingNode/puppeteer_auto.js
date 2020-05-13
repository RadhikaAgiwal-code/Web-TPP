let puppeteer = require("puppeteer");
let cFile = process.argv[2];
let fs = require("fs");

(async function () {

    try {
        let data = await fs.promises.readFile(cFile);
        let { url, pwd, user } = JSON.parse(data);

        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });

        let tabs = await browser.pages();
        let tab = tabs[0];

        await tab.goto(url);

        // username inputbox
        await tab.type("#login-email-input", user);
        // password inputbox
        await tab.type("#login-password-input", pwd, { delay: 50 });
        //signin
        await Promise.all([tab.click("#login-submit-button"), tab.waitForNavigation({ waitUntil: "networkidle2" })])
        //find jobs
        console.log("---")
        await Promise.all([tab.click(".gnav-PageLink-text"), tab.waitForNavigation({ waitUntil: "networkidle2" })])
        console.log("====")
        //first location
        // await tab.waitForSelector(".icl-TextInput-control.icl-TextInput-control--whatWheret", { visible: true });
        await tab.type(".icl-TextInput-control.icl-TextInput-control--whatWhere", "software engineer", { delay: 100 });
        //first location
        await tab.type(".icl-WhatWhere-input--where .icl-TextInput-control.icl-TextInput-control--whatWhere", "delhi", { delay: 100 });
        //click find jobs
        await Promise.all([tab.click(".icl-Button.icl-Button--primary.icl-Button--md.icl-WhatWhere-button"), tab.waitForNavigation({ waitUntil: "networkidle2" })])

        // salary drop down click
        await tab.click(".dropdown-button.dd-target")
        let sList = await tab.$$("#filter-salary-estimate ul li");
        let sss = sList[4];
        await sss.click();

        //popup
        await tab.waitForSelector("#popover-close-link", { visible: true })
        let popup = await tab.$("#popover-close-link");
        await popup.click();

        //company 
        await Promise.all([tab.click("#filter-company .dropdown-button.dd-target")])
        //select salary amount
        // await tab.waitForSelector("#filter-company", { visible: true })
        let cList = await tab.$$("#filter-company ul li");
        await Promise.all([cList[0].click(), tab.waitForNavigation({ waitUntil: "networkidle2" })])

        //duration
        Promise.all([tab.click("#filter-job-type .dropdown-button.dd-target"), tab.waitForNavigation({ waitUntil: "networkidle2" })])
        //select salary amount
        await tab.waitForSelector("#filter-job-type", { visible: true })
        let dList = await tab.$$("#filter-job-type ul li");
        await Promise.all([dList[0].click(), tab.waitForNavigation({ waitUntil: "networkidle2" })])

        //location
        Promise.all([tab.click("#filter-location .dropdown-button.dd-target"), tab.waitForNavigation({ waitUntil: "networkidle2" })])
        //select salary amount
        await tab.waitForSelector("#filter-location", { visible: true })
        let lList = await tab.$("#filter-location ul li");
        await Promise.all([lList.click(), tab.waitForNavigation({ waitUntil: "networkidle2" })])


        // cards
        let cards = await tab.$$(".jobsearch-SerpJobCard.unifiedRow.row.result.clickcard");
        await Promise.all([cards[0].click(), tab.waitForNavigation({ waitUntil: "networkidle2" })])
        console.log(cards.length);
        await tab.waitForSelector(".job-footer-button-row a", { visible: true })

        let firstJobAnchr = await tab.$(".job-footer-button-row a");
        let href = await tab.evaluate(function (elem) {
            return elem.getAttribute("href");
        }, firstJobAnchr);
        href = "https://www.indeed.co.in/" + href;
        console.log(href)
        await tab.goto(href, { waitUntil: "networkidle2" });

        // //company new page

        await Promise.all([tab.click("#signInLink")])
        await tab.waitForSelector(".hideInMobile.loginControl.blockLevelElement.ng-pristine.ng-invalid.ng-invalid-required.ng-valid-pattern", { visible: true })
        await tab.type(".hideInMobile.loginControl.blockLevelElement.ng-pristine.ng-invalid.ng-invalid-required.ng-valid-pattern", "anjalisrm74@gmail.com", { delay: 100 });
        await tab.type(".loginControl.hideInMobile.ng-scope.ng-pristine.ng-invalid.ng-invalid-required", "automation]", { delay: 100 });
        tab.click(".primaryButton.submitButton.hideInMobile.ladda-button")

        await autoScroll(tab)
        await tab.click(".ladda-button.ng-scope");
        // await Promise.all(
        //     [tab.waitForNavigation({ waitUntil: "networkidle2" }),
        //     tab.click(".goLink.ladda-button.ng-scope"),])
        await tab.waitForSelector(".goLink.ladda-button.ng-scope", { visible: true })

        await tab.click(".goLink.ladda-button.ng-scope")
        await tab.goto("https://www.indeed.co.in/jobs?q=software%20engineer%20%E2%82%A8847%2C500&l=Delhi&rbc=Boston%20Consulting%20Group&rbl=New%20Delhi%2C%20Delhi&jcid=1ac14d2aeaedd5c2&jlid=4849e8fc6531ba2c&jt=fulltime", { waitUntil: "networkidle2" });

        let selector = "#popover-close-link";

        for (let i = 1; i < 3; i++) {
            try {
                await tab.waitForSelector(selector, { timeout: 2000 })
                tab.click(selector);
                console("yes")
            } catch (error) {
                console.log("The element didn't appear.")
            }

            cards = await tab.$$(".jobsearch-SerpJobCard.unifiedRow.row.result.clickcard");
            //    await tab.evaluate(function(el){
            //          el.scrollIntoView();
            //    },cards[i])
            await Promise.all([cards[i].click(), tab.waitForNavigation({ waitUntil: "networkidle2" })])
            await tab.waitForSelector(".job-footer-button-row a", { visible: true })

            let firstJobAnchr = await tab.$(".job-footer-button-row a");
            let href = await tab.evaluate(function (elem) {
                return elem.getAttribute("href");
            }, firstJobAnchr);
            href = "https://www.indeed.co.in/" + href;
            console.log(href)
            let newTab = await browser.newPage();
            await newTab.goto(href, { waitUntil: "networkidle2" });
            await autoScroll(newTab)
            // await tab.waitForSelector(".ladda-button.ng-scope", { visible: true })

            await newTab.click(".ladda-button.ng-scope");
            await newTab.waitForSelector(".goLink.ladda-button.ng-scope", { visible: true })
            await newTab.click(".goLink.ladda-button.ng-scope")
            await newTab.close();
        }


        await autoScroll(tab);
        await Promise.all([tab.click(".pn"), tab.waitForNavigation({ waitUntil: "networkidle2" })])

        cards = await tab.$$(".jobsearch-SerpJobCard.unifiedRow.row.result.clickcard");

        for (let i = 0; i < cards.length; i++) {
            try {
                await tab.waitForSelector(selector, { timeout: 5000 })
                tab.click(selector);
                console("yes")
            } catch (error) {
                console.log("The element didn't appear.")
            }

            cards = await tab.$$(".jobsearch-SerpJobCard.unifiedRow.row.result.clickcard");
            await Promise.all([cards[i].click(), tab.waitForNavigation({ waitUntil: "networkidle2" })])
            await tab.waitForSelector(".job-footer-button-row a", { visible: true })

            let firstJobAnchr = await tab.$(".job-footer-button-row a");
            let href = await tab.evaluate(function (elem) {
                return elem.getAttribute("href");
            }, firstJobAnchr);
            href = "https://www.indeed.co.in/" + href;
            console.log(href)
            let newTab = await browser.newPage();
            await newTab.goto(href, { waitUntil: "networkidle2" });
            await autoScroll(newTab)
            // await tab.waitForSelector(".ladda-button.ng-scope", { visible: true })

            await newTab.click(".ladda-button.ng-scope");
            // await Promise.all(
            //     [tab.waitForNavigation({ waitUntil: "networkidle2" }),
            //     tab.click(".goLink.ladda-button.ng-scope"),])
            await newTab.waitForSelector(".goLink.ladda-button.ng-scope", { visible: true })

            await newTab.click(".goLink.ladda-button.ng-scope")
            await newTab.close();
        }


    } catch (err) {
        console.log(err);
    }



})()



async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 500;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
}