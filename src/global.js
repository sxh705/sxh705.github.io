// 全局函数

(() => {
    // 全局状态对象

    const store = Vue.reactive({
        count: 7051,
    })

    let count1 = 3;
    let count2 = Vue.ref(3);

    window.sxhGl = {
        store,
        count1,//不会保存状态
        count2,//会保存状态
    }

})();

// PWA渐进应用

if (typeof navigator.serviceWorker !== 'undefined') {
    navigator.serviceWorker.register('src/sw.js')
}

(() => {
    // 书签持久化服务

    const debounce = (fn, delay) => {
        let timer = 0
        let d1 = (!delay) ? 5000 : delay;
        return () => {
            if (timer) {
                clearTimeout(timer)
                timer = setTimeout(fn, d1)
            } else {
                timer = setTimeout(fn, d1)
            }
        }
    }
    const throttle = (fn, delay) => {
        let valid = true
        return () => {
            if (!valid) {
                return false
            }
            valid = false
            setTimeout(() => {
                fn()
                valid = true;
            }, (!delay) ? 5000 : delay)
        }
    }

    const getK = () => {
        let k = window.location.href;
        if (k.includes('?id')) {
            k = k.split('?id')[0]
        }
        return k;
    }
    (() => {
        const k = getK();
        const v = localStorage.getItem(k);
        if (v && window.location.href != v) {
            console.log('set: decodeURI(v)', decodeURI(v))
            window.location.href = v;
            return;
        }
        window.addEventListener('scroll', debounce(() => {
            const k = getK();
            const v1 = document.querySelector('li.active>a');
            const v = v1 ? v1.href : null
            if (k && v) {
                localStorage.setItem(k, v);
                console.log('decodeURI(k)', decodeURI(k))
                console.log('decodeURI(v)', decodeURI(v))
            }
        }))
    })()
})();