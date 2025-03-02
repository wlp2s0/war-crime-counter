import { readdir } from "node:fs/promises"
import { test } from "node:test"
import { strictEqual } from "node:assert"
import { fileURLToPath } from "node:url"
import { join } from "node:path"

//@ts-ignore must fix later
import parseImage from "../dist/index.mjs"

test("[parseImage] should return expected success rate", async () => {
    const targetColours = [
        {
          colour: { r: 255, g: 135, b: 36, tolerance: 28, },
          label: "primary",
        },
        {
          colour: { r: 113, g: 245, b: 255, tolerance: 42, },
          label: "secondary",
        }
      ]
    
    const basePath = "./fixtures"
    const fixtures = import.meta.resolve(basePath)
    const finalFixturePath = fileURLToPath(new URL(fixtures))
    
    const files = await readdir(finalFixturePath)

    for (const file of files) {
        const filename = file.split(".")[0]
        const [_, expectedPrimarySuccess, expectedSecondarySuccess] = file.split("_")
        const primaryColour = targetColours[0]
        const secondaryColour = targetColours[1]

        const sourcePath = join(finalFixturePath, file)

        const primaryResult = await parseImage({ filename, sourcePath, targetColor: primaryColour.colour, label: primaryColour.label, debug: true, debugPath: "./debug", cropRatioHeight: 0.5, yCropOffsetRatio: 0.1 })
        strictEqual(primaryResult.success, parseInt(expectedPrimarySuccess), "Primary missions failed: " + sourcePath)

        const secondaryResult = await parseImage({ filename, sourcePath, targetColor: secondaryColour.colour, label: secondaryColour.label, debug: true, debugPath: "./debug" })
        strictEqual(secondaryResult.success, parseInt(expectedSecondarySuccess), "Secondary missions failed: " + sourcePath)
    }
})