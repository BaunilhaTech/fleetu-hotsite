/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Generates favicon + app icons from the canonical SVG mark.
 *
 * Why: our favicon.ico previously had a white background baked in. Browsers often
 * prefer /favicon.ico over other formats, so that showed as a white square on tabs.
 *
 * Outputs:
 * - src/app/favicon.ico (multi-size ICO w/ PNG+alpha)
 * - src/app/icon.png (512x512, transparent)
 * - src/app/apple-icon.png (180x180, transparent)
 */

const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

const ROOT = path.resolve(__dirname, "..")
const INPUT_SVG = path.join(ROOT, "docs", "fleetu-logo.svg")

const OUT_FAVICON = path.join(ROOT, "src", "app", "favicon.ico")
const OUT_ICON_PNG = path.join(ROOT, "src", "app", "icon.png")
const OUT_APPLE_PNG = path.join(ROOT, "src", "app", "apple-icon.png")

async function renderPngSquare(size) {
  return sharp(INPUT_SVG, { density: 800 })
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
}

function buildIco(pngImages) {
  // ICO header: 6 bytes + 16 bytes per image entry
  const count = pngImages.length
  const headerSize = 6
  const entrySize = 16
  let offset = headerSize + entrySize * count

  const entries = pngImages.map(({ size, data }) => {
    const entry = {
      size,
      bytesInRes: data.length,
      offset,
      data,
    }
    offset += data.length
    return entry
  })

  const out = Buffer.alloc(offset)

  // ICONDIR
  out.writeUInt16LE(0, 0) // reserved
  out.writeUInt16LE(1, 2) // type (1 = icon)
  out.writeUInt16LE(count, 4) // image count

  // ICONDIRENTRYs
  let entryOffset = headerSize
  for (const entry of entries) {
    const dim = entry.size === 256 ? 0 : entry.size
    out.writeUInt8(dim, entryOffset + 0) // width
    out.writeUInt8(dim, entryOffset + 1) // height
    out.writeUInt8(0, entryOffset + 2) // colors (0 = truecolor)
    out.writeUInt8(0, entryOffset + 3) // reserved
    out.writeUInt16LE(1, entryOffset + 4) // planes
    out.writeUInt16LE(32, entryOffset + 6) // bit count
    out.writeUInt32LE(entry.bytesInRes, entryOffset + 8) // bytes in resource
    out.writeUInt32LE(entry.offset, entryOffset + 12) // image data offset
    entryOffset += entrySize
  }

  // image data blobs (PNG)
  for (const entry of entries) {
    entry.data.copy(out, entry.offset)
  }

  return out
}

async function main() {
  if (!fs.existsSync(INPUT_SVG)) {
    throw new Error(`Missing input SVG at ${INPUT_SVG}`)
  }

  // App icons
  const [icon512, apple180] = await Promise.all([renderPngSquare(512), renderPngSquare(180)])
  fs.writeFileSync(OUT_ICON_PNG, icon512)
  fs.writeFileSync(OUT_APPLE_PNG, apple180)

  // Favicon ICO (common sizes)
  const faviconSizes = [16, 32, 48, 64]
  const faviconPngs = await Promise.all(
    faviconSizes.map(async (size) => ({ size, data: await renderPngSquare(size) }))
  )
  const ico = buildIco(faviconPngs)
  fs.writeFileSync(OUT_FAVICON, ico)

  console.log("Generated:")
  console.log("-", path.relative(ROOT, OUT_FAVICON))
  console.log("-", path.relative(ROOT, OUT_ICON_PNG))
  console.log("-", path.relative(ROOT, OUT_APPLE_PNG))
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

