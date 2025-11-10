import type { ElysiaApp } from "../../index";
import { t } from "elysia";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";

GlobalFonts.registerFromPath("./src/assets/FcSubject.ttf", 'FcSubject')

// Body validation
// Content type : application/json
const generateSchema = t.Object({
    name: t.String()
})

export default (app: ElysiaApp) => app
    .post("/generate", async ({ body, set }: { body: typeof generateSchema.static, set: { headers: { [key: string]: string }, status: number } }) => {
        const { name } = body;

        // Load image and set canvas dimention
        const certImage = await loadImage('./src/data/cert_template.png');
        const canvas = createCanvas(certImage.width, certImage.height);
        const ctx = canvas.getContext('2d');

        // Draw a cert
        ctx.drawImage(certImage, 0, 0, certImage.width, certImage.height);

        // Fill the name
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "70px FcSubject";
        ctx.fillText(name, certImage.width / 2, (certImage.height / 2) - 100);

        // Fill the date
        ctx.font = "40px FcSubject";
        ctx.fillText(`มอบให้ ณ วันที่ ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}`, certImage.width / 2, (certImage.height / 2) + 325);

        // Set response content-type to image
        set.headers['Content-Type'] = 'image/png';
        const pngData = canvas.toBuffer("image/png");

        return pngData;
    }, {
        body: generateSchema
    });