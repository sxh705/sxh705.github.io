import os
import shutil
import subprocess
import paramiko
import stat

"""
注意 部署前停止dev环境，否则会产生冲突部署失败。
C:\Code\ConstrutionAdmin\cons_day1\cons_day1\venv\Scripts\python deploy.py
"""
# 配置
SFTP_HOST = '117.72.210.237'
SFTP_PORT = 7022
SFTP_USER = 'root'
SFTP_PASS = 'HLcr6102'
REMOTE_PATH = '/www/wwwroot/sxhNote'
LOCAL_DIST = os.path.join(os.path.dirname(__file__), '.', 'docs/.vuepress/dist')

def remove_dist():
    if os.path.exists(LOCAL_DIST):
        shutil.rmtree(LOCAL_DIST)
        print('dist 目录已删除')
    else:
        print('dist 目录不存在，跳过删除')

def build():
    print('正在执行 pnpm build...')
    result = subprocess.run(['pnpm', 'build'], shell=True)
    if result.returncode != 0:
        print('构建失败')
        exit(1)
    print('构建完成')
    print(f'dist 路径: {LOCAL_DIST}')
    print(f'dist 内容: {os.listdir(LOCAL_DIST) if os.path.exists(LOCAL_DIST) else "目录不存在"}')

def get_local_file_info(filepath):
    """获取本地文件的大小和修改时间"""
    stat_info = os.stat(filepath)
    return {
        'size': stat_info.st_size,
        'mtime': int(stat_info.st_mtime)
    }

def sftp_deploy():
    print('正在连接 SFTP...')
    transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
    transport.connect(username=SFTP_USER, password=SFTP_PASS)
    sftp = paramiko.SFTPClient.from_transport(transport)

    remote_files = {}
    print('正在扫描远程文件...')
    def scan_remote_dir(path):
        try:
            for item in sftp.listdir_attr(path):
                item_path = f"{path}/{item.filename}"
                if stat.S_ISDIR(item.st_mode):
                    scan_remote_dir(item_path)
                else:
                    remote_files[item_path] = {
                        'size': item.st_size,
                        'mtime': int(item.st_mtime)
                    }
        except Exception as e:
            print(f'扫描远程目录失败: {path}，原因: {e}')

    scan_remote_dir(REMOTE_PATH)
    print(f'扫描完成，发现 {len(remote_files)} 个远程文件')

    print('正在上传 dist 文件...')
    def upload_dir(local, remote):
        for root, dirs, files in os.walk(local):
            rel_path = os.path.relpath(root, local)
            remote_root = remote if rel_path == '.' else f"{remote}/{rel_path.replace(os.sep, '/')}"
            print(f"当前本地目录: {root}")
            print(f'当前远程目录: {remote_root}')

            try:
                sftp.stat(remote_root)
            except FileNotFoundError:
                sftp.mkdir(remote_root)
                print(f'创建远程目录: {remote_root}')

            for file in files:
                local_file_path = os.path.join(root, file)
                remote_file_path = f"{remote_root}/{file}"
                local_info = get_local_file_info(local_file_path)

                if remote_file_path in remote_files:
                    remote_info = remote_files[remote_file_path]
                    if local_info['size'] == remote_info['size'] and os.path.basename(local_file_path) != 'index.html':
                        print(f'跳过未修改文件: {remote_file_path}')
                        continue
                    else:
                        print(f'更新文件: {remote_file_path}')
                else:
                    print(f'上传新文件: {remote_file_path}')
                sftp.put(local_file_path, remote_file_path)
                sftp.utime(remote_file_path, (local_info['mtime'], local_info['mtime']))

        for remote_file in list(remote_files.keys()):
            if remote_file.startswith(remote):
                local_path = os.path.join(local, os.path.relpath(remote_file, remote))
                if not os.path.exists(local_path):
                    try:
                        sftp.remove(remote_file)
                        print(f'删除多余文件: {remote_file}')
                    except Exception as e:
                        print(f'删除文件失败: {remote_file}，原因: {e}')

    upload_dir(LOCAL_DIST, REMOTE_PATH)
    print('文件上传完成')

    sftp.close()
    transport.close()
    print('部署完成', 'http://117.72.210.237/')

if __name__ == '__main__':
    # remove_dist()
    build()
    sftp_deploy()