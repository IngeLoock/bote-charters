import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--no-sandbox", "--no-proxy-server"])
        ctx = await browser.new_context(viewport={"width": 1440, "height": 1000}, device_scale_factor=2)
        page = await ctx.new_page()
        await page.goto("http://localhost:8910/gallery/index.html", wait_until="load", timeout=12000)
        el = await page.query_selector(".gal")
        box = await el.bounding_box()
        await page.evaluate(f"window.scrollTo(0, {box['y']})")
        await page.wait_for_timeout(400)
        await page.screenshot(path="/home/claude/bote-site/shots2/gallery-grid-top-real.png")
        await browser.close()

asyncio.run(main())
print("done")
