// process-and-update.js

import sharp from 'sharp';
import {glob} from 'glob';
import fs from 'fs/promises';
import path from 'path';

const docsDir = 'docs';

async function processImagesAndMarkdown() {
    console.log('开始处理图片并更新Markdown引用...');

    // 1. 查找所有PNG/JPG图片
    const imageFiles = glob.sync(`${docsDir}/**/*.{png,jpg}`);

    if (imageFiles.length === 0) {
        console.log('未找到任何PNG或JPG图片。');
        return;
    }

    // 2. 遍历并转换图片
    for (const file of imageFiles) {
        const filePath = path.resolve(file);
        const newFilePath = filePath.replace(/\.(png|jpg)$/, '.webp');

        try {
            await sharp(filePath)
                .webp({quality: 80})
                .webp({quality: 80})
                .toFile(newFilePath);

            await fs.unlink(filePath);
            console.log(`✅ 已将 ${filePath} 转换为并替换为 ${newFilePath}`);
        } catch (err) {
            console.error(`❌ 转换 ${filePath} 失败：`, err);
        }
    }

    // 3. 查找所有Markdown文件
    const markdownFiles = glob.sync(`${docsDir}/**/*.md`);

    if (markdownFiles.length === 0) {
        console.log('未找到任何Markdown文件。');
        return;
    }

    // 4. 遍历并更新Markdown引用
    for (const mdFile of markdownFiles) {
        try {
            let content = await fs.readFile(mdFile, 'utf8');
            let updated = false;

            // 新的正则表达式，同时捕获alt_text和url
            content = content.replace(/!\[(.*?)\]\((.*?)\)/g, (match, altText, url) => {
                let newAltText = altText;
                let newUrl = url;

                // 检查并替换 alt_text
                if (altText.toLowerCase().endsWith('.png') || altText.toLowerCase().endsWith('.jpg')) {
                    newAltText = altText.replace(/\.(png|jpg)$/i, '.webp');
                    updated = true;
                }

                // 检查并替换 url
                if (url.toLowerCase().endsWith('.png') || url.toLowerCase().endsWith('.jpg')) {
                    newUrl = url.replace(/\.(png|jpg)$/i, '.webp');
                    updated = true;
                }

                // 重新拼接整个图片引用
                return `![${newAltText}](${newUrl})`;
            });

            if (updated) {
                await fs.writeFile(mdFile, content, 'utf8');
                console.log(`🔄 已更新 ${mdFile} 中的图片引用。`);
            }

        } catch (err) {
            console.error(`❌ 处理 ${mdFile} 失败：`, err);
        }
    }

    console.log('所有操作完成！');
}

processImagesAndMarkdown();