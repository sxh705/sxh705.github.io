
import { Jieba } from '@node-rs/jieba'
import { dict } from '@node-rs/jieba/dict.js'

// load jieba with the default dict
const jieba = Jieba.withDict(dict)

console.info(jieba.cut('我们中出了一个叛徒', false))

// ["我们", "中", "出", "了", "一个", "叛徒"]
