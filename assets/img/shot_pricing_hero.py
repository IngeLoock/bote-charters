import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--no-sandbox", "--no-proxy-server"])
        for vp, w, h in [("desktop", 1440, 900), ("mobile", 390, 844)]:
            ctx = await browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=2)
            page = await ctx.new_page()
            await page.goto("http://localhost:8910/pricing/index.html", wait_until="load", timeout=12000)
            await page.wait_for_timeout(400)
            await page.screenshot(path=f"/home/claude/bote-site/shots2/pricing-hero-{vp}.png")
            await ctx.close()
        await browser.close()

asyncio.run(main())
print("done")
