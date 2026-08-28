import asyncio
from playwright.async_api import async_playwright

TARGETS = [
    ("home-why-bote", "/index.html", "#why-bote"),
    ("home-cater-wrap", "/index.html", ".cater-wrap"),
    ("gallery-grid", "/gallery/index.html", ".gal"),
    ("hens-bucks-gallery", "/hens-bucks/index.html", None),
    ("menu-gallery", "/menu/index.html", None),
    ("pricing-covers", "/pricing/index.html", ".sec-tight"),
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--no-sandbox", "--no-proxy-server"])
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        page = await ctx.new_page()
        for name, path, sel in TARGETS:
            await page.goto("http://localhost:8910"+path, wait_until="load", timeout=12000)
            await page.wait_for_timeout(400)
            if sel:
                el = await page.query_selector(sel)
                if el:
                    await el.scroll_into_view_if_needed()
                    await page.wait_for_timeout(300)
                    await el.screenshot(path=f"/home/claude/bote-site/shots2/{name}.png")
                else:
                    print("no el for", name)
            else:
                await page.screenshot(path=f"/home/claude/bote-site/shots2/{name}.png", full_page=True)
        await browser.close()

asyncio.run(main())
print("done")
