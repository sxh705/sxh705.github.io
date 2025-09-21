// process-and-update.js

import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import Base62 from "base62";
const docsDir = 'docs';

/**
 * 根据文件内容生成一个短的唯一 Base62 哈希值
 * @param {string} filePath - 文件的完整路径
 * @returns {Promise<string>} - 返回一个4位数的 Base62 哈希字符串
 */
async function getUniqueHash(filePath) {
    const content = await fs.readFile(filePath);
    const hash = crypto.createHash('md5').update(content).digest('hex');

    // 将16进制哈希值的前12位转换为一个大整数
    const hexValue = hash.substring(0, 12);
    const intValue = parseInt(hexValue, 16);

    // 将大整数转换为 Base62 字符串并截取前4位
    return Base62.encode(intValue).substring(0, 4);
}

async function processImagesAndMarkdown() {
    console.log('开始处理图片并更新Markdown引用...');

    // 1. 查找所有PNG/JPG图片
    const imageFiles = glob.sync(`${docsDir}/**/*.{png,jpg}`);
    const originalToNewPathMap = new Map();

    if (imageFiles.length === 0) {
        console.log('未找到任何PNG或JPG图片。');
        return;
    }

    // 2. 遍历并转换图片，同时构建旧路径到新路径的映射
    for (const file of imageFiles) {
        const filePath = path.resolve(file);

        try {
            const hash = await getUniqueHash(filePath);
            const dirName = path.dirname(filePath);
            // 构建新的带哈希的文件路径
            const newFileName = `${hash}.webp`;
            const newFilePath = path.join(dirName, newFileName);

            await sharp(filePath)
                .webp({ quality: 80 })
                .toFile(newFilePath);

            await fs.unlink(filePath);
            console.log(`✅ 已将 ${filePath} 转换为并替换为 ${newFilePath}`);

            // 保存旧路径和新路径的映射关系
            originalToNewPathMap.set(path.normalize(file), path.normalize(newFilePath));

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

            // 遍历所有旧路径和新路径的映射
            for (const [originalPath, newPath] of originalToNewPathMap) {
                // 构建相对路径，以便在Markdown中正确引用
                const relativeOriginalPath = path.relative(path.dirname(mdFile), originalPath);
                const relativeNewPath = path.relative(path.dirname(mdFile), newPath);

                // 使用正则表达式匹配并替换
                const escapedOriginalPath = relativeOriginalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`!\\[(.*?)\\]\\(${escapedOriginalPath}\\)`, 'g');

                if (content.match(regex)) {
                    content = content.replace(regex, `![$1](${relativeNewPath})`);
                    updated = true;
                }
            }

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