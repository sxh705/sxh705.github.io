/**
 * 执行SQL查询请求
 * @param {string} sql - SQL查询语句
 * @param {Array} params - 查询参数数组
 * @returns {Promise}
 */
const executeQuery = async (sql, params) => {
    let host = "117.72.210.237"
    // host = "localhost"
    const baseUrl = `http://${host}:8000/eyuLrHrTb6JFJk1V`;
    const url = `${baseUrl}/query`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: sql,
                params: params || []
            }),
            timeout: 5000
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response}`);
            return await response.json()
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch request failed:', error);
        throw error;
    }
};

/**
 * 数据库操作类
 */
class MathStudyAPI {
    constructor(deviceId = null) {
        this.deviceId = deviceId || this.getOrSetDefaultDeviceId();
    }

    // 获取或设置默认设备ID
    getOrSetDefaultDeviceId() {
        let deviceId = localStorage.getItem('mathStudyDeviceId');
        if (!deviceId) {
            deviceId = '1'; // 默认设备ID为1
            localStorage.setItem('mathStudyDeviceId', deviceId);
        }
        return deviceId;
    }

    // 更新设备ID并永久保存
    updateDeviceId(newDeviceId) {
        this.deviceId = newDeviceId;
        localStorage.setItem('mathStudyDeviceId', newDeviceId);
    }

    // 添加学习记录
    async addRecord(record) {
        const sql = `
            INSERT INTO math_study_records (title, time_spent, status, notes, device_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            record.title,
            record.timeSpent,
            record.status,
            record.notes || '',
            this.deviceId
        ];

        try {
            const result = await executeQuery(sql, params);
            return result;
        } catch (error) {
            console.error('添加记录失败:', error);
            throw error;
        }
    }

    // 获取所有学习记录
    async getRecords() {
        const sql = `
            SELECT id, title, time_spent, status, notes, created_at, device_id
            FROM math_study_records
            ORDER BY created_at DESC
            LIMIT 100
        `;

        try {
            const result = await executeQuery(sql, []);
            return result.results || [];
        } catch (error) {
            console.error('获取记录失败:', error);
            throw error;
        }
    }

    // 删除所有记录
    async clearAllRecords() {
        const sql = `DELETE FROM math_study_records`;

        try {
            const result = await executeQuery(sql, []);
            return result;
        } catch (error) {
            console.error('清空记录失败:', error);
            throw error;
        }
    }

    // 获取统计信息
    async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                ROUND(AVG(time_spent)) as avg_time
            FROM math_study_records
        `;

        try {
            const result = await executeQuery(sql, []);
            const stats = result.results && result.results[0] ? result.results[0] : {
                total: 0,
                completed: 0,
                avg_time: 0
            };
            return stats;
        } catch (error) {
            console.error('获取统计失败:', error);
            return { total: 0, completed: 0, avg_time: 0 };
        }
    }
}

export default MathStudyAPI;

/**
 * 创建考研数学学习记录表
CREATE TABLE math_study_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL COMMENT '题目描述',
    time_spent INT NOT NULL COMMENT '用时(分钟)',
    status ENUM('completed', 'stuck', 'review') NOT NULL COMMENT '状态',
    notes TEXT COMMENT '学习笔记',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    device_id VARCHAR(100) COMMENT '设备标识',
    INDEX idx_created_at (created_at),
    INDEX idx_status (status),
    INDEX idx_device_id (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考研数学学习记录表';
 
 */