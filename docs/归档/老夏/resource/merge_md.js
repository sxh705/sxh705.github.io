const fs = require('fs');
const path = require('path');

let merge_name = 'merged';
const suffix = 'md'

merge_name = `${merge_name}.${suffix}`

if (fs.existsSync(merge_name)) {
    fs.unlinkSync(merge_name)
}
fs.writeFileSync(merge_name, '')

fs.readdirSync('.')
    .filter(file => file.endsWith(suffix))
    .sort()
    .forEach((file, index) => {
        const content = fs.readFileSync(file, 'utf8');
        fs.appendFileSync(merge_name, content);
    });

console.log(`所有${suffix}文件已合并到${merge_name}`);

const { exec } = require('child_process');  

const openCommand = `start "" "${path.resolve(merge_name)}"`;

exec(openCommand, (error, stdout, stderr) => {  
    if (error) {  
        console.error(`执行打开命令时出错: ${error}`);  
        return;  
    }  
    console.log('merged.txt 已打开');  
});