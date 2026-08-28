import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--no-sandbox", "--no-proxy-server"])
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        page = await ctx.new_page()
        await page.goto("http://localhost:8910/index.html", wait_until="load", timeout=12000)
        el = await page.query_selector(".cater-wrap")
        await el.scroll_into_view_if_needed()
        await page.wait_for_timeout(300)
        nextbtn = await page.query_selector(".cater-wrap button:last-of-type, .cater-wrap .next, .cater-wrap [aria-label='Next']")
        # find arrow buttons generically
        arrows = await el.query_selector_all("button")
        print("num buttons", len(arrows))
        for i in range(3):
            await el.screenshot(path=f"/home/claude/bote-site/shots2/cater-slide-{i}.png")
            if len(arrows) >= 2:
                await arrows[-1].click()
                await page.wait_for_timeout(500)
        await browser.close()

asyncio.run(main())
print("done")
